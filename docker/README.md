# Docker Configuration - IFAL-HelpDesk

Este diretório contém os arquivos de configuração do Docker para o projeto IFAL-HelpDesk.

## 📁 Arquivos

- **Dockerfile**: Configuração para ambiente de desenvolvimento com Vite e hot-reload
- **Dockerfile.prod**: Configuração para produção com build otimizado e Nginx
- **docker-compose.yml**: Orquestração para ambiente de desenvolvimento
- **docker-compose.prod.yml**: Orquestração para ambiente de produção
- **../.dockerignore**: Arquivo para otimizar o build do Docker

## 🚀 Comandos Rápidos

### Desenvolvimento
```bash
# Subir container em desenvolvimento
docker-compose -f docker/docker-compose.yml up -d

# Ver logs
docker-compose -f docker/docker-compose.yml logs -f

# Parar container
docker-compose -f docker/docker-compose.yml down

# Reconstruir container
docker-compose -f docker/docker-compose.yml up -d --build
```

### Produção
```bash
# Subir container em produção
docker-compose -f docker/docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker/docker-compose.prod.yml logs -f

# Parar container
docker-compose -f docker/docker-compose.prod.yml down

# Reconstruir container
docker-compose -f docker/docker-compose.prod.yml up -d --build
```

## 🔧 Troubleshooting

### Container não inicia
```bash
# Ver logs do container
docker-compose -f docker/docker-compose.yml logs web

# Reconstruir desde zero
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d --build --force-recreate
```

### Porta já em uso
```bash
# Ver qual processo está usando a porta 8080
netstat -ano | findstr :8080  # Windows
lsof -i :8080  # Linux/Mac

# Ou mude a porta no docker-compose.yml
```

### Problemas com permissões no Windows
Se você estiver usando Windows e tiver problemas com permissões, verifique se o Docker Desktop está configurado corretamente para usar o WSL 2.

## 📝 Notas

- O ambiente de desenvolvimento usa hot-reload automático
- O ambiente de produção cria um build otimizado e serve com Nginx
- As alterações nos arquivos são refletidas automaticamente em desenvolvimento
- Para produção, é necessário reconstruir o container após alterações