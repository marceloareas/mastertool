from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponseNotFound
from datetime import datetime

from .models import Aluno, Turma, Projeto, Nota

# TODO: Modular essas funções em 3 arquivos diff para simplificar o debugging

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- APIS ALUNOS -----------------------------------------
# -----------------------------------------------------------------------------------------------


def cadastro_alunos_txt(data, usuario):
    alunos              = []
    alunos_criados      = []
    id_turma            = data.get('id', None)
    tipo                = data.get('tipo', None)
    conteudo_arquivo    = data['turma']
    linhas              = conteudo_arquivo.splitlines()

    for linha in linhas:
        matricula, nome = linha.split(', ')
        if not matricula and not nome:
            continue  # Pular linhas que não têm nome ou matricula
        alunos.append({
            'matricula': matricula,
            'nome': nome
        })

    for aluno in alunos:
        if not Aluno.objects.filter(matricula=aluno['matricula'], usuario=usuario).exists():
            novo_aluno = Aluno(matricula=aluno['matricula'], nome=aluno['nome'])
            novo_aluno.save()
            novo_aluno.usuario.add(usuario)
            alunos_criados.append(aluno['nome'])
        else:
            print(f'Aluno com matrícula {matricula} já existe.')
        aluno = Aluno(nome=nome, matricula=matricula)
        aluno.save()
        aluno.usuario.add(usuario)
    if id_turma:
        if tipo == 'class':
            adicionar_aluno_turma(id_turma, alunos, usuario)
        elif tipo == 'project':
            adicionar_aluno_projeto(id_turma, alunos, usuario)

    return alunos_criados

def encontrar_aluno(matricula, usuario):
    if matricula:
        aluno = Aluno.objects.filter(matricula=matricula, usuario=usuario).first()
        aluno_json = {  'matricula' : aluno.matricula, 
                        'nome'      : aluno.nome}
        return aluno_json

    alunos = Aluno.objects.filter(usuario=usuario)
    alunos_json = [{'matricula' : aluno.matricula, 
                    'nome'      : aluno.nome} for aluno in alunos]
    return alunos_json
# -----------------------------------------------------------------------------------------------
# ----------------------------------------- APIS TURMA ------------------------------------------
# -----------------------------------------------------------------------------------------------


def cadastrar_turma_api(data, usuario):
    matriculas = []
    alunos_nao_criados = []
    alunos = []
    conteudo_arquivo = data['turma']

    nova_turma = Turma(nome=data['nome'],
                       periodo=data['periodo'], usuario=usuario)
    nova_turma.save()

    # Quando a turma foi criada junto com uma listagem de alunos
    if conteudo_arquivo:

        # TODO: Pode ocorrer um erro se o arquivo não está formatado corretamente
        for linha in conteudo_arquivo.splitlines():
            matricula, nome = linha.split(', ')
            alunos.append({'matricula': matricula, 'nome': nome})

        # Checa se TODOS da listagem de alunos existem e agurpa as matriculas de acordo
        for aluno in alunos:
            if Aluno.objects.filter(matricula=aluno['matricula']).first():
                matriculas.append(aluno['matricula'])
            else:
                alunos_nao_criados.append(aluno)

        # Coleta todos os alunos existentes e add a turma criada
        alunos_existentes = Aluno.objects.filter(
            matricula__in=matriculas, usuario=usuario)
        nova_turma.aluno.add(*alunos_existentes)

        # Tratamento dos alunos inexistentes:
        for aluno in alunos_nao_criados:
            # Cria o aluno inexistente
            novo_aluno = Aluno(
                matricula=aluno['matricula'], nome=aluno['nome'])
            novo_aluno.save()
            # O que isso significa?
            novo_aluno.usuario.set([usuario])

            # Adiciona o aluno a turma
            nova_turma.aluno.add(novo_aluno)

        if alunos_nao_criados:
            return {'id_turma': nova_turma.id, 'alunos_criados': alunos_existentes, 'alunos_nao_criados': alunos_nao_criados}
        else:
            return {'id_turma': nova_turma.id, 'alunos_criados': alunos_existentes}
    else:
        return {'id_turma': nova_turma.id, 'alunos_criados': []}


def encontrar_turma(id, usuario):
    if id:
        turma = Turma.objects.get(id=id, usuario=usuario)
        alunos_json = []
        for aluno in turma.aluno.all():
            try:
                notas_json = []
                notas = list(Nota.objects.filter(aluno=aluno, turma=turma))
                for nota in notas:
                    notas_json.append({
                        'id': nota.id,
                        'titulo': nota.titulo,
                        'valor': nota.valor,
                        'peso': nota.peso,  # Incluindo o peso
                    })
            except Nota.DoesNotExist:
                notas = None
            alunos_json.append({
                'matricula': aluno.matricula,
                'nome': aluno.nome,
                'notas': notas_json
            })

        turma_dict = {
            'id': turma.id,
            'nome': turma.nome,
            'periodo': turma.periodo,
            'alunos': alunos_json,
        }
        return turma_dict

    turmas = Turma.objects.filter(usuario=usuario)
    turmas_json = []

    for turma in turmas:
        alunos_json = []
        for aluno in turma.aluno.all():
            try:
                notas_json = []
                notas = list(Nota.objects.filter(aluno=aluno, turma=turma))
                for nota in notas:
                    notas_json.append({
                        'id'    : nota.id,
                        'titulo': nota.titulo,
                        'valor' : nota.valor,
                    })
            except Nota.DoesNotExist:
                notas = None
            alunos_json.append({
                'matricula' : aluno.matricula,
                'nome'      : aluno.nome,
                'notas'     : notas_json

            })
        turma_dict = {
            'id': turma.id,
            'nome': turma.nome,
            'periodo': turma.periodo,
            'alunos': alunos_json,
        }
        turmas_json.append(turma_dict)
    return turmas_json

def atualizar_turma(id, data, usuario):
    try:
        turma = Turma.objects.filter(id=id, usuario=usuario).first()

        if 'matricula' in data:
            try:
                aluno_existente = Aluno.objects.filter(turma=turma, usuario=usuario).first()
                aluno = Aluno.objects.filter(matricula=data['matricula'], usuario=usuario).first()

                turma.aluno.add(aluno)
                if aluno_existente:
                    numero_notas = Nota.objects.filter(turma=turma, aluno=aluno_existente)
                    for nota in numero_notas:
                        Nota.objects.create(
                            aluno=aluno,
                            turma=turma,
                            titulo=nota.titulo,
                            valor=None
                        )
            except ObjectDoesNotExist:
                return HttpResponseNotFound("Aluno não encontrado")
        elif 'removerMatricula' in data:
            try:
                aluno = Aluno.objects.filter(matricula=data['removerMatricula'], usuario=usuario).first()
                Nota.objects.filter(aluno=aluno, turma=turma).delete()
                turma.aluno.remove(aluno)
            except ObjectDoesNotExist:
                return HttpResponseNotFound("Aluno não encontrado")
        else:
            turma.nome    = data['nome']
            turma.periodo = data['periodo']
        turma.save()
        return ({'mensagem': 'Turma editada.'})
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Turma não encontrada")

def adicionar_aluno_turma(id, alunos, usuario):
    try:
        turma = Turma.objects.filter(id=id, usuario=usuario).first()

        for aluno in alunos:
            aluno = Aluno.objects.filter(matricula=aluno['matricula'], usuario=usuario).first()

            turma.aluno.add(aluno)
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Aluno não encontrado")

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- APIS PROJETOS ---------------------------------------
# -----------------------------------------------------------------------------------------------

def cadastrar_projeto_api(data, usuario):
    matriculas = []
    alunos_nao_criados = []
    alunos = []
    conteudo_arquivo = data['turma']

    novo_projeto = Projeto(
        nome=data['nome'],
        descricao=data['descricao'],
        periodo=data['periodo'],
        data_inicio=data['data_inicio'],
        data_fim=data['data_fim'],
        usuario=usuario
    )
    novo_projeto.save()

    # Caso haja lista de alunos
    if conteudo_arquivo:
        # Percorre a listaa e coleta as matricuas e nomes
        for linha in conteudo_arquivo.splitlines():
            matricula, nome = linha.split(', ')
            alunos.append({'matricula': matricula, 'nome': nome})

            # Para cada matricula coletada, agrupe de acordo com a existencia de um registro ou nao
        for aluno in alunos:
            if Aluno.objects.filter(matricula=aluno['matricula']).first():
                matriculas.append(aluno['matricula'])
            else:
                alunos_nao_criados.append(aluno)

        # Selecina os alunos ja'registrados e add ao projeto
        alunos_existentes = Aluno.objects.filter(
            matricula__in=matriculas, usuario=usuario)
        novo_projeto.aluno.add(*alunos_existentes)

        # Para cada aluno não registrado, crie e add ao projeto
        for aluno in alunos_nao_criados:
            novo_aluno = Aluno(
                matricula=aluno['matricula'], nome=aluno['nome'])
            novo_aluno.save()

            novo_aluno.usuario.set([usuario])

            novo_projeto.aluno.add(novo_aluno)

        if alunos_nao_criados:
            return {'id_projeto': novo_projeto.id, 'alunos_criados': alunos_existentes, 'alunos_nao_criados': alunos_nao_criados}
        else:
            return {'id_projeto': novo_projeto.id, 'alunos_criados': alunos_existentes}
    else:
        return {'id_projeto': novo_projeto.id}


def encontrar_projeto(id=None, usuario=None):
    if id:
        try:
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
        except ObjectDoesNotExist:
            return HttpResponseNotFound("Projeto não encontrado")
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

def parse_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except (ValueError, TypeError):
        return None

def atualizar_projeto(id, data, usuario):
    try:
        projeto = Projeto.objects.filter(id=id, usuario=usuario).first()

        if not projeto:
            return HttpResponseNotFound("Projeto não encontrado")

        if 'matricula' in data:
            try:
                aluno = Aluno.objects.filter(matricula=data['removerMatricula'], usuario=usuario).first()
                projeto.aluno.add(aluno)
            except Aluno.DoesNotExist:
                return HttpResponseNotFound("Aluno não encontrado")

        elif 'removerMatricula' in data:
            try:
                aluno = Aluno.objects.filter(matricula=data['removerMatricula'], usuario=usuario).first()
                projeto.aluno.remove(aluno)
            except Aluno.DoesNotExist:
                return HttpResponseNotFound("Aluno não encontrado")

        projeto.nome = data.get('nome', projeto.nome)
        projeto.descricao = data.get('descricao', projeto.descricao)
        projeto.data_inicio = parse_date(data.get('data_inicio')) or projeto.data_inicio
        projeto.data_fim = parse_date(data.get('data_fim')) if data.get('data_fim') else None
        projeto.periodo = data.get('periodo', projeto.periodo)
        projeto.save()

        return {
            'mensagem': 'Projeto atualizado com sucesso.',
            'projeto': {
                'id': projeto.id,
                'nome': projeto.nome,
                'descricao': projeto.descricao,
                'data_inicio': projeto.data_inicio,
                'data_fim': projeto.data_fim,
                'periodo': projeto.periodo,
            }
        }

    except Exception as e:
        return {'erro': f'Ocorreu um erro ao atualizar o projeto: {str(e)}'}


def deletar_projeto(id, usuario):
    try:
        projeto = Projeto.objects.get(id=id, usuario=usuario)
        projeto.delete()
        return JsonResponse({'mensagem': 'Projeto deletado com sucesso.'})
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Projeto não encontrado")

def adicionar_aluno_projeto(id, alunos, usuario):
    try:
        projeto = Projeto.objects.filter(id=id, usuario=usuario).first()

        for aluno in alunos:
            aluno = Aluno.objects.filter(matricula=aluno['matricula'], usuario=usuario).first()

            projeto.aluno.add(aluno)
    except ObjectDoesNotExist:
        return HttpResponseNotFound("Aluno não encontrado")
