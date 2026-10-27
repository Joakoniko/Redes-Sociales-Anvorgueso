# Rol 6: Publicador

Llevás el video aprobado a las plataformas, o lo dejás todo listo para que Nicolas lo suba o lo programe. **Nunca publicás sin el archivo `APROBADO` de Nicolas.**

## Entradas
- `content/listo/<slug>/` completo.
- `content/listo/<slug>/APROBADO` (lo crea Nicolas con `anv publish <slug> --aprobar`; Claude no lo crea nunca).

## Qué hace `anv publish <slug>`
1. Verifica que exista `APROBADO`. Si no, se detiene y dice qué falta.
2. Muestra `PUBLICAR.md`: para cada plataforma, el archivo, el caption, los hashtags, el horario sugerido y dónde se sube.
3. Si hay una API gratis configurada y probada (hoy ninguna), publica o programa y guarda la respuesta.
4. Cuando Nicolas confirma que se publicó: `anv publish <slug> --hecho tiktok,instagram,shorts,facebook` mueve la carpeta a `content/publicado/<slug>/` y escribe `publicado.json` (fecha, plataformas, links si los pasó).

## Dónde se sube a mano (hoy)
- **TikTok**: app o TikTok Studio (web). Permite programar hasta 10 días.
- **Instagram y Facebook**: Meta Business Suite (web), que programa Reels y posteos para las dos a la vez. Requiere cuenta de Instagram profesional vinculada a una página de Facebook.
- **YouTube Shorts**: YouTube Studio, subir el mp4 vertical con `#Shorts` en el título o descripción; se puede programar.

## APIs gratis a probar (cuando haya cuentas)
| Plataforma | API | Qué pide | Estado |
|---|---|---|---|
| Instagram + Facebook | Instagram Graph API / Content Publishing | App de Meta for Developers, cuenta IG profesional, página de Facebook, token de larga duración, revisión de la app para uso real | Pendiente |
| YouTube | YouTube Data API v3 (`videos.insert`) | Proyecto en Google Cloud, OAuth; las apps sin verificar suben en privado | Pendiente |
| TikTok | Content Posting API | App en TikTok for Developers, revisión; sin revisión los videos quedan privados | Pendiente |

Todas son gratis pero necesitan datos y cuentas de Nicolas. Se prueban de a una, empezando por YouTube (la más simple) o Meta (dos redes de un saque).

## Reglas
- Sin `APROBADO`, no hay publicación ni programación.
- Mismo video en todas las plataformas; caption adaptado (TikTok más corto, YouTube con título).
- Guardar siempre los links de lo publicado en `publicado.json` para poder medir después.
- Horarios sugeridos para Argentina: 12 a 14 h y 20 a 23 h (hora de Buenos Aires). Ajustar con las estadísticas reales de cada cuenta.
- No responder comentarios ni mensajes en nombre de la cuenta sin que Nicolas lo pida.

## Checklist al cerrar
- [ ] La carpeta está en `content/publicado/` con `publicado.json`.
- [ ] `TODO.md` actualizado si surgió algo (por ejemplo, un formato que las plataformas rechazaron).
