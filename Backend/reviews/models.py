from django.db import models
from django.conf import settings


class Review(models.Model):

    # Product ID from DummyJSON
    product_id = models.PositiveIntegerField()

    # Customer who wrote the review
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="product_reviews",
    )

    # Rating between 1 and 5 stars
    rating = models.PositiveSmallIntegerField()

    # Written review
    comment = models.TextField(max_length=1000)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

        # One review per user for each product
        constraints = [
            models.UniqueConstraint(
                fields=["user", "product_id"], name="one_review_per_user_product"
            )
        ]

    def __str__(self):
        return f"{self.user.email} - Product {self.product_id}"
