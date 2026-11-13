/* Direcciones del formulario: una por fuente, con guion entre siglas (form-ev-on = eventos online).
   Las direcciones viejas sin guion (formevon…) siguen vivas y llevan a la nueva, con todo lo que traiga el enlace
   (UTM, ids de anuncios). Así el QR publicado en YouTube y los enlaces ya compartidos siguen funcionando. */
export const FUENTES = {
  'form': 'General', 'form-p-meta': 'Pauta Meta', 'form-p-tiktok': 'Pauta TikTok', 'form-p-google': 'Pauta Google',
  'form-ig': 'Orgánico Instagram', 'form-tkt': 'Orgánico TikTok', 'form-lkd': 'LinkedIn', 'form-dropi': 'Referidos Dropi',
  'form-ref': 'Referidos', 'form-ev-on': 'Eventos online', 'form-ev-fis': 'Eventos físicos'
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
