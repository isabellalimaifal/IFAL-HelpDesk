# Dockerfile para produção - Build multi-stage
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /

# Copiar arquivos de configuração primeiro para melhor cache
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Expor porta 80
EXPOSE 80

# Comando para rodar o nginx
CMD ["npm", "run", "dev"]