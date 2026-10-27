# personajes/

Un JSON por personaje. El CLI descubre los modelos (SVG) en la carpeta indicada en `carpeta`. Campos:

| Campo | Qué es |
|---|---|
| `nombre`, `rol`, `descripcion` | Para los guiones y para la documentación. |
| `estado` | `activo` o `boceto`. Los bocetos generan un aviso al validar el guion. |
| `carpeta` | Dónde están los SVG (relativa a la raíz del repo). Cada `.svg` es un modelo o pose. |
| `modeloPrincipal` | Modelo por defecto cuando el guion no dice cuál. |
| `fondoPorDefecto` | Nombre de la paleta de fondos de `src/config.js`. |
| `paleta` | Colores oficiales, para referencia y para fondos. |
| `voz` | `edge` (voz de edge-tts), `edgeRate`, `edgePitch`, `piper` (`auto` o nombre de voz) y `piperLengthScale` (menor = más rápido). |
| `tono` | Recordatorios para el guionista. |

Más detalle en `docs/PERSONAJES.md`.
