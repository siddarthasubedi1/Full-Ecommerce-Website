# from rest_framework import serializers
# from .models import Category, Brand, Product


# class CategorySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Category
#         fields = ["id", "name", "image", "created_at"]


# class BrandSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Brand
#         fields = ["id", "name", "created_at"]


# class ProductSerializer(serializers.ModelSerializer):
#     category_name = serializers.CharField(source="category.name", read_only=True)
#     brand_name = serializers.CharField(
#         source="brand.name", read_only=True, default=None
#     )

#     class Meta:
#         model = Product
#         fields = [
#             "id",
#             "name",
#             "description",
#             "price",
#             "discounted_price",
#             "discount_percentage",
#             "image",
#             "category",
#             "category_name",
#             "brand",
#             "brand_name",
#             "rating",
#             "review_count",
#             "created_at",
#         ]


from rest_framework import serializers

from .models import Category, Brand, Product


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = [
            "id",
            "name",
            "image",
            "created_at",
        ]


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand

        fields = [
            "id",
            "name",
            "created_at",
        ]


class ProductSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(source="category.name", read_only=True)

    brand_name = serializers.CharField(
        source="brand.name", read_only=True, allow_null=True
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
            "stock",
            "is_active",
            "image",
            "category",
            "category_name",
            "brand",
            "brand_name",
            "rating",
            "review_count",
            "created_at",
        ]

    def validate(self, attrs):

        price = attrs.get("price", getattr(self.instance, "price", None))

        discounted_price = attrs.get(
            "discounted_price", getattr(self.instance, "discounted_price", None)
        )

        if price is not None and price <= 0:
            raise serializers.ValidationError(
                {"price": "Price must be greater than zero."}
            )

        if discounted_price is not None:

            if price is not None and discounted_price >= price:
                raise serializers.ValidationError(
                    {
                        "discounted_price": "Discounted price must be lower than original price."
                    }
                )

            if discounted_price <= 0:
                raise serializers.ValidationError(
                    {"discounted_price": "Discounted price must be greater than zero."}
                )

        return attrs
