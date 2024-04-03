from django.contrib import admin
from django.urls import include, path
from app_mastertool import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cadastrar-turma/', views.cadastrar_turma, name='cadastrar_turma'),
    path('cadastrar-usuario/', views.cadastrar_usuario, name='cadastrar_usuario'),
    path('login/', views.login, name='login'),

]
