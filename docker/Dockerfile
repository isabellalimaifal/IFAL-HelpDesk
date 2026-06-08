# Dockerfile multi-estágio para produção - IFAL-HelpDesk
# Stage 1: Build com Node.js
FROM node:18-alpine AS builder

# Metadados do container
LABEL maintainer="IFAL-HelpDesk Team"
LABEL description="Build multi-estágio para IFAL-HelpDesk"

# Definir diretório de trabalho
WORKDIR /app

# ARG para variáveis de ambiente durante o build
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Passar ARG como ENV para o Vite
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Copiar arquivos de configuração primeiro para melhor cache do Docker
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Build da aplicação
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Copiar configuração customizada do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos construídos para o diretório do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
