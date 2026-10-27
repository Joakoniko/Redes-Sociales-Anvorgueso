import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsearArgs } from '../src/cli.js';
import { slugificar } from '../src/lib/archivos.js';
import { partirLineas, tieneEmoji, tiemposPalabras } from '../src/lib/texto.js';
import { quitarFondo } from '../src/lib/svg.js';
import { animar } from '../src/commands/render.js';
import { estimarDuracion, plantillaGuion, validarGuion } from '../src/commands/script.js';
import { filtroMarcaDeAgua } from '../src/commands/edit.js';

test('parsearArgs separa posicionales y flags', () => {
  const r = parsearArgs(['script', 'mi-slug', '--check', '--personaje', 'anvorgueso', '--tema=hola']);
  assert.deepEqual(r.posicionales, ['script', 'mi-slug']);
  assert.equal(r.flags.check, true);
  assert.equal(r.flags.personaje, 'anvorgueso');
  assert.equal(r.flags.tema, 'hola');
});

test('slugificar quita tildes y símbolos', () => {
  assert.equal(slugificar('¡Anvorgueso se presenta! (versión 2)'), 'anvorgueso-se-presenta-version-2');
});

test('partirLineas respeta el máximo de caracteres', () => {
  const lineas = partirLineas('Mitad verde, mitad rosa y cero ganas de laburar', 20);
  assert.ok(lineas.every((l) => l.length <= 20), lineas.join('|'));
  assert.equal(lineas.join(' '), 'Mitad verde, mitad rosa y cero ganas de laburar');
});

test('tieneEmoji detecta emojis', () => {
  assert.equal(tieneEmoji('hola 🐱'), true);
  assert.equal(tieneEmoji('hola che'), false);
});

test('quitarFondo saca solo el rect del lienzo', () => {
  const svg = '<svg viewBox="0 0 240 240"><rect width="240" height="240" fill="#FFF"></rect><rect x="1" y="1" width="10" height="10"/><rect width="240" height="240" fill="#000"/></svg>';
  const limpio = quitarFondo(svg);
  assert.ok(!limpio.includes('fill="#FFF"'));
  assert.ok(limpio.includes('x="1"'));
});

test('animar devuelve transformaciones acotadas', () => {
  for (const tipo of ['quieto', 'habla', 'rebote', 'entrada', 'salida', 'baile', 'salto', 'temblor']) {
    for (let t = 0; t < 3; t += 0.1) {
      const a = animar(tipo, t, { dur: 3, vozDur: 2.5 });
      assert.ok(Math.abs(a.dx) <= 900 && Math.abs(a.dy) <= 700, `${tipo} se fue de rango`);
      assert.ok(a.sx > 0.8 && a.sy > 0.8 && a.sx < 1.2 && a.sy < 1.2, `${tipo} escala rara`);
    }
  }
  const e = animar('entrada', 0, { dur: 3, vozDur: 2 });
  assert.ok(e.dy > 600, 'la entrada arranca abajo');
});

test('la plantilla de guion pasa la validación salvo por lo esperado', async () => {
  const g = plantillaGuion({ slug: '2026-01-01-prueba', personaje: 'anvorgueso', modelo: '01-mochi' });
  const problemas = (await validarGuion(g)).filter((m) => !/muy corto/.test(m));
  assert.deepEqual(problemas, [], problemas.join('\n'));
  assert.ok(estimarDuracion(g) > 0);
});

test('la validación detecta emojis y personajes inexistentes', async () => {
  const g = plantillaGuion({ slug: 'x', personaje: 'anvorgueso', modelo: '01-mochi' });
  g.escenas[0].texto = 'Hola 🐱';
  g.escenas[1].personaje = 'gatonombre';
  const problemas = await validarGuion(g);
  assert.ok(problemas.some((p) => /emojis/.test(p)));
  assert.ok(problemas.some((p) => /no existe/.test(p)));
});

test('la marca de agua siempre está en el filtro', () => {
  const f = filtroMarcaDeAgua();
  assert.ok(f.startsWith('drawtext='));
  assert.ok(f.includes('@anvorgueso.cat'));
});

test('tiemposPalabras reparte toda la duración en orden', () => {
  const t = tiemposPalabras('Miau, che. Soy Anvorgueso.', 2);
  assert.equal(t.length, 4);
  assert.equal(t[0].desde, 0);
  assert.ok(Math.abs(t[3].hasta - 2) < 1e-9);
  assert.ok(t.every((w, i) => i === 0 || w.desde === t[i - 1].hasta));
  assert.ok(t[3].hasta - t[3].desde > t[1].hasta - t[1].desde, 'las palabras largas duran más');
});
