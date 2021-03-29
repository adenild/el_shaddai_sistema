from django.contrib.auth import get_user_model, authenticate, login, logout
from django.contrib.auth.models import Group
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
User = get_user_model()


def format_date(date):
    formatted_data = date.split('/')
    return f"{formatted_data[2]}-{formatted_data[1]}-{formatted_data[0]}"


def signup(request):
    if request.method == "POST":
        user = User(
            first_name=request.POST["name"].split(' ', 1)[0],
            last_name=request.POST["name"].split(' ', 1)[1],
            cpf=request.POST["cpf"],
            birthday=format_date(request.POST["birthday"]),
            email=request.POST["email"],
            username=request.POST["username"],
            password=request.POST["password"]
        )
        user.save()

        return logon(request)


def logon(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return HttpResponse(status=200)
    else:
        return HttpResponse(status=500)


def log_out(request):
    logout(request)


def read_users(request):
    users = User.objects.all().values()
    response = {
        "status_code": 200,
        "data": list(users),
        "message": "Objetos carregados com sucesso!"
    }
    return JsonResponse(response)


def get_user_groups(user_id):
    group = User.objects.get(id=user_id).groups.all().values()
    return group[0]["name"]


class UserController:
    def create(self, request):
        user = User(
            first_name=request.POST["name"].split(' ', 1)[0],
            last_name=request.POST["name"].split(' ', 1)[1],
            cpf=request.POST["cpf"],
            birthday=format_date(request.POST["birthday"]),
            status=request.POST["status"],
            position=request.POST["position"],
            employed_time=request.POST["employed_time"],
            contract_end=format_date(request.POST["contract_end"]),
            salary=request.POST["salary"],
            is_employee=True,
            email=request.POST["email"],
            username=request.POST["username"],
            password=request.POST["password"]
        )
        user.save()
        group = Group.objects.get(name=request.POST["group"])
        group.user_set.add(User.objects.get(username=request.POST["username"]))

        response = {
            "status_code": 200,
            "message": "Conta de funcionário criada com sucesso!"
        }
        return JsonResponse(response)

    def read(self, request):
        users = User.objects.filter(is_employee=True, is_active=True).values()

        users_dict = {}
        for user in list(users):
            user_id = user["id"]
            users_dict[user["id"]] = user
            users_dict[user["id"]].pop("id")
            users_dict[user_id]["group"] = get_user_groups(user_id)

        response = {
            "status_code": 200,
            "data": users_dict,
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)

    def update(self, request):
        user = User.objects.get(is_employee=True, id=request.POST["id"])
        user.first_name = request.POST["name"].split(' ', 1)[0]
        user.last_name = request.POST["name"].split(' ', 1)[1]
        user.contract_end = format_date(request.POST["contract_end"])
        user.birthday = format_date(request.POST["birthday"])
        common_fields = ["cpf", "status", "position", "employed_time", "salary", "email", "username", "password"]
        for field in common_fields:
            if len(request.POST[field]) > 0:
                setattr(user, field, request.POST[field])  # Altera o campo somente se ele for escrito
        user.save()
        response = {
            "status_code": 200,
            "message": "Objeto atualizado com sucesso!"
        }
        return JsonResponse(response)

    def delete(self, request):
        user = User.objects.get(id=request.POST["id"])
        user.is_active = False  # Não deleta efetivamente, apenas desativa a visualização
        user.save()

        response = {
            "status_code": 200,
            "message": "Objeto removido com sucesso!"
        }
        return JsonResponse(response)

    def get(self, request):
        user = User.objects.filter(is_active=True, id=request.POST["id"]).values()
        response = {
            "status_code": 200,
            "data": list(user),
            "message": "Objetos carregados com sucesso!"
        }
        return JsonResponse(response)
