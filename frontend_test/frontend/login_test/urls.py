from django.urls import path
from . import views

urlpatterns = [
	path("", views.index, name="index"),
	path("login/", views.userLogin, name="userLogin"),
	path("signin/", views.userSignin, name="userSignin"),
    path("info/", views.info, name="info")
]