# Rol 4: Productor

Dibujás el video: fondo, personaje animado y texto en pantalla, en 1080x1920. Dos líneas de producción:

## 2D con SVG (la línea principal)
- Los SVG están en `assets/personajes/<id>/`. Vienen de `propuestas-modelos/` y `propuestas-modos/` del repo de arte. **No se editan a mano acá**: si hay que cambiar el diseño, se pide en el repo de arte.
- `anv render <slug>` rasteriza cada SVG con `sharp`, quita el rectángulo de fondo original, y compone fotogramas a 30 fps con:
  - fondo (paleta del personaje o color del guion),
  - personaje con la animación pedida (`quieto`, `rebote`, `habla`, `entrada`, `salida`, `baile`, `salto`, `temblor`),
  - texto en pantalla con tipografía grande, borde oscuro y zona segura (nada en los 250 px de abajo ni en los 120 px de la derecha),
- y une los fotogramas con ffmpeg en `content/render/<slug>/video-mudo.mp4`.
- La duración de cada escena sale de `voz/voz.json` (duración del audio + 0,4 s de aire). Si no hay voz, de `dur`.
- Las animaciones son transformaciones simples (posición, escala, rotación, aplastar/estirar). Para "habla" se alterna un aplastado leve al ritmo de la voz. Para los modelos con brazos (mascota parada, manguera) el baile mueve el cuerpo entero; más adelante se pueden separar partes del SVG.

## 3D experimental (por código, sin GPU)
- Línea opcional para thumbnails o un modo "juguete" real. Idea: three.js con un renderer por software (`three` + `canvas` o `headless-gl` si compila; si no, WebGL en Chromium headless con Playwright) que genera PNG por fotograma y entra al mismo paso de ffmpeg.
- Mientras no esté probado, es solo experimento: se hace en `experimentos/3d/` y no bloquea ningún video. Ver TODO.

## Reglas
- Verde a la izquierda, rosa a la derecha, ojo rojo del lado verde, cola rosa. **Nunca espejar** un SVG del personaje: para que mire al otro lado se usa otra pose.
- Zona segura: texto y personaje dentro del rectángulo central (márgenes de 100 px a los lados, 220 px arriba, 300 px abajo). El render también dibuja la marca de agua `@anvorgueso.cat` en cada fotograma.
- Fondos lisos o con un degradé suave; el personaje tiene que leerse en un celular chico.
- No se versionan los fotogramas (`frames/`). Se regeneran desde el guion.
- Todo lo que aparezca en pantalla es nuestro (dibujo propio o SVG del repo de arte). Sin fotos ni imágenes bajadas de internet.

## Checklist antes de pasar al editor
- [ ] `video-mudo.mp4` existe, es 1080x1920, 30 fps, dura la suma de las escenas.
- [ ] El texto se lee entero en cada escena y no toca los bordes.
- [ ] El personaje está completo (no cortado) y con los colores del lado correcto.
- [ ] Si hubo voz, cada escena dura lo que su audio.
