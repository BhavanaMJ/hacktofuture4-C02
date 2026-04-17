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

        from authcore.ml_service import get_ml_risk_score, build_ml_features

        # Rule-based risk
        rule_score, reasons = calculate_risk(profile, context)

        # ML risk
        try:
            features = build_ml_features(context, profile)
            ml_result = get_ml_risk_score(features)
            ml_score = ml_result["risk"]
        except Exception as e:
            print("ML ERROR:", e)
            ml_score = 0  # fallback

        # 🔥 Combine both scores
        final_score = int((0.6 * rule_score) + (0.4 * ml_score))

        decision = decide(final_score)

        if decision in ["ALLOW","MONITOR"]:
            update_user_profile(profile, context)

        RequestLog.objects.create(
            user_id=user_id,
            ip=context.get("ip"),
            device=context.get("device"),
            endpoint=context.get("endpoint"),
            risk_score=final_score
        )

        return Response({
            "status": decision,
            "risk_score": final_score,
            "ml_score": ml_score,
            "rule_score":rule_score,
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
    
class TrainModelView(APIView):

    def post(self, request):
        from .anomaly_detection import append_and_retrain
        from authcore.ml_service import build_ml_features,get_model

        context = request.data.get("context")
        label = request.data.get("label")  # 0 = normal, 1 = anomaly
        user_id = request.data.get("user_id")

        if context is None or label not in [0, 1]:
            return Response({"error": "Invalid input"}, status=400)

        profile = get_or_create_profile(user_id)

        # Build features from context
        features = build_ml_features(context, profile)

        # Retrain model
        model, feature_cols = get_model()
        append_and_retrain(features, feature_cols, label)

        return Response({
            "status": "Model updated successfully"
        })
    



    # ====dashboard apis

from django.db.models import Count, Avg
from django.utils.timezone import now
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination

from .models import User, RequestLog


class UserSummaryView(APIView):

    def get(self, request):
        user_id = request.query_params.get("user_id")

        user = User.objects.filter(user_id=user_id).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        # Last 24 hours
        last_day = now() - timedelta(days=1)

        logs = RequestLog.objects.filter(user_id=str(user_id))

        requests_per_day = logs.filter(timestamp__gte=last_day).count()

        avg_risk = logs.aggregate(avg=Avg("risk_score"))["avg"] or 0

        # Fake metric (you don’t have packets yet)
        avg_packets = 45  

        # Frequency (approx)
        total_logs = logs.count()
        if total_logs > 1:
            first = logs.order_by("timestamp").first().timestamp
            last = logs.order_by("-timestamp").first().timestamp
            diff = (last - first).total_seconds() / max(total_logs, 1)
            freq = f"Every {int(diff//60)} mins"
        else:
            freq = "N/A"

        return Response({
            "name": user.email.split("@")[0],
            "email": user.email,
            "role": "Analyst",

            "requests_per_day": requests_per_day,
            "avg_packets_per_request": avg_packets,
            "frequency_interval": freq,
            "avg_risk_score": round(avg_risk, 2)
        })
    

class UserAnalyticsView(APIView):

    def get(self, request):
        user_id = request.query_params.get("user_id")

        logs = RequestLog.objects.filter(user_id=str(user_id))

        # Top IPs
        top_ips = (
            logs.values("ip")
            .annotate(count=Count("ip"))
            .order_by("-count")[:5]
        )

        # Top Endpoints
        top_endpoints = (
            logs.values("endpoint")
            .annotate(count=Count("endpoint"))
            .order_by("-count")[:5]
        )

        # Top Devices
        top_devices = (
            logs.values("device")
            .annotate(count=Count("device"))
            .order_by("-count")[:5]
        )

        return Response({
            "top_ips": list(top_ips),
            "top_endpoints": list(top_endpoints),
            "top_devices": list(top_devices),
        })
    

class LogsPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "limit"


class UserLogsView(APIView):

    def get(self, request):
        user_id = request.query_params.get("user_id")

        logs = RequestLog.objects.filter(user_id=str(user_id)).order_by("-timestamp")

        paginator = LogsPagination()
        paginated_logs = paginator.paginate_queryset(logs, request)

        data = [
            {
                "user_id": log.user_id,
                "ip": log.ip,
                "device": log.device,
                "endpoint": log.endpoint,
                "risk_score": log.risk_score,
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M"),
            }
            for log in paginated_logs
        ]

        return paginator.get_paginated_response(data)
    
