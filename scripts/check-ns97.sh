#!/usr/bin/env bash
# Comprueba si ns97 (217.160.80.231) acepta FTP/HTTP
set -euo pipefail
IP="${NS97_IP:-217.160.80.231}"
echo "▶ Servidor ns97: $IP"

python3 << PY
import socket
ip = "$IP"
for port, name in [(21,"FTP"), (80,"HTTP"), (443,"HTTPS")]:
    s = socket.socket()
    s.settimeout(8)
    try:
        s.connect((ip, port))
        print(f"  ✓ {name} ({port}) abierto")
    except OSError as e:
        print(f"  ✗ {name} ({port}) cerrado — {e}")
    finally:
        s.close()
PY

echo ""
python3 -c "
import urllib.request, json
for d in ['bateriascali.es','www.bateriascali.es']:
    with urllib.request.urlopen(f'https://dns.google/resolve?name={d}&type=A', timeout=10) as r:
        ans = [a.get('data') for a in json.load(r).get('Answer',[]) or []]
        ok = '$IP' in ans and len(ans) == 1
        mark = '✓' if ok else '!'
        print(f'  {mark} DNS {d}: {ans}')
"
