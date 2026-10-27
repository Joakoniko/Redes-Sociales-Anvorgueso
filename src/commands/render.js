import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import sharp from 'sharp';
import { DIRS, FONDOS, PERSONAJE_BASE, SUBTITULOS, TEXTO, TRANSICION, VIDEO, ZONA_SEGURA } from '../config.js';
import { asegurarDir, escribirJson, existe, leerJson } from '../lib/archivos.js';
import { cargarPersonaje, rutaModelo } from '../lib/personajes.js';
import { rasterizarSvg } from '../lib/svg.js';
import { renderizarSubtitulo, renderizarTexto, tiemposPalabras } from '../lib/texto.js';
import { cargarGuion, validarGuion } from './script.js';

export function ayuda() {
  return [
    'anv render <slug> [--fps 30] [--sin-validar]',
    '',
    'Dibuja los fotogramas 1080x1920 (fondo + personaje animado + texto) y se los manda a ffmpeg, que arma',
    'content/render/<slug>/video-mudo.mp4. Si existe voz/voz.json, cada escena dura lo que su audio.',
    '--guardar-frames también escribe cada fotograma como PNG en content/render/<slug>/frames/ (para revisar).',
  ].join('\n');
}

const { ancho: W, alto: H } = VIDEO;

function esClaro(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255; const g = (n >> 8) & 255; const b = n & 255;
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150;
}

function oscurecer(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - f)));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

async function fondoBuffer(color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="${oscurecer(color, 0.10)}"/></linearGradient></defs>
<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`;
  return sharp(Buffer.from(svg)).png().toBuffer();
}

const suavizarSalida = (k) => 1 - Math.pow(1 - k, 3);
const suavizarEntrada = (k) => k * k * k;

// Calcula la transformación del personaje en el instante t de la escena.
export function animar(tipo, t, { dur, vozDur }) {
  const hablando = vozDur ? t < vozDur : true;
  const base = { dx: 0, dy: 0, sx: 1, sy: 1, rot: 0 };
  const quieto = () => ({ ...base, dy: Math.sin(2 * Math.PI * 0.8 * t) * 5 });
  const habla = () => (hablando
    ? { ...base, dy: Math.sin(2 * Math.PI * 1.0 * t) * 6, sy: 1 + 0.025 * Math.sin(2 * Math.PI * 7 * t), sx: 1 - 0.015 * Math.sin(2 * Math.PI * 7 * t) }
    : quieto());
  switch (tipo) {
    case 'quieto': return quieto();
    case 'habla': return habla();
    case 'rebote': {
      const s = Math.abs(Math.sin(Math.PI * 2 * t));
      return { ...base, dy: -s * 45, sy: 1 - 0.06 * (1 - s), sx: 1 + 0.06 * (1 - s) };
    }
    case 'entrada': {
      if (t < 0.5) { const k = suavizarSalida(t / 0.5); return { ...base, dy: (1 - k) * 700, sy: 1 + 0.08 * (1 - k), sx: 1 - 0.05 * (1 - k) }; }
      return habla();
    }
    case 'salida': {
      const falta = dur - t;
      if (falta < 0.45) { const k = suavizarEntrada(1 - falta / 0.45); return { ...base, dx: k * 900, rot: k * 12 }; }
      return habla();
    }
    case 'baile': {
      const w = 2 * Math.PI * 1.4 * t;
      return { ...base, dx: Math.sin(w) * 70, dy: -Math.abs(Math.sin(2 * w)) * 30, rot: Math.sin(w) * 10 };
    }
    case 'salto': {
      const s = Math.abs(Math.sin(Math.PI * t / 0.7));
      return { ...base, dy: -s * 220, sy: 1 + 0.08 * s, sx: 1 - 0.06 * s };
    }
    case 'temblor': {
      const r = (n) => (Math.sin(n * 12.9898 + t * 78.233) * 43758.5453) % 1;
      return { ...base, dx: r(1) * 14 - 7, dy: r(2) * 14 - 7 };
    }
    default: return habla();
  }
}

// Pega una capa sobre el lienzo recortando lo que quede afuera.
async function capa(buffer, x, y) {
  const meta = await sharp(buffer).metadata();
  let { width: w, height: h } = meta;
  let left = Math.round(x); let top = Math.round(y);
  let ex = 0; let ey = 0;
  if (left < 0) { ex = -left; w += left; left = 0; }
  if (top < 0) { ey = -top; h += top; top = 0; }
  if (left + w > W) w = W - left;
  if (top + h > H) h = H - top;
  if (w <= 0 || h <= 0) return null;
  const input = (ex || ey || w !== meta.width || h !== meta.height)
    ? await sharp(buffer).extract({ left: ex, top: ey, width: w, height: h }).png().toBuffer()
    : buffer;
  return { input, left, top };
}

export async function run(posicionales, flags) {
  const slug = posicionales[0];
  if (!slug) throw new Error('Falta el slug. Uso: anv render <slug>');
  const guion = await cargarGuion(slug);
  if (!flags['sin-validar']) {
    const problemas = (await validarGuion(guion)).filter((p) => !/boceto/.test(p));
    if (problemas.length) throw new Error(`El guion tiene problemas (anv script ${slug} --check):\n  - ${problemas.join('\n  - ')}`);
  }
  const fps = Number(flags.fps) || VIDEO.fps;
  const dirRender = path.join(DIRS.render, slug);
  const dirFrames = path.join(dirRender, 'frames');
  await fs.rm(dirFrames, { recursive: true, force: true });
  await asegurarDir(dirRender);
  const guardarFrames = Boolean(flags['guardar-frames']);
  if (guardarFrames) await asegurarDir(dirFrames);
  const rutaVoz = path.join(dirRender, 'voz', 'voz.json');
  const voz = (await existe(rutaVoz)) ? await leerJson(rutaVoz) : null;
  if (!voz) console.log('  (Sin voz todavía: uso la duración "dur" de cada escena. Recomendado: anv voice primero.)');

  // Plan de escenas con tiempos.
  const plan = [];
  let inicio = 0;
  for (const [i, e] of guion.escenas.entries()) {
    const n = i + 1;
    const v = voz?.escenas.find((x) => x.n === n);
    const vozDur = v?.dur || 0;
    const dur = vozDur ? vozDur + VIDEO.aire : (Number(e.dur) || 2);
    const personaje = await cargarPersonaje(e.personaje || guion.personajes?.[0] || 'anvorgueso');
    const fondo = FONDOS[e.fondo] || (/^#/.test(e.fondo || '') ? e.fondo : FONDOS[personaje.fondoPorDefecto] || FONDOS.rosa);
    plan.push({ n, escena: e, personaje, modelo: rutaModelo(personaje, e.modelo), fondo, inicio, dur, vozDur, vozArchivo: v?.archivo || null, frames: Math.max(1, Math.round(dur * fps)) });
    inicio += dur;
  }
  const total = inicio;
  console.log(`  ${plan.length} escenas · ${total.toFixed(1)} s · ${Math.round(total * fps)} fotogramas a ${fps} fps`);

  // Los fotogramas van crudos (RGBA) directo a ffmpeg por stdin: no se escriben a disco.
  const salida = path.join(dirRender, 'video-mudo.mp4');
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-video_size', `${W}x${H}`, '-framerate', String(fps), '-i', 'pipe:0', '-c:v', 'libx264', '-preset', 'fast', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(fps), salida], { stdio: ['pipe', 'ignore', 'pipe'], windowsHide: true });
  let errFf = '';
  ff.stderr.on('data', (d) => { errFf += d; });
  const ffTermino = new Promise((resolve, reject) => {
    ff.on('error', (e) => reject(e.code === 'ENOENT' ? new Error('No encuentro ffmpeg. ¿Está instalado y en el PATH?') : e));
    ff.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg terminó con código ${code}\n${errFf.slice(-1500)}`))));
  });
  const escribir = (buf) => new Promise((resolve, reject) => {
    if (ff.stdin.destroyed) return reject(new Error(`ffmpeg cerró la entrada\n${errFf.slice(-800)}`));
    if (ff.stdin.write(buf)) resolve(); else ff.stdin.once('drain', resolve);
  });

  let indice = 0;
  for (const p of plan) {
    const e = p.escena;
    const escala = Number(e.escala) || 1;
    const anchoPersonaje = Math.round(PERSONAJE_BASE.ancho * escala);
    const sprite = await rasterizarSvg(p.modelo, anchoPersonaje);
    const spriteMeta = await sharp(sprite).metadata();
    const fondo = await fondoBuffer(p.fondo);
    const claro = esClaro(p.fondo);
    const texto = e.texto ? await renderizarTexto(e.texto, {
      color: claro ? TEXTO.colorSobreClaro : TEXTO.color,
      borde: claro ? TEXTO.bordeSobreClaro : TEXTO.borde,
      ancho: W - 2 * ZONA_SEGURA.lados,
    }) : null;
    // Posición base del personaje (los pies quedan fijos; la escala se ancla abajo).
    const posicion = e.posicion || 'centro';
    const centroX = posicion === 'izquierda' ? W / 2 - 200 : posicion === 'derecha' ? W / 2 + 200 : W / 2;
    const pieY = posicion === 'abajo' ? H - ZONA_SEGURA.abajo - 40 : Math.round(H * 0.72);
    const textoTop = (e.textoPos === 'abajo') ? (H - ZONA_SEGURA.abajo - (texto?.alto || 0) - 40) : ZONA_SEGURA.arriba + 60;
    const variantes = new Map();
    // Subtítulos: grupos de palabras con tiempos estimados sobre la duración real del audio.
    const usarSubs = SUBTITULOS.activos && guion.subtitulos !== false && e.subtitulos !== false && e.voz && p.vozDur;
    const tiempos = usarSubs ? tiemposPalabras(e.voz, p.vozDur) : [];
    const subsCache = new Map();
    const subtituloEn = async (t) => {
      if (!tiempos.length || t >= p.vozDur + 0.15) return null;
      let i = tiempos.findIndex((w) => t < w.hasta);
      if (i < 0) i = tiempos.length - 1;
      const g = Math.floor(i / SUBTITULOS.palabrasPorGrupo);
      const clave = `${g}|${i}`;
      if (!subsCache.has(clave)) {
        const grupo = tiempos.slice(g * SUBTITULOS.palabrasPorGrupo, (g + 1) * SUBTITULOS.palabrasPorGrupo).map((w) => w.palabra);
        subsCache.set(clave, await renderizarSubtitulo(grupo, i - g * SUBTITULOS.palabrasPorGrupo, { ...SUBTITULOS, ancho: W - 2 * ZONA_SEGURA.lados }));
      }
      return subsCache.get(clave);
    };

    const hacerFrame = async (f) => {
      const t = f / fps;
      const a = animar(e.animacion || 'habla', t, { dur: p.dur, vozDur: p.vozDur });
      // Pop de entrada en cada cambio de escena (salvo "entrada", que ya tiene su movimiento).
      if ((e.animacion || 'habla') !== 'entrada' && t < TRANSICION.pop) {
        const k = t / TRANSICION.pop;
        const pop = 0.82 + 0.18 * (1 - Math.pow(1 - k, 3)) + 0.05 * Math.sin(Math.PI * k);
        a.sx *= pop; a.sy *= pop;
      }
      const sxr = Math.round(a.sx * 100) / 100; const syr = Math.round(a.sy * 100) / 100; const rotr = Math.round(a.rot);
      const clave = `${sxr}|${syr}|${rotr}`;
      let v = variantes.get(clave);
      if (!v) {
        let img = sharp(sprite).resize(Math.max(2, Math.round(spriteMeta.width * sxr)), Math.max(2, Math.round(spriteMeta.height * syr)), { fit: 'fill' });
        if (rotr) img = img.rotate(rotr, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
        const buf = await img.png().toBuffer();
        const m = await sharp(buf).metadata();
        v = { buf, w: m.width, h: m.height };
        variantes.set(clave, v);
      }
      const capas = [];
      const c = await capa(v.buf, centroX + a.dx - v.w / 2, pieY + a.dy - v.h);
      if (c) capas.push(c);
      if (texto) capas.push({ input: texto.buffer, left: Math.round((W - texto.ancho) / 2), top: Math.round(textoTop) });
      const sub = await subtituloEn(t);
      if (sub) capas.push({ input: sub.buffer, left: Math.round((W - sub.ancho) / 2), top: SUBTITULOS.y });
      const img = sharp(fondo).composite(capas);
      if (guardarFrames) await img.clone().png().toFile(path.join(dirFrames, `f${String(indice + f).padStart(5, '0')}.png`));
      return img.ensureAlpha().raw().toBuffer();
    };
    const lote = 6;
    for (let f = 0; f < p.frames; f += lote) {
      const buffers = await Promise.all(Array.from({ length: Math.min(lote, p.frames - f) }, (_, k) => hacerFrame(f + k)));
      for (const b of buffers) await escribir(b);
    }
    indice += p.frames;
    console.log(`  Escena ${p.n}: ${e.animacion || 'habla'} · ${p.dur.toFixed(2)} s · ${p.frames} fotogramas · ${path.basename(p.modelo)}`);
  }

  ff.stdin.end();
  await ffTermino;
  await escribirJson(path.join(dirRender, 'render.json'), {
    slug,
    generado: new Date().toISOString(),
    fps,
    duracion: Math.round(total * 1000) / 1000,
    conVoz: Boolean(voz),
    escenas: plan.map((p) => ({ n: p.n, inicio: Math.round(p.inicio * 1000) / 1000, dur: Math.round(p.dur * 1000) / 1000, vozDur: p.vozDur, vozArchivo: p.vozArchivo, modelo: path.basename(p.modelo, '.svg'), personaje: p.personaje.id, animacion: p.escena.animacion || 'habla' })),
  });
  console.log(`✔ Video mudo: ${path.relative(process.cwd(), salida)} (${total.toFixed(1)} s). Siguiente: anv edit ${slug}`);
}
