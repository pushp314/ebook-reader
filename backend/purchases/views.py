from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import Purchase, PaymentMethod
from .serializers import PurchaseSerializer, PurchaseCreateSerializer, PaymentMethodSerializer

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'

class PurchaseListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return PurchaseCreateSerializer
        return PurchaseSerializer
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Purchase.objects.all()
        return Purchase.objects.filter(user=self.request.user)

class PurchaseDetailView(generics.RetrieveAPIView):
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'admin':
            return Purchase.objects.all()
        return Purchase.objects.filter(user=self.request.user)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_purchase(request, purchase_id):
    try:
        purchase = Purchase.objects.get(id=purchase_id)
        purchase.status = 'approved'
        purchase.approved_at = timezone.now()
        purchase.approved_by = request.user
        purchase.save()
        
        serializer = PurchaseSerializer(purchase)
        return Response(serializer.data)
    except Purchase.DoesNotExist:
        return Response(
            {'error': 'Purchase not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_purchase(request, purchase_id):
    try:
        purchase = Purchase.objects.get(id=purchase_id)
        purchase.status = 'rejected'
        purchase.save()
        
        serializer = PurchaseSerializer(purchase)
        return Response(serializer.data)
    except Purchase.DoesNotExist:
        return Response(
            {'error': 'Purchase not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )

class PaymentMethodListView(generics.ListAPIView):
    queryset = PaymentMethod.objects.filter(is_active=True)
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.AllowAny]

@api_view(['GET'])
@permission_classes([IsAdminUser])
def purchase_statistics(request):
    total_purchases = Purchase.objects.count()
    approved_purchases = Purchase.objects.filter(status='approved').count()
    pending_purchases = Purchase.objects.filter(status='pending').count()
    rejected_purchases = Purchase.objects.filter(status='rejected').count()
    
    total_revenue = sum(
        purchase.amount for purchase in Purchase.objects.filter(status='approved')
    )
    
    return Response({
        'total_purchases': total_purchases,
        'approved_purchases': approved_purchases,
        'pending_purchases': pending_purchases,
        'rejected_purchases': rejected_purchases,
        'total_revenue': total_revenue,
    })