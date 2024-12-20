# Generated by Django 5.0.3 on 2024-11-26 17:41

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_mastertool', '0011_nota_titulo_alter_nota_valor'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Projeto',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_inicio', models.DateField()),
                ('data_fim', models.DateField(blank=True, null=True)),
                ('nome', models.CharField(max_length=100)),
                ('descricao', models.TextField(blank=True)),
                ('periodo', models.CharField(blank=True, max_length=100)),
                ('aluno', models.ManyToManyField(related_name='projetos', to='app_mastertool.aluno')),
                ('usuario', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='projetos', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
