from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
import json


def index(request):
	return render(request, "user_management/index.html", {})

def userLogin(request):

	if request.user.is_authenticated:
		return render(request, "user_management/index.html", {})

	if request.method == "POST":
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return render(request, "user_management/index.html", {})
		else:
			return render(request, "user_management/login.html", {
				"success": False
			})

	return render(request, "user_management/login.html", {
		"success": True
	})

def userLogout(request):
	logout(request)
	return render(request, "user_management/index.html", {})

def userSignin(request):

	if request.method == "POST":

		username = request.POST["username"]
		email = request.POST["email"]
		password = request.POST["password"]

		if not username or not email or not password:
			return render(request, "user_management/signin.html", {
				"message": "Fail to create user."
			})		

		if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
			return render(request, "user_management/signin.html", {
				"message": "Username already exists."
			})
        
		user = User.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return render(request, "user_management/index.html", {})

	return render(request, "user_management/signin.html", {})


# REST API test login
def apiLogin(request):

	message = "Login Error"
	sessionid = None
	req_data = None
	if request.method == "POST" and request.body:
		req_data = json.loads(request.body)
		user = authenticate(request, username=req_data["username"], password=req_data["password"])
		if user:
			login(request, user)
			sessionid = request.session.session_key
			message = "Login Success"

	res_data = {
		"message": message,
		"sessionid": sessionid
	}
	return JsonResponse(res_data)

def apiSignin(request):

	message = "Signin Error"
	req_data = None
	if request.method == "POST" and request.body:
		req_data = json.loads(request.body)
		email = req_data['email']
		username = req_data['username']
		password = req_data['password']

		#print(req_data)
		if (not email or not username or not password):
			return JsonResponse({"message": "Signin Error", "success": "false"})
		if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
			return JsonResponse({"message": "User already exists", "success": "false"})
		User.objects.create_user(username=username, email=email, password=password)
		user = authenticate(request, username=username, password=password)
		if not user:
			return JsonResponse({"message": "Signin Error", "success": "false"})
	return JsonResponse({"message": "Signin Success", "success": "true"})

def apiTest(request):

	res_data = {
		"user": request.user.username,
	}
	return JsonResponse(res_data)
