import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';

const root = process.cwd();
const officialPages = [
  'index.html', 'portal-vecino.html', 'login-staff.html', 'dashboard.html', 'talleres.html',
  'talleres/ficha-alfareria.html', 'inscripciones.html', 'vecinos/ficha-maria-carmona.html',
  'asistencia.html', 'inventario.html', 'inventario/acta-custodia.html', 'reportes.html',
  'configuracion.html', 'mapa-sitio.html', 'diagrama-nodos.html'
];
const missing = [];

for (const page of officialPages) {
  const content = readFileSync(join(root, page), 'utf8');
  for (const match of content.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const target = match[1];
    if (/^(https?:|data:|mailto:|tel:|#|javascript:)/.test(target)) continue;
    const cleanTarget = target.split(/[?#]/)[0];
    if (!cleanTarget) continue;
    const targetPath = resolve(dirname(join(root, page)), cleanTarget);
    if (!existsSync(targetPath)) missing.push(`${page} -> ${target}`);
  }
}

if (missing.length) {
  console.error(`Enlaces locales inexistentes:\n${missing.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Enlaces verificados en ${officialPages.length} paginas oficiales.`);
}
