FROM python:3.11-slim

# Evita geração de arquivos .pyc e força flush no stdout/stderr
# ENV PYTHONDONTWRITEBYTECODE=1
# ENV PYTHONUNBUFFERED=1

# Diretório de trabalho no container
WORKDIR /app

# Instala dependências do sistema (necessárias para compilar psycopg2)
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && apt-get clean

# Copia apenas o requirements.txt e instala as dependências
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install psycopg

# Copia o restante da aplicação
COPY . .

# Expõe a porta padrão do Django
EXPOSE 8000

# Comando padrão: aplica migrações e roda o servidor
CMD ["sh", "-c", "python manage.py migrate && python manage.py makemigrations && python manage.py runserver 0.0.0.0:8000"]
