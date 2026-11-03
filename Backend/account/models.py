from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
)

from django.db import models


class UserManager(BaseUserManager):

    def create_user(self, email, name, tc=False, password=None, **extra_fields):

        if not email:
            raise ValueError("Users must have an email address.")

        if not name:
            raise ValueError("Users must have a name.")

        if not password:
            raise ValueError("A password is required.")

        user = self.model(
            email=self.normalize_email(email), name=name, tc=tc, **extra_fields
        )

        user.set_password(password)

        user.save(using=self._db)

        return user

    def create_superuser(self, email, name, tc=False, password=None, **extra_fields):

        if extra_fields.get("is_admin") is False:
            raise ValueError("A superuser must have is_admin=True.")

        extra_fields["is_admin"] = True
        extra_fields["is_active"] = True

        return self.create_user(email, name, tc=tc, password=password, **extra_fields)


class User(AbstractBaseUser):

    email = models.EmailField(max_length=255, unique=True)

    name = models.CharField(max_length=200)

    tc = models.BooleanField()

    is_active = models.BooleanField(default=True)

    is_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["name", "tc"]

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def is_superuser(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_active and self.is_admin

    def has_module_perms(self, app_label):
        return self.is_active and self.is_admin
