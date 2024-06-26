from django.http import JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, login as login_django
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .apis import *
from .models import *
import jwt
from .utils import get_tokens_for_user  # Importe a função do arquivo utils.py

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
            
            token = get_tokens_for_user(usuario)
            return JsonResponse({'mensagem': 'Autenticado com sucesso', 'token': token}, status=200)
        else:
            return JsonResponse({'erro': 'Email ou senha inválidos'}, status=400)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_alunos(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['file']
        usuario = request.user
        alunos_criados = cadastro_alunos_txt(uploaded_file, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_turma(request):
    if request.method == 'POST':
        uploaded_file = request.FILES['file']
        usuario = request.user
        alunos_criados = cadastro_turma_txt(uploaded_file, request.data, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_alunos(request):
    if request.method == 'GET':
        usuario = request.user
        alunos = Aluno.objects.filter(usuario=usuario)
        alunos_json = [{'matricula': aluno.matricula, 'nome': aluno.nome, 'atividade': aluno.atividade} for aluno in alunos]
        return JsonResponse(alunos_json, safe=False)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_turmas(request):
    if request.method == 'GET':
        usuario = request.user

        turmas = Turma.objects.filter(usuario=usuario)
        turmas_json = []

        for turma in turmas:
            alunos_json = []
            for aluno in turma.aluno.all():
                alunos_json.append({
                    'matricula': aluno.matricula,
                    'nome': aluno.nome,
                    'atividade': aluno.atividade,
                })
            turma_dict = {
                'nome': turma.nome,
                'periodo': turma.periodo,
                'alunos': alunos_json,
            }
            turmas_json.append(turma_dict)

        return JsonResponse(turmas_json, safe=False)