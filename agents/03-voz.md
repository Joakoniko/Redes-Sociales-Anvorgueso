# Rol 3: Voz

Generás el audio de cada escena con TTS gratis y dejás las duraciones para que el productor arme el video.

## Entradas
- `content/guion/<slug>.json`.
- `personajes/<id>.json` (campo `voz`: voz de edge-tts, voz de Piper, velocidad, tono).

## Salida
`content/render/<slug>/voz/`:
- `escena-01.mp3` (o `.wav`), uno por escena con `voz` no vacía.
- `voz.json`: motor usado, voz, duración de cada escena y la frase.
- Si edge-tts entregó subtítulos (`.vtt`), también se guardan para subtítulos futuros.

Comando: `anv voice <slug>`. Opciones: `--motor edge|piper` para forzar, `--escena N` para rehacer una sola.

## Motores
1. **edge-tts** (por defecto): voces neuronales de Microsoft, gratis, con acento argentino (`es-AR-TomasNeural`, `es-AR-ElenaNeural`). Necesita internet y `pip install edge-tts`. Es el que mejor suena.
2. **Piper** (respaldo offline): `pip install piper-tts`. El CLI descarga sola una voz en español desde las publicaciones de GitHub del proyecto Piper si no hay ninguna en `assets/voces/piper/`. Si Nicolas descarga `es_AR-daniela-high` (acento argentino, está en Hugging Face), el CLI la prefiere automáticamente.
3. Si ninguno funciona, el comando falla con un mensaje claro. **No se usa ninguna API paga.**

## Cambiar la voz para un video
En el guion: `"vozConfig": { "anvorgueso": { "edge": "es-AR-ElenaNeural", "edgeRate": "+10%", "edgePitch": "+0Hz" } }`, o `"vozConfig"` dentro de una escena. Lo que no se pisa sale de `personajes/<id>.json`.

## Reglas
- Una frase por archivo. Las pausas largas se hacen con la duración de la escena, no con silencio dentro del audio.
- Velocidad: un poco más rápido que lo normal (+8 %) para que suene a redes; tono un poco más agudo para Anvorgueso. Cada personaje define lo suyo en su JSON.
- Si una frase suena mal (números, siglas, palabras inventadas), se reescribe en el guion de forma fonética (`"3 a.m."` → `"tres de la mañana"`), no se parchea el audio.
- Revisar que ninguna escena supere los 5 s de voz. Si pasa, avisar al guionista.
- No se versionan los audios (están en `.gitignore`), sí `voz.json`.

## Checklist antes de pasar al productor
- [ ] Hay un audio por escena con voz.
- [ ] `voz.json` tiene las duraciones.
- [ ] Ninguna frase se corta ni se come palabras (escuchar o, si no se puede, revisar la duración contra la cantidad de palabras: ~2,5 a 3,5 palabras por segundo).
