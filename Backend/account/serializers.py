from django.contrib.auth.password_validation import (
    validate_password,
)

from django.core.exceptions import (
    ValidationError as DjangoValidationError,
)

from rest_framework import serializers

from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):

    password = serializers.CharField(
        write_only=True, trim_whitespace=False, style={"input_type": "password"}
    )

    password2 = serializers.CharField(
        write_only=True, trim_whitespace=False, style={"input_type": "password"}
    )

    class Meta:
        model = User

        fields = [
            "email",
            "name",
            "tc",
            "password",
            "password2",
        ]

    def validate_email(self, value):

        value = User.objects.normalize_email(value).lower()

        if User.objects.filter(email__iexact=value).exists():

            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return value

    def validate(self, attrs):

        if attrs.get("password") != attrs.get("password2"):

            raise serializers.ValidationError({"password2": "Passwords do not match."})

        if attrs.get("tc") is not True:

            raise serializers.ValidationError({"tc": "You must accept the terms."})

        try:
            validate_password(attrs["password"])

        except DjangoValidationError as exc:

            raise serializers.ValidationError({"password": list(exc.messages)})

        return attrs

    def create(self, validated_data):

        validated_data.pop("password2")

        return User.objects.create_user(**validated_data)


class UserDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "id",
            "email",
            "name",
            "tc",
            "is_active",
            "created_at",
        ]

        read_only_fields = [
            "id",
            "email",
            "tc",
            "is_active",
            "created_at",
        ]


class UserLoginSerializer(serializers.Serializer):

    email = serializers.EmailField()

    password = serializers.CharField(write_only=True, trim_whitespace=False)


class UserChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True, trim_whitespace=False)

    password = serializers.CharField(write_only=True, trim_whitespace=False)

    password2 = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):

        user = self.context["user"]

        if not user.check_password(attrs["old_password"]):

            raise serializers.ValidationError(
                {"old_password": "Current password is incorrect."}
            )

        if attrs["password"] != attrs["password2"]:

            raise serializers.ValidationError({"password2": "Passwords do not match."})

        try:
            validate_password(attrs["password"], user=user)

        except DjangoValidationError as exc:

            raise serializers.ValidationError({"password": list(exc.messages)})

        return attrs

    def save(self, **kwargs):

        user = self.context["user"]

        user.set_password(self.validated_data["password"])

        user.save(update_fields=["password"])

        return user
