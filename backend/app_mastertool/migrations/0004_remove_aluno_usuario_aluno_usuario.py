# Generated by Django 5.0.3 on 2024-04-17 14:13

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_mastertool', '0003_aluno_usuario_turma_usuario'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='aluno',
            name='usuario',
        ),
        migrations.AddField(
            model_name='aluno',
            name='usuario',
            field=models.ManyToManyField(default=1, related_name='alunos', to=settings.AUTH_USER_MODEL),
        ),
    ]