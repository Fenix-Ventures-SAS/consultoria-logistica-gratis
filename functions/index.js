/* Direcciones del formulario: una por fuente, con guion entre siglas (form-ev-on = eventos online).
   Las direcciones viejas sin guion (formevon…) siguen vivas y llevan a la nueva, con todo lo que traiga el enlace
   (UTM, ids de anuncios). Así el QR publicado en YouTube y los enlaces ya compartidos siguen funcionando. */
export const FUENTES = {
  'form': 'General', 'form-p-meta': 'Pauta Meta', 'form-p-tiktok': 'Pauta TikTok', 'form-p-google': 'Pauta Google',
  'form-ig': 'Orgánico Instagram', 'form-tkt': 'Orgánico TikTok', 'form-lkd': 'LinkedIn', 'form-dropi': 'Referidos Dropi',
  'form-ref': 'Referidos', 'form-ev-on': 'Eventos online', 'form-ev-fis': 'Eventos físicos', 'form-roaxgratis': 'Concurso ROAX',
  'form-dropkilleradv': 'Dropkiller Adviento'
};
/* Lo que cambia por fuente, además de su etiqueta: etiquetas de más en GHL y una línea al principio de las notas del lead
   (la de sus respuestas y la de su cita). GHL guarda las etiquetas en minúscula.
   Concurso de ROAX (pedido de Daniel, 19-nov-2026): esos leads tienen la instalación del ecosistema Fénix gratis.
   Dropkiller Adviento (pedido de Daniel, 19-nov-2026): a todo descalificado la página le da los videos de logística
   (`videos`; el enlace también está en app.js) y, si dejó sus datos, la nota lo dice. */
export const EXTRAS = {
  'form-roaxgratis': { etiquetas: ['Roax_ecosistema_gratis'], nota: '🎁 TIENE LA INSTALACIÓN DEL ECOSISTEMA FÉNIX GRATUITO (concurso ROAX)' },
  'form-dropkilleradv': { etiquetas: ['dropkiller adviento'], videos: 'https://drive.google.com/drive/folders/1L_lTqbOsIjZYpgSTVa3S7bVLS3IXi_oL' }
};
export const NOMBRE_NUEVO = {
  formpmeta: 'form-p-meta', formptiktok: 'form-p-tiktok', formpgoogle: 'form-p-google', formig: 'form-ig', formtkt: 'form-tkt',
  formlkd: 'form-lkd', formdropi: 'form-dropi', formref: 'form-ref', formevon: 'form-ev-on', formevfis: 'form-ev-fis'
};

// Solo atiende la página de entrada: si llega por una dirección vieja, la manda a la nueva; si no, sirve la página tal cual
export function onRequest({ request, next }) {
  const url = new URL(request.url);
  const m = url.hostname.match(/^(form[a-z]+)\.fenixventures\.co$/);
  if (m && NOMBRE_NUEVO[m[1]]) {
    url.hostname = NOMBRE_NUEVO[m[1]] + '.fenixventures.co';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
