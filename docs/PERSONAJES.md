# PERSONAJES.md: Anvorgueso y sus amigos

Catálogo de personajes del universo @anvorgueso.cat. El arte fuente vive en el repo `Joakoniko/Anvorgueso.cat` (carpetas `propuestas-modelos/` y `propuestas-modos/`, en la rama de propuestas de octubre de 2026). En este repo hay una copia de los SVG en `assets/personajes/` para que el CLI pueda renderizar sin depender del otro repo.

Cada personaje tiene un archivo de configuración en `personajes/<id>.json` con su paleta, sus modelos disponibles, su voz TTS y su rol. El CLI lee esos archivos: para sumar un personaje nuevo alcanza con agregar el JSON y sus SVG.

## Anvorgueso (protagonista)

- **Id:** `anvorgueso`
- **Qué es:** gato doméstico chiquito, cabezón, mitad verde (izq.) y mitad rosa (der.), ojo rojo dentado del lado verde, cola rosa. Ficha completa en [BRAND.md](BRAND.md).
- **Personalidad:** irónico, tierno, vago con orgullo, interesado (siempre pide atún), rencoroso de mentira (lleva un "diario de agravios"), digno ("no ronroneo para cualquiera").
- **Voz TTS:** `es-AR-TomasNeural` (edge-tts, acento argentino) con tono un poco más agudo. Respaldo offline: Piper en español.
- **Rol en los videos:** el que opina, se burla y cierra el chiste.

### Modelos (cuerpos)

Dieciséis cuerpos propuestos. Todos conservan los colores, la división, el ojo rojo y la cola rosa. **Todavía ninguno está elegido como definitivo**: hasta que Nicolas decida, el CLI usa `09-mascota-parada` como modelo principal (el recomendado en las propuestas) y `01-mochi` para reacciones en primer plano.

| Archivo | Nombre | Cómo es | Para qué sirve |
|---|---|---|---|
| `01-mochi` | Mochi | Una sola masa redonda, sin cuello, patitas mínimas. El más tierno y fácil de animar. | Reacciones rápidas, loops cortos, audios tiernos. |
| `02-estatua` | Estatua | Sentado erguido, flaco y alto, cola rodeando las patas, aire de superioridad. | Trends de juzgar, "POV: tu gato te mira". |
| `03-caja` | Caja | El gato es un cubo con cola en ángulo recto. | Transiciones (se abre la caja) y chistes de gato puro. |
| `04-fideo` | Fideo | Gato "líquido" estirado cuando lo alzan. | "Cuando me alzan", estiramientos, "¡Bajame!". |
| `05-bola-de-pelo` | Bola de pelo | Pelota esponjosa con la carita en el medio. | "Recién levantado", invierno, sustos. |
| `06-pera` | Pera | Cabeza chica, cuerpo de pera, bracitos sobre la panza. | Comida, mukbangs, reseñas. |
| `07-villano` | Villano | Todo ángulos, colmillos, cola en zigzag. | Trends de villano, storytimes dramáticos. |
| `08-bebe` | Bebé | Cabeza gigante, cuerpito mínimo, ojos enormes. | Trends tiernos, "POV: soy el más chiquito". |
| `09-mascota-parada` | Mascota parada | En dos patas, con brazos: saluda y sostiene un celular. El único que puede bailar y señalar texto. | Bailes, lip-sync, presentar cosas. **Modelo principal provisorio.** |
| `10-flotante` | Flotante | Fantasmita en una burbuja, sin patas. | Apariciones, transiciones mágicas, videos de noche. |
| `11-cucurucho` | Cucurucho | Cabeza redonda sobre cuerpo en punta, como un helado. | "Me caigo y me levanto", giros. |
| `12-musculoso` | Musculoso | Hombros anchos, torso en V, cabeza chiquita. | Gimnasio, "día de piernas", antes y después. |
| `13-pasarela` | Pasarela | Piernas larguísimas, manos en la cintura. | Outfits, desfiles, cámara lenta. |
| `14-persa` | Persa | Peludísimo, cara chata y de ofendido. | "No me hablen", quejas, glamour. |
| `15-manguera` | Manguera | Porotito con brazos y piernas de manguera, estilo dibujo animado viejo. | Coreografías y bailes exagerados. |
| `16-senor-sentado` | Señor sentado | En el sillón con el control remoto y la panza afuera. | Domingo, reacciones mirando la tele, comentarista. |

### Modos (materiales)

Los mismos 16 modelos con distinto acabado. Se eligen por video, no por personaje. Carpetas en `propuestas-modos/` del repo de arte:

| Carpeta | Modo | Cuándo usarlo |
|---|---|---|
| `01-anime` | Sombra de celda, brillo en el borde, ojos con reflejo | Trends de anime, dramatismo. |
| `02-juguete-3d` | Volumen y brillo de vinilo (falso 3D en SVG) | Cuando se quiere ver "más producido" sin 3D real. |
| `03-peluche` | Felpa, borde peludo y costura al medio | Ternura, invierno, merch. |
| `04-plastilina` | Bordes blandos y huellas de dedos | Stop motion falso, manualidades. |
| `05-pixel-96` | Pixel art 96x96 (solo PNG) | Guiños retro, videojuegos, la app. |
| `06-recorte-papel` | Capas de papel con borde blanco y sombra | Storytimes, cuentos. |
| `07-boceto-lapiz` | Lápiz sobre hoja de cuaderno | "Detrás de escena", ideas, explicaciones. |
| `08-realismo` | Prompts para generadores de imagen (no hay SVG) | Solo con herramientas gratis y revisando que no cambie el diseño. |

Los modos con texturas usan filtros SVG. `sharp` (librsvg) los renderiza bien; si alguno sale raro, se usa el PNG exportado del repo de arte.

## Los amigos (en boceto)

Están dibujados en `propuestas-modelos/` como bocetos. Tienen configuración en `personajes/` pero todavía **no tienen voz definida ni poses**: antes de usarlos en un video hay que confirmar con Nicolas el diseño y elegirles una voz TTS.

| Id | Nombre | Qué es | Personalidad | Rol en los videos |
|---|---|---|---|---|
| `choripan` | Choripán | Perro salchicha disfrazado de pancho, con el pan como parte del cuerpo. | Bueno, lento, se cree todo. | El "normal" que recibe la broma en trends de a dos. |
| `medialuna` | Medialuna | Hámster dorado, redondo, con rayitas curvas y cachetes llenos. | Caótico, tierno, acumulador. | Energía de los videos que salen mal; "guardé esto para después". |
| `fernet` | Fernet | Paloma de plaza porteña, gris tornasolada, cadenita de oro. | Chusma, ya lo vio todo. | Comentarista de fondo y narrador de storytimes. |

Nicolas mencionó que habrá más amigos. La regla para sumar uno: nombre de comida o bebida argentina, un rasgo visual que se reconozca en 32 píxeles, un rol fijo que no se pise con los demás, y paleta propia que no use el verde ni el rosa de Anvorgueso como color principal.

## Cómo se arma un personaje nuevo

1. SVG de frente en `assets/personajes/<id>/<pose>.svg`, viewBox cuadrado, sin fondo (o con un `<rect>` de fondo al principio, que el CLI quita).
2. `personajes/<id>.json` con: `nombre`, `descripcion`, `paleta`, `modelos` (mapa pose → archivo), `modeloPrincipal`, `voz` (`edge`, `piper`, `rate`, `pitch`), `rol`.
3. Una línea en este documento y la decisión fechada en [DECISIONES.md](DECISIONES.md).
