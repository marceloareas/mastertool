from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from .apis import cadastro_txt

@api_view(['POST'])
def cadastrar_turma(request):
    if request.method == 'POST' and request.data['arquivo']:
        alunos_criados = cadastro_txt(request.data)

        if alunos_criados:
            return JsonResponse({'mensagem': 'Arquivo processado com sucesso.', 'alunos_criados': alunos_criados})
        else:
            return JsonResponse({'erro': 'Não foi possível processar o arquivo.'}, status=400)
