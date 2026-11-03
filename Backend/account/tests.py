from django.contrib.auth import get_user_model
from django.test import TestCase

from rest_framework.test import APIClient

User = get_user_model()


class AccountTests(TestCase):

    def setUp(self):

        self.client = APIClient()

        self.user = User.objects.create_user(
            email="test@example.com", name="Test", tc=True, password="StrongPass123!"
        )

    def test_superuser_creation(self):

        admin = User.objects.create_superuser(
            email="admin@example.com", name="Admin", password="StrongPass123!", tc=True
        )

        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)

    def test_login(self):

        response = self.client.post(
            "/account/login/",
            {"email": "test@example.com", "password": "StrongPass123!"},
        )

        self.assertEqual(response.status_code, 200)

        self.assertIn("access", response.data["token"])

    def test_private_user_requires_authentication(self):

        response = self.client.get(f"/account/register/{self.user.pk}/")

        self.assertEqual(response.status_code, 401)

    def test_password_change_requires_old_password(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/account/change-password/",
            {
                "old_password": "wrong",
                "password": "NewStrongPass123!",
                "password2": "NewStrongPass123!",
            },
        )

        self.assertEqual(response.status_code, 400)

    def test_change_password(self):

        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            "/account/change-password/",
            {
                "old_password": "StrongPass123!",
                "password": "NewStrongPass123!",
                "password2": "NewStrongPass123!",
            },
        )

        self.assertEqual(response.status_code, 200)

        self.user.refresh_from_db()

        self.assertTrue(self.user.check_password("NewStrongPass123!"))

    def test_other_user_cannot_read_private_details(self):

        other = User.objects.create_user(
            email="other@example.com", name="Other", tc=True, password="StrongPass123!"
        )

        self.client.force_authenticate(user=self.user)

        response = self.client.get(f"/account/register/{other.pk}/")

        self.assertEqual(response.status_code, 403)
