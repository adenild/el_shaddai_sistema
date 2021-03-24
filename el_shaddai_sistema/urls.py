from django.contrib import admin
from django.urls import path, include
from system.views import signup, landing, logon

urlpatterns = [
    path('terminal/', include('terminal.urls')),
    path('system/', include('system.urls')),
    path('admin/', admin.site.urls),

    path('signup', signup, name='signup'),
    path('login', logon, name='login'),
    path('', landing, name='landing')
]
