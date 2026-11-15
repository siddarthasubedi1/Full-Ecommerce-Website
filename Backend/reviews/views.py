from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError

from .models import Review
from .serializers import ReviewSerializer

# Reuse the existing DummyJSON product checker
from cart.views import get_product


class ProductReviewListCreateView(APIView):

    # Anyone can read reviews.
    # Only logged-in users can create reviews.
    def get_permissions(self):

        if self.request.method == "GET":
            return [AllowAny()]

        return [IsAuthenticated()]

    # GET: View product reviews and average rating
    def get(self, request):

        product_id = request.query_params.get("product_id")

        if not product_id:
            raise ValidationError({"product_id": "Product ID is required."})

        try:
            product_id = int(product_id)
        except (TypeError, ValueError):
            raise ValidationError({"product_id": "Product ID must be a number."})

        reviews = Review.objects.filter(product_id=product_id).select_related("user")

        statistics = reviews.aggregate(
            average_rating=Avg("rating"), total_reviews=Count("id")
        )
        serializer = ReviewSerializer(reviews, many=True, context={"request": request})

        return Response(
            {
                "average_rating": round(statistics["average_rating"] or 0, 1),
                "total_reviews": statistics["total_reviews"],
                "reviews": serializer.data,
            }
        )

    # POST: Create a review
    def post(self, request):

        product_id = request.data.get("product_id")

        if not product_id:
            raise ValidationError({"product_id": "Product ID is required."})

        try:
            product_id = int(product_id)
        except (TypeError, ValueError):
            raise ValidationError({"product_id": "Invalid product ID."})

        # Check that the product exists
        get_product(product_id)

        # Prevent duplicate reviews
        if Review.objects.filter(user=request.user, product_id=product_id).exists():

            raise ValidationError(
                "You have already reviewed this product. Edit your existing review."
            )

        serializer = ReviewSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)

        serializer.save(user=request.user, product_id=product_id)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ReviewDetailView(APIView):

    permission_classes = [IsAuthenticated]

    # PATCH: Edit your own review
    def patch(self, request, pk):

        review = get_object_or_404(Review, pk=pk, user=request.user)

        serializer = ReviewSerializer(review, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)

    # DELETE: Delete your own review
    def delete(self, request, pk):

        review = get_object_or_404(Review, pk=pk, user=request.user)

        review.delete()

        return Response(
            {"message": "Review deleted successfully."}, status=status.HTTP_200_OK
        )
