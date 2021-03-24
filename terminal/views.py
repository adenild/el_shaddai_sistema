from django.http import HttpResponse
from django.shortcuts import render


# Create your views here.
def dashboard(request):
    return render(request, "terminal/dashboard.html", {"base": "base.html"})


def tickets(request):
    return render(request, "terminal/tickets.html", {"base": "base.html"})