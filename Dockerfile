
FROM node:24-slim

WORKDIR /usr/src/app

# Dependências de sistema
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    openssl \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Instalar dependências
COPY package.json package-lock.json ./

RUN npm ci

# Copiar aplicação
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Compilar NestJS
RUN npm run build

# Dar permissão ao script de inicialização
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

# Aplicar migrações e iniciar a API
CMD ["sh", "./docker-entrypoint.sh"]
