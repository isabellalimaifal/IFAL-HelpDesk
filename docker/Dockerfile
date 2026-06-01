# Dockerfile para ambiente de desenvolvimento - IFAL-HelpDesk
# Este Dockerfile é otimizado para desenvolvimento com hot-reload

# Usar imagem oficial do Node.js (Alpine para menor tamanho)
FROM node:18-alpine

# Metadados do container
LABEL maintainer="IFAL-HelpDesk Team"
LABEL description="Ambiente de desenvolvimento para IFAL-HelpDesk com Vite"

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de configuração primeiro para melhor cache do Docker
COPY package*.json ./

# Instalar dependências de desenvolvimento
RUN npm install

# Copiar todos os arquivos do projeto para o container
COPY . .

# Expor porta padrão do Vite (5173) para acesso externo
EXPOSE 5173

# Configurar variáveis de ambiente para o Vite
ENV VITE_HOST=0.0.0.0
ENV NODE_ENV=development

# Comando para rodar o Vite em modo de desenvolvimento
# --host permite acesso externo ao container
CMD ["npm", "run", "dev", "--", "--host"]