import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS, PYTHON, PIPER_RESPALDO, VIDEO } from '../config.js';
import { asegurarDir, escribirJson, existe, listar } from '../lib/archivos.js';
import { correr } from '../lib/proc.js';
import { duracion } from '../lib/ffmpeg.js';
import { cargarPersonaje } from '../lib/personajes.js';
import { cargarGuion } from './script.js';

export function ayuda() {
  return [
    'anv voice <slug> [--motor edge|piper] [--escena N]',
    '',
    'Genera un audio por escena con voz en content/render/<slug>/voz/ y escribe voz.json con las duraciones.',
    'Motores (todos gratis): edge-tts (voz argentina, necesita internet) y Piper (offline, respaldo).',
    'Requisitos: pip install edge-tts piper-tts',
  ].join('\n');
}

async function sintetizarEdge({ texto, voz, salida }) {
  const args = ['-m', 'edge_tts', '--voice', voz.edge || 'es-AR-TomasNeural', '--text', texto, '--write-media', salida, '--write-subtitles', salida.replace(/\.mp3$/, '.vtt')];
  if (voz.edgeRate) args.push('--rate', voz.edgeRate);
  if (voz.edgePitch) args.push('--pitch', voz.edgePitch);
  if (process.env.HTTPS_PROXY) args.push('--proxy', process.env.HTTPS_PROXY);
  await correr(PYTHON, args, { timeoutMs: 45000 });
  const st = await fs.stat(salida);
  if (!st.size) throw new Error('edge-tts no devolvió audio');
  return { motor: 'edge-tts', voz: voz.edge || 'es-AR-TomasNeural' };
}

// Busca una voz de Piper ya descargada; prefiere acento argentino, después cualquier español.
async function buscarVozPiper(preferida) {
  await asegurarDir(DIRS.voces);
  const modelos = await listar(DIRS.voces, '.onnx');
  if (!modelos.length) return null;
  const orden = [
    (m) => preferida && preferida !== 'auto' && m.startsWith(preferida),
    (m) => /es_AR/i.test(m),
    (m) => /^es[_-]/i.test(m),
    () => true,
  ];
  for (const regla of orden) {
    const m = modelos.find(regla);
    if (m) return path.join(DIRS.voces, m);
  }
  return null;
}

async function descargarVozRespaldo() {
  await asegurarDir(DIRS.voces);
  const tgz = path.join(DIRS.voces, `${PIPER_RESPALDO.nombre}.tar.gz`);
  console.log(`  Descargando voz Piper de respaldo (${PIPER_RESPALDO.nombre})...`);
  const res = await fetch(PIPER_RESPALDO.url);
  if (!res.ok) throw new Error(`No pude descargar la voz Piper (${res.status}).`);
  await fs.writeFile(tgz, Buffer.from(await res.arrayBuffer()));
  await correr('tar', ['-xzf', tgz, '-C', DIRS.voces]);
  await fs.rm(tgz, { force: true });
}

async function sintetizarPiper({ texto, voz, salida }) {
  let modelo = await buscarVozPiper(voz.piper);
  if (!modelo) {
    await descargarVozRespaldo();
    modelo = await buscarVozPiper(voz.piper);
  }
  if (!modelo) throw new Error('No hay ninguna voz de Piper en assets/voces/piper/.');
  const config = (await existe(`${modelo}.json`)) ? `${modelo}.json` : modelo.replace(/\.onnx$/, '.json');
  const args = ['-m', 'piper', '-m', modelo, '-c', config, '-f', salida];
  if (voz.piperLengthScale) args.push('--length-scale', String(voz.piperLengthScale));
  await correr(PYTHON, args, { input: texto + '\n', timeoutMs: 120000 });
  return { motor: 'piper', voz: path.basename(modelo, '.onnx') };
}

export async function run(posicionales, flags) {
  const slug = posicionales[0];
  if (!slug) throw new Error('Falta el slug. Uso: anv voice <slug>');
  const guion = await cargarGuion(slug);
  const dirVoz = path.join(DIRS.render, slug, 'voz');
  await asegurarDir(dirVoz);
  const soloEscena = flags.escena ? Number(flags.escena) : null;
  const motores = flags.motor ? [String(flags.motor)] : ['edge', 'piper'];
  const resultado = { slug, generado: new Date().toISOString(), escenas: [] };
  const previo = (await existe(path.join(dirVoz, 'voz.json'))) ? JSON.parse(await fs.readFile(path.join(dirVoz, 'voz.json'), 'utf8')) : null;
  let motorUsado = null;

  for (const [i, escena] of guion.escenas.entries()) {
    const n = i + 1;
    const texto = (escena.voz || '').trim();
    if (!texto) { resultado.escenas.push({ n, archivo: null, dur: 0, texto: '' }); continue; }
    if (soloEscena && soloEscena !== n && previo) {
      const ant = previo.escenas.find((e) => e.n === n);
      if (ant) { resultado.escenas.push(ant); continue; }
    }
    const personaje = await cargarPersonaje(escena.personaje || guion.personajes?.[0] || 'anvorgueso');
    const voz = personaje.voz || {};
    const nombreBase = `escena-${String(n).padStart(2, '0')}`;
    let info = null;
    let ultimoError = null;
    for (const motor of motores) {
      const salida = path.join(dirVoz, `${nombreBase}.${motor === 'edge' ? 'mp3' : 'wav'}`);
      try {
        info = motor === 'edge' ? await sintetizarEdge({ texto, voz, salida }) : await sintetizarPiper({ texto, voz, salida });
        info.archivo = salida;
        break;
      } catch (e) {
        ultimoError = e;
        console.log(`  Escena ${n}: ${motor} falló (${e.message.split('\n')[0].slice(0, 120)}). ${motor === 'edge' ? 'Pruebo Piper offline...' : ''}`);
      }
    }
    if (!info) throw new Error(`No pude generar la voz de la escena ${n}. Último error: ${ultimoError?.message}`);
    const dur = await duracion(info.archivo);
    motorUsado = motorUsado || info.motor;
    const palabras = texto.split(/\s+/).length;
    const aviso = dur > 5 ? ' ⚠ más de 5 s: acortar la frase' : '';
    console.log(`  Escena ${n}: ${info.motor} (${info.voz}) · ${dur.toFixed(2)} s · ${palabras} palabras${aviso}`);
    resultado.escenas.push({ n, archivo: path.relative(path.join(DIRS.render, slug), info.archivo), dur: Math.round(dur * 1000) / 1000, texto, motor: info.motor, voz: info.voz, personaje: personaje.id });
  }
  resultado.motor = motorUsado;
  resultado.duracionVoz = resultado.escenas.reduce((a, e) => a + e.dur, 0);
  resultado.duracionEstimada = resultado.escenas.reduce((a, e) => a + (e.dur ? e.dur + VIDEO.aire : (Number(guion.escenas[e.n - 1].dur) || 2)), 0);
  await escribirJson(path.join(dirVoz, 'voz.json'), resultado);
  console.log(`✔ Voz lista (${motorUsado}). Duración estimada del video: ${resultado.duracionEstimada.toFixed(1)} s. Siguiente: anv render ${slug}`);
  if (motorUsado === 'piper') console.log('  Nota: se usó la voz offline de respaldo. Con internet, edge-tts da la voz argentina.');
}
