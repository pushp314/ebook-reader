from rest_framework import serializers
from .models import Book, Category, Review, ReadingProgress

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class BookSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class BookListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    average_rating = serializers.ReadOnlyField()
    review_count = serializers.ReadOnlyField()
    
    class Meta:
        model = Book
        fields = ('id', 'title', 'author', 'description', 'price', 'cover_image', 
                 'category', 'category_name', 'tags', 'pages', 'average_rating', 
                 'review_count', 'created_at')

class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ('user', 'created_at')

class ReadingProgressSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    progress_percentage = serializers.ReadOnlyField()
    
    class Meta:
        model = ReadingProgress
        fields = '__all__'
        read_only_fields = ('user', 'last_read')