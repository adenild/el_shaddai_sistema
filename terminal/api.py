from django.contrib.auth import get_user_model
from django.http import JsonResponse
from terminal.models import Vehicle, Route, Ticket, Travel

User = get_user_model()


class VehicleController:
    def handler(self, request, method):
        if method == "create":
            self.create(request)
        elif method == "read":
            self.read()
        elif method == "update":
            self.update(request)
        elif method == "delete":
            self.delete(request)

    def create(self, request):
        vehicle = Vehicle(
            name=request.POST["name"],
            model=request.POST["model"],
            age=request.POST["age"],
            status=request.POST["status"],
            max_speed=request.POST["max_speed"],
            max_passengers=request.POST["max_passengers"],
            next_maintenance=request.POST["next_maintenance"],
            driver=request.POST["driver"],
            is_active=True
        )
        vehicle.save()

        response = {
            "status_code": 200,
            "message": "Objeto criado com sucesso!"
        }
        return JsonResponse(response)

    def read(self, request):
        vehicles = Vehicle.objects.filter(is_active=True).values()

        vehicles_dict = {}
        for vehicle in list(vehicles):
            vehicles_dict[vehicle["id"]] = vehicle
            vehicles_dict[vehicle["id"]].pop("id")

        response = {
            "status_code": 200,
            "data": vehicles_dict,
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)

    def update(self, request):
        vehicle = Vehicle.objects.get(id=request.POST["id"])
        form_fields = ["name", "model", "age", "status", "max_speed", "max_passengers", "next_maintenance", "driver"]
        for field in form_fields:
            if len(request.POST[field]) > 0:
                setattr(vehicle, field, request.POST[field])  # Altera o campo somente se ele for escrito
        vehicle.save()

        response = {
            "status_code": 200,
            "message": "Objeto atualizado com sucesso!"
        }
        return JsonResponse(response)

    def delete(self, request):
        vehicle = Vehicle.objects.get(id=request.POST["id"])
        vehicle.is_active = False  # Não deleta efetivamente, apenas desativa a visualização
        vehicle.save()

        response = {
            "status_code": 200,
            "message": "Objeto removido com sucesso!"
        }
        return JsonResponse(response)

    def get(self, request):
        vehicle = Vehicle.objects.filter(is_active=True, id=request.POST["id"]).values()
        response = {
            "status_code": 200,
            "data": list(vehicle),
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)


class RouteController:
    def handler(self, request, method):
        if method == "create":
            self.create(request)
        elif method == "read":
            self.read()
        elif method == "update":
            self.update(request)
        elif method == "delete":
            self.delete(request)

    def create(self, request):
        route = Route(
            name=request.POST["name"],
            code=request.POST["code"],
            distance=request.POST["distance"],
            origin=request.POST["origin"],
            destiny=request.POST["destiny"],
            allocated_vehicles=request.POST["allocated_vehicles"],
            stops=request.POST["stops"],
            is_active=True
        )
        route.save()

        response = {
            "status_code": 200,
            "message": "Objeto criado com sucesso!"
        }
        return JsonResponse(response)

    def read(self, request):
        routes = Route.objects.filter(is_active=True).values()

        routes_dict = {}
        for route in list(routes):
            routes_dict[route["id"]] = route
            routes_dict[route["id"]].pop("id")

        response = {
            "status_code": 200,
            "data": routes_dict,
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)

    def update(self, request):
        route = Route.objects.get(id=request.POST["id"])
        form_fields = ["name", "code", "distance", "origin", "destiny", "allocated_vehicles", "stops"]
        for field in form_fields:
            if len(request.POST[field]) > 0:
                setattr(route, field, request.POST[field])  # Altera o campo somente se ele for escrito
        route.save()

        response = {
            "status_code": 200,
            "message": "Objeto atualizado com sucesso!"
        }
        return JsonResponse(response)

    def delete(self, request):
        route = Route.objects.get(id=request.POST["id"])
        route.is_active = False  # Não deleta efetivamente, apenas desativa a visualização
        route.save()

        response = {
            "status_code": 200,
            "message": "Objeto removido com sucesso!"
        }
        return JsonResponse(response)

    def get(self, request):
        route = Route.objects.filter(is_active=True, id=request.POST["id"]).values()
        response = {
            "status_code": 200,
            "data": list(route)[0],
            "message": "Objeto carregados com sucesso!"
        }
        return JsonResponse(response)


class TravelController:
    def handler(self, request, method):
        if method == "create":
            self.create(request)
        elif method == "read":
            self.read()
        elif method == "update":
            self.update(request)
        elif method == "delete":
            self.delete(request)

    def create(self, request):
        travel = Travel(
            route=Route.objects.get(id=request.POST["route[id]"]),
            departure=request.POST["departure"],
            arrival=request.POST["arrival"],
            base_price=request.POST["base_price"],
            is_active=True
        )
        travel.save()

        response = {
            "status_code": 200,
            "message": "Objeto criado com sucesso!"
        }
        return JsonResponse(response)

    def read(self, request):
        travels = Travel.objects.filter(is_active=True).values()

        travels_dict = {}
        for travel in list(travels):
            travels_dict[travel["id"]] = travel
            travels_dict[travel["id"]].pop("id")

        response = {
            "status_code": 200,
            "data": travels_dict,
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)

    def update(self, request):
        travel = Travel.objects.get(id=request.POST["id"])
        travel.route_id = Route.objects.get(id=request.POST["route[id]"])
        common_fields = ["departure", "arrival", "base_price"]
        for field in common_fields:
            if len(request.POST[field]) > 0:
                setattr(travel, field, request.POST[field])  # Altera o campo somente se ele for escrito
        travel.save()

        response = {
            "status_code": 200,
            "message": "Objeto atualizado com sucesso!"
        }
        return JsonResponse(response)

    def delete(self, request):
        travel = Travel.objects.get(id=request.POST["id"])
        travel.is_active = False  # Não deleta efetivamente, apenas desativa a visualização
        travel.save()

        response = {
            "status_code": 200,
            "message": "Objeto removido com sucesso!"
        }
        return JsonResponse(response)

    def get(self, request):
        travel = Travel.objects.filter(is_active=True, id=request.POST["id"]).values()
        response = {
            "status_code": 200,
            "data": list(travel),
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)


class TicketController:
    def handler(self, request, method):
        if method == "create":
            self.create(request)
        elif method == "read":
            self.read()
        elif method == "update":
            self.update(request)
        elif method == "delete":
            self.delete(request)

    def create(self, request):
        travel_id = int(request.POST["travel[id]"].split()[0].replace("'", ''))

        if len(request.POST["passenger_id"]) < 1:
            passenger_id = User.objects.get(username="local")
        else:
            passenger_id = User.objects.get(id=request.POST["passenger_id"])

        formatted_birthday = request.POST["passenger_birthday"].split('/')
        formatted_birthday = f"{formatted_birthday[2]}-{formatted_birthday[1]}-{formatted_birthday[0]}"

        ticket = Ticket(
            travel=Travel.objects.get(id=travel_id),
            passenger_name=request.POST["passenger_name"],
            passenger_birthday=formatted_birthday,
            passenger_cpf=request.POST["passenger_cpf"],
            passenger_id=passenger_id,
            payment_method=request.POST["payment_method"],
            change_price=request.POST["change_price"],
            total_price=request.POST["total_price"],
            is_active=True
        )
        ticket.save()

        response = {
            "status_code": 200,
            "message": "Objeto criado com sucesso!"
        }
        return JsonResponse(response)

    def read(self, request):
        tickets = Ticket.objects.filter(is_active=True).values()

        tickets_dict = {}
        for ticket in list(tickets):
            tickets_dict[ticket["id"]] = ticket
            tickets_dict[ticket["id"]].pop("id")

        response = {
            "status_code": 200,
            "data": tickets_dict,
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)

    def update(self, request):
        ticket = Ticket.objects.get(id=request.POST["id"])

        travel_id = Travel.objects.get(id=request.POST["travel[id]"])
        user_id = User.objects.get(id=request.POST["passenger_id"])
        passenger_birthday = request.POST["passenger_birthday"].split('/')
        passenger_birthday = f"{passenger_birthday[2]}-{passenger_birthday[1]}-{passenger_birthday[0]}"

        ticket.travel = travel_id
        ticket.passenger_name = request.POST["passenger_name"]
        ticket.passenger_birthday = passenger_birthday
        ticket.passenger_cpf = request.POST["passenger_cpf"]
        ticket.passenger_id = user_id
        ticket.payment_method = request.POST["payment_method"]
        ticket.change_price = request.POST["change_price"]
        ticket.total_price = request.POST["total_price"]

        ticket.save()

        response = {
            "status_code": 200,
            "message": "Objeto atualizado com sucesso!"
        }
        return JsonResponse(response)

    def delete(self, request):
        ticket = Ticket.objects.get(id=request.POST["id"])
        ticket.is_active = False  # Não deleta efetivamente, apenas desativa a visualização
        ticket.save()

        response = {
            "status_code": 200,
            "message": "Objeto removido com sucesso!"
        }
        return JsonResponse(response)

    def get(self, request):
        ticket = Ticket.objects.filter(is_active=True, id=request.POST["id"]).values()
        response = {
            "status_code": 200,
            "data": list(ticket),
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)