import os
import django

# Load Django settings
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

# Set your admin login details here
ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "AdminPassword123!"

if not User.objects.filter(email=ADMIN_EMAIL).exists():
    print("Creating superuser...")
    try:
        # Standard user model
        User.objects.create_superuser(
            username="admin", email=ADMIN_EMAIL, password=ADMIN_PASSWORD
        )
    except TypeError:
        # Custom user model (if username is not used)
        User.objects.create_superuser(email=ADMIN_EMAIL, password=ADMIN_PASSWORD)
    print("Superuser created successfully!")
else:
    print("Superuser already exists.")
