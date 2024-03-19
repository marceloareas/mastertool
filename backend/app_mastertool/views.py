from django.http import HttpResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from .apis import cadastro_txt

@api_view(['POST'])
def cadastrar_turma(request):
    if request.method == 'POST' and request.FILES['turma']:
        sucess = cadastro_txt(request.FILES['turma'], 'pcs')

        if sucess:
            return HttpResponse(f'Arquivo processado com sucesso.')
        else:
            return HttpResponse('Envie um arquivo via POST')