from django.contrib import admin
from django.urls import include, path
from app_mastertool import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cadastrar-alunos/', views.cadastrar_alunos, name='cadastrar_alunos'),
    path('cadastrar-usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('cadastrar-turma/', views.cadastrar_turma, name='cadastrar_turma'),
    path('turmas/', views.get_turmas, name='get_turmas'),
    path('alunos/', views.get_alunos, name='get_alunos'),
    path('login/', views.login, name='login'),

]
