from django.contrib import admin

from .models import Wishlist, WishlistItem


class WishlistItemInline(admin.TabularInline):

    model = WishlistItem
    extra = 0


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "user",
        "created_at",
    )

    search_fields = ("user__email",)

    inlines = [
        WishlistItemInline,
    ]


@admin.register(WishlistItem)
class WishlistItemAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "wishlist",
        "product_id",
        "added_at",
    )
