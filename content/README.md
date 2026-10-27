# content/

Acá vive cada video en su etapa. El `slug` (por ejemplo `2026-10-27-presentacion`) es el mismo de punta a punta.

| Carpeta | Qué hay | Lo escribe |
|---|---|---|
| `idea/` | `<slug>.md` con la idea (trend, por qué, nuestra versión). | `anv trend` |
| `guion/` | `<slug>.json` con escenas, voz, texto, caption y hashtags. | `anv script` |
| `render/<slug>/` | `voz/` (audios y `voz.json`), `render.json`, `video-mudo.mp4`. | `anv voice`, `anv render` |
| `listo/<slug>/` | `<slug>.mp4` final con marca de agua, `caption.txt`, `meta.json`, `portada.png`, `PUBLICAR.md` y, cuando Nicolas aprueba, `APROBADO`. | `anv edit`, Nicolas |
| `publicado/<slug>/` | Lo mismo más `publicado.json`. | `anv publish --hecho` |

Los archivos pesados (fotogramas, audios, mp4) no se versionan salvo excepciones anotadas en `docs/DECISIONES.md`. Todo se regenera desde el guion.
