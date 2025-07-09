from rest_framework import serializers
from .models import Purchase, PaymentMethod
from books.serializers import BookListSerializer

class PurchaseSerializer(serializers.ModelSerializer):
    book_details = BookListSerializer(source='book', read_only=True)
    user_name_display = serializers.CharField(source='user.full_name', read_only=True)
    
    class Meta:
        model = Purchase
        fields = '__all__'
        read_only_fields = ('user', 'created_at', 'approved_at', 'approved_by')

class PurchaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Purchase
        fields = ('book', 'transaction_id', 'user_name', 'user_email', 'user_phone')
    
    def create(self, validated_data):
        book = validated_data['book']
        validated_data['amount'] = book.price
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'