from django.contrib import admin
from django.urls import path
from app_mastertool import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('cadastrar-turma/', views.cadastrar_turma, name='cadastrar_turma'),
]
