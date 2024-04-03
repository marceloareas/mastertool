from .models import Aluno, Turma
import re

def cadastro_txt(data):
    alunos_criados = []
    conteudo_arquivo = data.read().decode('utf-8')
    alunos = conteudo_arquivo.splitlines()

    for aluno in alunos:
        partes = aluno.split(',')
        matricula = partes[0].strip()
        nome = partes[1].strip()
        aluno = Aluno(nome=nome, matricula=matricula)
        aluno.save()
        alunos_criados.append(nome)
    return alunos_criados
