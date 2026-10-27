import path from 'node:path';
import { DIRS, ROOT } from '../config.js';
import { leerJson, listar, existe } from './archivos.js';

const cache = new Map();

export async function listarPersonajes() {
  const archivos = await listar(DIRS.personajes, '.json');
  return archivos.map((a) => a.replace(/\.json$/, ''));
}

// Devuelve la configuración de un personaje con sus modelos (SVG) descubiertos en su carpeta.
export async function cargarPersonaje(id) {
  if (cache.has(id)) return cache.get(id);
  const ruta = path.join(DIRS.personajes, `${id}.json`);
  if (!(await existe(ruta))) {
    const ids = await listarPersonajes();
    throw new Error(`No existe el personaje "${id}". Personajes disponibles: ${ids.join(', ') || 'ninguno'}`);
  }
  const datos = await leerJson(ruta);
  const carpeta = path.resolve(ROOT, datos.carpeta || path.join('assets', 'personajes', id));
  const svgs = await listar(carpeta, '.svg');
  const modelos = {};
  for (const s of svgs) modelos[s.replace(/\.svg$/, '')] = path.join(carpeta, s);
  const personaje = { id, ...datos, carpeta, modelos };
  if (!personaje.modeloPrincipal || !modelos[personaje.modeloPrincipal]) {
    personaje.modeloPrincipal = Object.keys(modelos)[0];
  }
  cache.set(id, personaje);
  return personaje;
}

export function rutaModelo(personaje, modelo) {
  const nombre = modelo || personaje.modeloPrincipal;
  const ruta = personaje.modelos[nombre];
  if (!ruta) {
    throw new Error(`El personaje "${personaje.id}" no tiene el modelo "${nombre}". Tiene: ${Object.keys(personaje.modelos).join(', ')}`);
  }
  return ruta;
}
