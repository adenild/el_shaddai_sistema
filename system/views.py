from django.contrib.auth import authenticate, login
from django.contrib.auth.forms import UserCreationForm
from django.shortcuts import render, redirect


# Create your views here.
def signup(request):
    return render(request, 'auth/signup.html')


def logon(request):
    return render(request, 'auth/login.html')


def landing(request):
    return render(request, 'system/landing.html', {"base": "base.html"})


def users(request):
    return render(request, "system/users.html", {"base": "base.html"})

