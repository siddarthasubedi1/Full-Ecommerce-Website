from django.db import models
from django.conf import settings


class Wishlist(models.Model):

    # Each user has one wishlist
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="wishlist"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Wishlist of {self.user.email}"


class WishlistItem(models.Model):

    # Each product belongs to a wishlist
    wishlist = models.ForeignKey(
        Wishlist, on_delete=models.CASCADE, related_name="items"
    )

    # ID of the product from DummyJSON
    product_id = models.PositiveIntegerField()

    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Prevent the same product being added twice
        constraints = [
            models.UniqueConstraint(
                fields=["wishlist", "product_id"], name="unique_wishlist_product"
            )
        ]

    def __str__(self):
        return f"Product {self.product_id}"
