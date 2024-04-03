from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from .apis import cadastro_txt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required


# @login_required()
@api_view(['POST'])
def cadastrar_turma(request):
    if request.method == 'POST' and request.data['arquivo']:
        alunos_criados = cadastro_txt(request.data)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.', 'alunos_criados': alunos_criados})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)

@api_view(['POST'])
def cadastrar_usuario(request):
    if request.method == 'POST':
        novo_cadastro = request.data

        if novo_cadastro['senha'] == novo_cadastro['confirmar_senha']:
            username = request.POST.get('usarname')
            email = request.POST.get('email')
            senha = request.POST.get('senha')

            usuario = User.objects.filter(username=username).first()

            if usuario:
                return JsonResponse({'erro': 'Usuario já existente'}, status=400)
            
            usuario = User.objects.create_user(username=username, email=email, password=senha)
            usuario.save()

            return JsonResponse({'mensagem': 'Usuario criado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível criar o usuario.'}, status=400)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        username = request.POST.get('usarname')
        senha = request.POST.get('senha')

        usuario = authenticate(username=username, password=senha)

        if usuario:
            login_django(request, usuario)
            return JsonResponse({'mensagem': 'Autenticado'})
        else:
            return JsonResponse({'erro': 'usuario ou senha invalidos'}, status=400)



