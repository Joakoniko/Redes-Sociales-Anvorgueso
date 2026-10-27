import sharp from 'sharp';
import { FUENTE, TEXTO } from '../config.js';

// Parte un texto en líneas de hasta maxCaracteres, respetando saltos de línea manuales.
export function partirLineas(texto, maxCaracteres = TEXTO.maxCaracteres) {
  const lineas = [];
  for (const parrafo of String(texto).split(/\n/)) {
    let actual = '';
    for (const palabra of parrafo.trim().split(/\s+/).filter(Boolean)) {
      if (!actual) actual = palabra;
      else if ((actual + ' ' + palabra).length <= maxCaracteres) actual += ' ' + palabra;
      else { lineas.push(actual); actual = palabra; }
    }
    if (actual) lineas.push(actual);
  }
  return lineas;
}

export function tieneEmoji(texto) {
  return /\p{Extended_Pictographic}/u.test(texto);
}

function escaparXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Dibuja texto grande con borde (para leerse sobre cualquier fondo) y devuelve un PNG.
export async function renderizarTexto(texto, opciones = {}) {
  const tam = opciones.tam || TEXTO.tam;
  const color = opciones.color || TEXTO.color;
  const borde = opciones.borde || TEXTO.borde;
  const ancho = opciones.ancho || 900;
  const lineas = partirLineas(texto, opciones.maxCaracteres || TEXTO.maxCaracteres);
  const interlineado = Math.round(tam * 1.18);
  const alto = interlineado * lineas.length + Math.round(tam * 0.6);
  const grosor = Math.round(tam * 0.16);
  const filas = lineas.map((l, i) => {
    const y = Math.round(tam * 0.95) + i * interlineado;
    const t = escaparXml(l);
    return `<text x="50%" y="${y}" text-anchor="middle" stroke="${borde}" stroke-width="${grosor}" stroke-linejoin="round" fill="${borde}">${t}</text>` +
      `<text x="50%" y="${y}" text-anchor="middle" fill="${color}">${t}</text>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">` +
    `<style>text{font-family:'${FUENTE.familia}',sans-serif;font-weight:700;font-size:${tam}px}</style>${filas}</svg>`;
  const buffer = await sharp(Buffer.from(svg)).png().toBuffer();
  return { buffer, ancho, alto, lineas };
}
