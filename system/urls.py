from django.urls import path
from system.api import signup, read_users, logon
urlpatterns = [
    path('signup', signup),
    path('login', logon),
    path('read/users', read_users)
]
