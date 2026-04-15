from django.db import models
from django.contrib.auth.models import AbstractUser
import random


# Custom User model extending AbstractUser
class User(AbstractUser):
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, null=True, blank=True)

    def generate_code(self):
        self.verification_code = str(random.randint(100000, 999999))
        self.save()

    def __str__(self):
        return self.username

