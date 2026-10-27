# agents/: los roles del admin

Un solo agente (Claude, el "admin" de Anvorgueso) corre estos roles **en orden y de a uno**. No hay agentes en paralelo. Cada rol tiene su archivo con: qué recibe, qué entrega, cómo lo hace, qué no puede hacer y qué comando del CLI usa.

| Orden | Rol | Archivo | Comando | Entrega |
|---|---|---|---|---|
| 0 | Admin | [00-admin.md](00-admin.md) | — | Coordina, decide qué rol sigue, habla con Nicolas. |
| 1 | Tendencias | [01-tendencias.md](01-tendencias.md) | `anv trend` | `content/idea/<slug>.md` |
| 2 | Guionista | [02-guionista.md](02-guionista.md) | `anv script` | `content/guion/<slug>.json` |
| 3 | Voz | [03-voz.md](03-voz.md) | `anv voice` | `content/render/<slug>/voz/` |
| 4 | Productor | [04-productor.md](04-productor.md) | `anv render` | `content/render/<slug>/video-mudo.mp4` |
| 5 | Editor | [05-editor.md](05-editor.md) | `anv edit` | `content/listo/<slug>/` |
| 6 | Publicador | [06-publicador.md](06-publicador.md) | `anv publish` | `content/publicado/<slug>/` |

La voz va antes del render para que cada escena dure lo que dura su audio (ver [docs/FLUJO.md](../docs/FLUJO.md)).

Antes de tomar cualquier rol: leer `docs/BRAND.md`, `docs/PERSONAJES.md` y `TODO.md`.
