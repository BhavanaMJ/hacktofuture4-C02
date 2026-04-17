from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            is_verified=False,
        )
        user.generate_code()
        # Generate and store the one-time recovery code
        recovery_code = user.generate_recovery_code()
        # Attach to instance temporarily for the view to read
        user._recovery_code = recovery_code
        return user
