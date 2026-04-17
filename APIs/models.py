from django.db import models
from django.contrib.auth.models import AbstractUser
import random
import string


# Custom User model extending AbstractUser
class User(AbstractUser):
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, null=True, blank=True)

    # Step-Up Verification
    recovery_code = models.CharField(max_length=10, unique=True, null=True, blank=True)
    is_recovered = models.BooleanField(default=False)

    def generate_code(self):
        self.verification_code = str(random.randint(100000, 999999))
        self.save()

    def generate_recovery_code(self):
        """Generate a unique 8-char alphanumeric recovery code."""
        chars = string.ascii_uppercase + string.digits
        while True:
            code = ''.join(random.choices(chars, k=8))
            if not User.objects.filter(recovery_code=code).exists():
                self.recovery_code = code
                self.save()
                return code

    def __str__(self):
        return self.username

