from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    """
    Função que gera tokens de acesso e atualização para um usuário autenticado.
    
    Args:
        user: O objeto de usuário autenticado.

    Returns:
        Um dicionário contendo os tokens de acesso e atualização para o usuário.
    """
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }