# Consultoría Logística Gratis · Fénix Ventures

Formulario de calificación de Fénix Ventures, la vertical logística de Dropi.

**Estado: en producción (12-nov-2026).** Cada lead que deja sus datos queda en GHL, aunque no toque el botón final (se guarda al salir o tras 40 s sin escribir), y agenda con horarios reales.

- **Direcciones por fuente** (desde el 13-nov-2026): form, form-p-meta, form-p-tiktok, form-p-google, form-ig, form-tkt, form-lkd, form-dropi, form-ref, form-ev-on y form-ev-fis `.fenixventures.co`. Las viejas sin guion (formevon…) siguen activas y `functions/index.js` las lleva a la nueva (301, con UTM). Así sigue funcionando el QR del video, que apunta a formevon. La etiqueta de GHL es exactamente el prefijo nuevo.
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
- Los logos de Dropi, Effi, Hoko, MasterShop, Chatea Pro, LucidBot, LiliBot, Pancake, SellerChat, Icomfly, Shopify, WhatsApp, Meta, TikTok y Google pertenecen a sus dueños y se usan solo para identificar cada plataforma. Los de los chatbots se tomaron de sus sitios oficiales (el de LiliBot, de su canal de YouTube) y se pasaron a WebP de 64 px.
- Animación de Dropi (`logos/dropi-afirma.webp`): un ciclo de la animación oficial «Afirmación naranja» de Dropi, entregada por Daniel el 13-nov-2026, reducido a 25 cuadros por segundo con una pausa de 1,7 s antes de repetir; `dropi-afirma-quieto.webp` es su primer cuadro, para quien pide menos movimiento.
