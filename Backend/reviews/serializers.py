from rest_framework import serializers
from .models import Review


class ReviewSerializer(serializers.ModelSerializer):

    # Display the reviewer's name
    user_name = serializers.CharField(source="user.name", read_only=True)
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Review

        fields = [
            "id",
            "product_id",
            "user",
            "user_name",
            "rating",
            "comment",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "product_id",
            "user",
            "user_name",
            "created_at",
            "updated_at",
        ]

    def validate_rating(self, value):

        if value < 1 or value > 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")

        return value

    def validate_comment(self, value):

        if not value.strip():
            raise serializers.ValidationError("Review cannot be empty.")

        return value

    def get_is_mine(self, obj):
        request = self.context.get("request")

        return (
            request is not None
            and request.user.is_authenticated
            and request.user.id == obj.user_id
        )
