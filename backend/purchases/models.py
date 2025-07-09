from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book

User = get_user_model()

class Purchase(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchases')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='purchases')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_id = models.CharField(max_length=100, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    
    # User details at time of purchase
    user_name = models.CharField(max_length=200)
    user_email = models.EmailField()
    user_phone = models.CharField(max_length=20)
    
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(blank=True, null=True)
    approved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='approved_purchases'
    )
    
    class Meta:
        unique_together = ('user', 'book')
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.book.title} ({self.status})"

class PaymentMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    qr_code = models.ImageField(upload_to='payment_qr/', blank=True, null=True)
    account_details = models.JSONField(default=dict, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name