from django.db import models
from django.contrib.auth.models import User

class Aluno(models.Model):
    matricula = models.CharField(primary_key=True, max_length=100)
    nome = models.CharField(max_length=100)
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
    
class Nota(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE, related_name='notas')
    turma = models.ForeignKey(Turma, on_delete=models.CASCADE, related_name='notas')
    valor = models.DecimalField(max_digits=5, decimal_places=2)
    # usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notas', default=1)

    def __str__(self):
        return f'{self.aluno.nome} - {self.turma.nome}: {self.valor}'