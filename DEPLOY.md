# Despliegue — www.bateriascali.es (Piensa ns97)

**Servidor:** `217.160.80.231` · `ns97.piensasolutions.com`  
**Dominio:** `www.bateriascali.es` / `bateriascali.es`  
**FTP:** cuenta `bateriascali.es` → carpeta `/html/`

## DNS (solo ns97)

| Registro | Tipo | Valor |
|----------|------|-------|
| `@` | A | `217.160.80.231` |
| `www` | A | `217.160.80.231` |

Quitar cualquier registro A a `217.76.150.40`.

## Despliegue

```bash
npm run deploy
```

## `.env`

```env
BATERIASCALI_FTP_HOST=217.160.80.231
BATERIASCALI_FTP_USER=bateriascali.es
BATERIASCALI_FTP_PASS='contraseña'
BATERIASCALI_SITE_URL=https://www.bateriascali.es
```

## Si el servidor ns97 no responde

El hosting debe estar **activado en Piensa** para ns97:

1. https://www.piensasolutions.com/clientes (login + 2FA)
2. Servicios → `bateriascali.es` → migrar/activar en **ns97**
3. Panel https://panel.bateriascali.es → certificado SSL
4. Zona DNS → registros A a `217.160.80.231`

Ver `scripts/dns-bateriascali-es.txt`
