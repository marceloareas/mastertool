from .models import *

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- APIS ALUNOS -----------------------------------------
# -----------------------------------------------------------------------------------------------

def cadastro_alunos_txt(data, usuario):
    alunos = []
    alunos_criados = []
    conteudo_arquivo = data['turma']
    linhas = conteudo_arquivo.splitlines()

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

def cadastro_turma_txt(data, usuario):
    matriculas = []
    alunos_nao_criados = [] 
    alunos = []
    conteudo_arquivo = data['turma']
    linhas = conteudo_arquivo.splitlines()

    nova_turma = Turma(nome=data['nome'], periodo=data['periodo'], usuario=usuario)
    nova_turma.save()

    for linha in linhas:
        matricula, nome = linha.split(', ')
        alunos.append({
            'matricula': matricula,
            'nome': nome
        })
    
    for aluno in alunos:
        if Aluno.objects.filter(matricula=aluno['matricula']).first():
            matriculas.append(aluno['matricula'])
        else:
            alunos_nao_criados.append(matricula)
    alunos_existentes = Aluno.objects.filter(matricula__in=matriculas, usuario=usuario)
    nova_turma.aluno.add(*alunos_existentes)

    if alunos_nao_criados:
        return {'alunos_criados': alunos_existentes, 'alunos_nao_criados': alunos_nao_criados}
    else:
        return {'alunos_criados': alunos_existentes}

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