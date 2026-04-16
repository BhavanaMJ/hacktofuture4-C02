from django.contrib import admin
from .models import User, UserProfile, RequestLog


# =========================
# USER ADMIN
# =========================
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "email",
        "is_active",
        "is_staff",
        "created_at",
    )

    search_fields = ("email", "user_id")
    list_filter = ("is_active", "is_staff", "created_at")
    ordering = ("-created_at",)

    readonly_fields = ("user_id", "created_at")


# =========================
# USER PROFILE ADMIN
# =========================
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        
        "usual_device",
        "usual_login_start",
        "usual_login_end",
        "updated_at",
    )

    search_fields = ("user_id", "usual_ip_prefixes", "usual_device")
    list_filter = ("usual_device", "updated_at")
    ordering = ("-updated_at",)

    readonly_fields = ("updated_at",)


# =========================
# REQUEST LOG ADMIN
# =========================
@admin.register(RequestLog)
class RequestLogAdmin(admin.ModelAdmin):
    list_display = (
        "user_id",
        "ip",
        "device",
        "endpoint",
        "risk_score",
        "timestamp",
    )

    search_fields = ("user_id", "ip", "device", "endpoint")
    list_filter = ("device", "endpoint", "timestamp")
    ordering = ("-timestamp",)

    readonly_fields = ("timestamp",)