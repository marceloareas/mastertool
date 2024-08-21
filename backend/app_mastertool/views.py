from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, login as login_django
from rest_framework.permissions import IsAuthenticated
from .apis import *
from .models import *
from .utils import get_tokens_for_user  # Importe a função do arquivo utils.py

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- VIEWS USUARIO ---------------------------------------
# -----------------------------------------------------------------------------------------------

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

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- VIEWS ALUNOS ----------------------------------------
# -----------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_alunos(request):
    if request.method == 'POST':
        usuario = request.user
        alunos_criados = cadastro_alunos_txt(request.data, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_alunos(request, matricula=None):
    if request.method == 'GET':
        usuario = request.user
        alunos_json = encontrar_aluno(matricula, usuario)
        return JsonResponse(alunos_json, safe=False)
       
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def excluir_aluno(request, matricula):
    usuario = request.user
    aluno   = Aluno.objects.filter(matricula=matricula, usuario=usuario).first()

    turmas = Turma.objects.filter(aluno=aluno, usuario=usuario)
    for turma in turmas:
        turma.aluno.remove(aluno)

    if aluno:
        aluno.delete()
        return JsonResponse({'mensagem': 'Aluno excluído.'})
    else:
        return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_aluno(request, matricula):
    usuario = request.user
    data    = request.data
    aluno   = Aluno.objects.filter(matricula=matricula, usuario=usuario).first()

    if aluno:
        aluno.matricula = data['matricula']
        aluno.nome      = data['nome']
        aluno.save()
        return JsonResponse({'mensagem': 'Dados do aluno foram editados.'})
    else:
        return JsonResponse({'erro': 'Não foi possível editar o aluno.'}, status=400)

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- VIEWS TURMA -----------------------------------------
# -----------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_turma(request):
    if request.method == 'POST':
        usuario        = request.user
        alunos_criados = cadastro_turma_txt(request.data, usuario)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.'})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_turmas(request, id=None):
    if request.method == 'GET':
        usuario = request.user

        turmas_json = encontrar_turma(id, usuario)

        return JsonResponse(turmas_json, safe=False)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def excluir_turma(request, id):
    usuario = request.user
    turma = Turma.objects.filter(id=id, usuario=usuario).first()
    if turma:
        turma.delete()
        return JsonResponse({'mensagem': 'Turma excluído.'})
    else:
        return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_turma(request, id):
    usuario = request.user
    data    = request.data
    turma   = Aluno.objects.filter(id=id, usuario=usuario).first()

    if turma:
        turma.nome      = data['nome']
        turma.periodo   = data['periodo']
        turma.aluno     = data['alunos']
        turma.save()
        return JsonResponse({'mensagem': 'Dados da turma foram editados.'})
    else:
        return JsonResponse({'erro': 'Não foi possível editar a turma.'}, status=400)