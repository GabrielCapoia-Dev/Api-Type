
#!/bin/sh

set -eu

echo "======================================"
echo " Iniciando API Type"
echo "======================================"

echo "[1/3] Verificando migrations..."

npx prisma migrate deploy

echo "[2/3] Verificando Prisma Client..."

test -d src/generated/prisma || {
    echo "Erro: Prisma Client não encontrado."
    exit 1
}

echo "[3/3] Iniciando NestJS..."

exec npm run start:prod
