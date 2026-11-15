from django.urls import path

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from .views import (
    UserChangePasswordView,
    UserLoginView,
    UserProfileView,
    UserRegistrationView,
)

urlpatterns = [
    # User registration
    path("register/", UserRegistrationView.as_view(), name="register"),
    # View, update or delete user details
    path("register/<int:pk>/", UserRegistrationView.as_view(), name="user-details"),
    # User login
    path("login/", UserLoginView.as_view(), name="login"),
    # Refresh JWT token
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    # Change password
    path("change-password/", UserChangePasswordView.as_view(), name="change-password"),
    # Logged-in user's profile
    path("profile/", UserProfileView.as_view(), name="profile"),
]
