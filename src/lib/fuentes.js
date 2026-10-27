// Hace que fontconfig (usado por sharp/librsvg para el texto de los SVG) encuentre
// la fuente que viene en assets/fonts sin instalar nada en el sistema.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export function configurarFuentes() {
  if (process.env.FONTCONFIG_FILE) return process.env.FONTCONFIG_FILE;
  const dirFuentes = path.join(ROOT, 'assets', 'fonts').replace(/\\/g, '/');
  const dirCache = path.join(ROOT, '.cache', 'fontconfig').replace(/\\/g, '/');
  const archivo = path.join(ROOT, '.cache', 'fonts.conf');
  fs.mkdirSync(dirCache, { recursive: true });
  const sistema = [
    '/etc/fonts/fonts.conf',
    '/usr/local/etc/fonts/fonts.conf',
    '/opt/homebrew/etc/fonts/fonts.conf',
  ].map((p) => `  <include ignore_missing="yes">${p}</include>`).join('\n');
  const dirsSistema = process.platform === 'win32'
    ? '  <dir>WINDOWSFONTDIR</dir>\n'
    : process.platform === 'darwin'
      ? '  <dir>/System/Library/Fonts</dir>\n  <dir>/Library/Fonts</dir>\n  <dir>~/Library/Fonts</dir>\n'
      : '  <dir>/usr/share/fonts</dir>\n  <dir>/usr/local/share/fonts</dir>\n  <dir>~/.fonts</dir>\n  <dir>~/.local/share/fonts</dir>\n';
  const xml = `<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
  <dir>${dirFuentes}</dir>
${dirsSistema}  <cachedir>${dirCache}</cachedir>
${sistema}
</fontconfig>
`;
  fs.writeFileSync(archivo, xml);
  process.env.FONTCONFIG_FILE = archivo;
  return archivo;
}
