from django.contrib import admin
from .models import *

# Add dos modelos das entidades
admin.site.register(Aluno)
admin.site.register(Turma)
admin.site.register(Nota)
admin.site.register(Projeto)

