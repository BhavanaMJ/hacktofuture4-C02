from django.urls import path
from .views import VerifyRequestView, RegisterView, LoginView,TrainModelView

urlpatterns = [
    path("auth/register", RegisterView.as_view()),
    path("auth/login", LoginView.as_view()),
    path("auth/verify", VerifyRequestView.as_view()),
    path("train/", TrainModelView.as_view()),

]