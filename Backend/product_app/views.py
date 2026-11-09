import requests as req

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.db.models.deletion import ProtectedError

from .models import Category, Brand, Product
from .serializers import CategorySerializer, BrandSerializer, ProductSerializer
from .permissions import IsAdminOrReadOnly
from rest_framework.permissions import AllowAny

# ── CATEGORIES ──────────────────────────────────


class CategoryListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        categories = Category.objects.all()
        return Response(CategorySerializer(categories, many=True).data)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CategoryDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, pk=None):
        category = get_object_or_404(Category, pk=pk)
        return Response(CategorySerializer(category).data)

    def put(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


# ── BRANDS ──────────────────────────────────────


class BrandListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        brands = Brand.objects.all()
        return Response(BrandSerializer(brands, many=True).data)

    def post(self, request):
        serializer = BrandSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BrandDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        return Response(BrandSerializer(brand).data)

    def put(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        serializer = BrandSerializer(brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        brand = get_object_or_404(Brand, pk=pk)
        serializer = BrandSerializer(brand, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        get_object_or_404(Brand, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── PRODUCTS ────────────────────────────────────


class ProductListCreateView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request):
        products = Product.objects.select_related("category", "brand").all()

        search = request.query_params.get("search", "").strip()
        category = request.query_params.get("category", "").strip()
        brand = request.query_params.get("brand", "").strip()

        if search:
            products = products.filter(name__icontains=search)
        if category:
            cat_list = [c.strip() for c in category.split(",") if c.strip()]
            products = products.filter(category__name__in=cat_list)
        if brand:
            brand_list = [b.strip() for b in brand.split(",") if b.strip()]
            products = products.filter(brand__name__in=brand_list)

        products = products.order_by("-created_at")
        return Response(ProductSerializer(products, many=True).data)

    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailView(APIView):
    permission_classes = [IsAdminOrReadOnly]

    def get(self, request, pk):
        product = get_object_or_404(
            Product.objects.select_related("category", "brand"), pk=pk
        )
        return Response(ProductSerializer(product).data)

    def put(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        get_object_or_404(Product, pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ── PROXY (DummyJSON) ──────────────────────────


class ProxyProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search = request.query_params.get("search", "").strip()
        category = request.query_params.get("category", "").strip()
        brand = request.query_params.get("brand", "").strip()
        min_price = request.query_params.get("min_price", "").strip()
        max_price = request.query_params.get("max_price", "").strip()

        if search:
            url = f"https://dummyjson.com/products/search?q={search}&limit=200"
        elif category:
            url = f"https://dummyjson.com/products/category/{category}?limit=200"
        else:
            url = "https://dummyjson.com/products?limit=200"

        try:
            res = req.get(url, timeout=10)
            data = res.json()
            products = data.get("products", [])
        except Exception:
            return Response({"error": "Failed to fetch products"}, status=500)

        if search and category:
            cats = [c.strip().lower() for c in category.split(",")]
            products = [p for p in products if p.get("category", "").lower() in cats]

        if brand:
            brands = [b.strip().lower() for b in brand.split(",")]
            products = [p for p in products if p.get("brand", "").lower() in brands]

        try:
            if min_price:
                products = [
                    p for p in products if p.get("price", 0) >= float(min_price)
                ]
            if max_price:
                products = [
                    p for p in products if p.get("price", 0) <= float(max_price)
                ]
        except ValueError:
            pass

        return Response(
            {
                "count": len(products),
                "results": products,
            }
        )


# ── PROXY PRODUCT DETAIL ───────────────────────


class ProxyProductDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        try:
            res = req.get(f"https://dummyjson.com/products/{pk}", timeout=10)
            if res.status_code == 404:
                return Response(
                    {"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND
                )

            data = res.json()
            return Response(data)
        except Exception:
            return Response(
                {"error": "Failed to fetch product detail"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ProxyCategoryListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            res = req.get("https://dummyjson.com/products/categories", timeout=10)
            data = res.json()
            # DummyJSON returns [{"slug": "beauty", "name": "Beauty", "url": "..."}]
            results = [{"id": i, "name": item["slug"]} for i, item in enumerate(data)]
            return Response(results)
        except Exception:
            return Response({"error": "Failed to fetch categories"}, status=500)


class ProxyBrandListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            res = req.get("https://dummyjson.com/products?limit=200", timeout=10)
            data = res.json()
            products = data.get("products", [])
            # Extract unique brands
            brands = sorted(set(p.get("brand", "") for p in products if p.get("brand")))
            results = [{"id": i, "name": b} for i, b in enumerate(brands)]
            return Response(results)
        except Exception:
            return Response({"error": "Failed to fetch brands"}, status=500)
