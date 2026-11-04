from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
)

from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

from .serializers import (
    UserChangePasswordSerializer,
    UserDetailSerializer,
    UserLoginSerializer,
    UserRegistrationSerializer,
)


def get_tokens_for_user(user):

    if not user.is_active:
        raise ValueError("Cannot issue tokens to an inactive user.")

    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class UserRegistrationView(APIView):

    def get_permissions(self):

        if self.request.method == "POST":
            return [AllowAny()]

        return [IsAuthenticated()]

    def post(self, request, pk=None):

        if pk is not None:
            return Response(
                {"error": "Registration does not accept a user ID."}, status=405
            )

        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "message": "Registration successful.",
                "data": UserDetailSerializer(user).data,
                "token": get_tokens_for_user(user),
            },
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, pk=None):

        if pk is None:
            if not request.user.is_staff:
                return Response(
                    {"error": "Only staff users can view all users."}, status=403
                )
            users = User.objects.all().order_by("id")
            return Response({"data": UserDetailSerializer(users, many=True).data})

        user = get_object_or_404(User, pk=pk)
        if user.pk != request.user.pk and not request.user.is_staff:
            return Response({"error": "Permission denied."}, status=403)
        return Response(UserDetailSerializer(user).data)

    def put(self, request, pk=None):
        return self.update_user(request, pk, partial=False)

    def patch(self, request, pk=None):
        return self.update_user(request, pk, partial=True)

    def update_user(self, request, pk, partial):
        if pk is None:
            return Response({"error": "User ID is required."}, status=400)
        user = get_object_or_404(User, pk=pk)
        if user.pk != request.user.pk and not request.user.is_staff:
            return Response({"error": "Permission denied."}, status=403)
        serializer = UserDetailSerializer(user, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {
                "message": "User updated successfully.",
                "data": serializer.data,
            }
        )

    def delete(self, request, pk=None):
        if pk is None:
            return Response({"error": "User ID is required."}, status=400)
        user = get_object_or_404(User, pk=pk)
        if user.pk != request.user.pk and not request.user.is_staff:
            return Response({"error": "Permission denied."}, status=403)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserLoginView(APIView):

    permission_classes = [AllowAny]

    def post(self, request):

        serializer = UserLoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = authenticate(
            request,
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        if user is None or not user.is_active:

            return Response({"error": "Email or password is invalid."}, status=401)

        return Response(
            {
                "message": "Login successful.",
                "token": get_tokens_for_user(user),
            }
        )


class UserChangePasswordView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = UserChangePasswordSerializer(
            data=request.data, context={"user": request.user}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {"message": "Password changed successfully. " "Please log in again."}
        )
