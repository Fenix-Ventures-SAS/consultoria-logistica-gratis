# Consultoría Logística Gratis · Fénix Ventures

Formulario de calificación de Fénix Ventures, la vertical logística de Dropi.

**Estado: en producción (12-nov-2026).** Cada lead que deja sus datos queda en GHL, aunque no toque el botón final (se guarda al salir o tras 40 s sin escribir), y agenda con horarios reales.

- `functions/api/[[ruta]].js` es el portero, la única parte que habla con GHL. Corre en Cloudflare y la clave vive allá (`GHL2_TOKEN`), nunca en este repositorio.
  - `/api/lead`: crea o actualiza el contacto por WhatsApp sin pisar sus datos, le suma la etiqueta del subdominio (`formevon`, `formpmeta`…), deja la oportunidad de Setter 2.0 en "Requiere atención humana" con todas las respuestas en una nota y devuelve los horarios.
  - `/api/agendar`: vuelve a verificar el horario en GHL, crea la cita (consultor por ventas diarias, como Sofía), guarda `hora_local_cita` y pasa la oportunidad a "Agendado 📆".

- `index.html` (estructura y estilos) y `app.js` (preguntas, lógica y agenda) son todo el código, sin librerías externas.
- Pensada para cargar rápido: la portada baja unos 63 KB en total, con letras recortadas en WOFF2 e imágenes en WebP. Los íconos de las preguntas se precargan en segundo plano.
- **Medición del recorrido:** la página manda a `/api/evento` cada pantalla, respuesta, aviso de error, toque fuera de botón y salida, sin datos personales. Todo queda en la base D1 `fenix-formulario-visitas` (enlace `DB`), y cada visita se une al contacto de GHL cuando deja sus datos.
- **Panel privado:** `/panel` muestra el embudo, dónde se va la gente, las respuestas, los tiempos y el recorrido de cada persona. Pide la clave `PANEL_KEY` guardada en Cloudflare.
- **Anti-robots:** Turnstile de Cloudflare, en modo "managed" con `interaction-only`, así casi nadie lo ve. Se exige en cuanto exista `TURNSTILE_SECRET`.
- No hay claves en este repositorio.

## Créditos

- Letra Museo 700: Jos Buivenga, [exljbris](https://www.exljbris.com).
- Letra Figtree: Erik Kennedy, licencia SIL Open Font License 1.1.
- Imágenes 3D de las respuestas: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft, licencia MIT (reducidas a WebP de 120 px; personas y manos en tono de piel medio claro; el apretón de manos, que solo existe en amarillo, se recoloreó a ese mismo tono).
- Dedito del deslizador: [Twemoji](https://github.com/jdecked/twemoji), licencia CC-BY 4.0.
- Los logos de Dropi, Effi, Hoko, MasterShop, Chatea Pro, Shopify, WhatsApp, Meta, TikTok y Google pertenecen a sus dueños y se usan solo para identificar cada plataforma.
