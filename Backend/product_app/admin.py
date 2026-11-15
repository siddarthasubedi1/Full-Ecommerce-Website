# from django.contrib import admin
# from .models import Category, Brand, Product

# admin.site.register(Category)
# admin.site.register(Brand)
# admin.site.register(Product)

from django.contrib import admin

from .models import Category, Brand, Product


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = ("name",)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "created_at",
    )

    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "brand",
        "price",
        "discounted_price",
        "stock",
        "is_active",
        "created_at",
    )

    list_filter = (
        "category",
        "brand",
        "is_active",
    )

    search_fields = (
        "name",
        "description",
    )
