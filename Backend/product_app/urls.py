from django.urls import path
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    BrandListCreateView,
    BrandDetailView,
    ProductListCreateView,
    ProductDetailView,
    ProxyProductListView,
    ProxyCategoryListView,
    ProxyBrandListView,
)

urlpatterns = [
    path("categories/", CategoryListCreateView.as_view(), name="category-list"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path("brands/", BrandListCreateView.as_view(), name="brand-list"),
    path("brands/<int:pk>/", BrandDetailView.as_view(), name="brand-detail"),
    path("proxy/", ProxyProductListView.as_view(), name="proxy-products"),
    path("proxy/categories/", ProxyCategoryListView.as_view(), name="proxy-categories"),
    path("proxy/brands/", ProxyBrandListView.as_view(), name="proxy-brands"),
    path("", ProductListCreateView.as_view(), name="product-list"),
    path("<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
]
