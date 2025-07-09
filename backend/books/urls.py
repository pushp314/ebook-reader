from django.urls import path
from .views import (
    CategoryListCreateView, BookListCreateView, BookDetailView,
    BookReviewListCreateView, ReadingProgressListCreateView,
    ReadingProgressDetailView, user_purchased_books, search_books
)

urlpatterns = [
    path('categories/', CategoryListCreateView.as_view(), name='category-list'),
    path('', BookListCreateView.as_view(), name='book-list'),
    path('<int:pk>/', BookDetailView.as_view(), name='book-detail'),
    path('<int:book_id>/reviews/', BookReviewListCreateView.as_view(), name='book-reviews'),
    path('progress/', ReadingProgressListCreateView.as_view(), name='reading-progress'),
    path('<int:book_id>/progress/', ReadingProgressDetailView.as_view(), name='book-progress'),
    path('purchased/', user_purchased_books, name='purchased-books'),
    path('search/', search_books, name='search-books'),
]