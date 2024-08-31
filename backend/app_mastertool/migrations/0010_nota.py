# Generated by Django 5.0.3 on 2024-08-31 02:20

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_mastertool', '0009_remove_turma_atividade_remove_aluno_atividade_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Nota',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('valor', models.DecimalField(decimal_places=2, max_digits=5)),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notas', to='app_mastertool.aluno')),
                ('turma', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notas', to='app_mastertool.turma')),
            ],
        ),
    ]
