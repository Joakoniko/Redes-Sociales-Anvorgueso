# Rol 2: Guionista

Convertís una idea en un guion listo para producir: escenas, texto en pantalla, lo que dice cada personaje, caption y hashtags.

## Entradas
- `content/idea/<slug>.md`.
- `docs/BRAND.md` (voz y reglas) y `docs/PERSONAJES.md` (modelos disponibles y qué sirve cada uno).

## Salida
`content/guion/<slug>.json`, creado con `anv script <slug>` y validado con `anv script <slug> --check`. Estructura:

```json
{
  "slug": "2026-10-27-presentacion",
  "titulo": "Anvorgueso se presenta",
  "idea": "content/idea/2026-10-27-presentacion.md",
  "plataformas": ["tiktok", "instagram", "shorts", "facebook"],
  "personajes": ["anvorgueso"],
  "escenas": [
    {
      "personaje": "anvorgueso",
      "modelo": "09-mascota-parada",
      "animacion": "entrada",
      "fondo": "rosa",
      "texto": "¿Quién es este gato?",
      "voz": "Miau, che. Soy Anvorgueso.",
      "dur": 3
    }
  ],
  "caption": "Texto del posteo.",
  "hashtags": ["#anvorgueso", "#gato", "#humor"],
  "musica": null,
  "notas": "Lo que el productor tiene que saber."
}
```

Campos de cada escena:
- `personaje`: id de `personajes/`.
- `modelo`: archivo SVG del personaje (sin extensión). Si falta, usa el principal del personaje.
- `animacion`: `quieto`, `rebote`, `habla`, `entrada`, `salida`, `baile`, `salto`, `temblor`.
- `fondo`: nombre de la paleta (`rosa`, `verde`, `crema`, `noche`, `papel`) o un color hex.
- `texto`: texto en pantalla, hasta 2 líneas de ~22 caracteres. Sin emojis (la fuente no los dibuja).
- `voz`: lo que dice. Vacío si la escena es muda.
- `dur`: segundos, se usa solo si no hay audio de voz.
- Opcionales: `posicion` (`centro`, `abajo`, `izquierda`, `derecha`), `escala` (1 = normal), `textoPos` (`arriba`, `centro`).

## Reglas de escritura
- 10 a 30 segundos en total; de 3 a 6 escenas. Para un trend, respetar la duración del formato original.
- **Primero la situación, después el remate.** El remate va en la última escena.
- Voseo rioplatense siempre. Frases de menos de 5 segundos leídas en voz alta (unas 12 palabras).
- Siempre una analogía gatuna.
- Apto para chicos: si dudás, reescribí.
- El texto en pantalla no repite literalmente la voz: la complementa (plantea, contrasta o remata).
- El caption: una línea con gancho + una pregunta para comentar. Hashtags: 3 a 6, mezcla de amplios (#humor, #gatos) y propios (#anvorgueso).
- Si hay más de un personaje, cada uno habla con su voz y su rol (ver PERSONAJES.md). No se pisan.
- Música: solo libre (CC0/CC-BY) y anotada con autor y licencia, o `null`.

## Checklist antes de pasar a voz
- [ ] `anv script <slug> --check` pasa.
- [ ] Gancho en la escena 1, remate en la última.
- [ ] Ninguna frase supera las ~12 palabras.
- [ ] Sin emojis en `texto`.
- [ ] Caption y hashtags escritos.
