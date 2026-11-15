import uuid

from django.db import models
from django.conf import settings


class Order(models.Model):

    # Different stages of an order
    ORDER_STATUS = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    # Unique order reference
    order_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)

    # The user who placed the order
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="orders"
    )

    # Current order status
    status = models.CharField(max_length=20, choices=ORDER_STATUS, default="pending")

    # Order amounts
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)

    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.order_number}"


class OrderItem(models.Model):

    # Each item belongs to one order
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    # DummyJSON product information saved as a snapshot
    product_id = models.PositiveIntegerField()
    product_name = models.CharField(max_length=255)
    product_image = models.URLField(blank=True)

    # Price at the time the order was placed
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    quantity = models.PositiveIntegerField()

    line_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"
