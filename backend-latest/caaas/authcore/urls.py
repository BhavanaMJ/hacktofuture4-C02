from django.urls import path
from .views import VerifyRequestView, RegisterView, LoginView, TrainModelView
from .recovery_views import RecoveryVerifyView

urlpatterns = [
    path("auth/register", RegisterView.as_view()),
    path("auth/login", LoginView.as_view()),
    path("auth/verify", VerifyRequestView.as_view()),
    path("train/", TrainModelView.as_view()),

    # Step-Up Verification (recovery code)
    path("auth/recovery/verify", RecoveryVerifyView.as_view()),
]