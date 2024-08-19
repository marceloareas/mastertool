from .models import Aluno, Turma
import re

def cadastro_alunos_txt(data, usuario):
    alunos_criados = []
    conteudo_arquivo = data.read().decode('utf-8-sig')
    alunos = conteudo_arquivo.splitlines()

    for aluno in alunos:
        partes = aluno.split(',')
        if len(partes) < 2:
            continue  # Pular linhas que não têm a quantidade correta de partes
        matricula = partes[0].strip()
        nome = partes[1].strip()
        if not Aluno.objects.filter(matricula=matricula).exists():
            novo_aluno = Aluno(matricula=matricula, nome=nome)
            novo_aluno.save()
            novo_aluno.usuario.add(usuario)
            alunos_criados.append(nome)
        else:
            print(f'Aluno com matrícula {matricula} já existe.')
        aluno = Aluno(nome=nome, matricula=matricula)
        aluno.save()
        aluno.usuario.add(usuario)
        alunos_criados.append(nome)
    return alunos_criados

def cadastro_turma_txt(data, info_turma, usuario):
    matriculas = []
    alunos_nao_criados = [] 
    conteudo_arquivo = data.read().decode('utf-8-sig')
    alunos = conteudo_arquivo.splitlines()

    info_turma.nome = 'pcs'
    info_turma.periodo = 'oitavo'

    nova_turma = Turma(nome=info_turma.nome, periodo=info_turma.periodo, usuario=usuario)
    nova_turma.save()

    for aluno in alunos:
        partes = aluno.split(',')
        if len(partes) < 2:
            continue  # Pular linhas que não têm a quantidade correta de partes
        matricula = partes[0].strip()
        # nome = partes[1].strip()
        if Aluno.objects.filter(matricula=matricula).first():
            matriculas.append(matricula)
        else:
            alunos_nao_criados.append(matricula)
    alunos_existentes = Aluno.objects.filter(matricula__in=matriculas, usuario=usuario)
    nova_turma.aluno.add(*alunos_existentes)

    return alunos_existentes