from django.urls import path
from .views import (
    PurchaseListCreateView, PurchaseDetailView, approve_purchase,
    reject_purchase, PaymentMethodListView, purchase_statistics
)

urlpatterns = [
    path('', PurchaseListCreateView.as_view(), name='purchase-list'),
    path('<int:pk>/', PurchaseDetailView.as_view(), name='purchase-detail'),
    path('<int:purchase_id>/approve/', approve_purchase, name='approve-purchase'),
    path('<int:purchase_id>/reject/', reject_purchase, name='reject-purchase'),
    path('payment-methods/', PaymentMethodListView.as_view(), name='payment-methods'),
    path('statistics/', purchase_statistics, name='purchase-statistics'),
]