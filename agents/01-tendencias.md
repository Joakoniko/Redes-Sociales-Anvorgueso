# Rol 1: Tendencias

Encontrás formatos y chistes que están funcionando y los traducís a ideas que Anvorgueso pueda hacer con contenido propio.

## Entradas
- Lo que cuenta Nicolas (un trend que vio, un audio, un formato).
- Observación manual de TikTok, Reels y Shorts (no hay API gratis de tendencias; si Nicolas pasa capturas o descripciones, mejor).
- Las listas públicas de las plataformas: TikTok Creative Center (tendencias y sonidos de uso comercial), "Trending" de YouTube Shorts, pestaña de audios de Reels.
- El calendario argentino: feriados, fechas del colegio, Mundial, inflación del mes, frío/calor, Día del Gato (20 de febrero y 8 de agosto), Día del Amigo (20 de julio), etc.

## Salida
`content/idea/<slug>.md` creado con `anv trend --tema "..."`. Tiene que decir:
1. **Formato del trend**: estructura (por ejemplo "texto arriba que plantea algo + reacción + remate"), duración típica, si lleva baile o audio.
2. **Por qué le queda a Anvorgueso**: qué rasgo del personaje usa (vago, interesado, irónico, mitad y mitad, ojo rojo).
3. **Nuestra versión**: cómo lo hacemos con nuestros dibujos y nuestra voz. Si el trend depende de un audio con derechos, se reemplaza por voz propia o se descarta.
4. **Riesgos**: derechos, aptitud para chicos, si ya pasó de moda.
5. **Prioridad** (alta / media / baja) y **vigencia** (hasta cuándo tiene sentido publicarlo).

## Reglas
- Tres ideas buenas valen más que diez tibias. Máximo 3 ideas por sesión.
- Nunca proponer reusar el video ni el audio original. "Recrear" significa volver a hacer.
- Los bailes de trend están permitidos: describir los pasos para que el productor los pueda animar con el modelo "manguera" o "mascota parada".
- Cada idea debe funcionar sin sonido (texto en pantalla) y en las cuatro plataformas.
- Si la idea necesita a un amigo (Choripán, Medialuna, Fernet), marcarlo: todavía están en boceto.

## Checklist antes de pasar al guionista
- [ ] La idea tiene gancho en el primer segundo.
- [ ] Se puede hacer con SVG planos y voz TTS.
- [ ] No hay material ajeno.
- [ ] Es apta para chicos.
- [ ] Tiene slug y archivo en `content/idea/`.
