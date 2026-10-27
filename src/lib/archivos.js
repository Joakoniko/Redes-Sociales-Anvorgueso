import fs from 'node:fs/promises';
import path from 'node:path';

export async function asegurarDir(dir) {
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function existe(ruta) {
  try { await fs.access(ruta); return true; } catch { return false; }
}

export async function leerJson(ruta) {
  const texto = await fs.readFile(ruta, 'utf8');
  try {
    return JSON.parse(texto);
  } catch (e) {
    throw new Error(`JSON inválido en ${path.relative(process.cwd(), ruta)}: ${e.message}`);
  }
}

export async function escribirJson(ruta, obj) {
  await asegurarDir(path.dirname(ruta));
  await fs.writeFile(ruta, JSON.stringify(obj, null, 2) + '\n');
}

export async function listar(dir, ext) {
  if (!(await existe(dir))) return [];
  const nombres = await fs.readdir(dir);
  return nombres.filter((n) => !n.startsWith('.') && (!ext || n.endsWith(ext))).sort();
}

export function hoy() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function slugificar(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function formatoMB(bytes) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
