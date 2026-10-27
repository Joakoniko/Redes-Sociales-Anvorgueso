# FLUJO.md: de la tendencia al posteo

El flujo lo corre **un solo agente admin** (Claude en este repo) siguiendo los roles de `agents/` en orden. No hay agentes en paralelo. Cada paso deja un archivo en `content/` y el paso siguiente lo lee.

```
tendencia ──> idea ──> guion ──> voz ──> render ──> edición ──> aprobación ──> publicación
  (trend)   content/  content/  content/render/<slug>/        content/listo/   content/publicado/
             idea/     guion/
```

## Carpetas

| Carpeta | Qué hay | Quién escribe |
|---|---|---|
| `content/idea/` | Un `.md` por idea: trend de origen, por qué encaja, cómo lo recreamos con contenido propio. | Rol tendencias (`anv trend`). |
| `content/guion/` | Un `.json` por video: escenas, texto en pantalla, lo que dice cada personaje, duración, caption y hashtags. | Rol guionista (`anv script`). |
| `content/render/<slug>/` | Voz (`voz/`), fotogramas (`frames/`, no se versionan) y el video mudo (`video-mudo.mp4`). | Roles voz y productor (`anv voice`, `anv render`). |
| `content/listo/<slug>/` | El `.mp4` final con marca de agua, `caption.txt`, `meta.json` y `PUBLICAR.md` con las instrucciones por plataforma. | Rol editor (`anv edit`). |
| `content/publicado/<slug>/` | Lo mismo más `publicado.json` con fecha y plataformas. | Rol publicador (`anv publish --hecho`). |

El `slug` identifica el video en todo el flujo: `AAAA-MM-DD-nombre-corto` (por ejemplo `2026-10-27-presentacion`).

## Pasos

### 1. Tendencias (`anv trend`)
Entrada: lo que Nicolas cuenta, o lo que el agente ve en las plataformas (sin API: observación manual, notas de Nicolas, listas públicas de sonidos de uso comercial). Salida: `content/idea/<slug>.md` con el formato del trend, por qué le queda a Anvorgueso y la versión propia (nunca el video ni el audio original). Si el trend depende de un audio con derechos, se descarta o se reemplaza por voz propia.

### 2. Guion (`anv script <slug>`)
Entrada: la idea. Salida: `content/guion/<slug>.json`. De 3 a 6 escenas, 10 a 30 segundos en total, gancho en la primera escena, remate en la última. Cada escena dice qué personaje, qué modelo o pose, qué texto en pantalla y qué dice. Se valida con `anv script <slug> --check`.

### 3. Voz (`anv voice <slug>`)
Genera un audio por escena con TTS gratis (edge-tts con voz argentina; si no hay red o falla, Piper offline). Guarda la duración real de cada audio para que el render se ajuste.

### 4. Render (`anv render <slug>`)
Rasteriza los SVG del personaje (sharp), arma los fotogramas 1080x1920 con fondo, personaje animado (rebote, habla, entrada) y texto en pantalla, y los une con ffmpeg en `video-mudo.mp4`. Si ya hay voz, cada escena dura lo que dura su audio más una pausa.

### 5. Edición (`anv edit <slug>`)
ffmpeg: une video y voz, pone la marca de agua `@anvorgueso.cat`, normaliza audio, exporta H.264 + AAC 1080x1920 a 30 fps. Escribe `caption.txt`, `meta.json` y `PUBLICAR.md` en `content/listo/<slug>/`.

### 6. Aprobación
Nicolas mira el video en `content/listo/`. Si lo aprueba, crea el archivo `APROBADO` en esa carpeta (con `anv publish <slug> --aprobar`, que solo corre él). **Claude nunca aprueba.** Si hay cambios, se vuelve al paso que haga falta (normalmente guion).

### 7. Publicación (`anv publish <slug>`)
Hoy no hay API gratis conectada. El comando verifica la aprobación, muestra las instrucciones de `PUBLICAR.md` (qué archivo subir, caption y hashtags por plataforma, horario sugerido) para que Nicolas lo suba o lo programe en Meta Business Suite, TikTok Studio y YouTube Studio. Cuando ya se publicó, `anv publish <slug> --hecho tiktok,instagram,...` lo mueve a `content/publicado/` y registra la fecha.

## Ritmo sugerido

- 3 videos por semana para arrancar (más un carrusel), siempre con 3 o 4 en `content/listo/` de colchón.
- Mejores horarios para Argentina (orientativo, se ajusta con datos reales): 12 a 14 h y 20 a 23 h, hora de Buenos Aires.
- Un mismo reel sale en TikTok, Reels, Shorts y Facebook. Las Stories reutilizan un fragmento o una imagen con pregunta.

## Reglas del flujo

- Tareas chicas: un comando por paso, un video por vez. No se rehace lo que ya está en `content/` salvo que Nicolas lo pida.
- Todo se puede volver a generar desde el guion: los archivos pesados (frames, wav) no se versionan.
- Si una herramienta paga parece necesaria, se anota en `TODO.md` con la justificación y se sigue con la alternativa gratis.
