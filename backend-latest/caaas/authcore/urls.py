from django.urls import path
from .views import VerifyRequestView, RegisterView, LoginView,TrainModelView
from .views import UserSummaryView, UserAnalyticsView, UserLogsView

urlpatterns = [
    path("auth/register", RegisterView.as_view()),
    path("auth/login", LoginView.as_view()),
    path("auth/verify", VerifyRequestView.as_view()),
    path("train/", TrainModelView.as_view()),

    # Step-Up Verification (recovery code)
    path("auth/recovery/verify", RecoveryVerifyView.as_view()),
# dashboard apis
    path("user/summary/", UserSummaryView.as_view()),
    path("user/analytics/", UserAnalyticsView.as_view()),
    path("user/logs/", UserLogsView.as_view()),

]