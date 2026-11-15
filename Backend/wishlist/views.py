from django.shortcuts import get_object_or_404
from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Wishlist, WishlistItem

# Reuse your existing DummyJSON product and cart functions
from cart.views import get_product, check_stock
from cart.models import Cart, CartItem


class WishlistView(APIView):

    # Only logged-in users can access their wishlist
    permission_classes = [IsAuthenticated]

    # GET: View all wishlist products
    def get(self, request):

        wishlist, created = Wishlist.objects.get_or_create(user=request.user)

        items = []

        for item in wishlist.items.all().order_by("-added_at"):

            # Get product details from DummyJSON
            product = get_product(item.product_id)

            items.append(
                {
                    "id": item.id,
                    "product_id": item.product_id,
                    "title": product.get("title"),
                    "price": product.get("price"),
                    "discountPercentage": product.get("discountPercentage", 0),
                    "thumbnail": product.get("thumbnail"),
                    "stock": product.get("stock", 0),
                    "category": product.get("category"),
                }
            )

        return Response({"total_items": len(items), "items": items})

    # POST: Add product to wishlist
    def post(self, request):

        product_id = request.data.get("product_id")

        if not product_id:
            raise ValidationError({"product_id": "Product ID is required."})

        try:
            product_id = int(product_id)
        except (TypeError, ValueError):
            raise ValidationError({"product_id": "Product ID must be a valid number."})

        if product_id <= 0:
            raise ValidationError(
                {"product_id": "Product ID must be greater than zero."}
            )

        # Check whether product exists in DummyJSON
        get_product(product_id)

        wishlist, created = Wishlist.objects.get_or_create(user=request.user)

        item, created = WishlistItem.objects.get_or_create(
            wishlist=wishlist, product_id=product_id
        )

        if not created:
            return Response({"message": "Product is already in your wishlist."})

        return Response(
            {"message": "Product added to wishlist successfully."},
            status=status.HTTP_201_CREATED,
        )


class WishlistItemView(APIView):

    permission_classes = [IsAuthenticated]

    # DELETE: Remove a product from wishlist
    def delete(self, request, product_id):

        wishlist = get_object_or_404(Wishlist, user=request.user)

        item = get_object_or_404(WishlistItem, wishlist=wishlist, product_id=product_id)

        item.delete()

        return Response(
            {"message": "Product removed from wishlist."}, status=status.HTTP_200_OK
        )


class MoveWishlistToCartView(APIView):

    permission_classes = [IsAuthenticated]

    # POST: Move a wishlist product into the shopping cart
    def post(self, request, product_id):

        wishlist = get_object_or_404(Wishlist, user=request.user)

        # Check that this product belongs to this user's wishlist
        wishlist_item = get_object_or_404(
            WishlistItem, wishlist=wishlist, product_id=product_id
        )

        # Get product information
        product = get_product(product_id)

        # Check stock availability
        check_stock(product, 1)

        with transaction.atomic():

            cart, created = Cart.objects.get_or_create(user=request.user)

            cart = Cart.objects.select_for_update().get(pk=cart.pk)

            cart_item, created = CartItem.objects.get_or_create(
                cart=cart, product_id=product_id, defaults={"quantity": 0}
            )

            new_quantity = cart_item.quantity + 1

            if new_quantity > 99:
                raise ValidationError("Maximum cart quantity is 99.")

            check_stock(product, new_quantity)

            cart_item.quantity = new_quantity
            cart_item.save()

            # Remove the item from wishlist after adding to cart
            wishlist_item.delete()

        return Response({"message": "Product moved to cart successfully."})
