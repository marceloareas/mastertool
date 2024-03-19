from .models import Aluno, Turma
import re

def cadastro_txt(arquivo, nome_turma):
    padrao = re.compile(r'(.+?)\s{2,}(\w+)')
    sucess = True
    conteudo_arquivo = arquivo.read().decode('utf-8')
    alunos = conteudo_arquivo.splitlines()

    turma = Turma(nome=nome_turma)
    turma.save()    
    turma = Turma.objects.get(nome=nome_turma)

    for aluno in alunos:
        match = padrao.match(aluno)

        if match:
            nome = match.group(1).strip()
            matricula = match.group(2)
            aluno = Aluno(nome=nome, matricula=matricula)
            aluno.save()
            turma.aluno.add(aluno)
        else:
            sucess = False
    return sucess
