from django.urls import path
from .views import CheckoutView, OrderHistoryView

urlpatterns = [
    # Place a new order
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    # View the logged-in user's order history
    path("", OrderHistoryView.as_view(), name="order-history"),
]
