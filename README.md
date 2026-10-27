# Redes Sociales Anvorgueso

Producción de contenido para **@anvorgueso.cat**, el gato influencer virtual mitad verde y mitad rosa. Acá viven la documentación de marca, las instrucciones de cada rol del flujo y el CLI `anv` que convierte un guion en un reel vertical con voz y marca de agua, usando solo herramientas gratis.

El arte del personaje está en [Joakoniko/Anvorgueso.cat](https://github.com/Joakoniko/Anvorgueso.cat).

## Empezar

Requisitos: Node ≥ 18, `ffmpeg` y `ffprobe`, Python 3.

```bash
npm install
npm test
node bin/anv.js --help              # o: npm link && anv --help
```

## Voz (Python)

Las voces gratis (edge-tts y Piper) se instalan en un entorno virtual dentro del repo. El CLI lo usa solo si existe la carpeta `.venv`. Piper todavía no funciona con Python 3.14 o más nuevo, por eso se usa 3.12:

```bash
brew install python@3.12            # en Mac; en Windows: winget install Python.Python.3.12
python3.12 -m venv .venv
.venv/bin/pip install edge-tts piper-tts
```

## El flujo en seis comandos

```bash
anv trend --tema "POV: tu gato te juzga por el delivery"   # content/idea/<slug>.md
anv script <slug>                                           # content/guion/<slug>.json (y --check para validar)
anv voice <slug>                                            # content/render/<slug>/voz/
anv render <slug>                                           # content/render/<slug>/video-mudo.mp4
anv edit <slug>                                             # content/listo/<slug>/<slug>.mp4 con marca de agua
anv publish <slug>                                          # verifica la aprobación de Nicolas y da las instrucciones
```

`anv estado` muestra en qué paso está cada video. El reel de prueba se regenera con `npm run prueba:reel`.

## Dónde está cada cosa

- `docs/`: [BRAND](docs/BRAND.md), [PERSONAJES](docs/PERSONAJES.md), [FLUJO](docs/FLUJO.md), [DERECHOS](docs/DERECHOS.md), [DECISIONES](docs/DECISIONES.md).
- `agents/`: instrucciones de cada rol (un solo admin los corre en orden).
- `personajes/` y `assets/personajes/`: configuración y SVG de Anvorgueso y sus amigos.
- `content/`: idea → guion → render → listo → publicado.
- `TODO.md`: prioridades. `CLAUDE.md`: reglas para el agente.

## Reglas cortas

Solo herramientas gratis. Nada se publica sin la aprobación de Nicolas. Nunca video ni audio ajeno con derechos. Marca de agua en todo. Apto para chicos. Verde a la izquierda, rosa a la derecha, ojo rojo del lado verde, cola rosa.
