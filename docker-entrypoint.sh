
#!/bin/sh

set -eu

echo "======================================"
echo " Iniciando API Type"
echo "======================================"

echo "[1/1] Iniciando NestJS e conectando ao MySQL..."

exec npm run start:prod
