import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

function copyRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyRecursive(from, to);
    } else {
      fs.copyFileSync(from, to);
    }
  }
}

function writeHtaccess() {
  const htaccess = `# Honda Baterías Cali — sitio estático (rutas por hash #)
DirectoryIndex index.html

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
  ExpiresByType image/svg+xml "access plus 1 month"
  ExpiresByType image/png "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/webp "access plus 1 month"
</IfModule>
`;
  fs.writeFileSync(path.join(DIST, '.htaccess'), htaccess);
}

console.log('Construyendo sitio estático para www.bateriascali.es…');
if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
copyRecursive(SRC, DIST);
writeHtaccess();
console.log(`✓ dist/ listo (${fs.readdirSync(DIST).length} entradas en raíz)`);
console.log('  Suba el contenido de dist/ a www.bateriascali.es (FTP → html/)');
