# Generated by Django 5.0.3 on 2024-08-30 23:11

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_mastertool', '0005_atividade'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AlterField(
            model_name='atividade',
            name='alunos',
            field=models.ManyToManyField(blank=True, related_name='atividade_aluno', to='app_mastertool.aluno'),
        ),
        migrations.AlterField(
            model_name='atividade',
            name='usuario',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='atividade_usuario', to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='NotaAtividade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nota', models.DecimalField(blank=True, decimal_places=2, max_digits=5, null=True)),
                ('aluno', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_mastertool.aluno')),
                ('atividade', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app_mastertool.atividade')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='atividade_nota_usuario', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('aluno', 'atividade')},
            },
        ),
    ]
