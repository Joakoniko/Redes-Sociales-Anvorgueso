# TODO.md

Prioridades del proyecto. Se actualiza en cada sesión: lo hecho se mueve a "Hecho" con fecha, lo nuevo entra en la prioridad que corresponda. Las tareas marcadas **[Nicolas]** las tiene que hacer él.

## P0: para poder publicar el primer video

- [ ] **[Nicolas]** Mirar el reel de prueba `content/listo/2026-10-27-presentacion/2026-10-27-presentacion.mp4` y decir qué cambiar (ritmo, voz, texto, tamaño del personaje).
- [ ] **[Nicolas]** Elegir el modelo definitivo del personaje (hoy provisorio: `09-mascota-parada` + `01-mochi` para primeros planos) y, si quiere, un modo (anime, juguete 3D, peluche, etc.). Anotar en `docs/DECISIONES.md`.
- [ ] **[Nicolas]** Instalar en su máquina: Node ≥ 18, ffmpeg, Python 3.12, el entorno `.venv` con edge-tts y piper-tts (README, sección "Voz"), `npm install`. Correr `npm run prueba:reel` para regenerar el reel con la voz argentina (`es-AR-TomasNeural`).
- [ ] **[Nicolas]** Crear o verificar las cuentas @anvorgueso.cat en TikTok, Instagram (profesional), Facebook (página) y YouTube. Si el usuario no está libre, elegir una variante igual en todas.
- [ ] Confirmar la voz: comparar `es-AR-TomasNeural` vs `es-AR-ElenaNeural` con tono subido y elegir una. Guardar la decisión.
- [ ] Primer lote de 3 ideas de trends con `anv trend` (necesita que Nicolas cuente qué trends vio o pase capturas; no hay API de tendencias).

## P1: calidad del video

- [ ] Subtítulos: usar los tiempos reales por palabra de edge-tts cuando estén (hoy se estiman por largo de palabra, sirve para cualquier motor).
- [ ] Más animaciones: parpadeo (alternar dos SVG), girar la cabeza, "sorpresa" (escala rápida), caída. Separar partes del SVG (brazos, cola) para el modelo "mascota parada" y "manguera" y así tener bailes de verdad.
- [ ] Más transiciones entre escenas (hoy: pop de escala al entrar): deslizar, zoom, "caja que se abre" con el modelo `03-caja`.
- [ ] Biblioteca de música libre (CC0 / CC-BY) con licencias guardadas en `assets/musica/LICENCIAS.md`, y mezcla a volumen bajo en `anv edit`.
- [ ] Efectos de sonido propios (pop, bufido, ronroneo) grabados o generados con ffmpeg/sox, libres.
- [ ] `anv edit --carrusel`: exportar 1080x1350 para carruseles de Instagram desde un guion de viñetas.
- [ ] `anv edit --story`: variante con el personaje más grande y texto más arriba para Stories.
- [ ] Probar los modos (`propuestas-modos/`) en el render: copiar los SVG de un modo y ver que los filtros se vean bien con sharp.
- [ ] Revisar que el texto en pantalla con tildes y "¿¡" se vea bien en Windows y Mac (fontconfig con la fuente del repo).

## P2: publicación y medición

- [ ] Probar la **YouTube Data API** (gratis): proyecto en Google Cloud + OAuth, subir en privado como prueba. **[Nicolas]** crea el proyecto y pasa el client secret como variable de entorno (no al repo).
- [ ] Probar la **Instagram Graph API / Facebook** (gratis): app en Meta for Developers, cuenta profesional vinculada a página. **[Nicolas]** crea la app.
- [ ] Probar la **TikTok Content Posting API** (gratis, requiere revisión de la app). Mientras tanto: TikTok Studio con programación.
- [ ] `anv publish` con APIs reales cuando las anteriores funcionen, siempre detrás del archivo `APROBADO`.
- [ ] Planilla simple de métricas por video (`content/metricas.csv`): vistas, likes, comentarios a las 24 h y a los 7 días.

## P3: personajes y universo

- [ ] **[Nicolas]** Confirmar diseño y voz de Choripán, Medialuna y Fernet (hoy están en boceto con voces provisorias en `personajes/`).
- [ ] Poses por personaje (de perfil izquierda/derecha, dormido, enojado, sorprendido) como SVG separados; pedirlas en el repo de arte.
- [ ] Stickers para WhatsApp/Telegram desde los SVG (`anv stickers`).
- [ ] Un video de presentación por amigo.

## P4: experimentos

- [ ] 3D por código sin GPU: three.js con renderizado por software (o Chromium headless con Playwright) para un modo "juguete" real. Guardar en `experimentos/3d/`. Solo si no bloquea la producción 2D.
- [ ] Lip-sync básico: abrir y cerrar la boca según la energía del audio (ffmpeg `astats` por fotograma).
- [ ] Animación de pixel art con los sprites originales de 32x32 (ya existen 29 cuadros en el repo de arte).

## Herramientas pagas que podrían valer la pena (no se usan sin ok de Nicolas)

| Herramienta | Para qué | Costo aprox. | Por qué podría valer |
|---|---|---|---|
| Ninguna por ahora | — | — | El flujo completo corre con herramientas gratis. Se anota acá si aparece algo. |

## Hecho

- 2026-10-27: subtítulos de la voz palabra por palabra (grupos de 3, palabra que suena en amarillo) y pop de entrada en cada escena. Se desactivan con `"subtitulos": false` en el guion o la escena.

- 2026-10-27: base del proyecto: `docs/`, `agents/`, CLI `anv` (trend, script, voice, render, edit, publish, estado), `personajes/`, SVG copiados del repo de arte, reel de prueba `2026-10-27-presentacion` generado de punta a punta con voz TTS y marca de agua.
