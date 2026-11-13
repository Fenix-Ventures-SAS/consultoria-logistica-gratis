/* Panel privado de visitas del formulario: pide la clave (PANEL_KEY en Cloudflare), trae las cifras de /api/panel y las dibuja.
   Todo lo que viene de la base se escapa antes de mostrarse: parte lo escribieron visitantes. */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = n => Number(n || 0).toLocaleString('es-CO');
const pct = (a, b) => b ? Math.round(a * 100 / b) + ' %' : '—';

const PASOS = ['portada', 'ventas', 'plataforma', 'canal', 'pauta', 'pago', 'vas_bien', 'operacion', 'problema', 'socios', 'contacto', 'revisando', 'agenda'];
const NOMBRE = { portada: 'Portada', ventas: 'Ventas diarias', plataforma: 'Plataformas', canal: 'Canal de pedidos', pauta: 'Pauta', pago: 'Forma de pago',
  vas_bien: '¡Pasaste el primer filtro!', operacion: 'Operación', problema: 'Problemas', socios: 'Socios', contacto: 'Datos de contacto',
  revisando: 'Análisis', agenda: 'Agenda', plataforma_otra: 'Otra plataforma', chatbot: 'Cómo responde', chatbot_b3: 'Cómo responde', confirma: 'Quién confirma' };
const RES = { no_vende: 'No vende', descartado_plataforma: 'Descartado: sin plataforma', descartado_canal: 'Descartado: canal', descartado_pauta: 'Descartado: no pauta',
  descartado_pago: 'Descartado: pago anticipado', seguimiento: 'Seguimiento (chatbot, menos de 20)', b1: 'B1 · 70 o más ventas', b2: 'B2 · 20 a 69', b3: 'B3 · 1 a 19' };
const OPC = { dropi: 'Dropi', effi: 'Effi', hoko: 'Hoko', mastershop: 'MasterShop', otra: 'Otra', transportadora: 'Transportadora', ninguna: 'Ninguna',
  pagina: 'Landing', whatsapp_redes: 'WhatsApp', pagina_whatsapp: 'Landing y WhatsApp', solo_marketplace: 'Solo marketplaces', solo_fisica: 'Solo tienda física',
  meta: 'Meta', tiktok: 'TikTok', google: 'Google', no: 'No pauta', contraentrega: 'Contraentrega', ambos: 'Contraentrega y anticipado', anticipado: 'Solo anticipado',
  manual: 'A mano', chatbot: 'Chatbot', yo: 'Él mismo', socio: 'Socio', empleados: 'Empleados', tercero: 'Empresa externa', bot: 'Un bot',
  devoluciones: 'Devoluciones', confirmaciones: 'Confirmar pedidos', novedades: 'Novedades', atencion: 'No da abasto con chats', tiempo: 'Falta tiempo',
  ventas_bajaron: 'Ventas bajaron', escalar: 'Quiere escalar', solo: 'Decide solo', socios: 'Con socios' };
const nombrePaso = p => NOMBRE[p] || (p && p.startsWith('fin_') ? 'Fin · ' + (RES[p.slice(4)] || p.slice(4)) : p || '—');
const opcion = v => String(v || '').split('+').map(x => OPC[x] || x).join(' + ');
const rango = v => { v = +v; return v === 0 ? '0' : v <= 10 ? '1 a 10' : v <= 19 ? '11 a 19' : v <= 30 ? '20 a 30' : v <= 69 ? '31 a 69' : v <= 99 ? '70 a 99' : v <= 299 ? '100 a 299' : '300 o más'; };
const hora = ms => new Date(ms).toLocaleString('es-CO', { timeZone: 'America/Bogota', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
const dur = ms => { const s = Math.round((ms || 0) / 1000); return s < 60 ? s + ' s' : Math.floor(s / 60) + ' min ' + String(s % 60).padStart(2, '0') + ' s'; };

let clave = '';
try { clave = sessionStorage.getItem('panelClave') || ''; } catch (e) { }

// Barras horizontales de una sola serie: el título dice qué se mide; el número va al final de cada barra
function barras(items, total) {
  if (!items.length) return '<p class="vacio">Sin datos en este periodo.</p>';
  const max = Math.max(...items.map(x => x.n), 1);
  return '<div class="barras">' + items.map(x => '<div class="fila" title="' + esc(x.nombre + ': ' + num(x.n) + (total ? ' (' + pct(x.n, total) + ')' : '')) + '">' +
    '<span class="nom">' + esc(x.nombre) + '</span><span class="pista"><i style="width:' + (x.n / max * 100).toFixed(1) + '%"></i></span>' +
    '<span class="val">' + num(x.n) + (total ? ' · ' + pct(x.n, total) : '') + (x.extra ? ' ' + x.extra : '') + '</span></div>').join('') + '</div>';
}
const tabla = (cab, filas) => filas.length ? '<table><thead><tr>' + cab.map((c, i) => '<th' + (i ? ' style="text-align:right"' : '') + '>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' +
  filas.map(f => '<tr>' + f.map((c, i) => '<td' + (i ? ' class="n"' : '') + '>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table>' : '<p class="vacio">Sin datos en este periodo.</p>';

function describir(e) {
  const v = e.valor;
  switch (e.tipo) {
    case 'pantalla': return 'Entró a <b>' + esc(nombrePaso(e.paso)) + '</b>' + (e.valor ? ' <span style="color:var(--mut)">(' + dur(e.ms_paso) + ' en ' + esc(nombrePaso(e.valor)) + ')</span>' : '');
    case 'empezar': return 'Tocó <b>Empezar</b>';
    case 'respuesta': return 'Respondió ' + esc(nombrePaso(e.paso)) + ': <b>' + esc(e.paso === 'ventas' ? v : e.paso === 'plataforma_otra' ? v : opcion(v)) + '</b>';
    case 'desliza': return 'Movió la barra';
    case 'atras': return 'Tocó <b>Atrás</b> en ' + esc(nombrePaso(e.paso));
    case 'error': return 'Vio el aviso: <b>' + esc(v) + '</b>';
    case 'resultado': return 'Resultado: <b>' + esc(RES[v] || v) + '</b>';
    case 'datos': return 'Envió sus datos (celular de ' + esc(v || '—') + ')';
    case 'guardado': return v === 'ok' ? 'Quedó guardado en GHL' : '<b>No se guardó en GHL</b> (' + esc(v) + ')';
    case 'agenda': return 'Vio la agenda (' + esc(v) + ')';
    case 'horario': return 'Tocó un horario: <b>' + esc(v) + '</b>';
    case 'otro': return 'Abrió «Otro día u hora»';
    case 'texto': return 'Escribió: <b>' + esc(v) + '</b>';
    case 'respaldo': return 'Vio la agenda de respaldo';
    case 'agendado': return '<b>AGENDÓ</b> ✔';
    case 'ocupado': return 'El horario se ocupó mientras agendaba';
    case 'agenda_error': return '<b>No pudo agendar</b> (' + esc(v) + ')';
    case 'reintentar': return 'Reintentó guardar sus datos';
    case 'reinicio': return 'Volvió a empezar';
    case 'clic_vacio': return 'Tocó algo que no es botón: ' + esc(v);
    case 'salida': return 'Salió o cambió de pestaña (' + dur(e.ms_paso) + ' en ' + esc(nombrePaso(e.paso)) + ')';
    case 'volver': return 'Volvió a la página';
    default: return esc(e.tipo);
  }
}

function dibujar(d) {
  const t = d.totales || {}, vis = t.visitas || 0;
  const pantallas = Object.fromEntries((d.pantallas || []).map(x => [x.paso, x.n]));
  // Embudo: personas que llegaron a cada pantalla, con la caída frente a la anterior
  let prev = null;
  const embudo = PASOS.filter(p => pantallas[p]).map(p => { const n = pantallas[p], caida = prev ? Math.round((1 - n / prev) * 100) : 0; prev = n;
    return { nombre: nombrePaso(p), n, extra: caida > 0 ? '<em>−' + caida + ' %</em>' : '' }; });
  // Tiempo mediano en cada pantalla
  const porPaso = {};
  (d.tiempos || []).forEach(x => (porPaso[x.paso] = porPaso[x.paso] || []).push(x.ms));
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  const tiempos = PASOS.filter(p => porPaso[p]).map(p => [nombrePaso(p), dur(med(porPaso[p])), num(porPaso[p].length)]);
  // Respuestas por pregunta (ventas en rangos)
  const preg = {};
  (d.respuestas || []).forEach(x => { const k = x.paso, nom = k === 'ventas' ? rango(x.valor) : k === 'plataforma_otra' ? x.valor : opcion(x.valor);
    preg[k] = preg[k] || {}; preg[k][nom] = (preg[k][nom] || 0) + x.n; });
  const ordenVentas = ['0', '1 a 10', '11 a 19', '20 a 30', '31 a 69', '70 a 99', '100 a 299', '300 o más'];
  const respuestas = Object.keys(preg).map(k => '<div class="preg"><h3>' + esc(nombrePaso(k)) + '</h3>' +
    barras(Object.entries(preg[k]).map(([nombre, n]) => ({ nombre, n })).sort((a, b) => k === 'ventas' ? ordenVentas.indexOf(a.nombre) - ordenVentas.indexOf(b.nombre) : b.n - a.n)) + '</div>').join('');
  // Recorrido de cada persona
  const porSesion = {};
  (d.recorridos || []).forEach(e => (porSesion[e.sesion] = porSesion[e.sesion] || []).push(e));
  const personas = (d.personas || []).map(p => {
    const ev = porSesion[p.sesion] || [], t0 = ev.length ? ev[0].ts : p.inicio;
    const fin = p.agendo ? '<span class="etq ok">Agendó</span>' : p.resultado ? '<span class="etq">' + esc(RES[p.resultado] || p.resultado) + '</span>' : '<span class="etq">Se fue en ' + esc(nombrePaso(p.avance)) + '</span>';
    const lead = p.contacto ? ' · <a href="' + esc(d.ghl + p.contacto) + '" target="_blank" rel="noopener">ver en GHL</a>' : '';
    return '<details class="persona"><summary><span class="hora">' + esc(hora(p.inicio)) + '</span><span class="que">' + fin + (p.datos ? '<span class="etq">Dejó datos</span>' : '') + lead + '</span>' +
      '<span class="marca">' + esc([p.fuente, p.pais, p.dispositivo].filter(Boolean).join(' · ')) + '</span></summary>' +
      '<ul class="linea">' + ev.map(e => '<li><span class="t">+' + esc(dur(e.ts - t0)) + '</span> ' + describir(e) + '</li>').join('') + '</ul>' +
      (p.origen || p.referido ? '<p class="vacio">Origen: ' + esc([p.origen, p.referido].filter(Boolean).join(' · ')) + '</p>' : '') + '</details>';
  }).join('');

  $('datos').innerHTML =
    '<div class="grid">' +
      '<div class="kpi"><span>Visitas</span><b>' + num(vis) + '</b><small>abrieron la página</small></div>' +
      '<div class="kpi"><span>Empezaron</span><b>' + num(t.empezaron) + '</b><small>' + pct(t.empezaron, vis) + ' de las visitas</small></div>' +
      '<div class="kpi"><span>Dejaron datos</span><b>' + num(t.datos) + '</b><small>' + pct(t.datos, vis) + ' de las visitas</small></div>' +
      '<div class="kpi"><span>Calificaron</span><b>' + num(t.calificados) + '</b><small>B1, B2 o B3</small></div>' +
      '<div class="kpi"><span>Agendaron</span><b>' + num(t.agendaron) + '</b><small>' + pct(t.agendaron, t.calificados) + ' de los calificados</small></div>' +
    '</div>' +
    '<section class="card"><h2>Hasta dónde llega la gente</h2><p class="sub">Personas que vieron cada pantalla, porcentaje de las visitas y, en dorado, cuántos se perdieron frente a la pantalla anterior.</p>' + barras(embudo, vis) + '</section>' +
    '<div class="dos">' +
      '<section class="card"><h2>Dónde se van</h2><p class="sub">Última pantalla de quienes salieron sin terminar.</p>' + barras((d.salidas || []).map(x => ({ nombre: nombrePaso(x.avance), n: x.n }))) + '</section>' +
      '<section class="card"><h2>Resultados</h2><p class="sub">Cómo terminó quien llegó al final.</p>' + barras((d.resultados || []).map(x => ({ nombre: RES[x.resultado] || x.resultado, n: x.n }))) + '</section>' +
    '</div><div style="height:14px"></div>' +
    '<section class="card"><h2>Respuestas</h2><p class="sub">Personas por opción en cada pregunta.</p>' + (respuestas || '<p class="vacio">Sin datos en este periodo.</p>') + '</section>' +
    '<div class="dos">' +
      '<section class="card"><h2>Tiempo en cada pantalla</h2><p class="sub">Mediana: la mitad de la gente tarda menos que esto.</p>' + tabla(['Pantalla', 'Tiempo', 'Personas'], tiempos) + '</section>' +
      '<section class="card"><h2>Avisos de error que vieron</h2><p class="sub">Dónde se traban al llenar.</p>' + tabla(['Aviso', 'Veces'], (d.errores || []).map(x => [nombrePaso(x.paso) + ' · ' + x.valor, num(x.n)])) + '</section>' +
    '</div><div style="height:14px"></div>' +
    '<section class="card"><h2>Toques fuera de los botones</h2><p class="sub">Lo que la gente intenta tocar y no hace nada: pistas de confusión.</p>' + tabla(['Pantalla y elemento', 'Veces'], (d.clics || []).map(x => [nombrePaso(x.paso) + ' · ' + x.valor, num(x.n)])) + '</section>' +
    '<div class="dos">' +
      '<section class="card"><h2>Por fuente</h2>' + tabla(['Fuente', 'Visitas', 'Datos', 'Agendas'], (d.fuentes || []).map(x => [x.fuente || '—', num(x.visitas), num(x.datos), num(x.agendaron)])) + '</section>' +
      '<section class="card"><h2>Dispositivo y país</h2>' + tabla(['Dispositivo', 'Visitas'], (d.dispositivos || []).map(x => [x.dispositivo || '—', num(x.n)])) +
        '<div style="height:10px"></div>' + tabla(['País de la conexión', 'Visitas'], (d.paises || []).map(x => [x.pais || '—', num(x.n)])) + '</section>' +
    '</div><div style="height:14px"></div>' +
    '<section class="card"><h2>Cada persona</h2><p class="sub">Las 60 visitas más recientes. Toca una para ver su recorrido paso a paso.</p>' + (personas || '<p class="vacio">Sin visitas en este periodo.</p>') + '</section>';

  const sel = $('fuente'), actual = sel.value;
  sel.innerHTML = '<option value="">Todas las fuentes</option>' + (d.fuentes || []).filter(x => x.fuente).map(x => '<option value="' + esc(x.fuente) + '">' + esc(x.fuente) + '</option>').join('');
  sel.value = actual;
  $('estado').textContent = 'Actualizado a las ' + new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit' });
}

async function cargar() {
  if (!clave) return;
  let r;
  try {
    r = await fetch('/api/panel', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ clave, dias: +$('dias').value, fuente: $('fuente').value }) });
  } catch (e) { $('estado').textContent = 'Sin conexión. Intenta de nuevo.'; return; }
  const d = await r.json().catch(() => ({}));
  if (r.status === 401) { clave = ''; try { sessionStorage.removeItem('panelClave'); } catch (e) { } $('login').hidden = false; $('datos').hidden = true; $('filtros').hidden = true; $('lerr').textContent = 'Esa clave no es. Revísala.'; return; }
  if (!d.ok) { $('lerr').textContent = d.error === 'config' ? 'Falta guardar PANEL_KEY en Cloudflare y volver a publicar.' : 'No se pudo cargar (' + (d.error || r.status) + ').'; return; }
  try { sessionStorage.setItem('panelClave', clave); } catch (e) { }
  $('login').hidden = true; $('datos').hidden = false; $('filtros').hidden = false;
  dibujar(d);
}

$('fclave').addEventListener('submit', e => { e.preventDefault(); clave = $('clave').value.trim(); $('lerr').textContent = ''; cargar(); });
$('dias').addEventListener('change', cargar);
$('fuente').addEventListener('change', cargar);
$('recargar').addEventListener('click', cargar);
// Se actualiza solo cada minuto mientras el panel está a la vista (útil durante un evento en vivo)
setInterval(() => { if (clave && document.visibilityState === 'visible') cargar(); }, 60000);
cargar();
