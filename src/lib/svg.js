import fs from 'node:fs/promises';
import sharp from 'sharp';

const cache = new Map();

// Los SVG del repo de arte traen un <rect> de fondo del tamaño del lienzo. Para componer
// el personaje sobre nuestro propio fondo, lo quitamos.
export function quitarFondo(svg) {
  const vb = svg.match(/viewBox="\s*([\d.-]+)\s+([\d.-]+)\s+([\d.]+)\s+([\d.]+)\s*"/);
  if (!vb) return svg;
  const [, , , w, h] = vb;
  const re = new RegExp(`<rect(?![^>]*\\b[xy]=)[^>]*width="${w}"[^>]*height="${h}"[^>]*?(?:/>|>\\s*</rect>)`);
  return svg.replace(re, '');
}

export function medidasSvg(svg) {
  const vb = svg.match(/viewBox="\s*([\d.-]+)\s+([\d.-]+)\s+([\d.]+)\s+([\d.]+)\s*"/);
  if (vb) return { ancho: Number(vb[3]), alto: Number(vb[4]) };
  const w = svg.match(/\swidth="([\d.]+)/);
  const h = svg.match(/\sheight="([\d.]+)/);
  return { ancho: w ? Number(w[1]) : 240, alto: h ? Number(h[1]) : 240 };
}

// Rasteriza un SVG a PNG (RGBA) con el ancho pedido. Cachea por ruta y tamaño.
export async function rasterizarSvg(ruta, ancho, { transparente = true } = {}) {
  const clave = `${ruta}|${ancho}|${transparente}`;
  if (cache.has(clave)) return cache.get(clave);
  let svg = await fs.readFile(ruta, 'utf8');
  if (transparente) svg = quitarFondo(svg);
  const { ancho: vbAncho } = medidasSvg(svg);
  const densidad = Math.min(2400, Math.max(72, Math.ceil((72 * ancho) / vbAncho)));
  const buffer = await sharp(Buffer.from(svg), { density: densidad })
    .resize({ width: ancho })
    .png()
    .toBuffer();
  cache.set(clave, buffer);
  return buffer;
}
