import fs from 'node:fs/promises';
import path from 'node:path';
import { DIRS } from '../config.js';
import { asegurarDir, existe, hoy, listar, slugificar } from '../lib/archivos.js';

export function ayuda() {
  return [
    'anv trend [--tema "..."] [--plataforma tiktok] [--slug nombre] [--prioridad alta|media|baja]',
    '',
    'Crea content/idea/<fecha>-<slug>.md con la plantilla del rol tendencias (agents/01-tendencias.md).',
    'Sin --tema, lista las ideas que ya existen.',
  ].join('\n');
}

const PLANTILLA = ({ tema, plataforma, prioridad, fecha, slug }) => `# Idea: ${tema}

- **Slug:** \`${slug}\`
- **Fecha:** ${fecha}
- **Plataforma de origen:** ${plataforma}
- **Prioridad:** ${prioridad}
- **Vigencia:** (hasta cuándo tiene sentido publicarlo)
- **Personajes:** anvorgueso

## Formato del trend
(Estructura del formato: qué pasa en los primeros 2 segundos, cómo sigue, cómo remata. Duración típica. ¿Lleva baile? ¿Lleva audio? Si lleva audio con derechos, acá se decide reemplazarlo por voz propia.)

## Por qué le queda a Anvorgueso
(Qué rasgo usa: vago con orgullo, interesado, irónico, mitad y mitad, ojo rojo, diario de agravios.)

## Nuestra versión
(Cómo lo hacemos con nuestros dibujos y nuestra voz. Escena por escena, en borrador. Qué modelo del personaje conviene.)

## Riesgos
- Derechos: (ninguno / cuál y cómo se evita)
- Apto para chicos: (sí / qué ajustar)
- ¿Ya pasó de moda?: (no / cuándo)

## Siguiente paso
\`anv script ${slug}\`
`;

export async function run(posicionales, flags) {
  await asegurarDir(DIRS.idea);
  const tema = flags.tema || posicionales.join(' ');
  if (!tema) {
    const ideas = await listar(DIRS.idea, '.md');
    if (!ideas.length) {
      console.log('No hay ideas todavía. Creá una con: anv trend --tema "..."');
      return;
    }
    console.log(`Ideas en content/idea/ (${ideas.length}):`);
    for (const i of ideas) console.log(`  - ${i.replace(/\.md$/, '')}`);
    return;
  }
  const fecha = hoy();
  const base = slugificar(flags.slug || tema).slice(0, 40) || 'idea';
  const slug = /^\d{4}-\d{2}-\d{2}-/.test(base) ? base : `${fecha}-${base}`;
  const ruta = path.join(DIRS.idea, `${slug}.md`);
  if (await existe(ruta)) throw new Error(`Ya existe ${path.relative(process.cwd(), ruta)}. Usá otro --slug.`);
  const contenido = PLANTILLA({
    tema,
    plataforma: flags.plataforma || 'tiktok',
    prioridad: flags.prioridad || 'media',
    fecha,
    slug,
  });
  await fs.writeFile(ruta, contenido);
  console.log(`✔ Idea creada: ${path.relative(process.cwd(), ruta)}`);
  console.log('  Completá las secciones (rol tendencias) y después: anv script ' + slug);
}
