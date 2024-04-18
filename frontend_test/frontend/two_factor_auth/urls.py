from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("generate_otp/", views.authWithCodeGeneration, name="authWithCodeGeneration"),
	path("configure_2fa/", views.configure_2fa, name="configure_2fa"),
]
