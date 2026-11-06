from django.urls import path

from .views import (
    CartView,
    CartItemView,
)

urlpatterns = [
    path("", CartView.as_view(), name="cart-list"),
    path("<int:product_id>/", CartItemView.as_view(), name="cart-item-detail"),
]
