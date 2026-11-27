# Consultoría Logística Gratis · Fénix Ventures

Formulario de calificación de Fénix Ventures, la vertical logística de Dropi.

**Estado: en producción (12-nov-2026).** Cada lead que deja sus datos queda en GHL, aunque no toque el botón final (se guarda al salir o tras 40 s sin escribir), y agenda con horarios reales.

- **Direcciones por fuente** (desde el 13-nov-2026): form, form-p-meta, form-p-tiktok, form-p-google, form-ig, form-tkt, form-lkd, form-dropi, form-ref, form-ev-on y form-ev-fis `.fenixventures.co`. Las viejas sin guion (formevon…) siguen activas y `functions/index.js` las lleva a la nueva (301, con UTM). Así sigue funcionando el QR del video, que apunta a formevon. La etiqueta de GHL es exactamente el prefijo nuevo.
  - **form-roaxgratis** (concurso de ROAX, pedido de Daniel el 19-nov-2026): el mismo formulario. En GHL suma además la etiqueta `Roax_ecosistema_gratis` (GHL guarda las etiquetas en minúscula), y la nota de sus respuestas y la de su cita empiezan con «🎁 TIENE LA INSTALACIÓN DEL ECOSISTEMA FÉNIX GRATUITO (concurso ROAX)». Esto se configura por fuente en `EXTRAS` (`functions/index.js`).
  - **form-dropkilleradv** (Dropkiller Adviento, pedido de Daniel el 19-nov-2026): el mismo formulario, con etiqueta extra `dropkiller adviento`. Lo que cambia: todo el que quede descalificado (no vende, plataforma, canal, pauta, pago o seguimiento) ve «Aún no aplicas para la consultoría» y, desde el 21-nov-2026, «Por llegar hasta acá, te damos acceso a un curso de logística. / Lo que nadie te dice antes de empezar a vender. / Aprovéchalo 💚» (texto de Daniel, tal cual), con el botón «Acceder al curso» (antes «Ver los videos», cambiado por Daniel el 21-nov-2026) a la carpeta de Google Drive y debajo cuándo volver. El enlace está en `VIDEOS` (app.js) y en `EXTRAS` (para la nota). Si dejó sus datos (seguimiento), la nota de GHL dice que se le dio acceso al curso de logística, con el enlace. Cada clic en el botón queda en la medición como evento `videos`.
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
- **Píxel de Meta** (pedido de Daniel, 21-nov-2026): solo en form-p-meta, píxel `1916521899372619` (`PIXEL_META` en app.js). Es el código oficial que entregó Daniel, cargado desde app.js porque la seguridad de la página no permite código suelto en el HTML. La política de la página permite `connect.facebook.net` (script) y `www.facebook.com` (envíos). Manda PageView al abrir y la escalera de eventos (21-nov-2026, `pix` en app.js), cada uno una vez por visita y con `eventID` = visita + evento para no duplicarlo si algún día lo manda también el servidor:
    - `Filtro_1` (personalizado): al llegar a «¡Pasaste el primer filtro!».
    - `Lead_Valido` (personalizado): calificó (B1, B2 o B3) y sus datos se guardaron.
    - `Lead_Calificado` (personalizado): calificó con 20 o más pedidos (B1 o B2).
    - `Calificado_B1`, `Calificado_B2` o `Calificado_B3` (personalizados): su nivel.
    - `Schedule` (estándar): agendó (no si ya tenía cita).
    - Descartados y seguimiento: solo PageView (los de seguimiento también `Filtro_1`).
    - Coincidencia avanzada manual (21-nov-2026, `pixDatos`): al tocar «Ver horarios», el píxel recibe solo el correo y el WhatsApp del lead (con indicativo), nunca los del socio ni el invitado, y los cifra antes de enviarlos. Van en `Lead_Valido`, `Lead_Calificado`, `Calificado_*` y `Schedule`; `PageView` y `Filtro_1` salen sin datos. Complementa al píxel: si Meta no reconoce los datos, el evento cuenta igual.
    - Los eventos automáticos de botones de Meta (`SubscribedButtonClick`) están apagados en el código (`autoConfig` en falso). La coincidencia avanzada automática de Meta debe seguir apagada: leería el WhatsApp sin indicativo y podría tomar el correo del socio o del invitado. Las demás direcciones no cargan nada de Meta.
- **Portada** (27-nov-2026, pedido de Daniel tras revisar la pauta): el título es «Inicia tu Diagnóstico Gratis», el mismo «diagnóstico» que ofrecen los anuncios (antes decía «Consultoría Logística Gratis»). Es igual en todas las direcciones.
- **Brillo alrededor del logo de la portada** (elegido por Daniel el 27-nov-2026):
  - Al abrir, una luz dorada con rayos suaves alumbra detrás del logo oficial durante 1,5 s y vuelve a quedar normal.
  - Es solo CSS, sin archivos extra: suma menos de 1 KB. Su tamaño (`--sol`, en `sizeEmb`) nunca pasa del espacio libre, así que no se corta en celulares chicos. No corre con «menos movimiento».
  - Reemplazó al fénix animado (`logos/fenix-anima.webp`, 165 KB), que triplicaba el peso de la portada. Ese archivo ya no está en el repositorio; sigue en el historial y en la rama `logo-animado`, y su programa en `formulario-dforms/herramientas/logo-animar.mjs`.
- **Sin bajar en ninguna pantalla** (pedido de Daniel, 13-nov-2026): la tarjeta mide lo visible de la pantalla (`100svh`; en computador, hasta 780 px).
  - Si una pantalla no cabe, `ajustar()` (app.js) la compacta: `k1` achica márgenes e íconos; `k2` pone las opciones en fila, con el ícono al lado del texto; y como último recurso reduce todo parejo (`zoom`, hasta 0,55).
  - Se vuelve a medir con cada cambio de la pantalla, al cargar las letras y al girar el celular, pero no mientras se escribe.
  - Ninguna parte se encoge sola (`.fbody>*{flex-shrink:0}`), así nada queda cortado sin verse.
  - Revisado en 8 tamaños, de 320×460 a 1440×780, y en todas las pantallas.
- **Socios:** si su socio confirma los pedidos, no se pregunta por socios y se da por hecho que los tiene. El nombre y el correo del socio van en la pantalla de datos, opcionales y solo si tiene socios. Si no tiene socios, sale en su lugar un correo adicional para invitar a alguien más, también opcional.
- **Agenda:** en el respaldo («próximos 2 días») no se muestra el nombre del consultor, solo los horarios.
- **Pantalla de carga** (pedido de Daniel, 14-nov-2026): logo de Fénix al centro, el nombre completo que dejó la persona, el porcentaje y la barra; abajo, Dropi entra rodando por el borde de la tarjeta, se vuelve su logo con el nombre y sale rodando. El 17-nov Daniel lo pidió más pequeño, a la medida del resto de la pantalla.
  - Dura lo mismo que esa animación (`CARGA_MS`, 3,8 s), y el conteo arranca cuando la animación ya se puede ver, así el 100 % llega cuando Dropi sale.
  - La animación se baja en segundo plano y se guarda en memoria (por eso la política de la página permite imágenes `blob:`): así empieza desde el principio cada vez que sale la pantalla, también tras «Volver a empezar».
  - El nombre se muestra con mayúscula inicial si lo escribieron todo en minúscula o todo en mayúscula; a GHL va tal cual.
- Pensada para cargar rápido: la portada baja unos 75 KB en total, con letras recortadas en WOFF2 e imágenes en WebP. Los íconos de las preguntas se precargan en segundo plano.
- **Medición del recorrido:** la página manda a `/api/evento` cada pantalla, respuesta, aviso de error, toque fuera de botón y salida, sin datos personales. Todo queda en la base D1 `fenix-formulario-visitas` (enlace `DB`), y cada visita se une al contacto de GHL cuando deja sus datos.
- **Panel privado:** `/panel` muestra el embudo, dónde se va la gente, las respuestas, los tiempos y el recorrido de cada persona. Pide la clave `PANEL_KEY` guardada en Cloudflare.
- **Anti-robots:** Turnstile de Cloudflare en modo invisible desde el 13-nov-2026 (pedido de Daniel): nunca se ve ni pide clic, ni siquiera cuando Cloudflare duda.
  - El modo se elige en el panel de Cloudflare (Turnstile → «Formulario consultoría Fénix»), no en el código. Si alguien lo vuelve a «Managed», la casilla puede reaparecer.
  - Cloudflare exige que la política de privacidad mencione su anexo de privacidad de Turnstile. Está en fenixventures.co/politica-privacidad, sección «4. Tecnología» (recuadro «Seguridad de los formularios» y etiqueta «Cloudflare Turnstile»), desde el 13-nov-2026.
  - Si Cloudflare no confirma que es una persona, el lead no se pierde: entra con la etiqueta `revisar-antirobots` y un aviso en la nota. Los navegadores automáticos o que fingen ser otro (como el de pruebas de Claude en modo celular) siempre caen aquí, con el error 600010.
  - Sin esa confirmación se aceptan hasta 10 envíos por conexión por hora.
  - La página no espera más de 8 s por la revisión, y si falla sigue de inmediato.
- No hay claves en este repositorio.

## Créditos

- Letra Museo 700: Jos Buivenga, [exljbris](https://www.exljbris.com).
- Letra Figtree: Erik Kennedy, licencia SIL Open Font License 1.1.
- Imágenes 3D de las respuestas: [Fluent Emoji](https://github.com/microsoft/fluentui-emoji) de Microsoft, licencia MIT (reducidas a WebP de 120 px; personas y manos en tono de piel medio claro; el apretón de manos, que solo existe en amarillo, se recoloreó a ese mismo tono).
- Dedito del deslizador: [Twemoji](https://github.com/jdecked/twemoji), licencia CC-BY 4.0. Desde el 21-nov-2026 va en tono de piel medio claro (👆🏼, `1f446-1f3fc.svg`, #F3D2A2): un tono más oscuro que el claro de antes, pedido de Daniel, y el mismo de las manos y personas 3D.
- Los logos de Dropi, Effi, Hoko, MasterShop, Chatea Pro, LucidBot, LiliBot, Pancake, SellerChat, Icomfly, Shopify, WhatsApp, Meta, TikTok y Google pertenecen a sus dueños y se usan solo para identificar cada plataforma. Los de los chatbots se tomaron de sus sitios oficiales (el de LiliBot, de su canal de YouTube) y se pasaron a WebP de 64 px.
- Dropi rodando (`logos/dropi-rueda.webp`, 127 KB): el GIF que entregó Daniel el 14-nov-2026 (1920×1080, 6,4 s), recortado a una franja de todo el ancho (1920×258: así Dropi cruza la tarjeta de borde a borde y se ve pequeño), reducido a 1040×140 y acelerado a 1,5x (37,5 cuadros por segundo). Se le limpiaron los puntos negros sueltos y el ruido del borde. Va en el naranja claro del logo de arriba (229,143,59), elegido por Daniel el 17-nov-2026; el GIF trae 239,107,41. `dropi-rueda-quieto.webp` es el logo completo, para quien pide menos movimiento. El programa que la arma está en `formulario-dforms/herramientas/dropi-rodar.mjs`.
- Animación de Dropi (`logos/dropi-afirma.webp`): un ciclo de la animación oficial «Afirmación naranja» de Dropi, entregada por Daniel el 13-nov-2026, reducido a 25 cuadros por segundo con una pausa de 1,7 s antes de repetir; desde el 17-nov-2026 va en el naranja claro del logo de arriba (229,143,59; el original es 239,110,44); `dropi-afirma-quieto.webp` es su primer cuadro, para quien pide menos movimiento.
