# Consultoría Logística Gratis · Fénix Ventures

Formulario de calificación de Fénix Ventures, la vertical logística de Dropi.

**Estado: en producción (12-nov-2026).** Cada lead que deja sus datos queda en GHL y agenda con horarios reales.

- `functions/api/[[ruta]].js` es el portero, la única parte que habla con GHL. Corre en Cloudflare y la clave vive allá (`GHL2_TOKEN`), nunca en este repositorio.
  - `/api/lead`: crea o actualiza el contacto por WhatsApp sin pisar sus datos, le suma la etiqueta del subdominio (`formevon`, `formpmeta`…), deja la oportunidad de Setter 2.0 en "Requiere atención humana" con todas las respuestas en una nota y devuelve los horarios.
  - `/api/agendar`: vuelve a verificar el horario en GHL, crea la cita (consultor por ventas diarias, como Sofía), guarda `hora_local_cita` y pasa la oportunidad a "Agendado 📆".

- `index.html` (estructura y estilos) y `app.js` (preguntas, lógica y agenda) son todo el código, sin librerías externas.
- Pensada para cargar rápido: la portada baja unos 63 KB en total, con letras recortadas en WOFF2 e imágenes en WebP. Los íconos de las preguntas se precargan en segundo plano.
- No hay claves en este repositorio.

## Créditos

- Letra Museo 700: Jos Buivenga, [exljbris](https://www.exljbris.com).
- Letra Figtree: Erik Kennedy, licencia SIL Open Font License 1.1.
- Íconos: [Twemoji](https://github.com/jdecked/twemoji), licencia CC-BY 4.0.
- Los logos de Dropi, Effi, Hoko, MasterShop, Chatea Pro, Shopify, WhatsApp, Meta, TikTok y Google pertenecen a sus dueños y se usan solo para identificar cada plataforma.
