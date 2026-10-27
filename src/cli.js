// Despacho de comandos del CLI `anv`.
const COMANDOS = {
  trend: { desc: 'Crea una idea en content/idea/ (rol tendencias). Sin argumentos, lista las ideas.', mod: './commands/trend.js' },
  script: { desc: 'Crea o valida el guion content/guion/<slug>.json (rol guionista).', mod: './commands/script.js' },
  voice: { desc: 'Genera la voz de cada escena con TTS gratis (rol voz).', mod: './commands/voice.js' },
  render: { desc: 'Dibuja el video mudo 1080x1920 a partir del guion y los SVG (rol productor).', mod: './commands/render.js' },
  edit: { desc: 'Une video y voz, pone la marca de agua y deja todo en content/listo/ (rol editor).', mod: './commands/edit.js' },
  publish: { desc: 'Verifica la aprobación y prepara o registra la publicación (rol publicador).', mod: './commands/publish.js' },
  estado: { desc: 'Muestra qué hay en cada carpeta de content/.', mod: './commands/estado.js' },
};

export function parsearArgs(argv) {
  const posicionales = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split(/=(.*)/s);
      if (v !== undefined) flags[k] = v;
      else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) flags[k] = argv[++i];
      else flags[k] = true;
    } else {
      posicionales.push(a);
    }
  }
  return { posicionales, flags };
}

export function ayuda() {
  const lineas = Object.entries(COMANDOS).map(([n, c]) => `  anv ${n.padEnd(8)} ${c.desc}`);
  return [
    'anv: el flujo de contenido de @anvorgueso.cat',
    '',
    'Uso: anv <comando> [slug] [--opciones]',
    '',
    ...lineas,
    '',
    'Orden normal: trend → script → voice → render → edit → (aprobación de Nicolas) → publish',
    'Ejemplos:',
    '  anv trend --tema "POV: tu gato te juzga por el delivery"',
    '  anv script 2026-10-27-presentacion --check',
    '  anv voice 2026-10-27-presentacion',
    '  anv render 2026-10-27-presentacion',
    '  anv edit 2026-10-27-presentacion',
    '  anv publish 2026-10-27-presentacion',
    '',
    'Cada comando acepta --help.',
  ].join('\n');
}

export async function main(argv) {
  const { posicionales, flags } = parsearArgs(argv);
  const nombre = posicionales.shift();
  if (!nombre || nombre === 'help' || nombre === 'ayuda' || (flags.help && !nombre)) {
    console.log(ayuda());
    return;
  }
  const cmd = COMANDOS[nombre];
  if (!cmd) throw new Error(`Comando desconocido: "${nombre}". Probá "anv --help".`);
  const mod = await import(cmd.mod);
  if (flags.help) {
    console.log(mod.ayuda ? mod.ayuda() : cmd.desc);
    return;
  }
  await mod.run(posicionales, flags);
}
