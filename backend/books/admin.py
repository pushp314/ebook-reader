from django.contrib import admin
from .models import Category, Book, Review, ReadingProgress

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'category', 'price', 'pages', 'is_active', 'created_at')
    list_filter = ('category', 'is_active', 'language', 'created_at')
    search_fields = ('title', 'author', 'isbn')
    list_editable = ('is_active', 'price')
    ordering = ('-created_at',)

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('book', 'user', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('book__title', 'user__email')

@admin.register(ReadingProgress)
class ReadingProgressAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'current_page', 'progress_percentage', 'completed', 'last_read')
    list_filter = ('completed', 'last_read')
    search_fields = ('user__email', 'book__title')