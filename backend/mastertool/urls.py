from django.contrib import admin
from django.urls import include, path
from app_mastertool import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # url de alunos
    path('alunos/', views.get_alunos, name='get_alunos'),
    path('alunos/cadastrar/', views.cadastrar_alunos, name='cadastrar_alunos'),
    path('alunos/aluno/<str:matricula>', views.get_aluno, name='get_aluno'),
    path('alunos/excluir-aluno/<str:matricula>', views.excluir_alunos, name='excluir_alunos'),
    path('alunos/editar-aluno/<str:matricula>', views.editar_alunos, name='editar_alunos'),

    # url de usuario
    path('cadastrar-usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('login/', views.login, name='login'),

    # url de turma
    path('cadastrar-turma/', views.cadastrar_turma, name='cadastrar_turma'),
    path('turmas/', views.get_turmas, name='get_turmas'),

]
