from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from cart.models import Cart
from cart.views import get_product, check_stock

from .models import Order, OrderItem
from .serializers import OrderSerializer


class CheckoutView(APIView):

    # Only logged-in users can place orders
    permission_classes = [IsAuthenticated]

    def post(self, request):

        # Find the current user's cart
        cart = get_object_or_404(Cart, user=request.user)

        # Get all products in the cart
        cart_items = list(cart.items.all())

        # Do not allow checkout with an empty cart
        if not cart_items:
            raise ValidationError("Your cart is empty.")

        order_products = []
        subtotal = Decimal("0.00")

        # Fetch current product information and calculate prices
        for item in cart_items:

            product = get_product(item.product_id)

            # Check whether enough stock is available
            check_stock(product, item.quantity)

            original_price = Decimal(str(product["price"]))
            discount = Decimal(str(product.get("discountPercentage", 0)))

            # Calculate discounted unit price
            unit_price = (
                original_price * (Decimal("1") - discount / Decimal("100"))
            ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

            line_total = unit_price * item.quantity

            subtotal += line_total

            order_products.append(
                {
                    "product_id": item.product_id,
                    "product_name": product["title"],
                    "product_image": product.get("thumbnail", ""),
                    "unit_price": unit_price,
                    "quantity": item.quantity,
                    "line_total": line_total,
                }
            )

        # Shipping is free for now
        shipping_fee = Decimal("0.00")
        total_amount = subtotal + shipping_fee

        # Save the order and its items together
        with transaction.atomic():

            order = Order.objects.create(
                user=request.user,
                subtotal=subtotal,
                shipping_fee=shipping_fee,
                total_amount=total_amount,
            )

            # Save every product in the order
            OrderItem.objects.bulk_create(
                [
                    OrderItem(order=order, **product_data)
                    for product_data in order_products
                ]
            )

            # Empty the cart only after saving the order
            cart.items.all().delete()

        # Return the saved order
        serializer = OrderSerializer(order)

        return Response(
            {
                "message": "Order placed successfully.",
                "order": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class OrderHistoryView(APIView):

    # Only logged-in users can view orders
    permission_classes = [IsAuthenticated]

    def get(self, request):

        # Retrieve only the orders belonging to this user
        orders = (
            Order.objects.filter(user=request.user)
            .prefetch_related("items")
            .order_by("-created_at")
        )

        # Convert orders into JSON
        serializer = OrderSerializer(orders, many=True)

        return Response(
            {
                "total_orders": orders.count(),
                "orders": serializer.data,
            }
        )
