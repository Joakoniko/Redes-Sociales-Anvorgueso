import sharp from 'sharp';
import { FUENTE, MARCA, TEXTO } from '../config.js';

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

// Reparte la duración de la voz entre las palabras, proporcional a su largo.
// Sirve para cualquier motor de TTS (Piper no entrega tiempos por palabra).
export function tiemposPalabras(frase, durVoz) {
  const palabras = String(frase).trim().split(/\s+/).filter(Boolean);
  const pesos = palabras.map((w) => w.replace(/[^\p{L}\p{N}]/gu, '').length + 2);
  const total = pesos.reduce((a, b) => a + b, 0) || 1;
  let t = 0;
  return palabras.map((w, i) => {
    const d = (pesos[i] / total) * durVoz;
    const r = { palabra: w, desde: t, hasta: t + d };
    t += d;
    return r;
  });
}

// Dibuja un grupo de palabras con una resaltada (índice dentro del grupo, o -1).
export async function renderizarSubtitulo(palabras, resaltada, opciones) {
  const { tam, color, resaltado, borde, ancho } = opciones;
  const alto = Math.round(tam * 1.7);
  const grosor = Math.round(tam * 0.18);
  const spans = (relleno) => palabras.map((w, i) => {
    const c = relleno ?? (i === resaltada ? resaltado : color);
    return `<tspan fill="${c}">${escaparXml(w)}</tspan>`;
  }).join(' ');
  const y = Math.round(tam * 1.15);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">` +
    `<style>text{font-family:'${FUENTE.familia}',sans-serif;font-weight:700;font-size:${tam}px}</style>` +
    `<text x="50%" y="${y}" text-anchor="middle" stroke="${borde}" stroke-width="${grosor}" stroke-linejoin="round">${spans(borde)}</text>` +
    `<text x="50%" y="${y}" text-anchor="middle">${spans()}</text></svg>`;
  return { buffer: await sharp(Buffer.from(svg)).png().toBuffer(), ancho, alto };
}

// Marca de agua "@anvorgueso.cat": texto blanco semitransparente con sombra.
// Se dibuja con sharp sobre cada fotograma, así no depende de que ffmpeg tenga drawtext.
export async function renderizarMarca() {
  const { texto, tam, alpha, sombra } = MARCA;
  const ancho = Math.ceil(texto.length * tam * 0.72) + 20;
  const alto = Math.ceil(tam * 1.5);
  const y = Math.round(tam * 1.0);
  const t = escaparXml(texto);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${ancho}" height="${alto}">` +
    `<style>text{font-family:'${FUENTE.familia}',sans-serif;font-weight:700;font-size:${tam}px}</style>` +
    `<text x="3" y="${y + 3}" fill="#000" fill-opacity="${sombra}">${t}</text>` +
    `<text x="0" y="${y}" fill="#FFF" fill-opacity="${alpha}">${t}</text></svg>`;
  return { buffer: await sharp(Buffer.from(svg)).png().toBuffer(), ancho, alto, texto };
}
