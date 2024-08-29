from django.db import models
from django.contrib.auth.models import User

class Aluno(models.Model):
    matricula = models.CharField(primary_key=True, max_length=100)
    nome = models.CharField(max_length=100)
    atividade = models.TextField(blank=True)
    usuario = models.ManyToManyField(User, related_name='alunos', default=1)

    def __str__(self):
        return self.nome

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    periodo = models.CharField(max_length=100, blank=True)
    aluno = models.ManyToManyField(Aluno, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='turmas', default=1)

    def __str__(self):
        return self.nome

class Atividade(models.Model):
    titulo = models.CharField(max_length=100)
    turma = models.ForeignKey('Turma', on_delete=models.CASCADE, related_name='atividades')
    alunos = models.ManyToManyField('Aluno', blank=True, related_name='atividades')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='atividades')

    def __str__(self):
        return self.titulo