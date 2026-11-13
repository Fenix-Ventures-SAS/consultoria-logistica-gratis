/* Formulario de Fénix Ventures: Consultoría Logística Gratis. */
// Si alguien mete la página dentro de otra (clickjacking), se sale del marco
if(window.top!==window.self){try{window.top.location=window.location.href}catch(e){document.documentElement.style.display='none'}}
// Origen del clic: UTM, fbclid e ids de Meta del enlace. Va en la nota del contacto en GHL.
// La fuente (etiqueta formevon, formpmeta…) la pone el servidor según el subdominio por el que entró.
const ORIGEN=(()=>{const q=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','campaign_id','adset_id','ad_id'].forEach(k=>{const v=q.get(k);if(v)o[k]=v.slice(0,300)});return o})();
/* Medición del recorrido, sin datos personales: pantallas, respuestas, errores, clics fuera de botones y salida.
   Va a la base de visitas de Cloudflare (/api/evento) para estudiar dónde avanza y dónde se va cada persona. */
const SES=Array.from(crypto.getRandomValues(new Uint8Array(10)),b=>b.toString(36).padStart(2,'0')).join('');
const META={o:Object.entries(ORIGEN).map(([k,v])=>k+'='+v).join(' · ').slice(0,200),w:screen.width+'x'+screen.height,
  r:(()=>{try{return document.referrer?new URL(document.referrer).hostname:''}catch(e){return ''}})()};
let colaEv=[],pasoAct='',tPaso=performance.now();
function ev(tipo,paso,valor,ms){colaEv.push([tipo,paso==null?pasoAct:paso,valor==null?null:String(valor).slice(0,80),ms==null?null:Math.round(ms),Date.now()]);if(colaEv.length>=20)enviarEv()}
function enviarEv(){if(!colaEv.length)return;const e=colaEv.splice(0,40);
  fetch('/api/evento',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({s:SES,m:META,e}),keepalive:true}).catch(()=>{})}
// Cada cambio de pantalla guarda de cuál venía y cuánto tiempo estuvo en ella
function marcarPaso(p){if(p===pasoAct)return;const t=performance.now();ev('pantalla',p,pasoAct||null,pasoAct?t-tPaso:null);pasoAct=p;tPaso=t}
setInterval(enviarEv,4000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){ev('salida',null,null,performance.now()-tPaso);enviarEv()}else ev('volver')});
// Clics fuera de botones y campos: muestran qué cosas la gente cree que se pueden tocar
document.addEventListener('click',e=>{const t=e.target;if(!(t instanceof Element)||t.closest('button,a,input,select,label,textarea'))return;
  const z=t.closest('[id]'),cl=typeof t.className==='string'&&t.className?t.className.split(' ')[0]:t.tagName.toLowerCase();
  ev('clic_vacio',null,(z?z.id+' ':'')+cl+' '+(t.textContent||'').trim().slice(0,30))},{passive:true});
const GT0={f:'ventas',op:'gt',v:0};
const PLATS=['dropi','effi','hoko','mastershop','otra'],CANAL_OK=['pagina','whatsapp_redes','pagina_whatsapp'],PAUTA_OK=['meta','tiktok','google'];
// Cada pregunta aparece solo si la anterior quedó bien respondida: así ningún descartado llega a los datos
const PAGO_OK={f:'pago',op:'in',vals:['contraentrega','ambos']};
const arr=v=>Array.isArray(v)?v:(v===undefined?[]:[v]);
const descarta=(s,v)=>!!s.end&&(s.endAll?arr(v).length>0&&arr(v).every(x=>s.end.includes(x)):arr(v).some(x=>s.end.includes(x)));
const HIDE_SEG={f:'chatbot_b3',op:'in',vals:['chatbot']};
// Si su socio confirma los pedidos ya sabemos que tiene socios: no se le pregunta
const SOCIO_CONFIRMA={f:'confirma',op:'in',vals:['socio']};
const conSocio=()=>A.socios==='socios'||A.confirma==='socio';
const BOT=[['A mano: yo o mi equipo','manual','img:logos/3d/escribe.webp'],['Con un chatbot','chatbot','img:logos/3d/bot.webp']];
// Si usa chatbot, debajo se abre cuál (pedido de Daniel, 13-nov-2026)
const CHATBOTS=[['Chatea Pro','chateapro','img:logos/chatea.webp'],['LucidBot','lucidbot','img:logos/lucidbot.webp'],['LiliBot','lilibot','img:logos/lilibot.webp'],['Pancake','pancake','img:logos/pancake.webp'],['SellerChat','sellerchat','img:logos/sellerchat.webp'],['Icomfly','icomfly','img:logos/icomfly.webp'],['Otro','otro','img:logos/3d/otra.webp']];
const USA_BOT=[{f:'chatbot',op:'in',vals:['chatbot']},{f:'chatbot_b3',op:'in',vals:['chatbot']}];
// Animación oficial de Dropi (asiente y aparece el ✓); quien pide menos movimiento ve el primer cuadro quieto
const DROPI_ANIM='<picture class="afirma"><source srcset="logos/dropi-afirma-quieto.webp" media="(prefers-reduced-motion: reduce)"><img src="logos/dropi-afirma.webp" alt="Dropi" width="240" height="238"></picture>';
const REQ='<span class="req" aria-hidden="true">*</span>';
const STEPS=[
{k:'ventas',type:'slider',min:0,max:1000,def:0,unit:'ventas diarias',q:'¿Cuántos pedidos vendes al día?',h:'0 = aún no vendo. Arrastra hasta tu promedio.',score:[[0,0,0],[1,10,10],[11,19,15],[20,30,20],[31,69,25],[70,1000,30]],t:'Ventas'},
{k:'plataforma',m:true,q:'¿Con qué plataformas despachas tus pedidos?',h:'Puedes elegir varias.',o:[['Dropi','dropi','img:logos/dropi.webp'],['Effi','effi','img:logos/effi.svg'],['Hoko','hoko','img:logos/hoko.webp'],['MasterShop','mastershop','img:logos/mastershop.webp'],['Otra plataforma','otra','img:logos/3d/otra.webp'],['Despacho directo con una transportadora','transportadora','img:logos/3d/camion.webp'],['No uso ninguna','ninguna','img:logos/3d/no.webp']],end:['transportadora','ninguna'],endAll:true,show:GT0,g:'plataforma',t:'Plataforma'},
{k:'plataforma_otra',type:'text',q:'¿Cuál plataforma usas?',ph:'Escribe el nombre',show:{f:'plataforma',op:'in',vals:['otra']},g:'plataforma',t:'Otra plataforma'},
{k:'canal',q:'¿Por dónde te llegan los pedidos?',o:[['Landing Page','pagina','img:logos/shopify-color.svg'],['Por WhatsApp','whatsapp_redes','img:logos/whatsapp-color.svg'],['Por Landing y WhatsApp','pagina_whatsapp','img2:logos/shopify-color.svg|logos/whatsapp-color.svg'],['Solo por marketplaces (Mercado Libre, Amazon, Falabella, etc.)','solo_marketplace','img:logos/3d/carrito.webp'],['Solo en tienda física','solo_fisica','img:logos/3d/tienda.webp']],end:['solo_marketplace','solo_fisica'],show:{f:'plataforma',op:'in',vals:PLATS},t:'Canal'},
{k:'pauta',m:true,q:'¿Estás pautando para vender?',h:'Puedes elegir varias.',o:[['Sí, en Meta (Facebook o Instagram)','meta','img:logos/meta-color.svg'],['Sí, en TikTok','tiktok','img:logos/tiktok-color.svg'],['Sí, en Google','google','img:logos/google-color.svg'],['No pauto','no','img:logos/3d/no.webp']],end:['no'],endAll:true,show:{f:'canal',op:'in',vals:CANAL_OK},t:'Pauta'},
{k:'pago',q:'¿Cómo te pagan tus clientes?',o:[['Contraentrega','contraentrega','img:logos/3d/billete.webp'],['Contraentrega y anticipado','ambos','img2:logos/3d/billete.webp|logos/3d/tarjeta.webp'],['Solo pago anticipado','anticipado','img:logos/3d/tarjeta.webp']],end:['anticipado'],show:{f:'pauta',op:'in',vals:PAUTA_OK},t:'Pago'},
{k:'vas_bien',type:'message',q:'¡Pasaste el primer filtro!',h:'Cuéntanos ahora 👇🏻',show:PAGO_OK,t:'Mensaje'},
{k:'chatbot_b3',q:'¿Cómo respondes los mensajes de tus clientes?',o:BOT,g:'operacion',show:PAGO_OK,hide:{f:'ventas',op:'gt',v:19},t:'Chatbot'},
{k:'chatbot',q:'¿Cómo respondes los mensajes de tus clientes?',o:BOT,g:'operacion',show:PAGO_OK,hide:{f:'ventas',op:'lt',v:20},t:'Chatbot'},
{k:'chatbot_cual',q:'¿Cuál chatbot usas?',o:CHATBOTS,c3:true,g:'operacion',show:USA_BOT,t:'Cuál chatbot'},
{k:'chatbot_otro',type:'text',q:'¿Cuál es? (opcional)',ph:'Nombre del chatbot',show:{f:'chatbot_cual',op:'in',vals:['otro']},g:'operacion',t:'Otro chatbot'},
{k:'confirma',q:'¿Quién confirma los pedidos?',o:[['Yo mismo','yo','img:logos/3d/persona.webp'],['Mi socio','socio','img:logos/3d/apreton.webp'],['Empleados','empleados','img:logos/3d/equipo.webp'],['Una empresa externa','tercero','img:logos/3d/empresa.webp']],show:PAGO_OK,hide:HIDE_SEG,t:'Quién confirma'},
{k:'problema',m:true,q:'¿Cuáles son los principales problemas de tu tienda hoy?',h:'Puedes elegir varios.',o:[['Devoluciones','devoluciones','img:logos/3d/paquete.webp'],['Confirmar pedidos','confirmaciones','img:logos/3d/telefono.webp'],['Novedades sin resolver','novedades','img:logos/3d/alerta.webp'],['No doy abasto con los chats','atencion','img:logos/3d/chats.webp'],['Me falta tiempo para crecer','tiempo','img:logos/3d/reloj.webp'],['Mis ventas bajaron','ventas_bajaron','img:logos/3d/baja.webp'],['Ninguno, quiero escalar','escalar','img:logos/3d/cohete.webp']],show:PAGO_OK,hide:HIDE_SEG,t:'Problema'},
{k:'socios',q:'¿Tomas las decisiones del negocio solo o con socios?',h:'Si tienes socios, en la consultoría deben estar todos los que deciden.',o:[['Solo yo','solo','img:logos/3d/persona.webp'],['Con socio(s) o pareja','socios','img:logos/3d/apreton.webp']],show:PAGO_OK,hide:[HIDE_SEG,SOCIO_CONFIRMA],t:'Socios'},
{k:'contacto',type:'contact',show:PAGO_OK,t:'Datos'},
{k:'revisando',type:'reveal',show:PAGO_OK,hide:HIDE_SEG,t:'Análisis'}];
const SCREENS=[];STEPS.forEach(s=>{const last=SCREENS[SCREENS.length-1];if(s.g&&last&&last[0].g===s.g)last.push(s);else SCREENS.push([s])});
const isAns=s=>s.o||s.type==='slider';

const OUT={
no_vende:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender, avísanos y ahí estaremos para ti.',kind:'no'},
descartado_plataforma:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a trabajar con Dropi, avísanos y ahí estaremos para ti.',kind:'no'},
descartado_canal:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender por tu propia página o por WhatsApp, avísanos y ahí estaremos para ti.',kind:'no'},
descartado_pauta:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a pautar para vender, avísanos y ahí estaremos para ti.',kind:'no'},
descartado_pago:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender contraentrega, avísanos y ahí estaremos para ti.',kind:'no'},
seguimiento:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender más de 20 pedidos al día, avísanos y ahí estaremos para ti.',kind:'warn'},
b3:{kind:'ok',dur:'llamada de 15 minutos para automatizar tu atención'},
b2:{kind:'ok',dur:'consultoría logística gratuita de 30 minutos'},
b1:{kind:'ok',dur:'consultoría logística gratuita de 30 minutos'}};
const ICO={chev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',ok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
warn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
no:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
gift:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 12.5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 8.5v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 8.5C10.6 5.2 7 4.6 7 6.6S10 8.5 12 8.5zM12 8.5c1.4-3.3 5-3.9 5-1.9S14 8.5 12 8.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
cal:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
pen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'};
const KIND={ok:['#f1f7f3','#0b6b3a'],warn:['#fbf3e1','#8d6208'],no:['#eef2ef','#5f6e64']};

/* Agenda: los horarios reales los entrega el servidor (functions/api) con las reglas de Sofía. Aquí solo se muestran en la hora del país del celular. */
const PAISES=[['593','America/Guayaquil','Ecuador','EC','🇪🇨',9,'99 123 4567'],['595','America/Asuncion','Paraguay','PY','🇵🇾',9,'981 123 456'],['502','America/Guatemala','Guatemala','GT','🇬🇹',8,'5123 4567'],['507','America/Panama','Panamá','PA','🇵🇦',8,'6123 4567'],['56','America/Santiago','Chile','CL','🇨🇱',9,'9 1234 5678'],['52','America/Mexico_City','México','MX','🇲🇽',10,'55 1234 5678'],['54','America/Argentina/Buenos_Aires','Argentina','AR','🇦🇷',10,'11 2345 6789'],['57','America/Bogota','Colombia','CO','🇨🇴',10,'300 123 4567']];
const PAIS_ORDEN=['CO','MX','CL','EC','GT','PA','PY','AR'];
const DIAL='AF93 AX358 AL355 DZ213 AS1684 AD376 AO244 AI1264 AG1268 AR54 AM374 AW297 AU61 AT43 AZ994 BS1242 BH973 BD880 BB1246 BY375 BE32 BZ501 BJ229 BM1441 BT975 BO591 BA387 BW267 BR55 IO246 VG1284 BN673 BG359 BF226 BI257 KH855 CM237 CA1 CV238 BQ599 KY1345 CF236 TD235 CL56 CN86 CX61 CC61 CO57 KM269 CG242 CD243 CK682 CR506 CI225 HR385 CU53 CW599 CY357 CZ420 DK45 DJ253 DM1767 DO1 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FK500 FO298 FJ679 FI358 FR33 GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1473 GP590 GU1671 GT502 GG44 GN224 GW245 GY592 HT509 HN504 HK852 HU36 IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1876 JP81 JE44 JO962 KZ7 KE254 KI686 XK383 KW965 KG996 LA856 LV371 LB961 LS266 LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MQ596 MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 ME382 MS1664 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NC687 NZ64 NI505 NE227 NG234 NU683 NF672 KP850 MK389 MP1670 NO47 OM968 PK92 PW680 PS970 PA507 PG675 PY595 PE51 PH63 PL48 PT351 PR1 QA974 RE262 RO40 RU7 RW250 BL590 SH290 KN1869 LC1758 MF590 PM508 VC1784 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 SG65 SX1721 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 SD249 SR597 SJ47 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TK690 TO676 TT1868 TN216 TR90 TM993 TC1649 TV688 VI1340 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 WF681 EH212 YE967 ZM260 ZW263';
const NOMBRE_PAIS=(()=>{try{const dn=new Intl.DisplayNames(['es'],{type:'region'});return iso=>dn.of(iso)||iso}catch(e){return iso=>iso}})();
const BANDERA=iso=>String.fromCodePoint(...[...iso].map(c=>0x1F1E6+c.charCodeAt(0)-65));
const TZ_PAIS=Object.fromEntries('AF:Asia/Kabul AX:Europe/Mariehamn AL:Europe/Tirane DZ:Africa/Algiers AS:Pacific/Pago_Pago AD:Europe/Andorra AO:Africa/Luanda AI:America/Anguilla AG:America/Antigua AR:America/Argentina/Buenos_Aires AM:Asia/Yerevan AW:America/Aruba AU:Australia/Sydney AT:Europe/Vienna AZ:Asia/Baku BS:America/Nassau BH:Asia/Bahrain BD:Asia/Dhaka BB:America/Barbados BY:Europe/Minsk BE:Europe/Brussels BZ:America/Belize BJ:Africa/Porto-Novo BM:Atlantic/Bermuda BT:Asia/Thimphu BO:America/La_Paz BA:Europe/Sarajevo BW:Africa/Gaborone BR:America/Sao_Paulo IO:Indian/Chagos VG:America/Tortola BN:Asia/Brunei BG:Europe/Sofia BF:Africa/Ouagadougou BI:Africa/Bujumbura KH:Asia/Phnom_Penh CM:Africa/Douala CA:America/Toronto CV:Atlantic/Cape_Verde BQ:America/Kralendijk KY:America/Cayman CF:Africa/Bangui TD:Africa/Ndjamena CL:America/Santiago CN:Asia/Shanghai CX:Indian/Christmas CC:Indian/Cocos CO:America/Bogota KM:Indian/Comoro CG:Africa/Brazzaville CD:Africa/Kinshasa CK:Pacific/Rarotonga CR:America/Costa_Rica CI:Africa/Abidjan HR:Europe/Zagreb CU:America/Havana CW:America/Curacao CY:Asia/Nicosia CZ:Europe/Prague DK:Europe/Copenhagen DJ:Africa/Djibouti DM:America/Dominica DO:America/Santo_Domingo EC:America/Guayaquil EG:Africa/Cairo SV:America/El_Salvador GQ:Africa/Malabo ER:Africa/Asmara EE:Europe/Tallinn SZ:Africa/Mbabane ET:Africa/Addis_Ababa FK:Atlantic/Stanley FO:Atlantic/Faroe FJ:Pacific/Fiji FI:Europe/Helsinki FR:Europe/Paris GF:America/Cayenne PF:Pacific/Tahiti GA:Africa/Libreville GM:Africa/Banjul GE:Asia/Tbilisi DE:Europe/Berlin GH:Africa/Accra GI:Europe/Gibraltar GR:Europe/Athens GL:America/Nuuk GD:America/Grenada GP:America/Guadeloupe GU:Pacific/Guam GT:America/Guatemala GG:Europe/Guernsey GN:Africa/Conakry GW:Africa/Bissau GY:America/Guyana HT:America/Port-au-Prince HN:America/Tegucigalpa HK:Asia/Hong_Kong HU:Europe/Budapest IS:Atlantic/Reykjavik IN:Asia/Kolkata ID:Asia/Jakarta IR:Asia/Tehran IQ:Asia/Baghdad IE:Europe/Dublin IM:Europe/Isle_of_Man IL:Asia/Jerusalem IT:Europe/Rome JM:America/Jamaica JP:Asia/Tokyo JE:Europe/Jersey JO:Asia/Amman KZ:Asia/Almaty KE:Africa/Nairobi KI:Pacific/Tarawa XK:Europe/Belgrade KW:Asia/Kuwait KG:Asia/Bishkek LA:Asia/Vientiane LV:Europe/Riga LB:Asia/Beirut LS:Africa/Maseru LR:Africa/Monrovia LY:Africa/Tripoli LI:Europe/Vaduz LT:Europe/Vilnius LU:Europe/Luxembourg MO:Asia/Macau MG:Indian/Antananarivo MW:Africa/Blantyre MY:Asia/Kuala_Lumpur MV:Indian/Maldives ML:Africa/Bamako MT:Europe/Malta MH:Pacific/Majuro MQ:America/Martinique MR:Africa/Nouakchott MU:Indian/Mauritius YT:Indian/Mayotte MX:America/Mexico_City FM:Pacific/Pohnpei MD:Europe/Chisinau MC:Europe/Monaco MN:Asia/Ulaanbaatar ME:Europe/Podgorica MS:America/Montserrat MA:Africa/Casablanca MZ:Africa/Maputo MM:Asia/Yangon NA:Africa/Windhoek NR:Pacific/Nauru NP:Asia/Kathmandu NL:Europe/Amsterdam NC:Pacific/Noumea NZ:Pacific/Auckland NI:America/Managua NE:Africa/Niamey NG:Africa/Lagos NU:Pacific/Niue NF:Pacific/Norfolk KP:Asia/Pyongyang MK:Europe/Skopje MP:Pacific/Saipan NO:Europe/Oslo OM:Asia/Muscat PK:Asia/Karachi PW:Pacific/Palau PS:Asia/Gaza PA:America/Panama PG:Pacific/Port_Moresby PY:America/Asuncion PE:America/Lima PH:Asia/Manila PL:Europe/Warsaw PT:Europe/Lisbon PR:America/Puerto_Rico QA:Asia/Qatar RE:Indian/Reunion RO:Europe/Bucharest RU:Europe/Moscow RW:Africa/Kigali BL:America/St_Barthelemy SH:Atlantic/St_Helena KN:America/St_Kitts LC:America/St_Lucia MF:America/Marigot PM:America/Miquelon VC:America/St_Vincent WS:Pacific/Apia SM:Europe/San_Marino ST:Africa/Sao_Tome SA:Asia/Riyadh SN:Africa/Dakar RS:Europe/Belgrade SC:Indian/Mahe SL:Africa/Freetown SG:Asia/Singapore SX:America/Lower_Princes SK:Europe/Bratislava SI:Europe/Ljubljana SB:Pacific/Guadalcanal SO:Africa/Mogadishu ZA:Africa/Johannesburg KR:Asia/Seoul SS:Africa/Juba ES:Europe/Madrid LK:Asia/Colombo SD:Africa/Khartoum SR:America/Paramaribo SJ:Arctic/Longyearbyen SE:Europe/Stockholm CH:Europe/Zurich SY:Asia/Damascus TW:Asia/Taipei TJ:Asia/Dushanbe TZ:Africa/Dar_es_Salaam TH:Asia/Bangkok TL:Asia/Dili TG:Africa/Lome TK:Pacific/Fakaofo TO:Pacific/Tongatapu TT:America/Port_of_Spain TN:Africa/Tunis TR:Europe/Istanbul TM:Asia/Ashgabat TC:America/Grand_Turk TV:Pacific/Funafuti VI:America/St_Thomas UG:Africa/Kampala UA:Europe/Kiev AE:Asia/Dubai GB:Europe/London US:America/New_York UY:America/Montevideo UZ:Asia/Tashkent VU:Pacific/Efate VA:Europe/Vatican VE:America/Caracas VN:Asia/Ho_Chi_Minh WF:Pacific/Wallis EH:Africa/El_Aaiun YE:Asia/Aden ZM:Africa/Lusaka ZW:Africa/Harare'.split(' ').map(x=>x.split(':')));
// Países con varias zonas horarias: se usa la principal y se nombra la ciudad para que el lead lo note
const ZONA_CIUDAD={US:'Nueva York',CA:'Toronto',BR:'São Paulo',RU:'Moscú',AU:'Sídney',MX:'Ciudad de México',ID:'Yakarta',KZ:'Almaty',CD:'Kinsasa',MN:'Ulán Bator',KI:'Tarawa',FM:'Pohnpei',PF:'Tahití',ES:'Madrid',PT:'Lisboa'};
const MUNDO=DIAL.split(' ').map(x=>[x.slice(0,2),x.slice(2)]).map(([iso,cod])=>[iso,cod,NOMBRE_PAIS(iso)]).sort((a,b)=>a[2].localeCompare(b[2],'es'));
// Países donde opera Fénix: zona horaria y dígitos exactos. El resto: zona horaria de su país (según el indicativo) y una revisión general de largo.
const paisBy=iso=>{const f=PAISES.find(p=>p[3]===iso);if(f)return f;const w=MUNDO.find(m=>m[0]===iso);return w?[w[1],TZ_PAIS[w[0]]||'America/Bogota',w[2],w[0],BANDERA(w[0]),null,'Número de celular']:null};
const DIAS=['domingo','lunes','martes','miércoles','jueves','viernes','sábado'],MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function country(){if(C.pais&&paisBy(C.pais))return paisBy(C.pais);const t=(C.tel||'').replace(/\D/g,'');return PAISES.find(p=>t.startsWith(p[0]))||PAISES[7]}
function parts(ms,tz){const o={};new Intl.DateTimeFormat('en-CA',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(ms)).forEach(p=>o[p.type]=p.value);return o}
function fmt(ms,long){const tz=country()[1];const p=parts(ms,tz);const tp=parts(Date.now(),tz);const d=p.year+'-'+p.month+'-'+p.day;const t=tp.year+'-'+tp.month+'-'+tp.day;
  const diff=Math.round((Date.parse(d)-Date.parse(t))/864e5);const wd=new Date(Date.parse(d+'T12:00:00Z')).getUTCDay();
  const h=+p.hour,m=p.minute,h12=h%12||12,ap=h<12?'a. m.':'p. m.';const hora=h12+':'+m+' '+ap;
  if(long)return DIAS[wd]+' '+(+p.day)+' de '+MESES[+p.month-1]+' a las '+hora;
  const dia=diff===0?'Hoy':diff===1?'Mañana':DIAS[wd][0].toUpperCase()+DIAS[wd].slice(1);
  return {dia:dia+' '+(+p.day)+' '+MESES[+p.month-1].slice(0,3),hora}}
function tzOff(tz,ms){const p=parts(ms,tz);return (Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute)-ms)/60e3}
function localToMs(d,hh,mm){const tz=country()[1];const guess=Date.parse(d+'T'+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+':00Z');return guess-tzOff(tz,guess)*60e3}
function parseReq(txt){const s=txt.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');const tz=country()[1];const tp=parts(Date.now(),tz);const today=tp.year+'-'+tp.month+'-'+tp.day;
  const addD=n=>new Date(Date.parse(today+'T12:00:00Z')+n*864e5).toISOString().slice(0,10);let day=null,hh=null,mm=0;
  const sinFranja=s.replace(/(en|por|de) la manana/g,' ');
  if(/pasado\s+manana/.test(s))day=addD(2);else if(/\bhoy\b/.test(s))day=addD(0);else if(/\bmanana\b/.test(sinFranja))day=addD(1);
  ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'].forEach((w,i)=>{if(day===null&&new RegExp('\\b'+w+'\\b').test(s)){const curD=new Date(Date.parse(today+'T12:00:00Z')).getUTCDay();let n=(i-curD+7)%7;if(n===0)n=7;day=addD(n)}});
  const dm=s.match(/\b(\d{1,2})\s*(?:\/\s*(\d{1,2})|de\s+(enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre))/);
  if(day===null&&dm){const dd=+dm[1];const mo=dm[2]?+dm[2]:(MESES.indexOf(dm[3])+1);let y=+tp.year;if(mo<+tp.month)y++;day=y+'-'+String(mo).padStart(2,'0')+'-'+String(dd).padStart(2,'0')}
  const rest=dm?s.replace(dm[0],' '):s;
  const tm=rest.match(/(\d{1,2})(?::(\d{2}))?\s*(a\.?\s?m\.?|p\.?\s?m\.?|am|pm|de la manana|de la tarde|de la noche)?/);
  if(tm){hh=+tm[1];mm=tm[2]?+tm[2]:0;const suf=tm[3]||'';if(/p|tarde|noche/.test(suf)&&hh<12)hh+=12;else if(!/a|manana/.test(suf)&&hh>=1&&hh<=7)hh+=12;if(hh>23)hh=null}
  if(hh===null){if(/mediodia/.test(s))hh=12;else if(/(en|por|de) la manana|temprano/.test(s)){hh=9;mm=30}else if(/(en|por|de) la tarde/.test(s))hh=15}
  if(day===null&&hh===null)return null;
  if(day===null){day=addD(0);if(localToMs(day,hh,mm)<Date.now()+90*60e3)day=addD(1)}
  if(hh===null){hh=8;mm=30}
  return localToMs(day,hh,mm)}

let A={},C={},hist=[],cur=-1,fin=null,timers=[],AG=null,LEAD=null,TOKEN=null,ULTIMO=null;
const CARGA_MS=4500;
// Llamada al servidor; si se cae la red o el servidor, se reintenta una vez
async function api(ruta,datos){const una=async()=>{try{const r=await fetch('/api/'+ruta,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(datos),keepalive:true});const j=await r.json().catch(()=>({}));return {...j,status:r.status}}catch(e){return {ok:false,status:0}}};
  const r=await una();return r.status===0||r.status>=500?una():r}
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

function cond(c,ans){const a=ans[c.f];if(a===undefined)return false;
  if(c.op==='in')return arr(a).some(x=>c.vals.includes(x));if(c.op==='gt')return a>c.v;if(c.op==='lt')return a<c.v;if(c.op==='eq')return a===c.v;if(c.op==='between')return a>=c.min&&a<=c.max;return false}
function vis(s,ans){ans=ans||A;if(s.show&&!(Array.isArray(s.show)?s.show.some(c=>cond(c,ans)):cond(s.show,ans)))return false;if(s.hide&&(Array.isArray(s.hide)?s.hide.some(c=>cond(c,ans)):cond(s.hide,ans)))return false;return true}
function scrVis(i,ans){return SCREENS[i].some(s=>vis(s,ans||A))}
function nextScr(i,ans){for(let j=i+1;j<SCREENS.length;j++)if(scrVis(j,ans))return j;return -1}
const OPT={ventas:1,plataforma:['dropi'],canal:'pagina',pauta:['meta'],pago:'contraentrega'};
const optim=(base=A)=>{const o={...base};for(const k in OPT)if(!arr(o[k]).length)o[k]=OPT[k];return o};
const isQ=sc=>sc.some(isAns);
function label(s,v){if(s.type==='slider')return v===0?'0 · aún no vendo':v.toLocaleString('es-CO')+' ventas diarias';if(s.type==='text')return v;if(Array.isArray(v))return v.map(x=>label(s,x)).join(' + ');const o=s.o.find(x=>x[1]===v);return o?o[0]:v}
function ptsVentas(ans){ans=ans||A;let p=0;STEPS.forEach(s=>{const v=ans[s.k];if(v===undefined)return;if(s.type==='slider'){const r=s.score.find(r=>v>=r[0]&&v<=r[1]);if(r)p+=r[2]}});return p}
// Como en dForms: pasar el último filtro (pago contraentrega o ambos) suma 100; así el resultado no depende de opciones como 'transportadora'
function outcome(ans){ans=ans||A;
  if(ans.ventas===0)return'no_vende';
  if(!arr(ans.plataforma).some(x=>PLATS.includes(x)))return'descartado_plataforma';
  if(['solo_marketplace','solo_fisica'].includes(ans.canal))return'descartado_canal';
  if(!arr(ans.pauta).some(x=>PAUTA_OK.includes(x)))return'descartado_pauta';
  if(ans.pago==='anticipado')return'descartado_pago';
  if(ans.chatbot_b3==='chatbot')return'seguimiento';
  const p=ptsVentas(ans);return p>=30?'b1':p>=20?'b2':'b3'}
function clearAfter(k){const i=STEPS.findIndex(s=>s.k===k);STEPS.slice(i+1).forEach(s=>{if(isAns(s)||s.type==='text')delete A[s.k]})}
const ICON=ic=>{if(ic.startsWith('img2:')){const [a,b]=ic.slice(5).split('|');return '<span class="ic im two"><img src="'+a+'" alt=""><img src="'+b+'" alt=""></span>'}
  return '<span class="ic im"><img src="'+ic.slice(4)+'" alt=""></span>'};

function cardsHTML(s){return '<div class="fcards'+(s.c3?' c3':'')+'">'+s.o.map(o=>'<button class="fc'+(arr(A[s.k]).includes(o[1])?' sel':'')+'"'+(s.m?' aria-pressed="'+arr(A[s.k]).includes(o[1])+'"':'')+' data-k="'+s.k+'" data-v="'+o[1]+'">'+ICON(o[2])+'<span class="lb">'+esc(o[0])+'</span></button>').join('')+'</div>'}
// El total de preguntas se calcula sin la respuesta que se está eligiendo, así no cambia mientras la persona decide
function counter(){const sin={...A};SCREENS[cur].forEach(x=>delete sin[x.k]);const ans=optim(sin);const qs=SCREENS.map((sc,i)=>i).filter(i=>scrVis(i,ans)&&isQ(SCREENS[i]));const n=qs.indexOf(cur)+1;return n>0?'<p class="fcount">Pregunta '+n+' de '+qs.length+'</p>':''}
const nameOf=()=>(C.nombre||'').split(' ')[0];

function agendaHTML(){const o=OUT[fin];const nm=nameOf();const pc0=country();const pais='hora de '+pc0[2]+(ZONA_CIUDAD[pc0[3]]?' ('+ZONA_CIUDAD[pc0[3]]+')':'');
  // Si el servidor no pudo guardar, se dice la verdad y se ofrece reintentar (nunca "ya tenemos tus datos")
  if(AG.fallo)return '<div class="result"><div class="badge-ico" style="background:'+KIND.warn[0]+';color:'+KIND.warn[1]+'">'+ICO.warn+'</div><p class="fq">No pudimos guardar tus datos</p><p class="msg">Revisa tu conexión a internet e inténtalo de nuevo.</p><button class="fbtn" id="reint">Intentar de nuevo</button></div>';
  if(AG.sinAgenda)return '<div class="result"><div class="badge-ico" style="background:#f1f7f3;color:#0b6b3a">'+ICO.ok+'</div><p class="fq">¡'+esc(nm||'Listo')+', tu tienda califica!</p><p class="msg">Ya tenemos tus datos. Un consultor te escribe por WhatsApp para agendar tu '+esc(o.dur)+'.</p><button class="flink" id="again">Volver a empezar</button></div>';
  if(AG.booked){const b=AG.booked;return '<div class="result"><div class="badge-ico" style="background:#f1f7f3;color:#0b6b3a">'+ICO.ok+'</div><p class="fq">¡Listo, '+esc(nm||'listo')+'!</p><p class="msg">'+(b.ya?'Ya tienes agendada tu '+esc(o.dur)+' para el':'Quedó agendada tu '+esc(o.dur)+' para el')+' <b>'+esc(fmt(b.ms,true))+'</b>, '+pais+'.</p><ul class="tips"><li>Te llega la invitación por WhatsApp'+(C.mail?' y al correo':'')+'.</li><li>Conéctate desde el computador, con cámara y buena señal.</li>'+(conSocio()?'<li>Conéctate con tus socios: deben estar todos los que deciden.</li>':'')+'</ul><button class="flink" id="again">Volver a empezar</button></div>'}
  const title='<p class="fcount">Agenda</p><p class="fq">'+(fin==='b3'?'¡Listo, '+esc(nm)+'!':'¡'+esc(nm)+', tu tienda califica!')+'</p>';
  const aviso=(AG.note?'<p class="llm">'+AG.note+'</p>':'')+(AG.busy?'<p class="intento">Agendando…</p>':'');
  if(AG.mode==='respaldo'){const R=AG.respaldo;
    return title+'<p class="fh">'+(AG.attempts?'No encontramos ese espacio. ':'')+'Estos son los horarios libres de los próximos dos días. Horarios en '+pais+'.</p>'+aviso+'<div class="calw"><div class="calh">'+ICO.cal+'<div><b>Horarios disponibles</b><small>Próximos 2 días</small></div></div><div class="calg">'+R.dias.map(d=>'<div class="cald"><p>'+esc(fmt(Date.parse(d.d+'T12:00:00-05:00')).dia)+'</p>'+(d.slots.length?d.slots.map(ms=>'<button class="calt" data-ms="'+ms+'" data-cl="'+R.cl+'">'+fmt(ms).hora+'</button>').join(''):'<small>Sin espacios</small>')+'</div>').join('')+'</div></div>'}
  if(!AG.all.length)return title+aviso+'<p class="msg">En este momento no hay horarios libres en la agenda. Ya tenemos tus datos: un consultor te escribe por WhatsApp para agendar tu '+esc(o.dur)+'.</p><button class="flink" id="again">Volver a empezar</button>';
  const list=AG.list.map(x=>{const f=fmt(x.ms);return '<button class="slot" data-ms="'+x.ms+'" data-cl="'+x.cl+'"><span>'+esc(f.dia)+'</span><b>'+f.hora+'</b></button>'}).join('');
  const other='<button class="slot other'+(AG.mode==='other'?' on':'')+'" id="oth"><span>'+ICO.pen+'Otro día u hora</span><b>Escríbelo</b></button>'+
    (AG.mode==='other'?'<div class="othbox"><input class="finput" id="othtxt" placeholder="Ej.: mañana a las 3 pm, el lunes en la mañana" value="'+esc(AG.lastTxt||'')+'"><button class="fbtn" id="othgo">Buscar</button><p class="ferr" id="otherr"></p></div>':'');
  return title+'<p class="fh">Elige el horario de tu '+esc(o.dur)+'. Horarios en '+pais+'.</p>'+aviso+'<div class="slots">'+list+other+'</div><p class="intento">'+(AG.attempts?'Intento '+AG.attempts+' de 2 con otro horario':'')+'</p>'}

// La cita se crea en GHL; si el horario se ocupó en el camino, llegan horarios nuevos
async function book(ms,cl){if(AG.busy)return;AG.busy=true;render();
  const pos=AG.mode==='respaldo'?'respaldo':'opción '+(AG.list.findIndex(x=>x.ms===ms)+1);ev('horario','agenda',pos+' · en '+Math.round((ms-Date.now())/36e5)+' h');
  const r=await api('agendar',{token:TOKEN,ms,cl});if(!AG)return;AG.busy=false;
  if(r.ok){ev(r.ya?'agenda_error':'agendado','agenda',r.ya?'ya tenía cita':cl);AG.booked={ms:r.ms,ya:!!r.ya};render();return}
  if(r.status===409&&r.agenda){ev('ocupado','agenda');startAgenda(r.agenda);AG.note='Ese horario se acaba de ocupar. Elige otro.';render();return}
  ev('agenda_error','agenda',r.error||r.status);
  AG.note='No pudimos agendar en este momento. Ya tenemos tus datos: un consultor te escribe por WhatsApp para confirmar tu cita.';render()}
// Las 5 primeras opciones quedan separadas al menos una hora, como las ofrece Sofía
function espaciar(all){const out=[];all.forEach(x=>{if(out.length<5&&(!out.length||x.ms-out[out.length-1].ms>=3600e3))out.push(x)});return out}
function startAgenda(ag){ev('agenda','agenda',ag?(ag.opciones||[]).length+' opciones':'sin agenda');AG=ag?{all:ag.opciones||[],respaldo:ag.respaldo,mode:'list',attempts:0,note:'',booked:null}:{sinAgenda:true};if(!AG.all)return;AG.list=espaciar(AG.all);if(!AG.all.length&&AG.respaldo)AG.mode='respaldo'}
function searchOther(){const txt=$('othtxt').value.trim();if(!txt){$('otherr').textContent='Escribe el día o la hora que prefieres.';ev('error','agenda','otro vacío');return}
  const ms=parseReq(txt);AG.lastTxt=txt;
  ev('texto','agenda',(ms===null?'no entendió: ':'')+txt.slice(0,60));
  if(ms===null){$('otherr').textContent='No entendí el día o la hora. Prueba así: «mañana a las 3 pm».';return}
  const exact=AG.all.find(x=>x.ms===ms);const said='Entendimos: <b>'+esc(fmt(ms,true))+'</b>.';
  if(exact){AG.note=said;book(exact.ms,exact.cl);return}
  AG.attempts++;
  if(AG.attempts>=2&&AG.respaldo){ev('respaldo','agenda');AG.mode='respaldo';AG.note='';render();return}
  const near=AG.all.slice().sort((a,b)=>Math.abs(a.ms-ms)-Math.abs(b.ms-ms)).slice(0,5).sort((a,b)=>a.ms-b.ms);
  AG.list=near;AG.mode='list';AG.lastTxt='';AG.note=said+' Ese espacio no está libre; estas son las 5 opciones más cercanas.';render()}

function render(){const c=$('card');c.classList.remove('flood');
  const pv=fin?(['b1','b2','b3'].includes(fin)?'agenda':'fin_'+fin):cur<0?'portada':(SCREENS[cur].find(x=>vis(x))||SCREENS[cur][0]);
  const paso=typeof pv==='string'?pv:pv.g||pv.k;if(fin&&paso!==pasoAct){marcarPaso(paso);ev('resultado',paso,fin)}else marcarPaso(paso);
  // Portada en verde oscuro; de la primera pregunta en adelante, fondo beige muy claro
  $('fcard').classList.toggle('osc',cur<0&&!fin);
  if(fin){const o=OUT[fin];
    if(['b1','b2','b3'].includes(fin)){if(!AG)startAgenda(null);c.innerHTML=agendaHTML();
      c.querySelectorAll('.slot[data-ms],.calt').forEach(b=>b.addEventListener('click',()=>book(+b.dataset.ms,b.dataset.cl)));
      if($('oth'))$('oth').addEventListener('click',()=>{if(AG.mode!=='other')ev('otro','agenda');AG.mode=AG.mode==='other'?'list':'other';render();if($('othtxt'))$('othtxt').focus()});
      if($('othgo')){$('othgo').addEventListener('click',searchOther);$('othtxt').addEventListener('keydown',e=>{if(e.key==='Enter')searchOther()})}
      if($('again'))$('again').addEventListener('click',reset);
      if($('reint'))$('reint').addEventListener('click',()=>{ev('reintentar');LEAD=guardar();fin=null;AG=null;render()});return}
    const k=KIND[o.kind];const nm=nameOf();
    c.innerHTML='<div class="result"><div class="badge-ico" style="background:'+k[0]+';color:'+k[1]+'">'+ICO[o.kind]+'</div><p class="fq">'+esc(o.label)+'</p><p class="msg">'+esc(o.msg).replace(/\n/g,'<br>')+'</p><button class="flink" id="again">Volver a empezar</button></div>';
    $('again').addEventListener('click',reset);return}
  if(cur===-1){c.innerHTML='<div class="cover"><div class="emb"><img src="fenix-emblema.webp" alt="Fénix Ventures"></div><div><p class="fq">Consultoría Logística Gratis</p><p class="fh" style="font-size:14.5px;line-height:1.6">Responde unas preguntas rápidas.<br>Empieza y vemos si quedas elegido.</p><button class="fbtn" id="go">Empezar</button><p class="trust">'+ICO.gift+'Obsequio de <img src="dropi-logo.webp" alt="Dropi"></p></div><div class="cend"></div></div>';
    $('go').addEventListener('click',start);sizeEmb();(window.requestIdleCallback||(f=>setTimeout(f,300)))(animarLogo);return}
  const sc=SCREENS[cur];const steps=sc.filter(s=>vis(s));const s=steps[0];
  const backBtn='<button class="flink" id="bk">← Atrás</button>';
  const wire=()=>{$('bk').addEventListener('click',back)};
  if(s.type==='contact'){const seg=A.chatbot_b3==='chatbot';const pc=paisBy(C.pais||'CO');
    const opt=iso=>{const p=paisBy(iso);return '<option value="'+iso+'"'+(pc&&iso===pc[3]?' selected':'')+'>'+p[4]+' '+esc(p[2])+' (+'+p[0]+')</option>'};
    c.innerHTML='<p class="fcount">Tus datos</p><p class="fq">'+(seg?'Te dejamos en seguimiento 💚 ¿Cómo te llamas?':'¿Cómo te llamas?')+REQ+'</p><input class="finput" id="fn" aria-required="true" autocomplete="name" placeholder="Ana Gómez" value="'+esc(C.nombre||'')+'"><label class="flabel" for="ph">'+(seg?'¿A qué WhatsApp te escribimos cuando estés vendiendo más?':'¿A qué número te llamamos? Que tenga WhatsApp.')+REQ+'</label><div class="ftel"><div class="fcc'+(pc?'':' vacio')+'" id="ccb"><span class="flag" id="ccf">'+(pc?pc[4]:'🌎')+'</span><span id="ccv">'+(pc?'+'+pc[0]:'País')+'</span>'+ICO.chev+'<select id="cc" aria-label="País del celular"><optgroup label="Los más frecuentes">'+PAIS_ORDEN.map(opt).join('')+'</optgroup><optgroup label="Todos los países">'+MUNDO.filter(m=>!PAIS_ORDEN.includes(m[0])).map(m=>opt(m[0])).join('')+'</optgroup></select></div><input class="finput" id="ph" aria-required="true" inputmode="tel" autocomplete="tel-national" placeholder="'+(pc?pc[6]:'Número de celular')+'" value="'+esc(C.num||'')+'"></div>'+
      (seg?'':'<label class="flabel" for="em">¿Y tu correo?'+REQ+'</label><input class="finput" id="em" aria-required="true" type="email" autocomplete="email" placeholder="nombre@mitienda.co" value="'+esc(C.mail||'')+'">'+
        (conSocio()?'<label class="flabel" for="sn">Tu socio(a), para invitarlo(a) a la reunión <span class="opc">(opcional)</span></label><div class="fdos"><input class="finput" id="sn" autocomplete="off" maxlength="80" placeholder="Nombre" value="'+esc(A.socio_nombre||'')+'"><input class="finput" id="sc" type="email" inputmode="email" autocomplete="off" maxlength="120" placeholder="Correo" value="'+esc(A.socio_correo||'')+'"></div>':'')+
        // Con socio no va el correo adicional: ya están sus datos y la pantalla quedaría muy cargada (Daniel, 13-nov)
        (conSocio()?'':'<label class="flabel" for="ic">¿Invitas a alguien más? Su correo <span class="opc">(opcional)</span></label><input class="finput" id="ic" type="email" inputmode="email" autocomplete="off" maxlength="120" placeholder="nombre@correo.com" value="'+esc(A.invitado_correo||'')+'">'))+
      '<p class="ferr" id="er"></p><button class="fbtn" id="snd">'+(seg?'Enviar':'Ver horarios')+'</button><div class="fnav" style="padding-top:12px">'+backBtn+'</div>';
    ['fn','ph','em'].forEach(id=>{if($(id))$(id).addEventListener('input',()=>{$('er').textContent='';clearTimeout(tParcial);tParcial=setTimeout(guardarParcial,40000)})});
    [['sn','socio_nombre'],['sc','socio_correo'],['ic','invitado_correo']].forEach(([id,k])=>{if($(id))$(id).addEventListener('input',e=>{$('er').textContent='';const v=e.target.value.trim();if(v)A[k]=v;else delete A[k]})});
    $('cc').addEventListener('change',e=>{const p=paisBy(e.target.value);$('ccb').classList.remove('vacio');$('ccf').textContent=p[4];$('ccv').textContent='+'+p[0];$('ph').placeholder=p[6];$('er').textContent='';$('ph').focus()});
    $('snd').addEventListener('click',send);wire();return}
  if(s.type==='reveal'){c.classList.add('flood');const nm=nameOf();const ini=(C.nombre||'?').split(' ').filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase();
    c.innerHTML='<div class="result vs"><div class="vsrow"><div class="vsm"><span class="vsc ini">'+esc(ini)+'</span><small>'+esc(nm||'Tú')+'</small></div><div class="vsp" id="vsp">0%</div><div class="vsm"><span class="vsc em"><img src="fenix-emblema.webp" alt=""></span><small>Perfil Fénix</small></div></div><p class="vss">Comparando con tiendas que ya escalaron</p><div class="vsbar"><i id="vsb"></i></div><p class="fq">Analizando tu operación</p><p class="fh">'+(nm?esc(nm)+', estamos':'Estamos')+' revisando si pasaste los últimos filtros</p><span class="vsdr">'+DROPI_ANIM+'</span></div>';
    const T=RM?0:CARGA_MS,t0=performance.now();
    // Mientras corre la carga, el servidor crea el contacto en GHL y busca los horarios del consultor que le toca
    const pendiente=LEAD;
    const tick=()=>{if(!$('vsp'))return;const k=Math.min(1,(performance.now()-t0)/(T||1));$('vsp').textContent=Math.round(k*100)+'%';$('vsb').style.width=Math.round(k*100)+'%';if(k<1&&!fin)requestAnimationFrame(tick)};
    if(T)requestAnimationFrame(tick);else{$('vsp').textContent='100%'}
    timers.push(setTimeout(async()=>{const r=pendiente?await pendiente:null;if(LEAD!==pendiente||fin||!$('vsp'))return;
      TOKEN=r&&r.ok?r.token:null;if(r&&r.ok)startAgenda(r.agenda||null);else AG={fallo:true};fin=outcome();render()},T));return}
  if(s.type==='message'){
    c.innerHTML='<div class="result"><span class="msg-logo">'+DROPI_ANIM+'</span><p class="fq">'+esc(s.q)+'</p><p class="msg">'+esc(s.h)+'</p><button class="fbtn" id="cont">Continuar</button></div><div class="fnav">'+backBtn+'</div>';
    $('cont').addEventListener('click',advance);wire();return}
  if(s.type==='slider'){const v=A.ventas!==undefined?A.ventas:s.def;
    // Escala en dos tramos (pedido de Daniel): la primera mitad de la barra va de 0 a 100 pedidos, donde está
    // la mayoría, y la segunda de 100 a 1.000. Cada mitad tiene 900 posiciones: cualquier número es alcanzable.
    const N=900,aVal=p=>p<=N?Math.round(p*100/N):100+(p-N),aPos=x=>x<=100?Math.round(x*N/100):N+(x-100);
    c.innerHTML=counter()+'<p class="fq">'+esc(s.q)+REQ+'</p><p class="fh">'+esc(s.h)+'</p><div class="sld"><div class="sval"><span><b id="sv">'+v.toLocaleString('es-CO')+'</b><small>'+esc(s.unit)+'</small></span></div><input type="range" id="sr" min="0" max="'+(2*N)+'" step="1" value="'+aPos(v)+'" aria-label="Ventas diarias" aria-valuetext="'+v+' ventas diarias"><div class="dedo" id="dd" aria-hidden="true" style="--p:'+(aPos(v)/(2*N))+'"><img src="logos/emoji/1f446-1f3fb.svg" alt=""></div></div><button class="fbtn" id="nx" style="margin-top:22px">Siguiente</button><div class="fnav">'+backBtn+'</div>';
    const pinta=()=>{const x=aVal(+$('sr').value);$('sv').textContent=x.toLocaleString('es-CO');$('sr').setAttribute('aria-valuetext',x+' ventas diarias');$('dd').style.setProperty('--p',$('sr').value/(2*N))};
    let movio=false;$('sr').addEventListener('input',()=>{pinta();if(!movio){movio=true;ev('desliza')}});
    // Con el teclado las flechas avanzan de a un pedido (y Re Pág / Av Pág de a 10), no de a una posición
    $('sr').addEventListener('keydown',e=>{const d={ArrowRight:1,ArrowUp:1,ArrowLeft:-1,ArrowDown:-1,PageUp:10,PageDown:-10}[e.key];if(!d)return;e.preventDefault();
      $('sr').value=aPos(Math.min(1000,Math.max(0,aVal(+$('sr').value)+d)));pinta()});
    $('nx').addEventListener('click',()=>{const x=aVal(+$('sr').value);ev('respuesta','ventas',x);setAns('ventas',x);advance()});wire();return}
  const multi=steps.filter(x=>x.o).length>1;
  c.innerHTML=counter()+steps.map(x=>x.type==='text'?'<div class="grp"><label class="flabel" for="tx_'+x.k+'">'+esc(x.q)+'</label><input class="finput" id="tx_'+x.k+'" data-t="'+x.k+'"'+(x.it==='email'?' type="email" inputmode="email" autocomplete="off" maxlength="120"':' maxlength="80"')+' placeholder="'+esc(x.ph||'')+'" value="'+esc(A[x.k]||'')+'"></div>':'<div class="grp"><p class="fq'+(multi?' sm':'')+'">'+esc(x.q)+REQ+'</p>'+(x.h?'<p class="fh">'+esc(x.h)+'</p>':'')+cardsHTML(x)+'</div>').join('')+'<p class="ferr" id="er"></p><button class="fbtn" id="nx">Siguiente</button><div class="fnav">'+backBtn+'</div>';
  c.querySelectorAll('.fc').forEach(b=>b.addEventListener('click',()=>{toggle(b.dataset.k,b.dataset.v);render();const t=c.querySelector('[data-t]');if(t)t.focus()}));
  c.querySelectorAll('[data-t]').forEach(t=>t.addEventListener('input',()=>{A[t.dataset.t]=t.value}));
  $('nx').addEventListener('click',()=>{const miss=sc.filter(x=>vis(x)&&x.o&&!arr(A[x.k]).length);if(miss.length){$('er').textContent='Elige una opción para seguir.';ev('error',null,'sin opción');return}
    const malo=sc.find(x=>vis(x)&&x.it==='email'&&(A[x.k]||'').trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(A[x.k].trim()));
    if(malo){$('er').textContent='Revisa el correo: parece incompleto.';ev('error',null,'correo '+malo.k);$('tx_'+malo.k).focus();return}
    sc.filter(x=>vis(x)).forEach(x=>{if(x.o)ev('respuesta',x.k,arr(A[x.k]).join('+'));else if(x.type==='text'&&(A[x.k]||'').trim())ev('respuesta',x.k,x.pd?'lleno':A[x.k])});
    const ko=sc.find(x=>vis(x)&&descarta(x,A[x.k]));if(ko){hist.push(cur);fin=outcome();render();return}advance()});wire()}

function clearT(){timers.forEach(clearTimeout);timers=[]}
function setAns(k,v){A[k]=v;clearAfter(k)}
function toggle(k,v){const s=STEPS.find(x=>x.k===k);if(!s.m){setAns(k,v);return}const c0=arr(A[k]);const nx=c0.includes(v)?c0.filter(x=>x!==v):c0.concat(v);setAns(k,nx.length?nx:undefined)}
// Precarga en segundo plano los íconos de todas las preguntas, para que cada pantalla aparezca al instante
function precargarIconos(){const urls=new Set();
  STEPS.forEach(s=>(s.o||[]).forEach(o=>{const ic=o[2];
    if(ic.startsWith('img2:'))ic.slice(5).split('|').forEach(u=>urls.add(u));
    else if(ic.startsWith('img:'))urls.add(ic.slice(4))}));
  urls.add(RM?'logos/dropi-afirma-quieto.webp':'logos/dropi-afirma.webp');
  urls.forEach(u=>{const i=new Image();i.decoding='async';i.src=u})}
let iconosPrecargados=false;
// Logo animado de la portada (13-nov, pedido de Daniel): el fénix vuela y forma el logo, una vez por visita.
// Si no le convence, la alternativa sobria es el brillo de sol de la rama logo-sol.
// Se baja después de mostrar la página, y no corre con ahorro de datos, conexión 2G o «menos movimiento».
// Al terminar se funde en el logo oficial, que siempre estuvo debajo.
let animLogo=false;
function animarLogo(){const cn=navigator.connection;if(animLogo||RM||(cn&&(cn.saveData||/2g/.test(cn.effectiveType||''))))return;animLogo=true;
  const im=new Image();im.className='anim';im.alt='';im.decoding='async';im.src='logos/fenix-anima.webp';
  im.decode().then(()=>{const e=document.querySelector('.cover .emb');if(cur!==-1||!e)return;e.appendChild(im);
    setTimeout(()=>im.classList.add('fuera'),4500);setTimeout(()=>im.remove(),5200)}).catch(()=>{})}
// Anti-robots de Cloudflare (Turnstile): casi siempre invisible; solo pide un clic si ve algo sospechoso.
// Se carga al empezar, así el permiso está listo cuando la persona deja sus datos.
const TS_KEY='0x4AAAAAAF-8NxKnzOw1XekY';let tsId=null,tsTok=null,tsFallo=false;const tsEspera=[];
function cargarTS(){if(window.tsListo)return;
  window.tsListo=()=>{const d=document.createElement('div');d.id='ts';$('fcard').appendChild(d);if(window.ResizeObserver)new ResizeObserver(pedirAjuste).observe(d);
    tsId=turnstile.render(d,{sitekey:TS_KEY,appearance:'interaction-only',theme:'light',language:'es',
      callback:t=>{tsFallo=false;const f=tsEspera.shift();if(f)f(t);else tsTok=t},'expired-callback':()=>{tsTok=null},
      // Si Cloudflare no logra revisar, no se espera: se envía igual y el servidor deja el lead marcado para revisar
      'error-callback':()=>{tsTok=null;tsFallo=true;tsEspera.splice(0).forEach(f=>f(''))}})};
  const s=document.createElement('script');s.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=tsListo&render=explicit';s.async=true;document.head.appendChild(s)}
// Entrega un permiso de un solo uso (espera hasta 15 s si aún se está verificando) y pide otro para el siguiente envío
function tokenTS(){return new Promise(res=>{let listo=false;
  const usar=t=>{if(listo)return;listo=true;tsTok=null;if(tsId!==null)setTimeout(()=>{try{window.turnstile.reset(tsId)}catch(e){}},0);res(t)};
  if(tsTok)return usar(tsTok);if(tsFallo){tsFallo=false;return usar('')}tsEspera.push(usar);
  setTimeout(()=>{const i=tsEspera.indexOf(usar);if(i>=0)tsEspera.splice(i,1);if(!listo){listo=true;res('')}},8000)})}
function start(){ev('empezar','portada');clearT();hist=[];AG=null;cur=nextScr(-1,{ventas:1});render();cargarTS();
  if(!iconosPrecargados){iconosPrecargados=true;(window.requestIdleCallback||(f=>setTimeout(f,200)))(precargarIconos)}}
function advance(){hist.push(cur);const n=nextScr(cur);if(n<0){fin=outcome()}else cur=n;render()}
function back(){ev('atras');clearT();fin=null;AG=null;cur=hist.length?hist.pop():-1;render()}
// Dígitos exactos del celular, sin indicativo ni 0 inicial. Los 8 países de Fénix los traen en PAISES; estos son los demás mercados.
// Territorios del Caribe con indicativo +1xxx: 7 dígitos. Países que no estén aquí: revisión general de largo.
const LARGO={PE:[9],VE:[10],BO:[8],UY:[8],BR:[10,11],CR:[8],SV:[8],HN:[8],NI:[8],DO:[10],CU:[8],PR:[10],US:[10],CA:[10],ES:[9],PT:[9],IT:[9,10],FR:[9],DE:[10,11],GB:[10],HT:[8],BZ:[7],GY:[7],SR:[7]};
const largos=p=>p[5]?[p[5]]:LARGO[p[3]]||(p[0].length===4&&p[0][0]==='1'?[7]:null);
// Lee la pantalla de datos: m es el aviso de nombre o celular; mc, el del correo (obligatorio solo al tocar el botón)
function leerDatos(){const n=$('fn').value.trim(),iso=$('cc').value,p=iso?paisBy(iso):null,e=$('em')?$('em').value.trim():'';let t=$('ph').value.replace(/\D/g,'');let m='';
  const L=p?largos(p):null;
  if(p){if(t.startsWith(p[0])&&t.length>(L?Math.max(...L):10))t=t.slice(p[0].length);t=t.replace(/^0+/,'')}
  if(!n)m='Escribe tu nombre para continuar.';else if(!p)m='Elige el país de tu celular para continuar.';
  else if(L&&!L.includes(t.length)&&!(p[3]==='AR'&&t.length===11&&t[0]==='9'))m='Revisa el número: en '+p[2]+' el celular tiene '+L.join(' u ')+' dígitos, sin el +'+p[0]+'.';
  else if(!L&&(t.length<6||t.length>14))m='Revisa el número: parece incompleto.';
  const mc=$('em')&&!e?'Escribe tu correo para continuar.':e&&!/^\S+@\S+\.\S+$/.test(e)?'Revisa el correo: parece incompleto.':'';
  return {n,iso,p,t,e,m,mc,contacto:p?{nombre:n,tel:p[0]+t,mail:mc?'':e,tz:p[1],pais:p[2]}:null}}
function send(){const d=leerDatos(),m=d.m||d.mc;
  if(m){$('er').textContent=m;ev('error',null,m);return}
  const malo=[['sc','socio_correo','Revisa el correo de tu socio(a): parece incompleto.'],['ic','invitado_correo','Revisa el correo de la persona que invitas: parece incompleto.']].find(([id])=>$(id)&&$(id).value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test($(id).value.trim()));
  if(malo){$('er').textContent=malo[2];ev('error',null,'correo '+malo[1]);$(malo[0]).focus();return}
  ['socio_nombre','socio_correo','invitado_correo'].forEach(k=>{if(A[k])ev('respuesta',k,'lleno')});
  clearTimeout(tParcial);C={nombre:d.n,pais:d.iso,num:d.t,tel:'+'+d.p[0]+' '+d.t,mail:d.e};AG=null;TOKEN=null;
  ULTIMO={respuestas:A,contacto:d.contacto,origen:META.o,s:SES};
  ev('datos','contacto',d.iso);LEAD=guardar();
  advance()}
// Si deja nombre y WhatsApp válidos pero no toca el botón, igual quedan en GHL para contactarlo:
// se guardan al salir o cambiar de pestaña, o tras 40 s sin escribir. Si después toca el botón, se completa la misma nota.
let PARCIAL=null,tParcial=null;
function guardarParcial(){if(LEAD||!$('fn')||!$('cc'))return;const d=leerDatos();if(d.m||d.n.length<2)return;
  const firma=JSON.stringify(d.contacto);if(PARCIAL&&PARCIAL.firma===firma)return;
  ev('parcial','contacto',d.iso);
  PARCIAL={firma,envio:tokenTS().then(ts=>api('lead',{respuestas:A,contacto:d.contacto,origen:META.o,s:SES,parcial:true,ts}))};enviarEv()}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')guardarParcial()});
window.addEventListener('pagehide',guardarParcial);
// Envía los datos al servidor (con el permiso anti-robots) y deja registrado si se guardaron
function guardar(){return (PARCIAL?PARCIAL.envio:Promise.resolve(null)).then(pr=>tokenTS().then(ts=>api('lead',{...ULTIMO,ts,...(pr&&pr.nota?{nota:pr.nota}:{})}))).then(r=>{ev('guardado','contacto',r&&r.ok?'ok':'fallo '+(r&&(r.error||r.status)));return r})}
function reset(){ev('reinicio');clearT();clearTimeout(tParcial);A={};C={};hist=[];cur=-1;fin=null;AG=null;LEAD=null;TOKEN=null;ULTIMO=null;PARCIAL=null;render()}

function sizeEmb(){const fw=document.querySelector('.fword'),fc=document.querySelector('.fcard');
  if(fw&&fc){const w=fw.getBoundingClientRect().width;if(w>0)fc.style.setProperty('--emb',Math.round(w*335/645)+'px')}}
// Ninguna pantalla obliga a bajar (pedido de Daniel, 13-nov): si lo que se ve no cabe en la tarjeta, se compacta por niveles
// (k1: márgenes e íconos; k2: opciones en fila) y, como último recurso, todo se reduce parejo hasta que quepa.
let tAjuste=0;
function ajustar(){const f=$('fcard'),c=$('card');if(!f||!c)return;f.classList.remove('k1','k2');c.style.zoom='';
  const sobra=()=>{const fin=Math.min(c.getBoundingClientRect().bottom,innerHeight)-parseFloat(getComputedStyle(c).paddingBottom||0)*(+c.style.zoom||1);
    let abajo=0;for(const e of c.children){const r=e.getBoundingClientRect();if(r.height)abajo=Math.max(abajo,r.bottom)}
    return abajo>fin+1||document.documentElement.scrollHeight>innerHeight+1};
  if(!sobra())return;f.classList.add('k1');if(!sobra())return;f.classList.add('k2');if(!sobra())return;
  let z=1;for(let i=0;i<10&&sobra();i++){z=Math.max(.55,z-.04);c.style.zoom=z}}
function pedirAjuste(){cancelAnimationFrame(tAjuste);tAjuste=requestAnimationFrame(ajustar)}
new MutationObserver(pedirAjuste).observe($('fcard'),{childList:true,subtree:true,characterData:true});
// Al girar o cambiar el tamaño se vuelve a medir, pero no mientras se escribe (el teclado también cambia el alto)
addEventListener('resize',()=>{const a=document.activeElement;if(!a||!/INPUT|SELECT|TEXTAREA/.test(a.tagName))pedirAjuste()});
render();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{sizeEmb();pedirAjuste()});
