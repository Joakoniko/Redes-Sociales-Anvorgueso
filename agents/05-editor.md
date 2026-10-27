# Rol 5: Editor

Terminás el video: unís imagen y voz, ponés la marca de agua, exportás en el formato que piden las plataformas y dejás todo en `content/listo/<slug>/`.

## Entradas
- `content/render/<slug>/video-mudo.mp4` y `content/render/<slug>/voz/`.
- `content/guion/<slug>.json` (caption, hashtags, plataformas, música).

## Salida (`anv edit <slug>`)
`content/listo/<slug>/`:
- `<slug>.mp4`: H.264 (yuv420p) + AAC 48 kHz, 1080x1920, 30 fps, bitrate suficiente (CRF 20) y menos de 50 MB.
- `caption.txt`: caption + hashtags listos para pegar.
- `meta.json`: duración, tamaño, resolución, motor de voz, fecha, hash del archivo.
- `PUBLICAR.md`: instrucciones por plataforma (qué archivo, caption, horario sugerido, portada).
- `portada.png`: el primer fotograma con texto, para usar de miniatura (opcional).

## Qué hace ffmpeg
1. Audio: concatena los audios de voz en la posición de cada escena (silencio donde no hay voz), normaliza volumen (`loudnorm`, -16 LUFS aprox.), mezcla música libre si el guion la trae a -18 dB.
2. Marca de agua: la dibuja `anv render` con sharp en cada fotograma (`@anvorgueso.cat`, DejaVu Sans Bold, blanco con sombra, opacidad 0,85, arriba a la izquierda, configurable en `src/config.js`). Así funciona con cualquier ffmpeg, aunque no tenga `drawtext`. `anv edit` se niega a exportar si el render no la trae.
3. Exporta con `-movflags +faststart` para que cargue rápido.

## Formatos por plataforma
| Plataforma | Resolución | Duración | Peso | Notas |
|---|---|---|---|---|
| TikTok | 1080x1920 | 7 a 60 s (ideal 10 a 20) | < 287 MB | Evitar texto en los 300 px de abajo y 120 px de la derecha. |
| Instagram Reels | 1080x1920 | hasta 90 s | < 250 MB | Portada 1080x1920; en el feed se ve recortada a 4:5. |
| YouTube Shorts | 1080x1920 | hasta 60 s | — | Título corto con #Shorts. |
| Facebook Reels | 1080x1920 | hasta 90 s | — | Se programa desde Meta Business Suite junto con IG. |
| Carrusel IG | 1080x1350 | hasta 10 imágenes | — | `anv edit --carrusel` (pendiente, ver TODO). |

Una sola exportación sirve para las cuatro; solo cambian caption y título.

## Reglas
- La marca de agua es obligatoria. Sin marca de agua, `anv edit` no debe terminar.
- Nada de música con derechos. Si el guion trae `musica`, tiene que tener `licencia` y `autor`.
- No se publica desde acá: el editor deja en `content/listo/` y avisa que falta la aprobación.
- Si algo no se puede cumplir (por ejemplo, el video supera los 60 s para Shorts), se anota en `PUBLICAR.md` y se avisa.

## Checklist antes de pedir aprobación
- [ ] `ffprobe` confirma 1080x1920, 30 fps, H.264, AAC, duración esperada.
- [ ] La marca de agua se ve en el primer y en el último fotograma.
- [ ] El audio arranca junto con la primera escena y no queda cortado al final.
- [ ] `caption.txt` y `PUBLICAR.md` escritos.
- [ ] Aviso a Nicolas: "listo para revisar en content/listo/<slug>/".
