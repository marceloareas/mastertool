from django.db import models

class Aluno(models.Model):
    matricula = models.CharField(primary_key=True, max_length=100)
    nome = models.CharField(max_length=100)
    atividade = models.TextField(blank=True)

    def __str__(self):
        return self.nome

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    periodo = models.CharField(max_length=100, blank=True)
    aluno = models.ManyToManyField(Aluno, blank=True)

    def __str__(self):
        return self.nome