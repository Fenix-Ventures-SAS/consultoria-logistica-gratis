# Consultoría Logística Gratis · Fénix Ventures

Formulario de calificación de Fénix Ventures, la vertical logística de Dropi.

**Estado: en producción (12-nov-2026).** Cada lead que deja sus datos queda en GHL, aunque no toque el botón final (se guarda al salir o tras 40 s sin escribir), y agenda con horarios reales.

- **Direcciones por fuente** (desde el 13-nov-2026): form, form-p-meta, form-p-tiktok, form-p-google, form-ig, form-tkt, form-lkd, form-dropi, form-ref, form-ev-on y form-ev-fis `.fenixventures.co`. Las viejas sin guion (formevon…) siguen activas y `functions/index.js` las lleva a la nueva (301, con UTM). Así sigue funcionando el QR del video, que apunta a formevon. La etiqueta de GHL es exactamente el prefijo nuevo.
- `functions/api/[[ruta]].js` es el portero, la única parte que habla con GHL. Corre en Cloudflare y la clave vive allá (`GHL2_TOKEN`), nunca en este repositorio.
  - `/api/lead`: crea o actualiza el contacto por WhatsApp sin pisar sus datos, le suma la etiqueta del subdominio (`formevon`, `formpmeta`…), deja la oportunidad de Setter 2.0 en "Requiere atención humana" con todas las respuestas en una nota y devuelve los horarios.
  - `/api/agendar`: vuelve a verificar el horario en GHL, crea la cita (consultor por ventas diarias, como Sofía), guarda `hora_local_cita` y pasa la oportunidad a "Agendado 📆".
    - **Invitados:** si el lead dejó el correo de su socio o de otra persona, van como invitados (`guests`) de la misma cita.
      - Los 5 calendarios de los consultores tienen encendido «Añadir invitados», con nombre y correo, desde el 13-nov-2026.
      - GHL crea o reutiliza un contacto por cada invitado y lo pone en el evento de Google del consultor, así que le llega la invitación de Google con el Meet.
      - El portero marca esos contactos con la etiqueta `invitado-consultoria` y una nota. Es lo único que corre después de responderle al lead.
      - Los flujos de citas (SETTING 04B, 05, 06 y 08) están en «Contact only», así que a los invitados no les escribe el bot ni les llegan mensajes de GHL.
      - Si GHL rechaza la cita por los invitados, se crea sin ellos y la nota pide agregarlos a mano.

- `index.html` (estructura y estilos) y `app.js` (preguntas, lógica y agenda) son todo el código, sin librerías externas.
- **Logo animado de la portada** (`logos/fenix-anima.webp`, 180 KB):
  - Son los primeros 5 s del video del fénix que entregó Daniel el 13-nov-2026: el fénix vuela, forma el logo, sale un destello y quedan chispas.
  - El logo queda quieto, sin el fondo oscuro del video, y la animación va pintada sobre el verde de la portada a 12 cuadros por segundo.
  - La portada abre con el logo oficial. La animación se baja después, corre una vez por visita y al final se funde en el logo oficial.
  - No corre con ahorro de datos, conexión 2G ni «menos movimiento».
  - El programa que la arma está en `formulario-dforms/herramientas/logo-animar.mjs`.
  - La alternativa sobria, un brillo de sol solo con CSS, está en la rama `logo-sol`.
- **Sin bajar en ninguna pantalla** (pedido de Daniel, 13-nov-2026): la tarjeta mide lo visible de la pantalla (`100svh`; en computador, hasta 780 px).
  - Si una pantalla no cabe, `ajustar()` (app.js) la compacta: `k1` achica márgenes e íconos; `k2` pone las opciones en fila, con el ícono al lado del texto; y como último recurso reduce todo parejo (`zoom`, hasta 0,55).
  - Se vuelve a medir con cada cambio de la pantalla, al cargar las letras y al girar el celular, pero no mientras se escribe.
  - Ninguna parte se encoge sola (`.fbody>*{flex-shrink:0}`), así nada queda cortado sin verse.
  - Revisado en 8 tamaños, de 320×460 a 1440×780, y en todas las pantallas.
- **Socios:** si su socio confirma los pedidos, no se pregunta por socios y se da por hecho que los tiene. El nombre y el correo del socio van en la pantalla de datos, opcionales y solo si tiene socios. Si no tiene socios, sale en su lugar un correo adicional para invitar a alguien más, también opcional.
- **Agenda:** en el respaldo («próximos 2 días») no se muestra el nombre del consultor, solo los horarios.
- Pensada para cargar rápido: la portada baja unos 63 KB en total, con letras recortadas en WOFF2 e imágenes en WebP. Los íconos de las preguntas se precargan en segundo plano.
- **Medición del recorrido:** la página manda a `/api/evento` cada pantalla, respuesta, aviso de error, toque fuera de botón y salida, sin datos personales. Todo queda en la base D1 `fenix-formulario-visitas` (enlace `DB`), y cada visita se une al contacto de GHL cuando deja sus datos.
- **Panel privado:** `/panel` muestra el embudo, dónde se va la gente, las respuestas, los tiempos y el recorrido de cada persona. Pide la clave `PANEL_KEY` guardada en Cloudflare.
- **Anti-robots:** Turnstile de Cloudflare en modo invisible (pedido de Daniel, 13-nov-2026): nunca se ve ni pide clic. Cloudflare exige mencionarlo en la política de privacidad, y ya está en fenixventures.co/politica-privacidad.
  - Si Cloudflare no confirma que es una persona, el lead no se pierde: entra con la etiqueta `revisar-antirobots` y un aviso en la nota.
  - Sin esa confirmación se aceptan hasta 10 envíos por conexión por hora.
  - La página no espera más de 8 s por la revisión, y si falla sigue de inmediato.
- No hay claves en este repositorio.

## Créditos

- Letra Museo 700: Jos Buivenga, [exljbris](https://www.exljbris.com).
- Letra Figtree: Erik Kennedy, licencia SIL Open Font License 1.1.
- Imágenes 3D de las respuestas: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft, licencia MIT (reducidas a WebP de 120 px; personas y manos en tono de piel medio claro; el apretón de manos, que solo existe en amarillo, se recoloreó a ese mismo tono).
- Dedito del deslizador: [Twemoji](https://github.com/jdecked/twemoji), licencia CC-BY 4.0.
- Los logos de Dropi, Effi, Hoko, MasterShop, Chatea Pro, LucidBot, LiliBot, Pancake, SellerChat, Icomfly, Shopify, WhatsApp, Meta, TikTok y Google pertenecen a sus dueños y se usan solo para identificar cada plataforma. Los de los chatbots se tomaron de sus sitios oficiales (el de LiliBot, de su canal de YouTube) y se pasaron a WebP de 64 px.
- Animación de Dropi (`logos/dropi-afirma.webp`): un ciclo de la animación oficial «Afirmación naranja» de Dropi, entregada por Daniel el 13-nov-2026, reducido a 25 cuadros por segundo con una pausa de 1,7 s antes de repetir; `dropi-afirma-quieto.webp` es su primer cuadro, para quien pide menos movimiento.
