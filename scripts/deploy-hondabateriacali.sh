#!/usr/bin/env bash
# Despliegue forzado a hondabateriascali.com vía FTP (Piensa)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Cargar credenciales locales (no commitear .env)
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

: "${DEPLOY_HOST:?Defina DEPLOY_HOST en .env (ej: slgn075.piensasolutions.com)}"
: "${DEPLOY_USER:?Defina DEPLOY_USER en .env}"
DEPLOY_PATH="${DEPLOY_PATH:-/httpdocs/}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

echo "▶ Build estático…"
npm run build

if [[ -n "${FTP_PASS:-${DEPLOY_PASS:-}}" ]]; then
  echo "▶ Limpieza FTP (archivos del cotizador antiguo)…"
  export FTP_PASS="${FTP_PASS:-$DEPLOY_PASS}"
  export FTP_USER="${FTP_USER:-$DEPLOY_USER}"
  export FTP_HOST="${FTP_HOST:-$DEPLOY_HOST}"
  export SITE_URL="${SITE_URL:-https://hondabateriascali.com}"
  python3 "${ROOT}/scripts/cleanup-ftp-honda.py" || true
  echo "▶ Subiendo dist/ → FTP ${FTP_USER}@${FTP_HOST}"
  python3 "${ROOT}/scripts/deploy-ftp-honda.py"
  exit $?
fi

echo "▶ Subiendo dist/ → ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"

if [[ -n "${DEPLOY_PASS:-}" ]]; then
  sshpass -p "$DEPLOY_PASS" rsync -avz --delete \
    -e "ssh -o StrictHostKeyChecking=accept-new -p ${DEPLOY_PORT}" \
    "${ROOT}/dist/" \
    "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
else
  KEY="${DEPLOY_KEY:-$HOME/.ssh/bateriagelylitio_ionos}"
  SSH_OPTS=(-o StrictHostKeyChecking=accept-new -o ConnectTimeout=20 -p "$DEPLOY_PORT")
  [[ -f "$KEY" ]] && SSH_OPTS+=(-i "$KEY")
  rsync -avz --delete -e "ssh ${SSH_OPTS[*]}" \
    "${ROOT}/dist/" \
    "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}"
fi

SITE_URL="${SITE_URL:-https://hondabateriascali.com}"
echo "✓ Despliegue completado: ${SITE_URL}/#marca-duncan"
