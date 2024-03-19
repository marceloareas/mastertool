# Generated by Django 5.0.3 on 2024-03-17 13:29

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Aluno',
            fields=[
                ('matricula', models.CharField(max_length=100, primary_key=True, serialize=False)),
                ('nome', models.CharField(max_length=100)),
                ('atividade', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Turma',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('periodo', models.CharField(max_length=100)),
                ('aluno', models.ManyToManyField(to='app_mastertool.aluno')),
            ],
        ),
    ]
