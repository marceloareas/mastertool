from django.contrib import admin
from django.urls import include, path
from app_mastertool import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # url de alunos
    path('alunos/', views.get_alunos, name='get_alunos'),
    path('alunos/<str:matricula>', views.get_alunos, name='get_aluno'),
    path('alunos/cadastrar/', views.cadastrar_alunos, name='cadastrar_alunos'),
    path('alunos/excluir/<str:matricula>', views.excluir_aluno, name='excluir_aluno'),
    path('alunos/editar/<str:matricula>', views.editar_aluno, name='editar_aluno'),

    # url de usuario
    path('cadastrar-usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('login/', views.login, name='login'),

    # url de turma
    path('turmas/', views.get_turmas, name='get_turmas'),
    path('turmas/<str:id>', views.get_turmas, name='get_turma'),
    path('turmas/cadastrar/', views.cadastrar_turma, name='cadastrar_turma'),
    path('turmas/excluir<str:id>', views.excluir_turma, name='excluir_turma'),
    path('turmas/editar<str:id>', views.editar_turma, name='editar_alunos'),

]
