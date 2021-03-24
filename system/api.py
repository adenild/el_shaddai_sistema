from django.contrib.auth import get_user_model, authenticate, login
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
User = get_user_model()


def signup(request):
    if request.method == "POST":
        user = User(
            first_name=request.POST["name"].split(' ', 1)[0],
            last_name=request.POST["name"].split(' ', 1)[1],
            cpf=request.POST["cpf"],
            birthday=request.POST["birthday"],
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

def read_users(request):
    users = User.objects.all().values()
    response = {
        "status_code": 200,
        "data": list(users),
        "message": "Objetos carregados com sucesso!"
    }
    return JsonResponse(response)
