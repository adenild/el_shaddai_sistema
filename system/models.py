from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class Log(models.Model):
    message = models.CharField(max_length=500)
    date = models.DateTimeField(auto_now_add=True)


class User(AbstractUser):
    cpf = models.CharField(max_length=11, null=True, blank=True)
    birthday = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=30, null=True, blank=True)
    position = models.CharField(max_length=30, null=True, blank=True)
    employed_time = models.IntegerField(null=True, blank=True)
    contract_end = models.DateField(null=True, blank=True)
    salary = models.FloatField(null=True, blank=True)
    is_employee = models.BooleanField(default=False, null=False, blank=False)
