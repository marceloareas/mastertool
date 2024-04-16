from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, login as login_django
from django.contrib.auth.decorators import login_required
from django.conf import settings
from .apis import *
from .models import *
import jwt

@api_view(['POST'])
def cadastrar_usuario(request):
    if request.method == 'POST':
        novo_cadastro = request.data

        if novo_cadastro['senha']:
            usuario = User.objects.filter(email=novo_cadastro['email']).first()

            if usuario:
                return JsonResponse({'erro': 'Usuario já existente'}, status=400)
            
            usuario = User.objects.create_user(username=novo_cadastro['email'], password=novo_cadastro['senha'])
            usuario.save()

            return JsonResponse({'mensagem': 'Usuario criado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível criar o usuario.'}, status=400)

@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        novo_cadastro = request.data
        
        usuario = authenticate(username=novo_cadastro['email'], password=novo_cadastro['senha'])
        if usuario is not None:
            login_django(request, usuario)
            
            token = jwt.encode({'user_id': usuario.id}, settings.SECRET_KEY, algorithm='HS256')
            return JsonResponse({'mensagem': 'Autenticado com sucesso', 'token': token}, status=200)
        else:
            return JsonResponse({'erro': 'Email ou senha inválidos'}, status=400)

@login_required()
@api_view(['POST'])
def cadastrar_alunos(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        usuario = request.user
        alunos_criados = cadastro_alunos_txt(uploaded_file, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
        
@login_required()
@api_view(['POST'])
def cadastrar_turma(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        usuario = request.user
        alunos_criados = cadastro_turma_txt(uploaded_file, request.POST, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)

@login_required()
@api_view(['GET'])
def get_alunos(request):
    if request.method == 'GET':
        alunos = Aluno.objects.all()
        alunos_json = [{'matricula': aluno.matricula, 'nome': aluno.nome, 'atividade': aluno.atividade} for aluno in alunos]
        return JsonResponse(alunos_json, safe=False)