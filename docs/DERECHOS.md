# DERECHOS.md: marca, autoría y licencias

> **Aviso:** esto es una checklist de trabajo armada por el agente, no asesoría legal. Antes de presentar una marca, firmar algo o monetizar, conviene que un abogado o agente de la propiedad industrial lo revise. Las reglas, formularios y aranceles del INPI y de la DNDA cambian; verificar siempre en los sitios oficiales (argentina.gob.ar/inpi y argentina.gob.ar/justicia/derechodeautor).

## 1. Qué protegemos

| Qué | Cómo se protege | Dónde |
|---|---|---|
| El nombre "Anvorgueso" y el usuario "@anvorgueso.cat" | Registro de marca | INPI (Instituto Nacional de la Propiedad Industrial), Argentina |
| El dibujo del personaje (logo / isologo) | Marca figurativa o mixta + derecho de autor | INPI + DNDA |
| Los dibujos, guiones, videos, SVG y el código | Derecho de autor (nace con la obra; el registro sirve como prueba) | DNDA (Dirección Nacional del Derecho de Autor) |
| Los amigos (Choripán, Medialuna, Fernet) | Igual que el personaje principal, cuando el diseño esté definido | INPI + DNDA |

## 2. Checklist de registro de marca en INPI Argentina

- [ ] **Búsqueda de antecedentes.** Buscar "Anvorgueso" y variantes (sin la V, con tilde, con "cat") en el buscador público del INPI y en Google, TikTok, Instagram, YouTube y dominios `.com.ar` / `.ar`. Anotar resultados y fecha.
- [ ] **Elegir clases (Clasificación de Niza).** Candidatas: **41** (entretenimiento, contenido audiovisual en línea), **9** (software, aplicaciones, contenido digital descargable), **35** (publicidad, promoción, gestión de redes), **16** (impresos, stickers, papelería), **25** (ropa) y **28** (juguetes, peluches) si se piensa en merch. Cada clase es una solicitud y un arancel aparte; se puede empezar por 41 y 9 y sumar después.
- [ ] **Decidir tipo de marca.** Denominativa ("ANVORGUESO" en letras), figurativa (el dibujo) o mixta (nombre + dibujo). La denominativa protege más el nombre; la mixta protege el conjunto. Lo más común es presentar la denominativa primero.
- [ ] **Titular.** Nicolas como persona física (CUIT/CUIL). Si algún día hay sociedad, se transfiere.
- [ ] **Imagen de la marca** (si es figurativa o mixta): PNG o JPG nítido, fondo blanco, según los requisitos del portal.
- [ ] **Presentación online.** Se hace con usuario del Portal de Trámites del INPI (clave fiscal nivel 2 o 3 de AFIP/ARCA). Formulario, clase, descripción de productos/servicios, pago del arancel.
- [ ] **Pago del arancel.** Verificar el monto vigente en el sitio del INPI. Guardar comprobante.
- [ ] **Seguimiento.** Publicación en el Boletín de Marcas, plazo de oposiciones (30 días corridos desde la publicación), posibles vistas o observaciones. Responder en término.
- [ ] **Concesión.** El registro dura 10 años y se renueva. Entre el 5.º y el 6.º año hay que presentar la declaración jurada de uso.
- [ ] **Mientras tanto:** usar "™" junto al nombre es opcional; "®" solo cuando la marca esté concedida.

## 3. Prueba de autoría (quién lo hizo y cuándo)

El derecho de autor nace al crear la obra, pero hay que poder demostrar fecha y autoría si alguien copia.

- [ ] **Repositorios con historial.** Los commits firmados con fecha en `Joakoniko/Anvorgueso.cat` y en este repo ya son una traza. No reescribir historial de las ramas principales.
- [ ] **Registro en la DNDA.** Para obra inédita (dibujos, personaje, guiones, software) se presenta un formulario, una copia de la obra y el arancel. Da fecha cierta con validez oficial. Se puede registrar un "pack" con la ficha del personaje, la hoja de referencia y los SVG.
- [ ] **Depósito digital alternativo o complementario.** Guardar un ZIP con todo el arte + `FICHA.md` + este documento, calcular su hash SHA-256 y guardarlo en varios lugares (correo enviado a uno mismo, nube, repo). Es barato y ayuda, aunque vale menos que el registro oficial.
- [ ] **Archivos fuente.** Conservar los SVG, los sprites de 32x32, los guiones y los proyectos de edición. El archivo final (mp4) sin la fuente es más difícil de defender.
- [ ] **Créditos consistentes.** Siempre "@anvorgueso.cat" en la marca de agua y en la bio de cada red: "Personaje original de Nicolas (Joakoniko)".

## 4. Qué pasa con las inspiraciones

El diseño toma la idea de dos colores y de un ojo raro de personajes de otras franquicias. La regla de este proyecto: Anvorgueso es un dibujo propio, no se nombran esas marcas en los posteos ni se copian sus diseños, logos o frases. Lo mismo para las parodias de `propuestas-diseno/`: dibujo original siempre, y cualquier uso comercial de una parodia (merch, publicidad paga) se revisa aparte.

## 5. Lo que usamos de terceros (licencias)

| Recurso | Licencia | Uso permitido |
|---|---|---|
| ffmpeg | LGPL/GPL | Herramienta; no afecta la licencia de los videos. |
| sharp / libvips / librsvg | Apache 2.0 / LGPL | Herramienta. |
| edge-tts (voz de Microsoft Edge) | Servicio gratuito no oficial; las voces son de Microsoft | Revisar los términos antes de monetizar fuerte. Si se vuelve un problema, pasar a Piper. |
| Piper TTS y sus voces | MIT (motor); cada voz tiene su licencia (ver el `.onnx.json`) | Uso libre en general; verificar la voz elegida. |
| Fuente DejaVu Sans | Licencia Bitstream Vera (libre, redistribuible) | Texto en pantalla y marca de agua. |
| Fuente Inter (opcional) | SIL Open Font License | Texto en pantalla. |
| Música | Solo CC0, CC-BY (con crédito en la descripción) o bibliotecas de uso comercial de la propia plataforma | Guardar en `content/<slug>/` el nombre, autor, licencia y enlace de cada pista. |

Nunca: clips de películas, series, programas, canciones comerciales, fotos de personas reales o memes con derechos, aunque sea "un pedacito".

## 6. Usuario y dominio

- [ ] Reservar `@anvorgueso.cat` (o la variante disponible más cercana, igual en todas) en TikTok, Instagram, YouTube, Facebook, X y Threads, aunque no se usen todavía.
- [ ] Evaluar el dominio `anvorgueso.cat` (el `.cat` es un dominio catalán que exige vínculo con la lengua o cultura catalana; puede no ser viable) y alternativas: `anvorgueso.com.ar`, `anvorgueso.ar`, `anvorgueso.com`.

## 7. Contenido y plataformas

- Leer las normas de cada plataforma sobre contenido con personajes animados y sobre contenido para menores. Si la cuenta se marca como "para niños" en YouTube cambian los comentarios y la monetización: decidirlo a propósito.
- Etiquetar como contenido con IA solo si la plataforma lo exige para voz sintética (TikTok y YouTube tienen opciones de divulgación). Anotar en `DECISIONES.md` qué se decidió.
