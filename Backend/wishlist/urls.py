from django.urls import path

from .views import (
    WishlistView,
    WishlistItemView,
    MoveWishlistToCartView,
)

urlpatterns = [
    # View wishlist and add products
    path("", WishlistView.as_view(), name="wishlist"),
    # Remove a wishlist product
    path("<int:product_id>/", WishlistItemView.as_view(), name="wishlist-remove"),
    # Move wishlist product to cart
    path(
        "<int:product_id>/move-to-cart/",
        MoveWishlistToCartView.as_view(),
        name="wishlist-move-to-cart",
    ),
]
