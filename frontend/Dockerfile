# Usa uma imagem oficial do Node.js com versão 18
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./


# iNSTALAR FERRAMENTAS PARA VERIFICAÇÃO DE CONEXÃO
RUN apt-get update && apt-get install -y curl netcat-traditional
# Instala as dependências
RUN npm install



# Copia o restante dos arquivos do projeto
COPY . .

# !!!
EXPOSE 4200

# Comando padrão para rodar o Angular (ajuste o script "start" se necessário)
CMD ["npm", "run" ,"start_host"]
