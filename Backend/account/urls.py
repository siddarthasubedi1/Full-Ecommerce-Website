from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    UserChangePasswordView,
    UserLoginView,
    UserRegistrationView,
)

urlpatterns = [
    path("register/", UserRegistrationView.as_view(), name="register"),
    path("register/<int:pk>/", UserRegistrationView.as_view(), name="user-details"),
    path("login/", UserLoginView.as_view(), name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("change-password/", UserChangePasswordView.as_view(), name="change-password"),
]
