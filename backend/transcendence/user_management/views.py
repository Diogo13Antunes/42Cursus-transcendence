from django.http import HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages

# Create your views here.
def index(request):
	return HttpResponse("Hello from the user_management app!")

def userLogin(request):

	if request.method == "POST":
		username = request.POST["username"]
		password = request.POST["password"]
		user = authenticate(request, username=username, password=password)
		if user is not None:
			login(request, user)
			return HttpResponse("Login success")
			#return redirect("index")
		else:
			return HttpResponse("Login Fail")

	return render(request, "user_management/login.html", {})
