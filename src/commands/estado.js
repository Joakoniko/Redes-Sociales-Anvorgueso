import path from 'node:path';
import { DIRS } from '../config.js';
import { existe, listar } from '../lib/archivos.js';

export function ayuda() {
  return 'anv estado: cuenta lo que hay en cada carpeta de content/ y qué paso sigue para cada slug.';
}

export async function run() {
  const ideas = (await listar(DIRS.idea, '.md')).map((n) => n.replace(/\.md$/, ''));
  const guiones = (await listar(DIRS.guion, '.json')).map((n) => n.replace(/\.json$/, ''));
  const renders = await listar(DIRS.render);
  const listos = await listar(DIRS.listo);
  const publicados = await listar(DIRS.publicado);
  console.log(`content/idea:      ${ideas.length}`);
  console.log(`content/guion:     ${guiones.length}`);
  console.log(`content/render:    ${renders.length}`);
  console.log(`content/listo:     ${listos.length}`);
  console.log(`content/publicado: ${publicados.length}`);
  const slugs = new Set([...ideas, ...guiones, ...renders, ...listos]);
  if (!slugs.size) return;
  console.log('\nSiguiente paso por slug:');
  for (const s of [...slugs].sort()) {
    let paso;
    if (publicados.includes(s)) paso = 'publicado';
    else if (listos.includes(s)) paso = (await existe(path.join(DIRS.listo, s, 'APROBADO'))) ? 'anv publish (aprobado)' : 'esperando aprobación de Nicolas';
    else if (renders.includes(s)) {
      const tieneVideo = await existe(path.join(DIRS.render, s, 'video-mudo.mp4'));
      const tieneVoz = await existe(path.join(DIRS.render, s, 'voz', 'voz.json'));
      paso = tieneVideo ? 'anv edit' : tieneVoz ? 'anv render' : 'anv voice';
    } else if (guiones.includes(s)) paso = 'anv script --check / anv voice';
    else paso = 'anv script';
    console.log(`  ${s.padEnd(40)} → ${paso}`);
  }
}
