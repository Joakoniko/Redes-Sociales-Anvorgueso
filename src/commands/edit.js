import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS, HORARIOS_SUGERIDOS, MARCA, PLATAFORMAS, VIDEO } from '../config.js';
import { asegurarDir, escribirJson, existe, formatoMB, leerJson } from '../lib/archivos.js';
import { ffmpeg, resumenVideo } from '../lib/ffmpeg.js';
import { cargarGuion } from './script.js';

export function ayuda() {
  return [
    'anv edit <slug>',
    '',
    'Une content/render/<slug>/video-mudo.mp4 (que ya trae la marca de agua "@anvorgueso.cat") con la voz,',
    'normaliza el audio y exporta H.264 + AAC 1080x1920 a content/listo/<slug>/<slug>.mp4,',
    'junto con caption.txt, meta.json, portada.png y PUBLICAR.md.',
  ].join('\n');
}

function textoPublicar({ slug, guion, meta }) {
  const caption = `${guion.caption}\n\n${(guion.hashtags || []).join(' ')}`;
  const partes = [`# Publicar: ${guion.titulo || slug}`, '', `Archivo: \`content/listo/${slug}/${slug}.mp4\` (${meta.ancho}x${meta.alto}, ${meta.duracion.toFixed(1)} s, ${formatoMB(meta.bytes)})`, `Portada: \`content/listo/${slug}/portada.png\``, '', '## Antes de subir', '- [ ] Nicolas revisó el video y creó `APROBADO` (`anv publish ' + slug + ' --aprobar`).', '- [ ] Marca de agua visible.', '- [ ] Caption y hashtags copiados de `caption.txt`.', '', `## Horarios sugeridos\n${HORARIOS_SUGERIDOS.map((h) => `- ${h}`).join('\n')}`, ''];
  for (const id of guion.plataformas || Object.keys(PLATAFORMAS)) {
    const p = PLATAFORMAS[id];
    if (!p) continue;
    const pasa = meta.duracion <= p.maxSeg;
    partes.push(`## ${p.nombre}`);
    partes.push(`- Dónde: ${p.donde}`);
    partes.push(`- Duración máxima: ${p.maxSeg} s ${pasa ? '✔' : '✖ el video es más largo, recortar'}`);
    if (id === 'shorts') partes.push(`- Título sugerido: ${guion.titulo || slug} #Shorts`);
    if (id === 'tiktok') partes.push('- Si la app ofrece un sonido de su biblioteca, se puede sumar solo dentro de TikTok (no en el archivo).');
    partes.push('- Caption:');
    partes.push('```');
    partes.push(caption);
    partes.push('```');
    partes.push('');
  }
  if (guion.musica) partes.push(`## Música\n- ${guion.musica.titulo || guion.musica.archivo} · ${guion.musica.autor} · ${guion.musica.licencia}${guion.musica.url ? ` · ${guion.musica.url}` : ''}\n`);
  partes.push(`## Después de publicar\n\`anv publish ${slug} --hecho tiktok,instagram,shorts,facebook --links "url1,url2"\``);
  return partes.join('\n') + '\n';
}

export async function run(posicionales) {
  const slug = posicionales[0];
  if (!slug) throw new Error('Falta el slug. Uso: anv edit <slug>');
  const guion = await cargarGuion(slug);
  const dirRender = path.join(DIRS.render, slug);
  const videoMudo = path.join(dirRender, 'video-mudo.mp4');
  if (!(await existe(videoMudo))) throw new Error(`No existe ${path.relative(process.cwd(), videoMudo)}. Primero: anv render ${slug}`);
  const render = await leerJson(path.join(dirRender, 'render.json'));
  // La marca de agua la dibuja el render en cada fotograma. Sin ella, no se exporta.
  if (render.marcaDeAgua !== MARCA.texto) {
    throw new Error(`El video mudo no tiene la marca de agua "${MARCA.texto}". Volvé a correr: anv render ${slug}`);
  }
  const dirListo = path.join(DIRS.listo, slug);
  await asegurarDir(dirListo);
  const salida = path.join(dirListo, `${slug}.mp4`);

  // Entradas: el video mudo y un audio por escena con voz, cada uno retrasado hasta el inicio de su escena.
  const args = ['-i', videoMudo];
  const filtros = [];
  const etiquetas = [];
  let k = 1;
  for (const e of render.escenas) {
    if (!e.vozArchivo) continue;
    const ruta = path.join(dirRender, e.vozArchivo);
    if (!(await existe(ruta))) throw new Error(`Falta el audio ${e.vozArchivo}. Volvé a correr: anv voice ${slug}`);
    args.push('-i', ruta);
    const ms = Math.round(e.inicio * 1000);
    filtros.push(`[${k}:a]aresample=${VIDEO.audioHz},aformat=channel_layouts=stereo,adelay=${ms}|${ms}[v${k}]`);
    etiquetas.push(`[v${k}]`);
    k++;
  }
  if (guion.musica?.archivo) {
    const rutaMusica = path.resolve(DIRS.cache, '..', guion.musica.archivo);
    if (!(await existe(rutaMusica))) throw new Error(`No existe la música ${guion.musica.archivo}.`);
    args.push('-stream_loop', '-1', '-i', rutaMusica);
    filtros.push(`[${k}:a]aresample=${VIDEO.audioHz},aformat=channel_layouts=stereo,volume=0.22[v${k}]`);
    etiquetas.push(`[v${k}]`);
    k++;
  }
  // El audio se rellena con silencio hasta la duración exacta del video (sin -shortest, que puede
  // seguir codificando de más con apad).
  const D = Number(render.duracion).toFixed(3);
  let cadenaAudio;
  if (!etiquetas.length) {
    args.push('-f', 'lavfi', '-i', `anullsrc=channel_layout=stereo:sample_rate=${VIDEO.audioHz}`);
    cadenaAudio = `[${k}:a]atrim=0:${D}[aout]`;
  } else if (etiquetas.length === 1) {
    cadenaAudio = `${etiquetas[0]}loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${D},atrim=0:${D}[aout]`;
  } else {
    cadenaAudio = `${etiquetas.join('')}amix=inputs=${etiquetas.length}:duration=longest:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11,apad=whole_dur=${D},atrim=0:${D}[aout]`;
  }
  filtros.push(cadenaAudio);
  filtros.push('[0:v]format=yuv420p[vout]');

  await ffmpeg([
    ...args,
    '-filter_complex', filtros.join(';'),
    '-map', '[vout]', '-map', '[aout]',
    '-c:v', 'libx264', '-preset', VIDEO.preset, '-crf', String(VIDEO.crf), '-r', String(render.fps || VIDEO.fps),
    '-c:a', 'aac', '-b:a', VIDEO.audioBitrate, '-ar', String(VIDEO.audioHz),
    '-t', D, '-movflags', '+faststart',
    salida,
  ]);

  const meta = await resumenVideo(salida);
  const problemas = [];
  if (meta.ancho !== VIDEO.ancho || meta.alto !== VIDEO.alto) problemas.push(`resolución ${meta.ancho}x${meta.alto}, se esperaba ${VIDEO.ancho}x${VIDEO.alto}`);
  if (meta.duracion > VIDEO.duracionMaxima) problemas.push(`dura ${meta.duracion.toFixed(1)} s, más de ${VIDEO.duracionMaxima}`);
  if (meta.bytes > VIDEO.pesoMaximoMB * 1024 * 1024) problemas.push(`pesa ${formatoMB(meta.bytes)}`);
  if (!meta.codecAudio) problemas.push('no tiene pista de audio');

  await ffmpeg(['-ss', '0.6', '-i', salida, '-frames:v', '1', path.join(dirListo, 'portada.png')]);
  const hash = crypto.createHash('sha256').update(await fs.readFile(salida)).digest('hex');
  const voz = (await existe(path.join(dirRender, 'voz', 'voz.json'))) ? await leerJson(path.join(dirRender, 'voz', 'voz.json')) : null;
  const metaCompleta = {
    slug,
    titulo: guion.titulo || slug,
    archivo: `${slug}.mp4`,
    generado: new Date().toISOString(),
    ...meta,
    marcaDeAgua: MARCA.texto,
    motorVoz: voz?.motor || null,
    vozUsada: voz?.escenas.find((e) => e.voz)?.voz || null,
    personajes: guion.personajes || [],
    plataformas: guion.plataformas || Object.keys(PLATAFORMAS),
    sha256: hash,
    problemas,
  };
  await escribirJson(path.join(dirListo, 'meta.json'), metaCompleta);
  await fs.writeFile(path.join(dirListo, 'caption.txt'), `${guion.caption}\n\n${(guion.hashtags || []).join(' ')}\n`);
  await fs.writeFile(path.join(dirListo, 'PUBLICAR.md'), textoPublicar({ slug, guion, meta }));

  console.log(`✔ Listo: ${path.relative(process.cwd(), salida)}`);
  console.log(`  ${meta.ancho}x${meta.alto} · ${meta.fps} fps · ${meta.duracion.toFixed(2)} s · ${formatoMB(meta.bytes)} · ${meta.codecVideo}/${meta.codecAudio} · marca de agua "${MARCA.texto}"`);
  if (problemas.length) {
    console.log(`  ⚠ Problemas: ${problemas.join('; ')}`);
    process.exitCode = 1;
  } else {
    console.log(`  Falta la aprobación de Nicolas: revisar el video y correr "anv publish ${slug} --aprobar".`);
  }
}
