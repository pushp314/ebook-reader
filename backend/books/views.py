from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Book, Category, Review, ReadingProgress
from .serializers import (
    BookSerializer, BookListSerializer, CategorySerializer, 
    ReviewSerializer, ReadingProgressSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == 'admin'

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]

class BookListCreateView(generics.ListCreateAPIView):
    queryset = Book.objects.filter(is_active=True)
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'language']
    search_fields = ['title', 'author', 'description', 'tags']
    ordering_fields = ['created_at', 'price', 'title']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return BookListSerializer
        return BookSerializer

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.filter(is_active=True)
    serializer_class = BookSerializer
    permission_classes = [IsAdminOrReadOnly]

class BookReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        book_id = self.kwargs['book_id']
        return Review.objects.filter(book_id=book_id)
    
    def perform_create(self, serializer):
        book_id = self.kwargs['book_id']
        serializer.save(user=self.request.user, book_id=book_id)

class ReadingProgressListCreateView(generics.ListCreateAPIView):
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReadingProgressDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ReadingProgressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return ReadingProgress.objects.filter(user=self.request.user)
    
    def get_object(self):
        book_id = self.kwargs['book_id']
        progress, created = ReadingProgress.objects.get_or_create(
            user=self.request.user,
            book_id=book_id,
            defaults={'current_page': 1}
        )
        return progress

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def user_purchased_books(request):
    from purchases.models import Purchase
    
    purchases = Purchase.objects.filter(
        user=request.user, 
        status='approved'
    ).select_related('book')
    
    books = [purchase.book for purchase in purchases]
    serializer = BookListSerializer(books, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_books(request):
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    
    books = Book.objects.filter(is_active=True)
    
    if query:
        books = books.filter(
            Q(title__icontains=query) |
            Q(author__icontains=query) |
            Q(description__icontains=query)
        )
    
    if category:
        books = books.filter(category__name=category)
    
    serializer = BookListSerializer(books, many=True)
    return Response(serializer.data)