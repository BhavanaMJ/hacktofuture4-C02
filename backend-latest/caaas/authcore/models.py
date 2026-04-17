from django.db import models
from django.contrib.auth.hashers import make_password, check_password


from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
import uuid


from django.contrib.auth.models import BaseUserManager

class UserManager(BaseUserManager):

    def create_user(self, email, password=None):
        if not email:
            raise ValueError("Users must have an email")

        email = self.normalize_email(email)

        user = self.model(email=email)
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_superuser(self, email, password=None):
        user = self.create_user(email, password)

        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)

        return user

    def get_by_natural_key(self, email):
        return self.get(email=email)

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import uuid

class User(AbstractBaseUser, PermissionsMixin):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    # Step-Up Verification
    recovery_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    is_recovered = models.BooleanField(default=False)

    objects = UserManager()  # 👈 THIS IS CRITICAL

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    system_lockdown = models.BooleanField(default=False)

    def generate_recovery_code(self):
        """Generate a unique 8-char alphanumeric recovery code and save it."""
        import random
        import string
        chars = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choices(chars, k=8))
            if not User.objects.filter(recovery_code=code).exists():
                self.recovery_code = code
                self.save(update_fields=["recovery_code"])
                return code

    def __str__(self):
        return self.email

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    usual_ip_prefixes = models.JSONField(default=dict)
    usual_device = models.CharField(max_length=100, null=True, blank=True)

    usual_login_start = models.IntegerField(default=0)
    usual_login_end = models.IntegerField(default=23)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"User ID:{self.user_id},user IP:{self.usual_ip_prefixes}"


class RequestLog(models.Model):
    user_id = models.CharField(max_length=255)
    ip = models.GenericIPAddressField()
    device = models.CharField(max_length=255)
    endpoint = models.CharField(max_length=255)
    risk_score = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)