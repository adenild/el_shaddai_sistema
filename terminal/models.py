from django.db import models
from django.conf import settings


# Create your models here.
class Vehicle(models.Model):
    name = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    age = models.IntegerField()
    status = models.CharField(max_length=20)
    max_speed = models.IntegerField()
    max_passengers = models.IntegerField()
    next_maintenance = models.DateField()
    driver = models.CharField(max_length=200)
    is_active = models.BooleanField("Ativo no sistema", default=True, null=False, blank=False)


class Route(models.Model):
    name = models.CharField(max_length=50)
    code = models.IntegerField()
    distance = models.IntegerField()
    origin = models.CharField(max_length=70)
    destiny = models.CharField(max_length=70)
    allocated_vehicles = models.IntegerField()
    stops = models.IntegerField()
    is_active = models.BooleanField("Ativo no sistema", default=True, null=False, blank=False)


class Travel(models.Model):
    route = models.ForeignKey(Route, null=False, blank=False, on_delete=models.CASCADE)
    departure = models.CharField(max_length=9)
    arrival = models.CharField(max_length=9)
    base_price = models.FloatField()
    is_active = models.BooleanField("Ativo no sistema", default=True, null=False, blank=False)


class Ticket(models.Model):
    travel = models.ForeignKey(Travel, null=False, blank=False, on_delete=models.CASCADE)
    passenger_name = models.CharField(max_length=100)
    passenger_birthday = models.DateField()
    passenger_cpf = models.CharField(max_length=11)
    passenger_id = models.OneToOneField(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=50)
    change_price = models.FloatField()
    total_price = models.FloatField()
    is_active = models.BooleanField("Ativo no sistema", default=True, null=False, blank=False)
