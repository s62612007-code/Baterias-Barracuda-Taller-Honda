#!/usr/bin/env bash
# Despliegue a bateriascali.es (Piensa Solutions — ns97)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

export SITE_URL="${BATERIASCALI_SITE_URL:-https://www.bateriascali.es}"
export FTP_HOST="${BATERIASCALI_FTP_HOST:-217.160.80.231}"
export FTP_USER="${BATERIASCALI_FTP_USER:-bateriascali.es}"
export FTP_PASS="${BATERIASCALI_FTP_PASS:?Defina BATERIASCALI_FTP_PASS en .env}"

echo "▶ Build estático…"
npm run build

echo "▶ Subiendo dist/ → ${FTP_USER}@${FTP_HOST}:/html/"
python3 "${ROOT}/scripts/deploy-ftp-honda.py"

echo "✓ Despliegue completado: ${SITE_URL}/#marca-duncan"
