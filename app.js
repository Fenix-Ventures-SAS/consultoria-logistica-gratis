/* Formulario de Fénix Ventures: Consultoría Logística Gratis.
   Generado desde la simulación con construir.py; no editar a mano. */
const CONFIG={modoPrueba:true,api:''};
// Si alguien mete la página dentro de otra (clickjacking), se sale del marco
if(window.top!==window.self){try{window.top.location=window.location.href}catch(e){document.documentElement.style.display='none'}}
// Origen del lead: UTM, fbclid e ids de Meta del enlace (se guardan con la respuesta cuando el formulario se conecte)
const ORIGEN=(()=>{const q=new URLSearchParams(location.search),o={};['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','campaign_id','adset_id','ad_id'].forEach(k=>{const v=q.get(k);if(v)o[k]=v.slice(0,300)});return o})();
const GT0={f:'ventas',op:'gt',v:0};
const PLATS=['dropi','effi','hoko','mastershop','otra'],CANAL_OK=['pagina','whatsapp_redes','pagina_whatsapp'],PAUTA_OK=['meta','tiktok','google'];
// Cada pregunta aparece solo si la anterior quedó bien respondida: así ningún descartado llega a los datos
const PAGO_OK={f:'pago',op:'in',vals:['contraentrega','ambos']};
const arr=v=>Array.isArray(v)?v:(v===undefined?[]:[v]);
const descarta=(s,v)=>!!s.end&&(s.endAll?arr(v).length>0&&arr(v).every(x=>s.end.includes(x)):arr(v).some(x=>s.end.includes(x)));
const HIDE_SEG={f:'chatbot_b3',op:'in',vals:['chatbot']};
const BOT=[['A mano: yo o mi equipo','manual','🙋'],['Con un chatbot (Chatea Pro, LucidBot, Lilibot, Pancake, SellerChat u otro)','chatbot','img:logos/chatea-mark.png']];
const STEPS=[
{k:'ventas',type:'slider',min:0,max:1000,def:0,unit:'ventas diarias',q:'¿Cuántos pedidos vendes al día?',h:'0 = aún no vendo. Arrastra hasta tu promedio.',score:[[0,0,0],[1,10,10],[11,19,15],[20,30,20],[31,69,25],[70,1000,30]],t:'Ventas'},
{k:'plataforma',m:true,q:'¿Con qué plataformas despachas tus pedidos?',h:'Puedes elegir varias.',o:[['Dropi','dropi','img:logos/dropi.png'],['Effi','effi','img:logos/effi.svg'],['Hoko','hoko','img:logos/hoko.png'],['MasterShop','mastershop','img:logos/mastershop.png'],['Otra plataforma','otra','➕'],['Despacho directo con una transportadora','transportadora','🚚'],['No uso ninguna','ninguna','🚫']],end:['transportadora','ninguna'],endAll:true,show:GT0,g:'plataforma',t:'Plataforma'},
{k:'plataforma_otra',type:'text',q:'¿Cuál plataforma usas?',ph:'Escribe el nombre',show:{f:'plataforma',op:'in',vals:['otra']},g:'plataforma',t:'Otra plataforma'},
{k:'canal',q:'¿Por dónde te llegan los pedidos?',o:[['Landing Page','pagina','img:logos/shopify-color.svg'],['Por WhatsApp','whatsapp_redes','img:logos/whatsapp-color.svg'],['Por Landing y WhatsApp','pagina_whatsapp','img2:logos/shopify-color.svg|logos/whatsapp-color.svg'],['Solo por marketplaces (Mercado Libre, Amazon, Falabella, etc.)','solo_marketplace','🛒'],['Solo en tienda física','solo_fisica','🏬']],end:['solo_marketplace','solo_fisica'],show:{f:'plataforma',op:'in',vals:PLATS},t:'Canal'},
{k:'pauta',m:true,q:'¿Estás pautando para vender?',h:'Puedes elegir varias.',o:[['Sí, en Meta (Facebook o Instagram)','meta','img:logos/meta-color.svg'],['Sí, en TikTok','tiktok','img:logos/tiktok-color.svg'],['Sí, en Google','google','img:logos/google-color.svg'],['No pauto','no','🚫']],end:['no'],endAll:true,show:{f:'canal',op:'in',vals:CANAL_OK},t:'Pauta'},
{k:'pago',q:'¿Cómo te pagan tus clientes?',o:[['Contraentrega','contraentrega','💵'],['Contraentrega y anticipado','ambos','🔀'],['Solo pago anticipado','anticipado','💳']],end:['anticipado'],show:{f:'pauta',op:'in',vals:PAUTA_OK},t:'Pago'},
{k:'vas_bien',type:'message',q:'¡Pasaste el primer filtro!',h:'Cuéntanos ahora 👇🏻',show:PAGO_OK,t:'Mensaje'},
{k:'chatbot_b3',q:'¿Cómo respondes los mensajes de tus clientes?',o:BOT,g:'operacion',show:PAGO_OK,hide:{f:'ventas',op:'gt',v:19},t:'Chatbot'},
{k:'chatbot',q:'¿Cómo respondes los mensajes de tus clientes?',o:BOT,g:'operacion',show:PAGO_OK,hide:{f:'ventas',op:'lt',v:20},t:'Chatbot'},
{k:'confirma',q:'¿Quién confirma los pedidos?',o:[['Yo mismo','yo','🙋'],['Mi socio','socio','🤝'],['Empleados','empleados','👥'],['Una empresa externa','tercero','🏢'],['Un bot','bot','🤖']],g:'operacion',show:PAGO_OK,hide:HIDE_SEG,t:'Quién confirma'},
{k:'problema',m:true,q:'¿Cuáles son los principales problemas de tu tienda hoy?',h:'Puedes elegir varios.',o:[['Devoluciones','devoluciones','📦'],['Confirmar pedidos','confirmaciones','☎️'],['Novedades sin resolver','novedades','⚠️'],['No doy abasto con los chats','atencion','💬'],['Me falta tiempo para crecer','tiempo','⏳'],['Mis ventas bajaron','ventas_bajaron','📉'],['Ninguno, quiero escalar','escalar','🚀']],show:PAGO_OK,hide:HIDE_SEG,t:'Problema'},
{k:'socios',q:'¿Tomas las decisiones del negocio solo o con socios?',h:'Si tienes socios, en la consultoría deben estar todos los que deciden.',o:[['Solo yo','solo','🙋'],['Con socio(s) o pareja','socios','🤝']],show:PAGO_OK,hide:HIDE_SEG,t:'Socios'},
{k:'contacto',type:'contact',show:PAGO_OK,t:'Datos'},
{k:'revisando',type:'reveal',show:PAGO_OK,hide:HIDE_SEG,t:'Análisis'}];
const SCREENS=[];STEPS.forEach(s=>{const last=SCREENS[SCREENS.length-1];if(s.g&&last&&last[0].g===s.g)last.push(s);else SCREENS.push([s])});
const STITLE=sc=>sc[0].g==='operacion'?'Operación':sc[0].t;
const isAns=s=>s.o||s.type==='slider';

const OUT={
no_vende:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender, avísanos y ahí estaremos para ti.',pill:['p-no','Descartado · no vende'],kind:'no',ghl:'No se crea: no dejó datos',tier:'—',acc:'Ninguno',ev:[]},
descartado_plataforma:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a trabajar con Dropi, avísanos y ahí estaremos para ti.',pill:['p-no','Descartado · sin plataforma'],kind:'no',ghl:'No se crea: no dejó datos',tier:'—',acc:'Ninguno',ev:[]},
descartado_canal:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender por tu propia página o por WhatsApp, avísanos y ahí estaremos para ti.',pill:['p-no','Descartado · canal'],kind:'no',ghl:'No se crea: no dejó datos',tier:'—',acc:'Ninguno',ev:[]},
descartado_pauta:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a pautar para vender, avísanos y ahí estaremos para ti.',pill:['p-no','Descartado · no pauta'],kind:'no',ghl:'No se crea: no dejó datos',tier:'—',acc:'Ninguno',ev:[]},
descartado_pago:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender contraentrega, avísanos y ahí estaremos para ti.',pill:['p-no','Descartado · solo anticipado'],kind:'no',ghl:'No se crea: no dejó datos',tier:'—',acc:'Ninguno',ev:[]},
seguimiento:{label:'Gracias por contactarnos.',msg:'Tristemente para nosotros, no tenemos cómo aportarle valor a tu negocio en este momento y preferimos ser sinceros 🥲\n\nCuando empieces a vender más de 20 pedidos al día, avísanos y ahí estaremos para ti.',kind:'warn',pill:['p-warn','Seguimiento'],ghl:'Seguimiento',tier:'Sin ruta de agenda',acc:'Sin agenda; se retoma cuando venda más',ev:['Filtro_1']},
b3:{kind:'ok',pill:['p-ok','B3 · 1 a 19 pedidos, manual'],acc:'Agenda en el formulario la llamada de 15 minutos con Sonia o Yucelis',ev:['Filtro_1','Calificado_B3','Lead_Valido'],dur:'llamada de 15 minutos para automatizar tu atención'},
b2:{kind:'ok',pill:['p-ok','B2 · 20 a 69 pedidos'],acc:'Agenda en el formulario con Sonia, Yucelis o Ricardo',ev:['Filtro_1','Calificado_B2','Lead_Calificado','Lead_Valido'],dur:'consultoría logística gratuita de 30 minutos'},
b1:{kind:'ok',pill:['p-ok','B1 · 70 o más pedidos'],acc:'Agenda en el formulario con Ricardo, Daniel o Felipe (Sonia si no hay espacio)',ev:['Filtro_1','Calificado_B1','Lead_Calificado','Lead_Valido'],dur:'consultoría logística gratuita de 30 minutos'}};
const ghlOf=n=>n<=10?['1-10 Ventas diarias','Media']:n<=30?['11-30 Ventas Diarias','A']:['30+ Ventas diarias','AA'];
const BASE={ventas:90,plataforma:['dropi'],canal:'pagina',pauta:['meta'],pago:'contraentrega',chatbot_b3:'manual',chatbot:'chatbot',confirma:'yo',problema:['devoluciones','confirmaciones'],socios:'solo'};
const ROUTES=[
['B1 · 70 o más pedidos',{},'b1'],
['B2 · 31 a 69 pedidos',{ventas:45},'b2'],
['B2 · 20 a 30 pedidos, con chatbot',{ventas:25},'b2'],
['B3 · 11 a 19 pedidos, atiende a mano',{ventas:15},'b3'],
['B3 · 1 a 10 pedidos, atiende a mano',{ventas:8},'b3'],
['1 a 10 pedidos, con chatbot',{ventas:8,chatbot_b3:'chatbot'},'seguimiento'],
['Aún no vende (0)',{ventas:0},'no_vende'],
['Dropi y además transportadora directa',{plataforma:['dropi','transportadora']},'b1'],
['Solo despacho directo con transportadora',{plataforma:['transportadora']},'descartado_plataforma'],
['Vende solo por marketplaces',{canal:'solo_marketplace'},'descartado_canal'],
['Vende solo en tienda física',{canal:'solo_fisica'},'descartado_canal'],
['No pauta',{pauta:['no']},'descartado_pauta'],
['Solo pago anticipado',{pago:'anticipado'},'descartado_pago']];
const GROUPS=[['Califican','Agendan en el mismo formulario, con la lógica de Sofía.',['b1','b2','b3']],['Seguimiento','No agendan; dejan nombre y WhatsApp para retomarlos cuando vendan más.',['seguimiento']],['Descartes','Terminan apenas dan la respuesta que descarta y no dejan datos.',['no_vende','descartado_plataforma','descartado_canal','descartado_pauta','descartado_pago']]];
const SAMPLE={nombre:'Ana Gómez',pais:'CO',num:'3001234567',tel:'+57 3001234567',mail:'ana@mitienda.co'};
const ICO={chev:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',ok:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
warn:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v6M12 16.5v.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
no:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 12h10" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
play:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/></svg>',
gift:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="8.5" width="17" height="4" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5 12.5v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7M12 8.5v12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 8.5C10.6 5.2 7 4.6 7 6.6S10 8.5 12 8.5zM12 8.5c1.4-3.3 5-3.9 5-1.9S14 8.5 12 8.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
spark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1-5.1-1.9 5.1-1.9z" fill="currentColor"/></svg>',
cal:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M3.5 9.5h17M8 3v4M16 3v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
pen:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>'};
const KIND={ok:['#f1f7f3','#0b6b3a'],warn:['#fbf3e1','#8d6208'],no:['#eef2ef','#5f6e64']};

/* Agenda con la lógica de Sofía (flujos KAd4A y knRiI): consultores por tier, el horario más cercano primero, empate por prioridad, ventana de 36 h sin domingos ni festivos, mínimo 90 min, hora del país por indicativo. Disponibilidad simulada. */
const CLOSERS={ricardo:'Ricardo López',daniel:'Daniel Plata',felipe:'Felipe Gómez',sonia:'Sonia Gómez',yucelis:'Yucelis Cárdenas'};
const ORDEN={b1:['ricardo','daniel','felipe','sonia'],b2:['sonia','yucelis','ricardo'],b3:['sonia','yucelis']};
const FESTIVOS=['2026-11-16','2026-12-08','2026-12-25','2027-01-01','2027-01-11','2027-03-22'];
const GRID_WD=['08:30','09:30','10:30','11:30','14:00','15:00','16:00'],GRID_SAT=['09:30','10:30','11:30'];
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
const bogDay=ms=>new Date(ms-5*3600e3).toISOString().slice(0,10);
const dayMs=d=>Date.parse(d+'T12:00:00-05:00');
const noLab=d=>FESTIVOS.includes(d)||new Date(dayMs(d)).getUTCDay()===0;
function hash(s){let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0)%100}
const busy=(cl,ms)=>hash(cl+ms)<42;
function windowMs(){const now=Date.now();let lim=now+36*3600e3;let cur=dayMs(bogDay(now));while(cur<=lim+12*3600e3){const d=bogDay(cur);if(Date.parse(d+'T00:00:00-05:00')>lim)break;if(noLab(d))lim+=24*3600e3;cur+=24*3600e3}return [now+90*60e3,lim]}
function gridDays(n){const out=[];let ms=dayMs(bogDay(Date.now()));for(let i=0;i<n;i++){const d=bogDay(ms);if(!noLab(d))out.push(d);ms+=24*3600e3}return out}
function slotsOf(d){const wd=new Date(dayMs(d)).getUTCDay();return (wd===6?GRID_SAT:GRID_WD).map(t=>Date.parse(d+'T'+t+':00-05:00'))}
function freeSlots(tier){const [a,b]=windowMs();const out=[];gridDays(6).forEach(d=>slotsOf(d).forEach(ms=>{if(ms<a||ms>b)return;const cl=ORDEN[tier].find(c=>!busy(c,ms));if(cl)out.push({ms,cl})}));return out.sort((x,y)=>x.ms-y.ms)}
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

let A={},C={},hist=[],cur=-1,fin=null,timers=[],AG=null,BUSQ=null;
const CARGA_MS=4500,BUSQUEDA_MS=1800;
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

function cond(c,ans){const a=ans[c.f];if(a===undefined)return false;
  if(c.op==='in')return arr(a).some(x=>c.vals.includes(x));if(c.op==='gt')return a>c.v;if(c.op==='lt')return a<c.v;if(c.op==='eq')return a===c.v;if(c.op==='between')return a>=c.min&&a<=c.max;return false}
function vis(s,ans){ans=ans||A;if(s.show&&!cond(s.show,ans))return false;if(s.hide&&cond(s.hide,ans))return false;return true}
function scrVis(i,ans){return SCREENS[i].some(s=>vis(s,ans||A))}
function nextScr(i,ans){for(let j=i+1;j<SCREENS.length;j++)if(scrVis(j,ans))return j;return -1}
const OPT={ventas:1,plataforma:['dropi'],canal:'pagina',pauta:['meta'],pago:'contraentrega'};
const optim=()=>{const o={...A};for(const k in OPT)if(!arr(o[k]).length)o[k]=OPT[k];return o};
const isQ=sc=>sc.some(isAns);
function label(s,v){if(s.type==='slider')return v===0?'0 · aún no vendo':v.toLocaleString('es-CO')+' ventas diarias';if(s.type==='text')return v;if(Array.isArray(v))return v.map(x=>label(s,x)).join(' + ');const o=s.o.find(x=>x[1]===v);return o?o[0]:v}
function ptsVentas(ans){ans=ans||A;let p=0;STEPS.forEach(s=>{const v=ans[s.k];if(v===undefined)return;if(s.type==='slider'){const r=s.score.find(r=>v>=r[0]&&v<=r[1]);if(r)p+=r[2]}});return p}
// Como en dForms: pasar el último filtro (pago contraentrega o ambos) suma 100; así el resultado no depende de opciones como 'transportadora'
function score(ans){ans=ans||A;return ptsVentas(ans)+(PAGO_OK.vals.includes(ans.pago)?100:0)}
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
  if(ic.startsWith('img:'))return '<span class="ic im"><img src="'+ic.slice(4)+'" alt=""></span>';
  if(/^[A-Z]{1,2}$/.test(ic))return '<span class="ic lt">'+ic+'</span>';
  const cp=[...ic].map(ch=>ch.codePointAt(0).toString(16)).filter(x=>x!=='fe0f').join('-');
  return '<span class="ic im"><img src="logos/emoji/'+cp+'.svg" alt=""></span>'};

function walk(full){const ans={},seen=[];let i=nextScr(-1,{ventas:full.ventas});
  while(i>=0){const sc=SCREENS[i];seen.push(STITLE(sc));let ended=false;
    for(const s of sc){if(!vis(s,ans))continue;if(isAns(s)){ans[s.k]=full[s.k];if(descarta(s,full[s.k]))ended=true}}
    if(ended)break;i=nextScr(i,ans)}
  const out=outcome(ans);if(['b1','b2','b3'].includes(out))seen.push('Agenda');
  return{ans,seen,out}}

function side(){if(!$('pts'))return;
  $('pts').textContent=score();
  const items=STEPS.filter(s=>(isAns(s)||s.type==='text')&&A[s.k]!==undefined&&A[s.k]!=='').map(s=>'<li><span>'+esc(s.t)+'</span>'+esc(label(s,A[s.k]))+'</li>');
  $('resp').innerHTML=items.length?items.join(''):'<li style="display:block;color:var(--soft)">Sin respuestas todavía</li>';
  $('agd').textContent=AG&&AG.booked?(fmt(AG.booked.ms,true)+' · '+CLOSERS[AG.booked.cl]+(AG.booked.via?' · vía Calendly':'')):
    !fin&&BUSQ&&BUSQ.estado==='buscando'?'Buscando horarios mientras carga…':!fin&&AG?'Horarios listos en '+(BUSQ.ms/1000).toLocaleString('es-CO')+' s, antes de que termine la carga ('+(CARGA_MS/1000).toLocaleString('es-CO')+' s)':'—';
  if(fin){const o=OUT[fin];$('ruta').innerHTML='<span class="pill '+o.pill[0]+'">'+o.pill[1]+'</span>';
    if(o.ghl){$('ghl').textContent=o.ghl;$('tier').textContent=o.tier}
    else{const g=ghlOf(A.ventas);$('ghl').textContent=(AG&&AG.booked?'Agendado 📆':g[0])+' · pipeline 05. Setter 2.0';$('tier').textContent='Tier '+g[1]+' · ruta '+fin.toUpperCase()}
    $('acc').textContent=o.acc;
    const ev=o.ev.concat(AG&&AG.booked?['Schedule']:[]);
    $('evs').innerHTML=ev.length?ev.map(e=>'<span class="ev">'+e+'</span>').join(''):'<span class="noev">Ninguno: Meta no aprende de este lead</span>'}
  else{const p=ptsVentas();const r=A.ventas>0?(p>=30?'Va como B1':p>=20?'Va como B2':'Va como B3'):'Sin definir';
    $('ruta').innerHTML='<span class="pill p-n">'+r+'</span>';$('ghl').textContent='—';$('tier').textContent='—';$('acc').textContent='—';
    const f1=SCREENS.findIndex(sc=>sc.some(x=>x.k==='vas_bien'));
    $('evs').innerHTML=hist.includes(f1)?'<span class="ev">Filtro_1</span>':'<span class="noev">Ninguno todavía</span>'}
  const ans=optim();const qs=SCREENS.map((sc,i)=>i).filter(i=>scrVis(i,ans)&&isQ(SCREENS[i]));
  const done=qs.filter(i=>hist.includes(i)).length;
  $('bar').style.width=(fin?100:cur<0?0:Math.round(100*done/(qs.length+1)))+'%'}

function cardsHTML(s){return '<div class="fcards">'+s.o.map(o=>'<button class="fc'+(arr(A[s.k]).includes(o[1])?' sel':'')+'"'+(s.m?' aria-pressed="'+arr(A[s.k]).includes(o[1])+'"':'')+' data-k="'+s.k+'" data-v="'+o[1]+'">'+ICON(o[2])+'<span class="lb">'+esc(o[0])+'</span></button>').join('')+'</div>'}
function counter(){const ans=optim();const qs=SCREENS.map((sc,i)=>i).filter(i=>scrVis(i,ans)&&isQ(SCREENS[i]));const n=qs.indexOf(cur)+1;return n>0?'<p class="fcount">Pregunta '+n+' de '+qs.length+'</p>':''}
const nameOf=()=>(C.nombre||'').split(' ')[0];

function agendaHTML(){const o=OUT[fin];const nm=nameOf();const pc0=country();const pais='hora de '+pc0[2]+(ZONA_CIUDAD[pc0[3]]?' ('+ZONA_CIUDAD[pc0[3]]+')':'');
  if(AG.booked){const b=AG.booked;return '<div class="result"><div class="badge-ico" style="background:#f1f7f3;color:#0b6b3a">'+ICO.ok+'</div><p class="fq">¡Listo, '+esc(nm||'listo')+'!</p><p class="msg">Quedó agendada tu '+esc(o.dur)+' para el <b>'+esc(fmt(b.ms,true))+'</b>, '+pais+'.</p><ul class="tips"><li>Te llega la invitación por WhatsApp'+(C.mail?' y al correo':'')+'.</li><li>Conéctate desde el computador, con cámara y buena señal.</li>'+(A.socios==='socios'?'<li>Conéctate con tus socios: deben estar todos los que deciden.</li>':'')+'</ul><button class="flink" id="again">Volver a empezar</button></div>'}
  const title='<p class="fcount">Agenda</p><p class="fq">'+(fin==='b3'?'¡Listo, '+esc(nm)+'!':'¡'+esc(nm)+', tu tienda califica!')+'</p>';
  if(AG.mode==='calendly'){const days=gridDays(4).slice(0,2);const cl=AG.cal;
    return title+'<p class="fh">No encontramos ese espacio. Agenda directo con el consultor que tiene más disponibilidad en los próximos dos días.</p><div class="calw"><div class="calh">'+ICO.cal+'<div><b>'+esc(CLOSERS[cl])+'</b><small>Calendly · '+(fin==='b3'?'15 min':'30 min')+' · próximos 2 días</small></div></div><div class="calg">'+days.map(d=>{const sl=slotsOf(d).filter(ms=>ms>Date.now()+90*60e3&&!busy(cl,ms));return '<div class="cald"><p>'+esc(fmt(dayMs(d)).dia)+'</p>'+(sl.length?sl.map(ms=>'<button class="calt" data-ms="'+ms+'" data-cl="'+cl+'">'+fmt(ms).hora+'</button>').join(''):'<small>Sin espacios</small>')+'</div>'}).join('')+'</div></div>'}
  const list=AG.list.map(x=>{const f=fmt(x.ms);return '<button class="slot" data-ms="'+x.ms+'" data-cl="'+x.cl+'"><span>'+esc(f.dia)+'</span><b>'+f.hora+'</b></button>'}).join('');
  const other='<button class="slot other'+(AG.mode==='other'?' on':'')+'" id="oth"><span>'+ICO.pen+'Otro día u hora</span><b>Escríbelo</b></button>'+
    (AG.mode==='other'?'<div class="othbox"><input class="finput" id="othtxt" placeholder="Ej.: mañana a las 3 pm, el lunes en la mañana" value="'+esc(AG.lastTxt||'')+'"><button class="fbtn" id="othgo">Buscar</button><p class="ferr" id="otherr"></p></div>':'');
  return title+'<p class="fh">Elige el horario de tu '+esc(o.dur)+'. Horarios en '+pais+'.</p>'+(AG.note?'<p class="llm">'+AG.note+'</p>':'')+'<div class="slots">'+list+other+'</div><p class="intento">'+(AG.attempts?'Intento '+AG.attempts+' de 2 con otro horario':'')+'</p>'}

function book(ms,cl,via){AG.booked={ms,cl,via};render()}
function startAgenda(tier){const all=freeSlots(tier||fin);AG={all,list:all.slice(0,5),mode:'list',attempts:0,note:'',booked:null}}
function searchOther(){const txt=$('othtxt').value.trim();if(!txt){$('otherr').textContent='Escribe el día o la hora que prefieres.';return}
  const ms=parseReq(txt);AG.lastTxt=txt;
  if(ms===null){$('otherr').textContent='No entendí el día o la hora. Prueba así: «mañana a las 3 pm».';return}
  const exact=AG.all.find(x=>x.ms===ms);const said='Entendimos: <b>'+esc(fmt(ms,true))+'</b>.';
  if(exact){AG.note=said;book(exact.ms,exact.cl);return}
  AG.attempts++;
  if(AG.attempts>=2){const days=gridDays(4).slice(0,2);let bestC=null,bestN=-1;ORDEN[fin].forEach(c=>{const n=days.reduce((a,d)=>a+slotsOf(d).filter(m=>m>Date.now()+90*60e3&&!busy(c,m)).length,0);if(n>bestN){bestN=n;bestC=c}});AG.cal=bestC;AG.mode='calendly';AG.note='';render();return}
  const near=AG.all.slice().sort((a,b)=>Math.abs(a.ms-ms)-Math.abs(b.ms-ms)).slice(0,5).sort((a,b)=>a.ms-b.ms);
  AG.list=near;AG.mode='list';AG.lastTxt='';AG.note=said+' Ese espacio no está libre; estas son las 5 opciones más cercanas.';render()}

function render(){side();const c=$('card');c.classList.remove('flood');
  // Portada en verde oscuro; de la primera pregunta en adelante, fondo beige muy claro
  $('fcard').classList.toggle('osc',cur<0&&!fin);
  if(fin){const o=OUT[fin];
    if(['b1','b2','b3'].includes(fin)){if(!AG)startAgenda();c.innerHTML=agendaHTML();
      c.querySelectorAll('.slot[data-ms],.calt').forEach(b=>b.addEventListener('click',()=>book(+b.dataset.ms,b.dataset.cl,b.classList.contains('calt'))));
      if($('oth'))$('oth').addEventListener('click',()=>{AG.mode=AG.mode==='other'?'list':'other';render();if($('othtxt'))$('othtxt').focus()});
      if($('othgo')){$('othgo').addEventListener('click',searchOther);$('othtxt').addEventListener('keydown',e=>{if(e.key==='Enter')searchOther()})}
      if($('again'))$('again').addEventListener('click',reset);return}
    const k=KIND[o.kind];const nm=nameOf();
    c.innerHTML='<div class="result"><div class="badge-ico" style="background:'+k[0]+';color:'+k[1]+'">'+ICO[o.kind]+'</div><p class="fq">'+esc(o.label)+'</p><p class="msg">'+esc(o.msg).replace(/\n/g,'<br>')+'</p><button class="flink" id="again">Volver a empezar</button></div>';
    $('again').addEventListener('click',reset);return}
  if(cur===-1){c.innerHTML='<div class="cover"><div class="emb"><img src="fenix-emblema.png" alt="Fénix Ventures"></div><div><p class="fq">Consultoría Logística Gratis</p><p class="fh" style="font-size:14.5px;line-height:1.6">Responde unas preguntas rápidas.<br>Empieza y vemos si quedas elegido.</p><button class="fbtn" id="go">Empezar</button><p class="trust">'+ICO.gift+'Obsequio de <img src="dropi-logo.png" alt="Dropi"></p></div><div class="cend"></div></div>';
    $('go').addEventListener('click',start);sizeEmb();return}
  const sc=SCREENS[cur];const steps=sc.filter(s=>vis(s));const s=steps[0];
  const backBtn=hist.length?'<button class="flink" id="bk">← Atrás</button>':'<span></span>';
  const wire=()=>{if(hist.length)$('bk').addEventListener('click',back)};
  if(s.type==='contact'){const seg=A.chatbot_b3==='chatbot';const pc=paisBy(C.pais||'CO');
    const opt=iso=>{const p=paisBy(iso);return '<option value="'+iso+'"'+(pc&&iso===pc[3]?' selected':'')+'>'+p[4]+' '+esc(p[2])+' (+'+p[0]+')</option>'};
    c.innerHTML='<p class="fcount">Tus datos</p><p class="fq">'+(seg?'Te dejamos en seguimiento 💚 ¿Cómo te llamas?':'¿Cómo te llamas?')+'</p><input class="finput" id="fn" autocomplete="name" placeholder="Ana Gómez" value="'+esc(C.nombre||'')+'"><label class="flabel" for="ph">'+(seg?'¿A qué WhatsApp te escribimos cuando estés vendiendo más?':'¿A qué número te llamamos? Que tenga WhatsApp.')+'</label><div class="ftel"><div class="fcc'+(pc?'':' vacio')+'" id="ccb"><span class="flag" id="ccf">'+(pc?pc[4]:'🌎')+'</span><span id="ccv">'+(pc?'+'+pc[0]:'País')+'</span>'+ICO.chev+'<select id="cc" aria-label="País del celular"><optgroup label="Los más frecuentes">'+PAIS_ORDEN.map(opt).join('')+'</optgroup><optgroup label="Todos los países">'+MUNDO.filter(m=>!PAIS_ORDEN.includes(m[0])).map(m=>opt(m[0])).join('')+'</optgroup></select></div><input class="finput" id="ph" inputmode="tel" autocomplete="tel-national" placeholder="'+(pc?pc[6]:'Número de celular')+'" value="'+esc(C.num||'')+'"></div>'+
      (seg?'':'<label class="flabel" for="em">¿Y tu correo? <span style="font-weight:400;color:var(--f-mut)">Opcional, ahí llega la invitación.</span></label><input class="finput" id="em" type="email" autocomplete="email" placeholder="nombre@mitienda.co" value="'+esc(C.mail||'')+'">')+
      '<p class="ferr" id="er"></p><button class="fbtn" id="snd">'+(seg?'Enviar':'Ver horarios')+'</button><div class="fnav" style="padding-top:12px">'+backBtn+'</div>';
    ['fn','ph','em'].forEach(id=>{if($(id))$(id).addEventListener('input',()=>{$('er').textContent=''})});
    $('cc').addEventListener('change',e=>{const p=paisBy(e.target.value);$('ccb').classList.remove('vacio');$('ccf').textContent=p[4];$('ccv').textContent='+'+p[0];$('ph').placeholder=p[6];$('er').textContent='';$('ph').focus()});
    $('snd').addEventListener('click',send);wire();return}
  if(s.type==='reveal'){c.classList.add('flood');const nm=nameOf();const ini=(C.nombre||'?').split(' ').filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase();
    c.innerHTML='<div class="result vs"><div class="vsrow"><div class="vsm"><span class="vsc ini">'+esc(ini)+'</span><small>'+esc(nm||'Tú')+'</small></div><div class="vsp" id="vsp">0%</div><div class="vsm"><span class="vsc em"><img src="fenix-emblema.png" alt=""></span><small>Perfil Fénix</small></div></div><p class="vss">Comparando con tiendas que ya escalaron</p><div class="vsbar"><i id="vsb"></i></div><p class="fq">Analizando tu operación</p><p class="fh">'+(nm?esc(nm)+', estamos':'Estamos')+' revisando si pasaste los últimos filtros</p></div>';
    const T=RM?0:CARGA_MS,t0=performance.now();
    // Mientras corre la carga se buscan los horarios del consultor que le toca; al terminar ya están listos
    const pre=outcome();if(['b1','b2','b3'].includes(pre)&&!AG){BUSQ={estado:'buscando',t0:performance.now()};side();
      timers.push(setTimeout(()=>{startAgenda(pre);BUSQ={estado:'listo',ms:BUSQUEDA_MS};side()},RM?0:BUSQUEDA_MS))}
    const tick=()=>{if(!$('vsp'))return;const k=Math.min(1,(performance.now()-t0)/(T||1));$('vsp').textContent=Math.round(k*100)+'%';$('vsb').style.width=Math.round(k*100)+'%';if(k<1&&!fin)requestAnimationFrame(tick)};
    if(T)requestAnimationFrame(tick);else{$('vsp').textContent='100%'}
    timers.push(setTimeout(()=>{fin=outcome();render()},T));return}
  if(s.type==='message'){
    c.innerHTML='<div class="result"><img class="msg-logo" src="logos/dropi.png" alt="Dropi"><p class="fq">'+esc(s.q)+'</p><p class="msg">'+esc(s.h)+'</p><button class="fbtn" id="cont">Continuar</button></div>';
    $('cont').addEventListener('click',advance);return}
  if(s.type==='slider'){const v=A.ventas!==undefined?A.ventas:s.def;
    c.innerHTML=counter()+'<p class="fq">'+esc(s.q)+'</p><p class="fh">'+esc(s.h)+'</p><div class="sld"><div class="sval"><span><b id="sv">'+v.toLocaleString('es-CO')+'</b><small>'+esc(s.unit)+'</small></span></div><input type="range" id="sr" min="'+s.min+'" max="'+s.max+'" step="1" value="'+v+'" aria-label="Ventas diarias"><div class="ends"><span>0</span><span>1.000</span></div></div><button class="fbtn" id="nx" style="margin-top:22px">Siguiente</button><div class="fnav">'+backBtn+'</div>';
    $('sr').addEventListener('input',e=>{$('sv').textContent=(+e.target.value).toLocaleString('es-CO')});
    $('nx').addEventListener('click',()=>{setAns('ventas',+$('sr').value);advance()});wire();return}
  if(steps.length===1&&!sc[0].g&&!s.m){
    c.innerHTML=counter()+'<p class="fq">'+esc(s.q)+'</p>'+(s.h?'<p class="fh">'+esc(s.h)+'</p>':'')+cardsHTML(s)+'<div class="fnav">'+backBtn+'</div>';
    c.querySelectorAll('.fc').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.k,b.dataset.v)));wire();return}
  const multi=steps.filter(x=>x.o).length>1;
  c.innerHTML=counter()+steps.map(x=>x.type==='text'?'<div class="grp"><label class="flabel" for="tx_'+x.k+'">'+esc(x.q)+'</label><input class="finput" id="tx_'+x.k+'" data-t="'+x.k+'" placeholder="'+esc(x.ph||'')+'" value="'+esc(A[x.k]||'')+'"></div>':'<div class="grp"><p class="fq'+(multi?' sm':'')+'">'+esc(x.q)+'</p>'+(x.h?'<p class="fh">'+esc(x.h)+'</p>':'')+cardsHTML(x)+'</div>').join('')+'<p class="ferr" id="er"></p><button class="fbtn" id="nx">Siguiente</button><div class="fnav">'+backBtn+'</div>';
  c.querySelectorAll('.fc').forEach(b=>b.addEventListener('click',()=>{toggle(b.dataset.k,b.dataset.v);render();const t=c.querySelector('[data-t]');if(t)t.focus()}));
  c.querySelectorAll('[data-t]').forEach(t=>t.addEventListener('input',()=>{A[t.dataset.t]=t.value}));
  $('nx').addEventListener('click',()=>{const miss=sc.filter(x=>vis(x)&&x.o&&!arr(A[x.k]).length);if(miss.length){$('er').textContent='Elige una opción para seguir.';return}
    const ko=sc.find(x=>vis(x)&&descarta(x,A[x.k]));if(ko){hist.push(cur);fin=outcome();render();return}advance()});wire()}

function clearT(){timers.forEach(clearTimeout);timers=[]}
function setAns(k,v){A[k]=v;clearAfter(k)}
function toggle(k,v){const s=STEPS.find(x=>x.k===k);if(!s.m){setAns(k,v);return}const c0=arr(A[k]);const nx=c0.includes(v)?c0.filter(x=>x!==v):c0.concat(v);setAns(k,nx.length?nx:undefined)}
function start(){clearT();hist=[];AG=null;BUSQ=null;cur=nextScr(-1,{ventas:1});render()}
function advance(){hist.push(cur);const n=nextScr(cur);if(n<0){fin=outcome()}else cur=n;render()}
function pick(k,v){setAns(k,v);const s=STEPS.find(x=>x.k===k);if(s.end&&s.end.includes(v)){hist.push(cur);fin=outcome();render();return}advance()}
function back(){clearT();if(!hist.length)return;cur=hist.pop();fin=null;AG=null;BUSQ=null;render()}
function send(){const n=$('fn').value.trim(),iso=$('cc').value,p=iso?paisBy(iso):null,e=$('em')?$('em').value.trim():'';let t=$('ph').value.replace(/\D/g,'');let m='';
  if(p){if(t.startsWith(p[0])&&t.length>(p[5]||10))t=t.slice(p[0].length);t=t.replace(/^0+/,'')}
  if(!n)m='Escribe tu nombre para continuar.';else if(!p)m='Elige el país de tu celular para continuar.';
  else if(p[5]&&t.length!==p[5]&&!(p[3]==='AR'&&t.length===11&&t[0]==='9'))m='Revisa el número: en '+p[2]+' el celular tiene '+p[5]+' dígitos, sin el +'+p[0]+'.';
  else if(!p[5]&&(t.length<6||t.length>14))m='Revisa el número: parece incompleto.';
  else if(e&&!/^\S+@\S+\.\S+$/.test(e))m='Revisa el correo o déjalo vacío.';
  if(m){$('er').textContent=m;return}
  C={nombre:n,pais:iso,num:t,tel:'+'+p[0]+' '+t,mail:e};advance()}
function reset(){clearT();A={};C={};hist=[];cur=-1;fin=null;AG=null;BUSQ=null;render()}

function play(i){clearT();const full={...BASE,...ROUTES[i][1]};A={};C={...SAMPLE};hist=[];fin=null;AG=null;BUSQ=null;cur=nextScr(-1,{ventas:1});render();
  document.querySelector('.bench').scrollIntoView({behavior:RM?'auto':'smooth',block:'start'});
  const d=RM?0:700;
  const stepOnce=()=>{if(fin){if(AG&&!AG.booked&&AG.list.length){const x=AG.list[0];book(x.ms,x.cl)}return}if(cur<0)return;const sc=SCREENS[cur];const s=sc.filter(x=>vis(x))[0];
    if(s.type==='reveal')return;
    if(s.type==='contact'||s.type==='message'){advance();return}
    if(s.type==='slider'){setAns('ventas',full.ventas);advance();return}
    if(sc[0].g||s.m){for(const x of sc){if(vis(x)&&isAns(x))setAns(x.k,full[x.k])}const ko=sc.find(x=>vis(x)&&descarta(x,A[x.k]));if(ko){hist.push(cur);fin=outcome();render();return}advance();return}
    pick(s.k,full[s.k])};
  for(let n=1;n<=18;n++)timers.push(setTimeout(stepOnce,d*n+(n>13?CARGA_MS+200:0)))}

let VER={};try{VER=JSON.parse(localStorage.getItem('calif-ver')||'{}')}catch(e){VER={}}
function saveVer(){try{localStorage.setItem('calif-ver',JSON.stringify(VER))}catch(e){}}
function count(){const n=ROUTES.filter((r,i)=>VER[i]).length;$('cnt').textContent=n+' de '+ROUTES.length+' verificadas';$('vbar').style.width=Math.round(100*n/ROUTES.length)+'%'}

function rowHTML(r,i){const full={...BASE,...r[1]};const w=walk(full);const o=OUT[w.out];
  const keys=STEPS.filter(s=>isAns(s)&&w.ans[s.k]!==undefined&&(r[1][s.k]!==undefined||s.k==='ventas')).map(s=>esc(label(s,w.ans[s.k]))).join(' · ');
  const ghl=o.ghl?o.ghl:'Agendado 📆 · tier '+ghlOf(w.ans.ventas)[1];
  const ev=o.ev.concat(['b1','b2','b3'].includes(w.out)?['Schedule']:[]);
  const ok=w.out===r[2];
  return '<div class="rt'+(VER[i]?' done':'')+'" id="rt'+i+'">'+
    '<span class="num">'+String(i+1).padStart(2,'0')+'</span>'+
    '<div><h4>'+esc(r[0])+'</h4><p class="keys">'+keys+'</p><p class="path">'+w.seen.map(esc).join(' → ')+' → Resultado</p></div>'+
    '<div class="out"><span class="pill '+o.pill[0]+'">'+o.pill[1]+'</span><p><b>GHL:</b> '+esc(ghl)+'</p><p><b>Siguiente:</b> '+esc(o.acc)+'</p>'+(ok?'':'<p style="color:var(--no)">No coincide con lo esperado</p>')+'</div>'+
    '<div class="act"><div>'+(ev.length?ev.map(e=>'<span class="ev">'+e+'</span>').join(''):'<span class="noev">Sin eventos a Meta</span>')+'</div>'+
    '<button class="btn" data-play="'+i+'">'+ICO.play+'Probar</button>'+
    '<label class="vchk"><input type="checkbox" data-ver="'+i+'" '+(VER[i]?'checked':'')+'> Verificada</label></div></div>'}

function routes(){
  $('groups').innerHTML=GROUPS.map(g=>{const idx=ROUTES.map((r,i)=>i).filter(i=>g[2].includes(ROUTES[i][2]));
    return '<div class="group"><div class="ghead"><h3>'+g[0]+'</h3><span class="n">'+idx.length+'</span></div><p class="lede" style="margin:-4px 0 12px;font-size:14px">'+g[1]+'</p><div class="list">'+idx.map(i=>rowHTML(ROUTES[i],i)).join('')+'</div></div>'}).join('');
  document.querySelectorAll('[data-play]').forEach(b=>b.addEventListener('click',()=>play(+b.dataset.play)));
  document.querySelectorAll('[data-ver]').forEach(c=>c.addEventListener('change',()=>{const i=+c.dataset.ver;VER[i]=c.checked;saveVer();$('rt'+i).classList.toggle('done',c.checked);count()}));
  count()}

function sizeEmb(){const fw=document.querySelector('.fword'),fc=document.querySelector('.fcard');
  if(fw&&fc){const w=fw.getBoundingClientRect().width;if(w>0)fc.style.setProperty('--emb',Math.round(w*335/645)+'px')}}
render();
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sizeEmb);
