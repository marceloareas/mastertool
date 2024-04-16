from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as login_django
from django.contrib.auth.decorators import login_required
from .apis import *
from .models import *

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
        email = request.data['email']
        senha = request.data['senha']

        usuario = authenticate(username=email, password=senha)

        if usuario:
            login_django(request, usuario)
            return JsonResponse({'mensagem': 'Autenticado'}, status=200)
        else:
            return JsonResponse({'erro': 'usuario ou senha invalidos'}, status=400)

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