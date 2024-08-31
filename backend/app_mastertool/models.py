from django.db import models
from django.contrib.auth.models import User

class Aluno(models.Model):
    matricula = models.CharField(primary_key=True, max_length=100)
    nome = models.CharField(max_length=100)
    atividade = models.TextField(blank=True)
    usuario = models.ManyToManyField(User, related_name='alunos', default=1)

    def __str__(self):
        return self.nome

class Atividade(models.Model):
    titulo = models.CharField(max_length=100)
    alunos = models.ManyToManyField('Aluno', blank=True, related_name='atividade_aluno')
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='atividade_usuario')

    def __str__(self):
        return self.titulo

class Turma(models.Model):
    nome = models.CharField(max_length=100)
    periodo = models.CharField(max_length=100, blank=True)
    aluno = models.ManyToManyField(Aluno, blank=True)
    atividade = models.ManyToManyField(Atividade, blank=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='turmas', default=1)

    def __str__(self):
        return self.nome
    
class NotaAtividade(models.Model):
    aluno = models.ForeignKey(Aluno, on_delete=models.CASCADE)
    atividade = models.ForeignKey(Atividade, on_delete=models.CASCADE)
    nota = models.DecimalField(max_digits=5, decimal_places=2, blank=True, null=True)
    usuario = models.ForeignKey(User, on_delete=models.CASCADE, related_name='atividade_nota_usuario')
    turma = models.ForeignKey('Turma', on_delete=models.CASCADE, related_name='atividade_nota_turma')

    class Meta:
        unique_together = ('aluno', 'atividade')

    def __str__(self):
        return f'{self.aluno.nome} - {self.atividade.titulo}: {self.nota}'