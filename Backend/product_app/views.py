# ============================================
# IMPORTS
# ============================================

import requests as req

from decimal import Decimal, InvalidOperation

from django.shortcuts import get_object_or_404
from django.db.models import ProtectedError

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.exceptions import ValidationError

from .models import Category, Brand, Product
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductSerializer,
)
from .permissions import IsAdminOrReadOnly

# ============================================
# CATEGORY VIEWS
# ============================================


class CategoryListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve all categories
    def get(self, request):
        categories = Category.objects.all()

        serializer = CategorySerializer(categories, many=True)

        return Response(serializer.data)

    # POST: Create a new category
    def post(self, request):
        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve one category
    def get(self, request, pk):
        category = get_object_or_404(Category, pk=pk)

        serializer = CategorySerializer(category)

        return Response(serializer.data)

    # PUT: Update the complete category
    def put(self, request, pk):
        category = get_object_or_404(Category, pk=pk)

        serializer = CategorySerializer(category, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Partially update a category
    def patch(self, request, pk):
        category = get_object_or_404(Category, pk=pk)

        serializer = CategorySerializer(category, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a category
    def delete(self, request, pk):
        category = get_object_or_404(Category, pk=pk)

        try:
            category.delete()

        except ProtectedError:
            return Response(
                {"error": "Category still has products."},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================
# BRAND VIEWS
# ============================================


class BrandListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve all brands
    def get(self, request):
        brands = Brand.objects.all()

        serializer = BrandSerializer(brands, many=True)

        return Response(serializer.data)

    # POST: Create a new brand
    def post(self, request):
        serializer = BrandSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BrandDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve one brand
    def get(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)

        serializer = BrandSerializer(brand)

        return Response(serializer.data)

    # PUT: Update the complete brand
    def put(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)

        serializer = BrandSerializer(brand, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Partially update a brand
    def patch(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)

        serializer = BrandSerializer(brand, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a brand
    def delete(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)

        brand.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================
# PRODUCT VIEWS
# ============================================


class ProductListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve and filter local products
    def get(self, request):

        # Retrieve active products and related category/brand.
        products = Product.objects.select_related("category", "brand")

        # Customers see active products only.
        # Administrators can see all products.
        if not request.user.is_staff:
            products = products.filter(is_active=True)
        # Search products by name.
        search = request.query_params.get("search", "").strip()

        # Category filter.
        category = request.query_params.get("category", "").strip()

        # Brand filter.
        brand = request.query_params.get("brand", "").strip()

        # Minimum and maximum price.
        min_price = request.query_params.get("min_price", "").strip()

        max_price = request.query_params.get("max_price", "").strip()

        # Search by product name.
        if search:
            products = products.filter(name__icontains=search)

        # Filter by category names.
        if category:
            category_list = [
                value.strip() for value in category.split(",") if value.strip()
            ]

            products = products.filter(category__name__in=category_list)

        # Filter by brand names.
        if brand:
            brand_list = [value.strip() for value in brand.split(",") if value.strip()]

            products = products.filter(brand__name__in=brand_list)

        # Validate and apply price filters.
        try:
            minimum = None
            maximum = None

            if min_price:
                minimum = Decimal(min_price)

                if minimum < 0:
                    raise ValueError

            if max_price:
                maximum = Decimal(max_price)

                if maximum < 0:
                    raise ValueError

            if minimum is not None and maximum is not None and minimum > maximum:
                raise ValidationError(
                    {"price": "Minimum price cannot exceed maximum price."}
                )

            if minimum is not None:
                products = products.filter(price__gte=minimum)

            if maximum is not None:
                products = products.filter(price__lte=maximum)

        except (InvalidOperation, ValueError):
            raise ValidationError({"price": "Please enter valid non-negative prices."})

        # Show newest products first.
        products = products.order_by("-created_at")

        # Convert products into JSON.
        serializer = ProductSerializer(
            products, many=True, context={"request": request}
        )

        return Response(serializer.data)

    # POST: Create a new product
    def post(self, request):
        serializer = ProductSerializer(data=request.data, context={"request": request})

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    # GET: Retrieve one product
    def get(self, request, pk):
        product = get_object_or_404(
            Product.objects.select_related("category", "brand"), pk=pk
        )

        serializer = ProductSerializer(product, context={"request": request})

        return Response(serializer.data)

    # PUT: Update the complete product
    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        serializer = ProductSerializer(
            product, data=request.data, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # PATCH: Partially update a product
    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        serializer = ProductSerializer(
            product, data=request.data, partial=True, context={"request": request}
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE: Delete a product
    def delete(self, request, pk):
        product = get_object_or_404(Product, pk=pk)

        product.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


# ============================================
# DUMMYJSON PROXY VIEWS
# These endpoints retrieve external products.
# They are separate from our local products.
# ============================================


class ProxyProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        search = request.query_params.get("search", "").strip()

        category = request.query_params.get("category", "").strip()

        brand = request.query_params.get("brand", "").strip()

        min_price = request.query_params.get("min_price", "").strip()

        max_price = request.query_params.get("max_price", "").strip()

        # Choose the external API URL.
        if search:
            url = "https://dummyjson.com/products/search"

            params = {"q": search, "limit": 200}

        elif category:
            category_slug = category.split(",")[0].strip()

            url = "https://dummyjson.com/products/category/" f"{category_slug}"

            params = {"limit": 200}

        else:
            url = "https://dummyjson.com/products"

            params = {"limit": 200}

        try:
            res = req.get(url, params=params, timeout=10)

            res.raise_for_status()

            data = res.json()

            products = data.get("products", [])

        except req.RequestException:
            return Response(
                {"error": "Failed to fetch products."},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # Apply category filter.
        if category:
            categories = [value.strip().lower() for value in category.split(",")]

            products = [
                product
                for product in products
                if product.get("category", "").lower() in categories
            ]

        # Apply brand filter.
        if brand:
            brands = [value.strip().lower() for value in brand.split(",")]

            products = [
                product
                for product in products
                if product.get("brand", "").lower() in brands
            ]

        # Apply price filters.
        try:
            if min_price:
                minimum = float(min_price)

                if minimum < 0:
                    raise ValueError

                products = [
                    product
                    for product in products
                    if product.get("price", 0) >= minimum
                ]

            if max_price:
                maximum = float(max_price)

                if maximum < 0:
                    raise ValueError

                products = [
                    product
                    for product in products
                    if product.get("price", 0) <= maximum
                ]

        except ValueError:
            return Response(
                {"error": "Please enter valid non-negative prices."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({"count": len(products), "results": products})


# ============================================
# DUMMYJSON PRODUCT DETAIL
# ============================================


class ProxyProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):

        try:
            res = req.get(f"https://dummyjson.com/products/{pk}", timeout=10)

            if res.status_code == 404:
                return Response(
                    {"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND
                )

            res.raise_for_status()

            return Response(res.json())

        except req.RequestException:
            return Response(
                {"error": "Failed to fetch product details."},
                status=status.HTTP_502_BAD_GATEWAY,
            )


# ============================================
# DUMMYJSON CATEGORY LIST
# ============================================


class ProxyCategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        try:
            res = req.get("https://dummyjson.com/products/categories", timeout=10)

            res.raise_for_status()

            data = res.json()

            results = [
                {"id": index, "name": item["slug"]} for index, item in enumerate(data)
            ]

            return Response(results)

        except (req.RequestException, ValueError, KeyError):
            return Response(
                {"error": "Failed to fetch categories."},
                status=status.HTTP_502_BAD_GATEWAY,
            )


# ============================================
# DUMMYJSON BRAND LIST
# ============================================


class ProxyBrandListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):

        try:
            res = req.get("https://dummyjson.com/products?limit=200", timeout=10)

            res.raise_for_status()

            data = res.json()

            products = data.get("products", [])

            # Extract unique brand names.
            brands = sorted(
                {product.get("brand") for product in products if product.get("brand")}
            )

            results = [
                {"id": index, "name": brand} for index, brand in enumerate(brands)
            ]

            return Response(results)

        except (req.RequestException, ValueError):
            return Response(
                {"error": "Failed to fetch brands."}, status=status.HTTP_502_BAD_GATEWAY
            )
