# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
# from .models import User


# @admin.register(User)
# class CustomUserAdmin(BaseUserAdmin):
#     list_display = ("id", "email", "name", "is_active", "is_admin")
#     search_fields = ("email", "name")
#     list_filter = ("is_active", "is_admin")
#     ordering = ("email",)
#     filter_horizontal = []

#     readonly_fields = ("last_login", "created_at", "updated_at")

#     fieldsets = (
#         ("Account", {"fields": ("email", "password")}),
#         ("Personal Information", {"fields": ("name", "tc")}),
#         ("Permissions", {"fields": ("is_active", "is_admin")}),
#         ("Dates", {"fields": ("last_login", "created_at", "updated_at")}),
#     )

#     add_fieldsets = (
#         (
#             None,
#             {
#                 "classes": ("wide",),
#                 "fields": ("email", "name", "tc", "password1", "password2"),
#             },
#         ),
#     )


from django.contrib import admin
from django.contrib.auth.admin import (
    UserAdmin as BaseUserAdmin,
)

from django.contrib.auth.forms import (
    AdminUserCreationForm,
)

from .models import User


@admin.register(User)
class CustomUserAdmin(BaseUserAdmin):

    add_form = AdminUserCreationForm

    list_display = (
        "id",
        "email",
        "name",
        "is_active",
        "is_admin",
    )

    search_fields = (
        "email",
        "name",
    )

    list_filter = (
        "is_active",
        "is_admin",
    )

    ordering = ("email",)

    filter_horizontal = []

    readonly_fields = (
        "last_login",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Account",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Personal Information",
            {
                "fields": (
                    "name",
                    "tc",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_admin",
                )
            },
        ),
        (
            "Dates",
            {
                "fields": (
                    "last_login",
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "name",
                    "tc",
                    "password1",
                    "password2",
                ),
            },
        ),
    )
