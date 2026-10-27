import path from 'node:path';
import { DIRS, FONDOS, VIDEO } from '../config.js';
import { asegurarDir, escribirJson, existe, leerJson, listar } from '../lib/archivos.js';
import { cargarPersonaje, listarPersonajes } from '../lib/personajes.js';
import { partirLineas, tieneEmoji } from '../lib/texto.js';

export const ANIMACIONES = ['quieto', 'rebote', 'habla', 'entrada', 'salida', 'baile', 'salto', 'temblor'];
export const POSICIONES = ['centro', 'abajo', 'izquierda', 'derecha'];
export const PALABRAS_POR_SEGUNDO = 2.8;

export function ayuda() {
  return [
    'anv script <slug> [--check] [--personaje anvorgueso] [--titulo "..."]',
    '',
    'Sin --check: crea content/guion/<slug>.json con una plantilla para que el guionista la complete.',
    'Con --check: valida el guion (escenas, duraciones, textos, personajes, modelos) y muestra un resumen.',
    'Sin slug: lista los guiones que existen.',
  ].join('\n');
}

export function plantillaGuion({ slug, titulo, personaje, modelo }) {
  return {
    slug,
    titulo: titulo || slug,
    idea: `content/idea/${slug}.md`,
    plataformas: ['tiktok', 'instagram', 'shorts', 'facebook'],
    personajes: [personaje],
    escenas: [
      { personaje, modelo, animacion: 'entrada', fondo: 'rosa', texto: 'Gancho en pantalla', voz: 'Primera frase.', dur: 3 },
      { personaje, modelo, animacion: 'habla', fondo: 'verde', texto: 'Desarrollo', voz: 'Segunda frase.', dur: 3 },
      { personaje, modelo, animacion: 'habla', fondo: 'crema', texto: 'Remate', voz: 'Remate.', dur: 3 },
    ],
    caption: 'Una línea con gancho. ¿Pregunta para comentar?',
    hashtags: ['#anvorgueso', '#gato', '#humor'],
    musica: null,
    notas: '',
  };
}

export function estimarDuracion(guion) {
  return guion.escenas.reduce((acc, e) => {
    if (e.voz && e.voz.trim()) {
      const palabras = e.voz.trim().split(/\s+/).length;
      return acc + palabras / PALABRAS_POR_SEGUNDO + VIDEO.aire;
    }
    return acc + (Number(e.dur) || 2);
  }, 0);
}

// Devuelve una lista de problemas (vacía si el guion está bien).
export async function validarGuion(guion) {
  const problemas = [];
  const aviso = (m) => problemas.push(m);
  if (!guion.slug) aviso('Falta "slug".');
  if (!Array.isArray(guion.escenas) || !guion.escenas.length) {
    aviso('Falta la lista "escenas".');
    return problemas;
  }
  if (guion.escenas.length < 2) aviso('Un video necesita al menos 2 escenas (gancho y remate).');
  if (guion.escenas.length > 8) aviso('Más de 8 escenas: demasiado largo para un reel corto.');
  if (!guion.caption) aviso('Falta "caption".');
  if (!Array.isArray(guion.hashtags) || guion.hashtags.length < 3 || guion.hashtags.length > 6) aviso('Poné entre 3 y 6 hashtags.');
  if (guion.musica && (!guion.musica.archivo || !guion.musica.licencia || !guion.musica.autor)) {
    aviso('"musica" necesita archivo, autor y licencia (solo música libre).');
  }
  const ids = await listarPersonajes();
  for (const [i, e] of guion.escenas.entries()) {
    const n = i + 1;
    if (!e.personaje) aviso(`Escena ${n}: falta "personaje".`);
    else if (!ids.includes(e.personaje)) aviso(`Escena ${n}: el personaje "${e.personaje}" no existe en personajes/.`);
    else {
      const p = await cargarPersonaje(e.personaje);
      if (e.modelo && !p.modelos[e.modelo]) aviso(`Escena ${n}: "${e.personaje}" no tiene el modelo "${e.modelo}".`);
      if (p.estado === 'boceto') aviso(`Escena ${n}: "${e.personaje}" está en boceto; confirmá con Nicolas antes de usarlo.`);
    }
    if (e.animacion && !ANIMACIONES.includes(e.animacion)) aviso(`Escena ${n}: animación "${e.animacion}" desconocida (${ANIMACIONES.join(', ')}).`);
    if (e.posicion && !POSICIONES.includes(e.posicion)) aviso(`Escena ${n}: posición "${e.posicion}" desconocida (${POSICIONES.join(', ')}).`);
    if (e.fondo && !FONDOS[e.fondo] && !/^#[0-9a-fA-F]{6}$/.test(e.fondo)) aviso(`Escena ${n}: fondo "${e.fondo}" no es una paleta (${Object.keys(FONDOS).join(', ')}) ni un color hex.`);
    if (e.texto) {
      if (tieneEmoji(e.texto)) aviso(`Escena ${n}: el texto en pantalla tiene emojis y la fuente no los dibuja.`);
      const lineas = partirLineas(e.texto);
      if (lineas.length > 3) aviso(`Escena ${n}: el texto ocupa ${lineas.length} líneas; máximo 3.`);
      if (lineas.some((l) => l.length > 22)) aviso(`Escena ${n}: hay una palabra o línea de más de 22 caracteres.`);
    }
    if (e.voz) {
      const palabras = e.voz.trim().split(/\s+/).length;
      if (palabras > 14) aviso(`Escena ${n}: la frase tiene ${palabras} palabras; máximo ~14 (5 segundos).`);
    } else if (!e.dur) {
      aviso(`Escena ${n}: sin voz necesita "dur" en segundos.`);
    }
    if (!e.texto && !e.voz) aviso(`Escena ${n}: no tiene ni texto ni voz.`);
  }
  const total = estimarDuracion(guion);
  if (total > VIDEO.duracionMaxima) aviso(`Duración estimada ${total.toFixed(1)} s: supera los ${VIDEO.duracionMaxima} s.`);
  if (total < 6) aviso(`Duración estimada ${total.toFixed(1)} s: muy corto.`);
  return problemas;
}

export async function cargarGuion(slug) {
  const ruta = path.join(DIRS.guion, `${slug}.json`);
  if (!(await existe(ruta))) throw new Error(`No existe el guion ${path.relative(process.cwd(), ruta)}. Crealo con: anv script ${slug}`);
  const guion = await leerJson(ruta);
  guion.slug = guion.slug || slug;
  return guion;
}

export async function run(posicionales, flags) {
  await asegurarDir(DIRS.guion);
  const slug = posicionales[0];
  if (!slug) {
    const guiones = await listar(DIRS.guion, '.json');
    if (!guiones.length) return console.log('No hay guiones. Creá uno con: anv script <slug>');
    console.log(`Guiones en content/guion/ (${guiones.length}):`);
    for (const g of guiones) console.log(`  - ${g.replace(/\.json$/, '')}`);
    return;
  }
  const ruta = path.join(DIRS.guion, `${slug}.json`);
  if (flags.check) {
    const guion = await cargarGuion(slug);
    const problemas = await validarGuion(guion);
    const total = estimarDuracion(guion);
    console.log(`Guion: ${guion.titulo || slug}`);
    console.log(`  Escenas: ${guion.escenas?.length ?? 0} · Duración estimada: ${total.toFixed(1)} s · Personajes: ${(guion.personajes || []).join(', ')}`);
    if (problemas.length) {
      console.log(`\n✖ ${problemas.length} problema(s):`);
      for (const p of problemas) console.log(`  - ${p}`);
      process.exitCode = 1;
    } else {
      console.log('\n✔ El guion pasa la validación. Siguiente: anv voice ' + slug);
    }
    return;
  }
  if (await existe(ruta)) throw new Error(`Ya existe ${path.relative(process.cwd(), ruta)}. Para validarlo: anv script ${slug} --check`);
  const idPersonaje = flags.personaje || 'anvorgueso';
  const personaje = await cargarPersonaje(idPersonaje);
  const guion = plantillaGuion({ slug, titulo: flags.titulo, personaje: idPersonaje, modelo: personaje.modeloPrincipal });
  const rutaIdea = path.join(DIRS.idea, `${slug}.md`);
  if (!(await existe(rutaIdea))) {
    guion.idea = null;
    console.log(`  (No hay content/idea/${slug}.md; el guion se crea igual.)`);
  }
  await escribirJson(ruta, guion);
  console.log(`✔ Guion creado: ${path.relative(process.cwd(), ruta)}`);
  console.log('  Completalo (rol guionista) y validalo con: anv script ' + slug + ' --check');
}
