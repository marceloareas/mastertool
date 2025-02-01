from django.http import JsonResponse, HttpResponseNotFound
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import authenticate, login as login_django
from rest_framework.permissions import IsAuthenticated
from .apis import *
from .models import *
from .utils import get_tokens_for_user  # Importe a função do arquivo utils.py
from django.views.decorators.http import require_http_methods
from django.core.exceptions import ObjectDoesNotExist

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
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def aluno_existe(request, matricula):
        aluno = Aluno.objects.filter(matricula=matricula, usuario=request.user).first()
        if aluno:
            return JsonResponse({'existe': True, 'mensagem': f'Aluno com matrícula {matricula} já existe.'}, status=200)

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
    try:
        aluno   = Aluno.objects.filter(matricula=matricula, usuario=usuario).first()
        
        turmas = Turma.objects.filter(aluno=aluno, usuario=usuario)
        if turmas: 
            for turma in turmas:
                turma.aluno.remove(aluno)
                Nota.objects.filter(aluno=aluno, turma=turma).delete()
        aluno.delete()
        return JsonResponse({'mensagem': 'Aluno excluído.'})
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Aluno não encontrad")
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_aluno(request, matricula):
    usuario = request.user
    data    = request.data
    
    try:
        aluno   = Aluno.objects.filter(matricula=matricula, usuario=usuario).first()
        aluno.matricula = data['matricula']
        aluno.nome      = data['nome']
        aluno.save()
        return JsonResponse({'mensagem': 'Dados do aluno foram editados.'})
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Não foi possível editar o aluno.")

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- VIEWS TURMA -----------------------------------------
# -----------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_turma(request):
    if request.method == 'POST':
        usuario        = request.user
        resultado  = cadastro_turma_txt(request.data, usuario)

        alunos_criados = resultado.get('alunos_criados', [])
        alunos_nao_criados = resultado.get('alunos_nao_criados', [])
        id_turma = resultado.get('id_turma', [])

        if alunos_criados:
            response_data = {
                'mensagem': 'Arquivo processado com sucesso.',
                'id_turma': id_turma,
                'alunos_criados': [aluno.nome for aluno in alunos_criados],
                'alunos_nao_criados': alunos_nao_criados
            }
            return JsonResponse(response_data)
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

    try:
        turma = Turma.objects.filter(id=id, usuario=usuario).first()
        turma.delete()
        return JsonResponse({'mensagem': 'Turma excluída.'})
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Turma não encontrada")
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_turma(request, id):
    usuario = request.user
    data    = request.data

    turma_editada = atualizar_turma(id, data, usuario)
    return JsonResponse(turma_editada, safe=False)

# -----------------------------------------------------------------------------------------------
# ---------------------------------------- VIEWS NOTAS ------------------------------------------
# -----------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def adicionar_nota(request, id):
    if request.method == 'POST':
        data    = request.data
        usuario = request.user

        try:
            turma = Turma.objects.get(id=id)
            
            # Excluir notas
            if 'titulo' in data:
                alunos = Aluno.objects.filter(turma=turma)
                for aluno in alunos:
                    Nota.objects.filter(
                        titulo=data['titulo'],
                        turma=turma, 
                        aluno=aluno
                    ).first().delete()
            else:
                for aluno_editar in data:
                    aluno = Aluno.objects.get(matricula=aluno_editar['matricula'])

                    # Adicionar ou Atualizar notas
                    for nota in aluno_editar['notas']:

                        # Atualiza o valor da nota existente
                        if 'id' in nota:
                            nota_existente = Nota.objects.filter(
                                aluno=aluno,
                                turma=turma,
                                id=nota['id']
                            ).first()
                            nota_existente.titulo = nota['titulo']
                            nota_existente.valor = nota['valor']
                            nota_existente.save()
                        else:
                        # Cria uma nova nota
                            Nota.objects.create(
                                aluno=aluno,
                                turma=turma,
                                titulo=nota['titulo'],
                                valor=nota['valor']
                            )

            return JsonResponse({'message': 'Notas adicionadas com sucesso'}, status=200)
        except Aluno.DoesNotExist:
            return JsonResponse({'error': 'Aluno não encontrado'}, status=404)
        except Turma.DoesNotExist:
            return JsonResponse({'error': 'Turma não encontrada'}, status=404)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
        
# -----------------------------------------------------------------------------------------------
# ---------------------------------------- VIEWS PROJETOS ---------------------------------------
# -----------------------------------------------------------------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cadastrar_projeto(request):
    if request.method == 'POST':
        usuario = request.user
        data = request.data

        resultado  = cadastro_projeto_txt(request.data, usuario)

        alunos_criados = resultado.get('alunos_criados', [])
        alunos_nao_criados = resultado.get('alunos_nao_criados', [])
        id_turma = resultado.get('id_turma', [])

        if alunos_criados:
            response_data = {
                'mensagem': 'Arquivo processado com sucesso.',
                'id_turma': id_turma,
                'alunos_criados': [aluno.nome for aluno in alunos_criados],
                'alunos_nao_criados': alunos_nao_criados
            }
            return JsonResponse(response_data)
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_projetos(request, id=None):
    usuario = request.user

    try:
        if id:
            projeto = Projeto.objects.get(id=id, usuario=usuario)
            alunos_json = [{'matricula': aluno.matricula, 'nome': aluno.nome} for aluno in projeto.aluno.all()]
            
            projeto_json = {
                'id': projeto.id,
                'nome': projeto.nome,
                'descricao': projeto.descricao,
                'data_inicio': projeto.data_inicio,
                'data_fim': projeto.data_fim,
                'periodo': projeto.periodo,
                'alunos': alunos_json,
            }
            return JsonResponse(projeto_json)
        
        else:
            projetos = Projeto.objects.filter(usuario=usuario)
            projetos_json = []
            
            for projeto in projetos:
                alunos_json = [{'matricula': aluno.matricula, 'nome': aluno.nome} for aluno in projeto.aluno.all()]
                
                projetos_json.append({
                    'id': projeto.id,
                    'nome': projeto.nome,
                    'descricao': projeto.descricao,
                    'data_inicio': projeto.data_inicio,
                    'data_fim': projeto.data_fim,
                    'periodo': projeto.periodo,
                    'alunos': alunos_json,
                })
                
            return JsonResponse(projetos_json, safe=False)

    except Projeto.DoesNotExist:
        return HttpResponseNotFound("Projeto não encontrado")


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def excluir_projeto(request, id):
    if request.method == 'DELETE':
        usuario = request.user
        
        try:
            projeto = Projeto.objects.get(id=id, usuario=usuario)
            projeto.delete()
            return JsonResponse({'mensagem': 'Projeto excluído com sucesso.'}, status=200)
        except Projeto.DoesNotExist:
            return HttpResponseNotFound("Projeto não encontrado")
        except Exception as e:
            return JsonResponse({'erro': f'Erro ao excluir o projeto: {str(e)}'}, status=400)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def editar_projeto(request, id):
    if request.method == 'PUT':
        usuario = request.user
        data = request.data
        
        projeto_atualizado = atualizar_projeto(id, data, usuario)
        return JsonResponse(projeto_atualizado, safe=False)
        
