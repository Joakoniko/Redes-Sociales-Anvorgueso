import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS, PLATAFORMAS } from '../config.js';
import { asegurarDir, escribirJson, existe, leerJson } from '../lib/archivos.js';

export function ayuda() {
  return [
    'anv publish <slug>                      Verifica la aprobación y muestra las instrucciones de publicación.',
    'anv publish <slug> --aprobar            Solo Nicolas: marca el video como aprobado (crea el archivo APROBADO).',
    'anv publish <slug> --hecho tiktok,instagram [--links "url1,url2"]',
    '                                        Registra que ya se publicó y mueve la carpeta a content/publicado/.',
    '',
    'Hoy no hay ninguna API conectada: la publicación se hace a mano o se programa en Meta Business Suite,',
    'TikTok Studio y YouTube Studio. Ver agents/06-publicador.md.',
  ].join('\n');
}

function ahoraIso() {
  return new Date().toISOString();
}

export async function run(posicionales, flags) {
  const slug = posicionales[0];
  if (!slug) throw new Error('Falta el slug. Uso: anv publish <slug>');
  const dirListo = path.join(DIRS.listo, slug);
  const rutaAprobado = path.join(dirListo, 'APROBADO');

  if (flags.aprobar) {
    // Este paso es de Nicolas. Si lo corre un agente de Claude, se niega.
    if (process.env.CLAUDECODE || process.env.CLAUDE_CODE || process.env.ANV_AGENTE) {
      throw new Error('La aprobación la da Nicolas a mano (anv publish <slug> --aprobar desde su terminal). Un agente no aprueba.');
    }
    if (!(await existe(dirListo))) throw new Error(`No existe content/listo/${slug}. Primero: anv edit ${slug}`);
    await fs.writeFile(rutaAprobado, `Aprobado por Nicolas el ${ahoraIso()}\n`);
    console.log(`✔ Aprobado. Ahora: anv publish ${slug}`);
    return;
  }

  if (flags.hecho) {
    if (!(await existe(rutaAprobado))) throw new Error('No se puede registrar como publicado algo que no fue aprobado.');
    const plataformas = String(flags.hecho).split(',').map((s) => s.trim()).filter(Boolean);
    const malas = plataformas.filter((p) => !PLATAFORMAS[p]);
    if (malas.length) throw new Error(`Plataformas desconocidas: ${malas.join(', ')}. Válidas: ${Object.keys(PLATAFORMAS).join(', ')}`);
    const links = flags.links ? String(flags.links).split(',').map((s) => s.trim()).filter(Boolean) : [];
    const destino = path.join(DIRS.publicado, slug);
    await asegurarDir(DIRS.publicado);
    if (await existe(destino)) throw new Error(`Ya existe content/publicado/${slug}.`);
    await fs.rename(dirListo, destino);
    const meta = (await existe(path.join(destino, 'meta.json'))) ? await leerJson(path.join(destino, 'meta.json')) : {};
    await escribirJson(path.join(destino, 'publicado.json'), {
      slug,
      fecha: ahoraIso(),
      plataformas,
      links,
      archivo: meta.archivo || `${slug}.mp4`,
      duracion: meta.duracion || null,
    });
    console.log(`✔ Registrado como publicado en ${path.relative(process.cwd(), destino)} (${plataformas.join(', ')}).`);
    return;
  }

  if (!(await existe(dirListo))) throw new Error(`No existe content/listo/${slug}. Primero: anv edit ${slug}`);
  if (!(await existe(rutaAprobado))) {
    console.log(`⏸ ${slug} todavía no está aprobado.`);
    console.log(`  Nicolas tiene que revisar content/listo/${slug}/${slug}.mp4 y, si le gusta, correr:`);
    console.log(`  anv publish ${slug} --aprobar`);
    process.exitCode = 2;
    return;
  }
  const rutaInstrucciones = path.join(dirListo, 'PUBLICAR.md');
  console.log(`✔ ${slug} está aprobado (${(await fs.readFile(rutaAprobado, 'utf8')).trim()}).`);
  console.log('  No hay API conectada todavía, así que se publica a mano. Instrucciones:\n');
  if (await existe(rutaInstrucciones)) console.log(await fs.readFile(rutaInstrucciones, 'utf8'));
  console.log(`\nCuando esté publicado: anv publish ${slug} --hecho tiktok,instagram,shorts,facebook --links "..."`);
}
