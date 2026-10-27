#!/usr/bin/env node
// Punto de entrada del CLI `anv`. Configura las fuentes antes de cargar sharp.
import { configurarFuentes } from '../src/lib/fuentes.js';

configurarFuentes();
const { main } = await import('../src/cli.js');
main(process.argv.slice(2)).catch((e) => {
  console.error(`\n✖ ${e.message}`);
  if (process.env.ANV_DEBUG) console.error(e.stack);
  process.exit(1);
});
