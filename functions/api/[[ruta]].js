/* Portero del formulario: única parte que habla con GHL. La clave vive solo en Cloudflare (GHL2_TOKEN).
   POST /api/lead     → crea o actualiza el contacto, le pone la etiqueta del subdominio, deja la oportunidad
                        en Setter 2.0 "Requiere atención humana" con las respuestas en notas y devuelve los horarios.
   POST /api/agendar  → vuelve a verificar el horario, crea la cita y pasa la oportunidad a "Agendado 📆".
   Agenda con las reglas de Sofía (flujos KAd4A y knRiI): consultor por ventas diarias, 36 h sin domingos ni
   festivos, mínimo 90 min de anticipación, a la misma hora desempata el orden de prioridad. */

const GHL = 'https://services.leadconnectorhq.com';
const LOC = '04Ruck2fFcV5VVehGEaY';
const CAL = {
  ricardo: { id: 'wbosNoajpiNqOi79OTov', user: 'rn8huM7r4EaowZPQWYuc', nombre: 'Ricardo López' },
  daniel: { id: 'pLxOxkmiYWRlOTsjRU9c', user: 'ow5XoyQR2vErA7LRpPwG', nombre: 'Daniel Plata' },
  felipe: { id: 'JouqwRatah2JtsetGZUM', user: '0eDdMo2fBgSW2OAL1X3v', nombre: 'Felipe Gómez' },
  sonia: { id: 'c26zCEkXlaL02zKcLtkk', user: 'ZyfPiYBpPvmF8OuoblUK', nombre: 'Sonia Gómez' },
  yucelis: { id: 'fXAQgjiWJJCqUAzWnVEv', user: 'k5k2I9MQP2XQG4yBzpw7', nombre: 'Yucelis Cárdenas' }
};
const DURACION_MIN = 45;
// Regla de Daniel: el consultor sale solo de las ventas diarias (el formulario ya filtró lo demás)
const ORDEN = { B1: ['ricardo', 'daniel', 'felipe', 'sonia'], B2: ['sonia', 'yucelis', 'ricardo'], B3: ['sonia', 'yucelis'] };
const tierDe = v => v >= 70 ? 'B1' : v >= 20 ? 'B2' : 'B3';
// Festivos de Colombia hasta 2030 (los mismos de Sofía). Ampliar antes de 2031.
const FESTIVOS = new Set(['2026-11-16', '2026-12-08', '2026-12-25', '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26', '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05', '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01', '2027-11-15', '2027-12-08', '2027-12-25', '2028-01-01', '2028-01-10', '2028-03-20', '2028-04-13', '2028-04-14', '2028-05-01', '2028-05-29', '2028-06-19', '2028-06-26', '2028-07-03', '2028-07-20', '2028-08-07', '2028-08-21', '2028-10-16', '2028-11-06', '2028-11-13', '2028-12-08', '2028-12-25', '2029-01-01', '2029-01-08', '2029-03-19', '2029-03-29', '2029-03-30', '2029-05-01', '2029-05-14', '2029-06-04', '2029-06-11', '2029-07-02', '2029-07-20', '2029-08-07', '2029-08-20', '2029-10-15', '2029-11-05', '2029-11-12', '2029-12-08', '2029-12-25', '2030-01-01', '2030-01-07', '2030-03-25', '2030-04-18', '2030-04-19', '2030-05-01', '2030-06-03', '2030-06-24', '2030-07-01', '2030-07-20', '2030-08-07', '2030-08-19', '2030-10-14', '2030-11-04', '2030-11-11', '2030-12-08', '2030-12-25']);

/* Respuestas válidas: lo que no esté aquí se rechaza */
const OPC = {
  plataforma: { dropi: 'Dropi', effi: 'Effi', hoko: 'Hoko', mastershop: 'MasterShop', otra: 'Otra plataforma', transportadora: 'Despacho directo con transportadora', ninguna: 'No usa ninguna' },
  canal: { pagina: 'Landing Page', whatsapp_redes: 'WhatsApp', pagina_whatsapp: 'Landing y WhatsApp', solo_marketplace: 'Solo marketplaces', solo_fisica: 'Solo tienda física' },
  pauta: { meta: 'Meta', tiktok: 'TikTok', google: 'Google', no: 'No pauta' },
  pago: { contraentrega: 'Contraentrega', ambos: 'Contraentrega y anticipado', anticipado: 'Solo anticipado' },
  chatbot: { manual: 'A mano (él o su equipo)', chatbot: 'Con chatbot' },
  confirma: { yo: 'Él mismo', socio: 'Su socio', empleados: 'Empleados', tercero: 'Empresa externa', bot: 'Un bot' },
  problema: { devoluciones: 'Devoluciones', confirmaciones: 'Confirmar pedidos', novedades: 'Novedades sin resolver', atencion: 'No da abasto con los chats', tiempo: 'Le falta tiempo para crecer', ventas_bajaron: 'Sus ventas bajaron', escalar: 'Ninguno, quiere escalar' },
  socios: { solo: 'Decide solo', socios: 'Con socio(s) o pareja' }
};
const MULTI = new Set(['plataforma', 'pauta', 'problema']);
const FUENTES = { pmeta: 'Pauta Meta', ptiktok: 'Pauta TikTok', pgoogle: 'Pauta Google', ig: 'Orgánico Instagram', tkt: 'Orgánico TikTok', lkd: 'LinkedIn', dropi: 'Referidos Dropi', ref: 'Referidos', evon: 'Eventos online', evfis: 'Eventos físicos' };

/* ---------- utilidades ---------- */
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const falla = (status, error) => json({ ok: false, error }, status);
const limpio = (v, max) => typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f<>"\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max) : '';
const bogDia = ms => new Date(ms - 5 * 3600e3).toISOString().slice(0, 10);
const noLaboral = d => FESTIVOS.has(d) || new Date(d + 'T12:00:00-05:00').getUTCDay() === 0;
const isoBog = ms => new Date(ms - 5 * 3600e3).toISOString().slice(0, 19) + '-05:00';
// GHL entrega la hora de las citas sin zona ("2026-11-13 15:00:00"): es hora de Bogotá, la de la cuenta
const leerHoraGhl = s => { const t = String(s || '').trim().replace(' ', 'T'); return Date.parse(/[zZ]$|[+-]\d\d:?\d\d$/.test(t) ? t : t + '-05:00'); };

// Límite de intentos por IP (por servidor de Cloudflare; frena ráfagas, no reemplaza la verificación anti-robots).
// Es holgado porque en un evento presencial muchos asistentes comparten el mismo wifi.
const VISTAS = new Map();
function demasiados(ip, clave, max, ventanaMs) {
  const k = clave + ip, ahora = Date.now();
  const lista = (VISTAS.get(k) || []).filter(t => ahora - t < ventanaMs);
  lista.push(ahora); VISTAS.set(k, lista);
  if (VISTAS.size > 5000) VISTAS.clear();
  return lista.length > max;
}

/* Permiso firmado: lo entrega /api/lead y /api/agendar solo acepta ese (no se puede inventar ni cambiar) */
const b64 = s => btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const deB64 = s => atob(s.replace(/-/g, '+').replace(/_/g, '/'));
async function llaveFirma(env) {
  const base = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('firma-formulario|' + env.GHL2_TOKEN));
  return crypto.subtle.importKey('raw', base, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
async function firmar(env, datos) {
  const cuerpo = b64(unescape(encodeURIComponent(JSON.stringify(datos))));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await llaveFirma(env), new TextEncoder().encode(cuerpo)));
  return cuerpo + '.' + b64(String.fromCharCode(...sig));
}
async function verificar(env, token) {
  if (typeof token !== 'string' || token.length > 2000 || !token.includes('.')) return null;
  const [cuerpo, sig] = token.split('.');
  try {
    const bytes = Uint8Array.from(deB64(sig), c => c.charCodeAt(0));
    if (!await crypto.subtle.verify('HMAC', await llaveFirma(env), bytes, new TextEncoder().encode(cuerpo))) return null;
    const datos = JSON.parse(decodeURIComponent(escape(deB64(cuerpo))));
    return datos.exp > Date.now() ? datos : null;
  } catch { return null; }
}

/* ---------- GHL ---------- */
async function ghl(env, ruta, { method = 'GET', body, version = '2021-07-28' } = {}) {
  const r = await fetch(GHL + ruta, {
    method,
    headers: { Authorization: 'Bearer ' + env.GHL2_TOKEN, Version: version, Accept: 'application/json', 'User-Agent': 'FenixFormularioWeb/1.0', ...(body ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  let data = {};
  try { data = await r.json(); } catch { }
  return { ok: r.ok, status: r.status, data };
}

// Ids que no cambian (embudo, etapas, campo de hora local): se buscan por nombre una vez por servidor
let IDS = null;
async function ids(env) {
  if (IDS) return IDS;
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const [p, f] = await Promise.all([ghl(env, '/opportunities/pipelines?locationId=' + LOC), ghl(env, '/locations/' + LOC + '/customFields?model=contact')]);
  const pipe = (p.data.pipelines || []).find(x => norm(x.name).includes('setter 2.0'));
  if (!pipe) throw new Error('No encontré el embudo Setter 2.0');
  const etapa = t => (pipe.stages || []).find(s => norm(s.name).includes(t));
  const atencion = etapa('atencion humana'), agendado = etapa('agendado');
  if (!atencion || !agendado) throw new Error('No encontré las etapas de Setter 2.0');
  const hora = (f.data.customFields || []).find(c => c.fieldKey === 'contact.hora_local_cita');
  IDS = { pipeline: pipe.id, atencion: atencion.id, agendado: agendado.id, horaLocal: hora ? hora.id : null };
  return IDS;
}

/* Disponibilidad: de ahora+90 min hasta 5 días, sin domingos ni festivos, por consultor */
async function libres(env, tier, desdeMs, hastaMs) {
  const res = {};
  await Promise.all(ORDEN[tier].map(async k => {
    const r = await ghl(env, '/calendars/' + CAL[k].id + '/free-slots?startDate=' + desdeMs + '&endDate=' + hastaMs + '&timezone=America/Bogota', { version: '2021-04-15' });
    const minMs = Date.now() + 90 * 60e3;
    const out = [];
    Object.keys(r.data || {}).forEach(d => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(d) || noLaboral(d)) return;
      (r.data[d].slots || []).forEach(s => { const t = Date.parse(s); if (t >= minMs) out.push(t); });
    });
    res[k] = [...new Set(out)].sort((a, b) => a - b);
  }));
  return res;
}
// Ventana de Sofía: 36 h; cada domingo o festivo que cae dentro la alarga un día
function limite36() {
  let lim = Date.now() + 36 * 3600e3, cur = Date.parse(bogDia(Date.now()) + 'T12:00:00-05:00');
  while (cur <= lim + 12 * 3600e3) {
    const d = bogDia(cur);
    if (Date.parse(d + 'T00:00:00-05:00') > lim) break;
    if (noLaboral(d)) lim += 24 * 3600e3;
    cur += 24 * 3600e3;
  }
  return lim;
}
function armarHorarios(tier, porCloser) {
  const lim = limite36(), u = new Map();
  ORDEN[tier].forEach(k => (porCloser[k] || []).forEach(t => { if (t <= lim && !u.has(t)) u.set(t, k); }));
  const opciones = [...u.entries()].sort((a, b) => a[0] - b[0]).map(([ms, cl]) => ({ ms, cl }));
  // Respaldo: el consultor con más espacios en los próximos 2 días hábiles
  const dias = [...new Set(Object.values(porCloser).flat().map(bogDia))].sort().slice(0, 2);
  let mejor = null, n = -1;
  ORDEN[tier].forEach(k => { const c = (porCloser[k] || []).filter(t => dias.includes(bogDia(t))).length; if (c > n) { n = c; mejor = k; } });
  const respaldo = mejor && n > 0 ? { cl: mejor, nombre: CAL[mejor].nombre, dias: dias.map(d => ({ d, slots: porCloser[mejor].filter(t => bogDia(t) === d) })) } : null;
  return { opciones, respaldo };
}

/* ---------- validación ---------- */
function leerRespuestas(a) {
  if (!a || typeof a !== 'object') return null;
  const r = {};
  const v = a.ventas;
  if (!Number.isInteger(v) || v < 1 || v > 1000) return null;
  r.ventas = v;
  for (const k of Object.keys(OPC)) {
    const x = a[k];
    if (x === undefined || x === null) continue;
    if (MULTI.has(k)) {
      if (!Array.isArray(x) || x.length > 10 || !x.every(y => Object.hasOwn(OPC[k], y))) return null;
      r[k] = [...new Set(x)];
    } else {
      if (!Object.hasOwn(OPC[k], x)) return null;
      r[k] = x;
    }
  }
  const ch = a.chatbot_b3 !== undefined ? a.chatbot_b3 : a.chatbot;
  if (ch !== undefined) { if (!Object.hasOwn(OPC.chatbot, ch)) return null; r.chatbot = ch; }
  r.plataforma_otra = limpio(a.plataforma_otra, 60);
  // Mismo filtro del formulario: si no lo pasa, no debió llegar aquí
  const PLATS = ['dropi', 'effi', 'hoko', 'mastershop', 'otra'];
  if (!(r.plataforma || []).some(x => PLATS.includes(x))) return null;
  if (!['pagina', 'whatsapp_redes', 'pagina_whatsapp'].includes(r.canal)) return null;
  if (!(r.pauta || []).some(x => ['meta', 'tiktok', 'google'].includes(x))) return null;
  if (!['contraentrega', 'ambos'].includes(r.pago)) return null;
  r.seguimiento = r.ventas < 20 && r.chatbot === 'chatbot';
  return r;
}
function leerContacto(c) {
  if (!c || typeof c !== 'object') return null;
  const nombre = limpio(c.nombre, 80);
  const tel = typeof c.tel === 'string' ? c.tel.replace(/[^\d]/g, '') : '';
  if (nombre.length < 2 || tel.length < 8 || tel.length > 15) return null;
  // Lo que solo sirve para mostrar (correo, zona, país) nunca hace perder al lead: si viene raro se descarta ese dato
  let mail = limpio(c.mail, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) mail = '';
  let tz = limpio(c.tz, 40);
  try { new Intl.DateTimeFormat('en', { timeZone: tz }); } catch { tz = 'America/Bogota'; }
  let pais = limpio(c.pais, 40);
  if (!/^[\p{L}\p{M} .()'’-]{2,40}$/u.test(pais)) pais = 'Colombia';
  return { nombre, tel: '+' + tel, mail, tz, pais };
}
function etiquetaDe(request) {
  const host = new URL(request.url).hostname;
  const m = host.match(/^(form[a-z]*)\.fenixventures\.co$/);
  return m ? m[1] : 'form-pruebas';
}

/* ---------- notas ---------- */
function horaLocal(ms, tz, pais) {
  const p = {};
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(ms)).forEach(x => p[x.type] = x.value);
  const DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'], MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const d = new Date(Date.parse(p.year + '-' + p.month + '-' + p.day + 'T12:00:00Z'));
  const h = +p.hour, h12 = h % 12 || 12;
  return DIA[d.getUTCDay()] + ', ' + (+p.day) + ' de ' + MES[d.getUTCMonth()] + (h12 === 1 ? ' a la ' : ' a las ') + h12 + ':' + p.minute + (h < 12 ? ' am' : ' pm') + ' (Hora de ' + pais + ')';
}
function notaRespuestas(r, c, etiqueta, origen, tier) {
  const lista = (k, v) => [].concat(v).map(x => OPC[k][x]).join(', ');
  const fuente = FUENTES[etiqueta.replace(/^form/, '')] || 'General';
  const filas = [
    '📝 FORMULARIO WEB · Consultoría Logística Gratis',
    'Entró por: ' + etiqueta + '.fenixventures.co (' + fuente + ')',
    'Resultado: ' + (r.seguimiento ? 'SEGUIMIENTO (vende menos de 20 al día y ya tiene chatbot; no se le ofreció agenda)' : tier + ' · se le mostró la agenda'),
    '',
    'Nombre: ' + c.nombre,
    'WhatsApp: ' + c.tel + ' (' + c.pais + ')',
    'Correo: ' + (c.mail || 'no lo dejó'),
    '',
    'Ventas diarias: ' + r.ventas,
    'Plataformas: ' + lista('plataforma', r.plataforma) + (r.plataforma_otra ? ' (' + r.plataforma_otra + ')' : ''),
    'Le llegan los pedidos por: ' + OPC.canal[r.canal],
    'Pauta en: ' + lista('pauta', r.pauta),
    'Sus clientes pagan: ' + OPC.pago[r.pago]
  ];
  if (r.chatbot) filas.push('Responde los mensajes: ' + OPC.chatbot[r.chatbot]);
  if (r.confirma) filas.push('Confirma los pedidos: ' + OPC.confirma[r.confirma]);
  if (r.problema) filas.push('Principales problemas: ' + lista('problema', r.problema));
  if (r.socios) filas.push('Decisiones: ' + OPC.socios[r.socios]);
  if (origen) filas.push('', 'Origen del clic: ' + origen);
  return filas.join('\n');
}

/* ---------- POST /api/lead ---------- */
async function lead(request, env, cuerpo) {
  const r = leerRespuestas(cuerpo.respuestas), c = leerContacto(cuerpo.contacto);
  if (!r || !c) return falla(400, 'datos');
  const etiqueta = etiquetaDe(request);
  const origen = limpio(cuerpo.origen, 300);
  const tier = tierDe(r.ventas);

  // La agenda se busca al mismo tiempo que se guarda el contacto
  const agenda = r.seguimiento ? null : libres(env, tier, Date.now(), Date.now() + 5 * 86400e3).then(x => armarHorarios(tier, x)).catch(() => null);
  // 1. Contacto: se busca por WhatsApp. Si no existe, se crea completo y con su etiqueta en un solo paso (así cualquier
  //    flujo de GHL que arranque al crearlo ya lo ve con nombre). Si existe, no se crea otro ni se le pisan datos:
  //    solo se llena lo vacío y se le suma la etiqueta.
  const partes = c.nombre.split(' ');
  const nombre = { firstName: partes[0], ...(partes.length > 1 ? { lastName: partes.slice(1).join(' ') } : {}) };
  const [I, dup] = await Promise.all([
    ids(env).catch(e => { console.log('ids', e.message); return null; }),
    ghl(env, '/contacts/search/duplicate?locationId=' + LOC + '&number=' + encodeURIComponent(c.tel))
  ]);
  let ct = dup.ok && dup.data.contact && dup.data.contact.id ? dup.data.contact : null, nuevo = false;
  if (!ct) {
    const base = { locationId: LOC, phone: c.tel, ...nombre, source: 'Formulario web ' + etiqueta, tags: [etiqueta] };
    let cr = await ghl(env, '/contacts/', { method: 'POST', body: c.mail ? { ...base, email: c.mail } : base });
    if (!cr.ok && c.mail) cr = await ghl(env, '/contacts/', { method: 'POST', body: base }); // el correo ya es de otro contacto
    if (cr.ok && cr.data.contact && cr.data.contact.id) { ct = cr.data.contact; nuevo = true; }
  }
  if (!ct) { // último recurso, como Sofía: upsert solo por WhatsApp
    const up = await ghl(env, '/contacts/upsert', { method: 'POST', body: { locationId: LOC, phone: c.tel, source: 'Formulario web ' + etiqueta } });
    ct = up.ok && up.data.contact && up.data.contact.id ? up.data.contact : null;
  }
  if (!ct) return falla(502, 'ghl');
  const cid = ct.id;
  // 2. Notas con todas las respuestas
  const tareas = [ghl(env, '/contacts/' + cid + '/notes', { method: 'POST', body: { body: notaRespuestas(r, c, etiqueta, origen, tier) } })];
  if (!nuevo) {
    // 3. Contacto que ya existía: etiqueta del subdominio (se suma a las que tenga) y solo lo vacío
    tareas.push(ghl(env, '/contacts/' + cid + '/tags', { method: 'POST', body: { tags: [etiqueta] } }));
    const vacio = v => !v || /^[\d\s+().-]+$/.test(String(v).trim());
    const relleno = vacio(ct.firstName) && vacio(ct.lastName) ? { ...nombre } : {};
    if (c.mail && !ct.email) relleno.email = c.mail;
    if (Object.keys(relleno).length) tareas.push(ghl(env, '/contacts/' + cid, { method: 'PUT', body: relleno })
      .then(x => x.ok || !relleno.email ? x : ghl(env, '/contacts/' + cid, { method: 'PUT', body: { ...relleno, email: undefined } })));
  }
  // 4. Oportunidad en Setter 2.0: si ya tiene una abierta se mueve (sin sacarla de Agendado); si no, se crea
  let oid = null;
  if (I) {
    const busq = await ghl(env, '/opportunities/search?location_id=' + LOC + '&pipeline_id=' + I.pipeline + '&contact_id=' + cid + '&status=open');
    const abierta = (busq.data.opportunities || [])[0];
    if (abierta) {
      oid = abierta.id;
      if (abierta.pipelineStageId !== I.agendado) tareas.push(ghl(env, '/opportunities/' + oid, { method: 'PUT', body: { pipelineId: I.pipeline, pipelineStageId: I.atencion, status: 'open' } }));
    } else {
      const nueva = await ghl(env, '/opportunities/', { method: 'POST', body: { locationId: LOC, pipelineId: I.pipeline, pipelineStageId: I.atencion, contactId: cid, name: c.nombre + ' · Formulario web', status: 'open', source: etiqueta } });
      oid = nueva.data && nueva.data.opportunity ? nueva.data.opportunity.id : null;
      if (!oid) console.log('aviso: oportunidad', nueva.status);
    }
  }
  const hechos = await Promise.all(tareas);
  hechos.forEach(h => { if (!h.ok) console.log('aviso GHL', h.status); });

  if (r.seguimiento) return json({ ok: true, seguimiento: true });
  const token = await firmar(env, { c: cid, o: oid, t: tier, n: partes[0], tz: c.tz, p: c.pais, exp: Date.now() + 3 * 3600e3 });
  return json({ ok: true, tier, token, agenda: await agenda });
}

/* ---------- POST /api/agendar ---------- */
async function agendar(request, env, cuerpo) {
  const T = await verificar(env, cuerpo.token);
  if (!T) return falla(401, 'permiso');
  const ms = cuerpo.ms, pedido = cuerpo.cl;
  if (!Number.isInteger(ms) || ms < Date.now() || ms > Date.now() + 10 * 86400e3) return falla(400, 'hora');
  if (!ORDEN[T.t].includes(pedido)) return falla(400, 'consultor');
  // En paralelo: ids de GHL, citas que ya tenga y horarios libres de ese día
  const dia = bogDia(ms);
  const [I, citas, porCloser] = await Promise.all([
    ids(env).catch(() => null),
    ghl(env, '/contacts/' + T.c + '/appointments'),
    libres(env, T.t, Date.parse(dia + 'T00:00:00-05:00'), Date.parse(dia + 'T23:59:59-05:00'))
  ]);
  // Una sola cita por persona: si ya tiene una próxima, no se crea otra
  const proxima = (citas.data.events || []).find(e => leerHoraGhl(e.startTime) > Date.now() && !/cancel|invalid|noshow/i.test(String(e.appointmentStatus || e.appoinmentStatus || '')));
  if (proxima) return json({ ok: true, ya: true, ms: leerHoraGhl(proxima.startTime) });

  // El horario se verifica de nuevo en GHL: primero con el consultor elegido y, si se ocupó, con el siguiente por prioridad
  const cl = (porCloser[pedido] || []).includes(ms) ? pedido : ORDEN[T.t].find(k => (porCloser[k] || []).includes(ms));
  if (!cl) {
    const nuevos = await libres(env, T.t, Date.now(), Date.now() + 5 * 86400e3).then(x => armarHorarios(T.t, x)).catch(() => null);
    return json({ ok: false, error: 'ocupado', agenda: nuevos }, 409);
  }
  const hora = horaLocal(ms, T.tz, T.p);
  // La hora local va antes de la cita: la confirmación de GHL la usa
  if (I && I.horaLocal) await ghl(env, '/contacts/' + T.c, { method: 'PUT', body: { customFields: [{ id: I.horaLocal, field_value: hora }] } });
  const cita = await ghl(env, '/calendars/events/appointments', {
    method: 'POST', version: '2021-04-15',
    body: { calendarId: CAL[cl].id, locationId: LOC, contactId: T.c, assignedUserId: CAL[cl].user, startTime: isoBog(ms), endTime: isoBog(ms + DURACION_MIN * 60e3), title: ('Consultoría Fénix - ' + T.n).slice(0, 70) + ' (' + T.t + ')', appointmentStatus: 'confirmed' }
  });
  if (!cita.ok) {
    console.log('cita rechazada', cita.status);
    const nuevos = await libres(env, T.t, Date.now(), Date.now() + 5 * 86400e3).then(x => armarHorarios(T.t, x)).catch(() => null);
    return json({ ok: false, error: 'ocupado', agenda: nuevos }, 409);
  }
  await Promise.all([
    T.o && I ? ghl(env, '/opportunities/' + T.o, { method: 'PUT', body: { pipelineId: I.pipeline, pipelineStageId: I.agendado, status: 'open' } }) : null,
    ghl(env, '/contacts/' + T.c + '/notes', { method: 'POST', body: { body: '📆 AGENDÓ DESDE EL FORMULARIO WEB\nCon: ' + CAL[cl].nombre + ' (' + T.t + ')\nHora Colombia: ' + horaLocal(ms, 'America/Bogota', 'Colombia') + '\nHora del lead: ' + hora } })
  ]);
  return json({ ok: true, ms, consultor: CAL[cl].nombre });
}

/* ---------- entrada ---------- */
export async function onRequest({ request, env, params }) {
  const ruta = (params.ruta || []).join('/');
  if (request.method !== 'POST') return falla(405, 'metodo');
  // Solo se aceptan llamadas desde la misma página
  const origin = request.headers.get('Origin');
  if (!origin || new URL(origin).host !== new URL(request.url).host) return falla(403, 'origen');
  if (!(request.headers.get('content-type') || '').startsWith('application/json')) return falla(415, 'tipo');
  if (!env.GHL2_TOKEN) return falla(503, 'config');
  const ip = request.headers.get('CF-Connecting-IP') || '?';
  const texto = await request.text();
  if (texto.length > 6000) return falla(413, 'tamano');
  let cuerpo;
  try { cuerpo = JSON.parse(texto); } catch { return falla(400, 'json'); }
  try {
    if (ruta === 'lead') {
      if (demasiados(ip, 'l', 30, 10 * 60e3)) return falla(429, 'espera');
      return await lead(request, env, cuerpo);
    }
    if (ruta === 'agendar') {
      if (demasiados(ip, 'a', 40, 10 * 60e3)) return falla(429, 'espera');
      return await agendar(request, env, cuerpo);
    }
    return falla(404, 'ruta');
  } catch (e) {
    console.log('error', e && e.message);
    return falla(500, 'interno');
  }
}
