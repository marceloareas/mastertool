from .models import Aluno, Turma

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

# -----------------------------------------------------------------------------------------------
# ----------------------------------------- APIS TURMA -----------------------------------------
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

    return alunos_existentes

def encontrar_turma(id, usuario):
    if id: # get de apenas uma turma
        turma = Turma.objects.get(id=id, usuario=usuario)
        alunos_json = []
        for aluno in turma.aluno.all():
            alunos_json.append({
                'matricula': aluno.matricula,
                'nome': aluno.nome,
                'atividade': aluno.atividade,
            })
        turma_dict = {
            'id': turma.id,
            'nome': turma.nome,
            'periodo': turma.periodo,
            'alunos': alunos_json,
        }
        return turma_dict
    
    # get de todas as turmas
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
            'id': turma.id,
            'nome': turma.nome,
            'periodo': turma.periodo,
            'alunos': alunos_json,
        }
        turmas_json.append(turma_dict)
    return turmas_json