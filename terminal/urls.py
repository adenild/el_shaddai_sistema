from django.urls import path
from terminal.views import *
from terminal.api import VehicleController, RouteController, TravelController, TicketController

urlpatterns = [
    path('', dashboard, name='dashboard'),
    path('tickets', tickets, name='tickets'),
    path('tickets/list', tickets_read, name='tickets_list'),
    path('routes', routes, name='routes'),
    # URL do veículo
    # path('api/vehicle/<method>', VehicleController().handler),
    path('api/vehicle/create', VehicleController().create),
    path('api/vehicle/read', VehicleController().read),
    path('api/vehicle/update', VehicleController().update),
    path('api/vehicle/delete', VehicleController().delete),
    path('api/vehicle/get', VehicleController().get),
    # URL da rota
    # path('api/route/<method>', RouteController().handler),
    path('api/route/create', RouteController().create),
    path('api/route/read', RouteController().read),
    path('api/route/update', RouteController().update),
    path('api/route/delete', RouteController().delete),
    path('api/route/get', RouteController().get),
    # URL da viagem
    # path('api/travel/<method>', TravelController().handler),
    path('api/travel/create', TravelController().create),
    path('api/travel/read', TravelController().read),
    path('api/travel/update', TravelController().update),
    path('api/travel/delete', TravelController().delete),
    path('api/travel/get', TravelController().get),
    # URL da passagem
    # path('api/ticket/<method>', TravelController().handler),
    path('api/ticket/create', TicketController().create),
    path('api/ticket/read', TicketController().read),
    path('api/ticket/update', TicketController().update),
    path('api/ticket/delete', TicketController().delete),
    path('api/ticket/get', TicketController().get),
]
