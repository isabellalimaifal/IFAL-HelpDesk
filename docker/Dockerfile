# Dockerfile para projeto HTML estático - IFAL-HelpDesk
FROM nginx:alpine

# Metadados do container
LABEL maintainer="IFAL-HelpDesk Team"
LABEL description="Servidor HTML estático para IFAL-HelpDesk"

# Copiar configuração customizada do Nginx
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

# Copiar arquivos HTML estáticos diretamente para o nginx
COPY . /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
