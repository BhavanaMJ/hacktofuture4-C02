from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from authcore.serializers import (
    VerifyRequestSerializer,
    RegisterSerializer,
    LoginSerializer
)

from authcore.services.jwt_service import validate_jwt, generate_jwt
from authcore.services.profile_service import get_or_create_profile
from authcore.services.risk_engine import calculate_risk
from authcore.services.decision_engine import decide
from authcore.services.auth_service import register_user, authenticate_user

from authcore.models import RequestLog


class VerifyRequestView(APIView):

    

    def post(self, request):

        def update_user_profile(profile, context):
            ip = context.get("ip")
            device = context.get("device")

            if ip:
                prefix = ".".join(ip.split(".")[:2])

                ip_data = profile.usual_ip_prefixes or {}

                ip_data[prefix] = ip_data.get(prefix, 0) + 1

                profile.usual_ip_prefixes = ip_data

            if device:
                profile.usual_device = device

            profile.save()
        data = request.data
        serializer = VerifyRequestSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        token = serializer.validated_data["token"]
        context = serializer.validated_data["context"]

        print("request received: token:",token,"Context:",context, "data:",data)

        jwt_result = validate_jwt(token)

        if not jwt_result["valid"]:
            return Response({
                "status": jwt_result["error"],
                "message": "Authentication failed"
            }, status=401)
        
        payload = jwt_result["payload"]

        user_id = payload.get("user_id")

        if not user_id:
            return Response({
                "status": "INVALID_TOKEN",
                "message": "Token missing user_id"
            }, status=401)

        profile = get_or_create_profile(user_id)

        risk_score, reasons = calculate_risk(profile, context)
        decision = decide(risk_score)

        if decision in ["ALLOW","MONITOR"]:
            update_user_profile(profile, context)

        RequestLog.objects.create(
            user_id=user_id,
            ip=context.get("ip"),
            device=context.get("device"),
            endpoint=context.get("endpoint"),
            risk_score=risk_score
        )

        return Response({
            "status": decision,
            "risk_score": risk_score,
            "reasons": reasons
        })


class RegisterView(APIView):

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = register_user(
            serializer.validated_data["email"],
            serializer.validated_data["password"]
        )

        return Response({
            "message": "User registered",
            "user_id": user.user_id
        })


class LoginView(APIView):

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        user = authenticate_user(
            serializer.validated_data["email"],
            serializer.validated_data["password"]
        )

        if not user:
            return Response({"error": "Invalid credentials"}, status=401)

        token = generate_jwt(str(user.user_id))

        return Response({
            "access_token": token
        })