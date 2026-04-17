from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication

from .models import User
from .serializers import RegisterSerializer
from .utils.smtp import send_otp_email

# -----------------------------
# REGISTER
# -----------------------------

class RegisterView(APIView):

    def get(self, request):
        return Response({
            "endpoint": "Register",
            "method": "POST",
            "required_fields": ["username", "email", "password"]
        })

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"message": None, "data": None, "error": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.save()

        # Send verification email
        send_otp_email(
            otp=user.verification_code,
            email=user.email,
        )

        # Return recovery_code ONCE — frontend must display and discard it
        recovery_code = getattr(user, '_recovery_code', None)

        return Response(
            {
                "message": "User registered. Check email for verification code.",
                "data": {
                    "user_name": user.username,
                    "recovery_code": recovery_code,   # shown once only
                },
                "error": None
            },
            status=status.HTTP_201_CREATED
        )


# -----------------------------
# VERIFY ACCOUNT
# -----------------------------

class VerifyView(APIView):

    def get(self, request):
        return Response({
            "endpoint": "Verify Account",
            "method": "POST",
            "required_fields": ["username", "verification_code"]
        })

    def post(self, request):
        username = request.data.get("username")
        code = request.data.get("verification_code")

        if not username or not code:
            return Response(
                {"message": None, "data": None, "error": "Username and verification_code are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return Response(
                {"message": None, "data": None, "error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user.verification_code != str(code):
            return Response(
                {"message": None, "data": None, "error": "Invalid verification code"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_verified = True
        user.verification_code = None  # Clear code after use
        user.save()

        return Response({"message": "Account verified successfully", "data": None, "error": None})


# -----------------------------
# LOGIN (JWT)
# -----------------------------

class LoginView(APIView):

    def get(self, request):
        return Response({
            "endpoint": "Login",
            "method": "POST",
            "required_fields": ["username", "password"]
        })

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {"message": None, "data": None, "error": "Username and password are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)

        if user is None:
            return Response(
                {"message": None, "data": None, "error": "Invalid credentials"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.is_verified:
            return Response(
                {"message": None, "data": None, "error": "Account not verified"},
                status=status.HTTP_403_FORBIDDEN
            )

        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Login successful",
            "data": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "user_name": user.username,
                "user_id": str(user.id),
            },
            "error": None
        })

