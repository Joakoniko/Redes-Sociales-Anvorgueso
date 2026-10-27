# DECISIONES.md: registro de decisiones

Una entrada por decisión, con fecha, qué se decidió, por qué y qué alternativas quedaron afuera. Las decisiones las toma Nicolas; las que toma el agente son **provisorias** y se marcan como tal hasta que Nicolas las confirme.

Formato: `## AAAA-MM-DD — Título` seguido de **Decisión**, **Por qué**, **Alternativas**, **Estado** (confirmada por Nicolas / provisoria del agente).

---

## 2026-10-27 — Alcance y reglas base del proyecto
**Decisión:** Anvorgueso publica como @anvorgueso.cat en TikTok, Instagram (Reels, Stories, carruseles), YouTube Shorts y Facebook. Solo herramientas gratis. Nada se publica sin aprobación de Nicolas. Recrear trends con contenido propio; bailes permitidos; nunca reusar video ni audio ajeno con derechos; marca de agua en todo.
**Por qué:** indicaciones de Nicolas al crear el proyecto.
**Estado:** confirmada por Nicolas.

## 2026-10-27 — Un solo agente admin, roles en secuencia
**Decisión:** un solo agente (Claude en este repo) ejecuta los roles de `agents/` en orden: tendencias → guionista → voz → productor → editor → publicador. Sin agentes en paralelo.
**Por qué:** cuidar tokens y evitar trabajo duplicado mientras el flujo se estabiliza.
**Estado:** confirmada por Nicolas.

## 2026-10-27 — Stack técnico
**Decisión:** Node.js (≥ 18, sin framework) para el CLI `anv`; `sharp` para rasterizar SVG y componer fotogramas; `ffmpeg` para unir, poner marca de agua y exportar; TTS con `edge-tts` (voz `es-AR-TomasNeural`) y respaldo offline con Piper.
**Por qué:** todo gratis y multiplataforma; `sharp` trae librsvg incluido (no hace falta Inkscape); ffmpeg ya es el estándar. edge-tts es la voz gratis con acento argentino de mejor calidad; Piper funciona sin internet.
**Alternativas:** Remotion (más pesado y con licencia para empresas), Puppeteer para renderizar HTML (más lento), Coqui TTS (muy pesado), gTTS (no tiene voz argentina).
**Estado:** provisoria del agente.

## 2026-10-27 — Orden de los pasos: la voz antes del render
**Decisión:** el flujo recomendado es guion → voz → render → edición, porque la duración de cada escena se toma del audio generado. Si se corre `render` sin voz, usa la duración escrita en el guion y `edit` arma el audio igual.
**Por qué:** evita recortar frases o dejar silencios.
**Estado:** provisoria del agente.

## 2026-10-27 — Modelo provisorio del personaje
**Decisión:** hasta que Nicolas elija el modelo definitivo, el CLI usa `09-mascota-parada` como cuerpo principal y `01-mochi` para primeros planos de reacción. Los 16 modelos y los 3 amigos están copiados en `assets/personajes/` desde la rama de propuestas del repo de arte.
**Por qué:** "mascota parada" es el único que puede bailar y señalar texto, y la página de propuestas lo recomienda como principal; "mochi" es el más fácil de animar con rebote.
**Estado:** provisoria del agente. **Pendiente: Nicolas elige modelo y modo definitivos.**

## 2026-10-27 — Marca de agua
**Decisión:** texto "@anvorgueso.cat" (dibujado con sharp en `anv render`, ver la entrada siguiente) en DejaVu Sans Bold, blanco con sombra, al 85 % de opacidad, arriba a la izquierda (x = 48 px, y = 150 px), fuera de la interfaz de TikTok e Instagram. Configurable en `src/config.js`.
**Por qué:** la zona superior izquierda queda libre en las tres apps; abajo y a la derecha tapan la interfaz.
**Estado:** provisoria del agente.

## 2026-10-27 — Publicación sin API por ahora
**Decisión:** `anv publish` no sube nada. Verifica la aprobación de Nicolas (archivo `APROBADO` en `content/listo/<slug>/`) y genera las instrucciones para subir a mano o programar en Meta Business Suite, TikTok Studio y YouTube Studio.
**Por qué:** las APIs gratis existen (Instagram Graph API, YouTube Data API, TikTok Content Posting API) pero exigen cuentas de empresa, apps aprobadas y revisión; se prueban cuando haya contenido y cuentas creadas (ver TODO).
**Estado:** confirmada por Nicolas en las reglas ("primero probás las APIs gratis; si no, lo dejás listo para Meta Business Suite").

## 2026-10-27 — Qué se versiona de `content/`
**Decisión:** se versionan ideas, guiones, `caption.txt`, `meta.json`, `PUBLICAR.md` y registros. No se versionan fotogramas, WAV, MP3 ni MP4, salvo el reel de prueba inicial que se guarda como referencia.
**Por qué:** mantener el repo liviano; todo se regenera desde el guion.
**Estado:** provisoria del agente.

## 2026-10-27 — Reel de prueba con voz de respaldo
**Decisión:** el primer reel (`2026-10-27-presentacion`) se generó con Piper (voz `es-carlfm-x-low`, español de España) porque el entorno donde se armó no tiene salida a los servidores de edge-tts. En la computadora de Nicolas, `anv voice` vuelve a generar la voz argentina.
**Por qué:** demostrar el flujo de punta a punta sin bloquearse por la red.
**Estado:** provisoria del agente.

## 2026-10-27 — Subtítulos de la voz
**Decisión:** todo video con voz lleva subtítulos abajo (y = 1440 px), de a 3 palabras, con la palabra que suena en amarillo `#FFE63C`. Los tiempos se estiman repartiendo la duración real del audio según el largo de cada palabra. Se apagan con `"subtitulos": false`.
**Por qué:** mucha gente mira sin sonido y los subtítulos dinámicos retienen más. La estimación funciona con Piper, que no da tiempos por palabra.
**Estado:** provisoria del agente.

## 2026-10-27 — Marca de agua con sharp, no con drawtext
**Decisión:** la marca de agua se dibuja en cada fotograma durante `anv render` con sharp, y `anv edit` verifica que esté antes de exportar. Ya no se usa el filtro `drawtext` de ffmpeg.
**Por qué:** el ffmpeg de Homebrew en la Mac de Nicolas no trae `drawtext` (falla con "No such filter"). Con sharp funciona con cualquier ffmpeg.
**Estado:** provisoria del agente.

## 2026-10-27 — Voz un poco más rápida
**Decisión:** `es-AR-TomasNeural` a +15 % de velocidad (antes +8 %) y frases del reel de prueba acortadas, porque con la voz argentina el reel duraba 18,5 s y una escena pasaba los 5 s.
**Estado:** provisoria del agente.

## 2026-10-27 — No versionar lo generado
**Decisión:** no se versiona nada de `content/render/` ni lo generado en `content/listo/` (salvo `caption.txt` y `APROBADO`). Se deja de guardar el reel de prueba en el repo.
**Por qué:** esos archivos se regeneran en la compu de Nicolas y hacían fallar `git pull`; además el mp4 viejo (voz de respaldo) quedaba como si fuera el nuevo.
**Estado:** provisoria del agente. Reemplaza "Qué se versiona de content/".
