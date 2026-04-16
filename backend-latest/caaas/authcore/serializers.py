from rest_framework import serializers
from .models import User

class VerifyRequestSerializer(serializers.Serializer):
    token = serializers.CharField()
    context = serializers.DictField()

class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()