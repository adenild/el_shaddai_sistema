from django.urls import path
from system.api import signup, read_users, logon, UserController, log_out
from system.views import *
urlpatterns = [
    path('signup', signup),
    path('login', logon),
    path('logout', log_out),
    path('users', users, name='users'),
    path('landing', landing),
    # URL de funcionário
    path('api/user/create', UserController().create),
    path('api/user/read', UserController().read),
    path('api/user/update', UserController().update),
    path('api/user/delete', UserController().delete),
    path('api/user/get', UserController().get),
]
