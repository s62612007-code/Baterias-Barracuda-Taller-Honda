#!/usr/bin/env bash
# Verificación rápida del despliegue Honda Baterías
set -euo pipefail
BASE="${VERIFY_URL:-${SITE_URL:-https://www.bateriascali.es}}"
BASE="${BASE%/}"

if ! curl -sI --max-time 8 "$BASE/" >/dev/null 2>&1; then
  BASE="https://bateriascali.es"
fi

echo "▶ Verificando ${BASE}"

fail=0
check() {
  local url="$1" expect="$2" label="$3"
  local status
  status=$(curl -sI --max-time 15 "$url" | head -1 | awk '{print $2}')
  if [[ "$status" == "$expect" ]]; then
    echo "  ✓ $label ($status)"
  else
    echo "  ✗ $label (esperado $expect, obtuvo ${status:-?})"
    fail=1
  fi
}

check "$BASE/" 200 "index"
check "$BASE/css/main.css" 200 "css"
check "$BASE/js/main.js" 200 "js"
check "$BASE/js/data/catalog-mac.js" 200 "catálogo"
check "$BASE/assets/images/honda-logo.svg" 200 "logo Honda"
check "$BASE/js/app.js" 404 "cotizador antiguo"

count=$(curl -sL --max-time 25 "$BASE/js/data/catalog-mac.js" | grep -c '"id"' || true)
echo "  · Productos en catálogo: $count"
[[ "$count" -ge 600 ]] && echo "  ✓ catálogo completo" || { echo "  ✗ catálogo incompleto"; fail=1; }

python3 -c "
import urllib.request, json, sys
for d in ['bateriascali.es','www.bateriascali.es']:
    u=f'https://dns.google/resolve?name={d}&type=A'
    with urllib.request.urlopen(u, timeout=10) as r:
        data=json.load(r)
        ans=[a.get('data') for a in data.get('Answer',[]) or []]
        print(f'  · DNS {d}:', ans or 'SIN REGISTRO A')
" 2>/dev/null || true

exit $fail
