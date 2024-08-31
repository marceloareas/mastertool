from django.contrib import admin
from .models import *

admin.site.register(Aluno)
admin.site.register(Turma)
admin.site.register(Atividade)
admin.site.register(NotaAtividade)

