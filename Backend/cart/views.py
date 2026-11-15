from decimal import Decimal, ROUND_HALF_UP
import requests
from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import (
    APIException,
    NotFound,
    ValidationError,
)

from .models import Cart, CartItem
from .serializers import (
    AddToCartSerializer,
    UpdateCartItemSerializer,
)


class ProductServiceUnavailable(APIException):
    status_code = 503
    default_detail = "Product service is unavailable."


def get_product(product_id):
    url = f"https://dummyjson.com/products/{product_id}"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code == 404:
            raise NotFound("Product not found.")

        response.raise_for_status()
        product = response.json()

    except requests.RequestException:
        raise ProductServiceUnavailable()

    if product.get("id") != product_id:
        raise ValidationError("Invalid product data.")

    return product


def check_stock(product, quantity):
    stock = int(product.get("stock", 0))

    if quantity > stock:
        raise ValidationError({"quantity": f"Only {stock} items available."})


def get_cart_data(cart):
    items = []
    subtotal = Decimal("0.00")
    total_quantity = 0

    for item in cart.items.all():
        product = get_product(item.product_id)
        # Get original product price
        original_price = Decimal(str(product["price"]))

        # Get discount percentage from DummyJSON
        discount_percentage = Decimal(str(product.get("discountPercentage", 0)))

        # Calculate discounted price
        price = (
            original_price * (Decimal("1") - discount_percentage / Decimal("100"))
        ).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        # Calculate total for this cart item
        line_total = price * item.quantity

        items.append(
            {
                "id": item.id,
                "product_id": item.product_id,
                "name": product["title"],
                "image": product.get("thumbnail", ""),
                # Discounted unit price
                "price": str(price),
                # Original price before discount
                "original_price": str(original_price),
                # Discount percentage
                "discount_percentage": str(discount_percentage),
                "quantity": item.quantity,
                "stock": product.get("stock", 0),
                "total": str(line_total),
            }
        )

        subtotal += line_total
        total_quantity += item.quantity

    return {
        "cart_id": cart.id,
        "items": items,
        "total_quantity": total_quantity,
        "subtotal": str(subtotal),
    }


class CartView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cart, created = Cart.objects.get_or_create(user=request.user)

        return Response(get_cart_data(cart))

    def post(self, request):
        serializer = AddToCartSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        product = get_product(product_id)

        with transaction.atomic():
            cart, created = Cart.objects.get_or_create(user=request.user)

            cart = Cart.objects.select_for_update().get(pk=cart.pk)

            item, created = CartItem.objects.get_or_create(
                cart=cart, product_id=product_id, defaults={"quantity": 0}
            )

            new_quantity = item.quantity + quantity

            if new_quantity > 99:
                raise ValidationError("Maximum quantity is 99.")

            check_stock(product, new_quantity)

            item.quantity = new_quantity
            item.save()

        return Response(
            {"message": "Product added successfully."}, status=status.HTTP_200_OK
        )

        # DELETE: Remove all items from the user's cart

    def delete(self, request):
        cart = get_object_or_404(Cart, user=request.user)

        # Delete every item belonging to this cart
        cart.items.all().delete()

        return Response(
            {"message": "Cart cleared successfully."}, status=status.HTTP_200_OK
        )


class CartItemView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, product_id):
        serializer = UpdateCartItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data["quantity"]

        product = get_product(product_id)
        check_stock(product, quantity)

        with transaction.atomic():
            cart = get_object_or_404(Cart, user=request.user)

            cart = Cart.objects.select_for_update().get(pk=cart.pk)

            item = get_object_or_404(CartItem, cart=cart, product_id=product_id)

            item.quantity = quantity
            item.save()

        return Response({"message": "Quantity updated successfully."})

    def delete(self, request, product_id):
        cart = get_object_or_404(Cart, user=request.user)

        item = get_object_or_404(CartItem, cart=cart, product_id=product_id)

        item.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)
