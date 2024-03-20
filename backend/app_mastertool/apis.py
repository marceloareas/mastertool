from .models import Aluno, Turma
import re

def cadastro_txt(data):
    sucess = True
    conteudo_arquivo = data['arquivo'].read().decode('utf-8')
    alunos = conteudo_arquivo.splitlines()

    turma = Turma(nome=data['nome'], periodo=data['periodo'])
    turma.save()    
    turma = Turma.objects.get(nome=data['nome'])

    for aluno in alunos:
            partes = aluno.split(',')
            matricula = partes[0].strip()
            nome = partes[1].strip()
            aluno = Aluno(nome=nome, matricula=matricula)
            aluno.save()
            turma.aluno.add(aluno)
    return sucess
