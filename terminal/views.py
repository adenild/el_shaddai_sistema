from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
def dashboard(request):
    return render(request, "terminal/dashboard.html", {"base": "base.html"})


def tickets(request):
    return render(request, "terminal/tickets.html", {"base": "base.html"})


def tickets_read(request):
    return render(request, "terminal/tickets_read.html", {"base": "base.html"})


def routes(request):
    return render(request, "terminal/routes.html", {"base": "base.html"})
