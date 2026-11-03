from rest_framework import serializers
from .models import Category, Brand, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "image", "created_at"]


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ["id", "name", "created_at"]


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    brand_name = serializers.CharField(
        source="brand.name", read_only=True, default=None
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "name",
            "description",
            "price",
            "discounted_price",
            "discount_percentage",
            "image",
            "category",
            "category_name",
            "brand",
            "brand_name",
            "rating",
            "review_count",
            "created_at",
        ]
