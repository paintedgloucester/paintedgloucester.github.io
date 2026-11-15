// Builds print/map.html: a one-page, letter-size printable chart of the nine painting sites,
// for painters standing on the rocks without a signal. Render to PDF with tools/printmap.py.
import fs from 'fs'; import vm from 'vm'; import { execFileSync } from 'child_process';
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['data.js', 'coast.js']) vm.runInContext(fs.readFileSync(`js/${f}`, 'utf8'), ctx);
const D = ctx.window.DATA, C = ctx.window.COAST, W = Object.fromEntries(D.works.map(w => [w.id, w]));
const ORIGIN = 'https://paintedgloucester.github.io';
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Where to stand today and when to go, condensed from each site's "today" notes in js/data.js.
const NOTE = {
  'fort-point': ['Fort Point shore access is unconfirmed. The same view of Ten Pound Island is open from the public way on Rocky Neck.', 'Late August, about two hours before sunset.'],
  'ten-pound': ['The island is reached only by boat. Without one, paint it from the Rocky Neck public way, looking west.', 'Sunset.'],
  'banner-hill': ['The hilltop vantage is now private. Look from the road.', 'Morning. By afternoon the town is backlit.'],
  'braces-cove': ['Public shore access is unverified. Check on site before you set up.', 'Late afternoon, sun behind you.'],
  'normans-woe': ['Shore north of the rock. Sanctuary rules unverified; mind the tide (about 9 feet).', 'The last half hour before sunset.'],
  'coffins-beach': ['The Loaf is mapped as a nature reserve; access to Coffin’s Beach is unverified.', 'Sunrise. Be in place before it.'],
  'eastern-point': ['By Eastern Point Light (closed) and the Dog Bar Breakwater. Stay off it in breaking waves.', 'Low tide, about two hours before sunset.'],
  'annisquam': ['From Wingaersheek Beach. Summer parking must be reserved.', 'Morning, around 9 a.m.'],
  'harbor-view': ['Rocky Neck Art Trail stop 15, on foot from Rocky Neck Avenue.', 'About two hours before sunset.'],
};
const PAINTING = { 'harbor-view': 'his last canvas, painted at the Harbor View Hotel (Nelson-Atkins Museum)' };

// ---- chart ----
const pts = D.sites.map(s => s.V);
let la0 = Math.min(...pts.map(p => p[0])) - 0.010, la1 = Math.max(...pts.map(p => p[0])) + 0.012;
let lo0 = Math.min(...pts.map(p => p[1])) - 0.014, lo1 = Math.max(...pts.map(p => p[1])) + 0.016;
const k = Math.cos((la0 + la1) / 2 * Math.PI / 180);
const MW = 560, MH = Math.round(MW * (la1 - la0) / ((lo1 - lo0) * k));
const X = lo => (lo - lo0) / (lo1 - lo0) * MW, Y = la => (la1 - la) / (la1 - la0) * MH;
const inBox = ([a, o]) => a > la0 - .01 && a < la1 + .01 && o > lo0 - .01 && o < lo1 + .01;
const path = c => c.filter(inBox).map((p, i) => `${i ? 'L' : 'M'}${X(p[1]).toFixed(1)},${Y(p[0]).toFixed(1)}`).join('');
const fullPath = c => c.map((p, i) => `${i ? 'L' : 'M'}${X(p[1]).toFixed(1)},${Y(p[0]).toFixed(1)}`).join('') + 'Z';
const land = C.towns.filter(tn => tn.c.some(inBox)).map(tn => `<path class="${tn.k === 17 ? 'tb' : 'sh'}" d="${tn.c.map((p, i) => `${i ? 'L' : 'M'}${X(p[1]).toFixed(1)},${Y(p[0]).toFixed(1)}`).join('')}"/>`).join('');
const coast = C.coast.filter(c => c.some(inBox)).map(c => `<path d="${c.map((p, i) => `${i ? 'L' : 'M'}${X(p[1]).toFixed(1)},${Y(p[0]).toFixed(1)}`).join('')}"/>`).join('');
const kmPx = 1000 / (111320 * k) / (lo1 - lo0) * MW;
const label = (la, lo, t, cls = 'wl') => `<text x="${X(lo).toFixed(0)}" y="${Y(la).toFixed(0)}" class="${cls}">${t}</text>`;
const pins = D.sites.map(s => { const x = X(s.V[1]), y = Y(s.V[0]); return `<g class="pin"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="11"/><text x="${x.toFixed(1)}" y="${(y + 4.2).toFixed(1)}">${s.n}</text></g>`; }).join('');
const chart = `<svg viewBox="0 0 ${MW} ${MH}" class="chart" role="img" aria-label="Chart of Gloucester and Cape Ann with the nine painting sites numbered">
<defs><clipPath id="cl"><rect width="${MW}" height="${MH}"/></clipPath></defs><g clip-path="url(#cl)"><rect width="${MW}" height="${MH}" class="sea"/><g class="land">${land}</g><g class="coast">${coast}</g></g>
${label(42.5965, -70.676, 'Gloucester Harbor')}${label(42.5755, -70.690, 'Atlantic Ocean')}${label(42.664, -70.728, 'Ipswich Bay')}
<g class="scale" transform="translate(${MW - kmPx - 24},${MH - 26})"><rect width="${kmPx.toFixed(1)}" height="5"/><text x="0" y="-5">0</text><text x="${kmPx.toFixed(1)}" y="-5" text-anchor="end">1 km</text></g>
<g class="north" transform="translate(${MW - 30},40)"><path d="M0,-22 L8,6 L0,0 L-8,6 Z"/><text y="22" text-anchor="middle">N</text></g>
${pins}</svg>`;

// ---- QR ----
const qr = execFileSync('python3', ['-c', `import segno,sys;q=segno.make(sys.argv[1],error='m');sys.stdout.write(q.svg_inline(scale=3,border=3,dark='#1F3A52',light='#FFFFFF',omitsize=True))`, ORIGIN + '/?utm_source=print&utm_medium=map'], { encoding: 'utf8' });

const card = s => { const w = s.main ? W[s.main] : null, [stand, when] = NOTE[s.id];
  const ptg = w ? `<i>${esc(w.t)}</i>, ${esc(w.d)}` : esc(PAINTING[s.id] || '');
  return `<li><span class="n">${s.n}</span><div><h3>${esc(s.title)}</h3><p class="by">${esc(s.artist)}: ${ptg}</p><p><b>Stand</b> ${esc(stand)}</p><p><b>Light</b> ${esc(when)}</p></div></li>`; };
const cardsA = D.sites.slice(0, 5).map(card).join(''), cardsB = D.sites.slice(5).map(card).join('');

const fonts = ['cormorant-600', 'eb-garamond-400', 'eb-garamond-400i', 'inter-400', 'inter-600'].map(f => {
  const [fam, wt] = f.split('-').length === 3 ? [f.split('-').slice(0, 2).join('-'), f.split('-')[2]] : f.split('-');
  const name = { cormorant: 'Cormorant', 'eb-garamond': 'EB Garamond', inter: 'Inter' }[fam];
  return `@font-face{font-family:'${name}';src:url(../fonts/${f}.woff2) format('woff2');font-weight:${parseInt(wt)};font-style:${wt.endsWith('i') ? 'italic' : 'normal'}}`; }).join('');

const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Painted Gloucester: printable chart of the nine painting sites</title>
<meta name="robots" content="noindex"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fonts}
@page{size:letter;margin:0}
*{box-sizing:border-box}html,body{margin:0;background:#F3EDE1;color:#22303C}
.page{width:8.5in;height:11in;padding:.42in .45in .38in;display:flex;flex-direction:column;gap:.12in;overflow:hidden}
header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #1F3A52;padding-bottom:.06in}
header h1{font:600 27px/1 Cormorant,serif;color:#1F3A52;margin:0}header h1 span{color:#9A6B32}
header p{font:400 10px/1.3 Inter,sans-serif;color:#5A4632;margin:0;text-align:right;max-width:3.4in}
.chart{width:100%;height:auto;display:block;border:1px solid #B9A88C}
.sea{fill:#FAF6EE}.land path{fill:none;stroke:#46607A;stroke-width:1.1;stroke-linejoin:round}.land path.tb{stroke:#8A9BA8;stroke-width:.8;stroke-dasharray:3 4}.coast path{fill:none;stroke:#46607A;stroke-width:1;stroke-linejoin:round}
.wl{font:italic 400 13px 'EB Garamond',serif;fill:#46607A;letter-spacing:.06em}
.pin circle{fill:#9A3B22;stroke:#F3EDE1;stroke-width:2.5}.pin text{font:600 12px Inter,sans-serif;fill:#fff;text-anchor:middle}
.scale rect{fill:#1F3A52}.scale text,.north text{font:600 9px Inter,sans-serif;fill:#1F3A52}.north path{fill:#1F3A52}
.top{display:grid;grid-template-columns:4.8in 1fr;gap:.16in;align-items:start}
ol{list-style:none;margin:0;padding:0;display:grid;gap:.1in .14in}ol.a{grid-template-columns:1fr}ol.b{grid-template-columns:repeat(4,1fr)}
li{display:flex;gap:.07in;min-width:0}
.n{flex:none;width:20px;height:20px;border-radius:50%;background:#9A3B22;color:#fff;font:600 11px/20px Inter,sans-serif;text-align:center;margin-top:1px}
li div{min-width:0}h3{font:600 13.5px/1.1 Cormorant,serif;color:#1F3A52;margin:0 0 1px}
li p{font:400 8.6px/1.32 Inter,sans-serif;margin:0 0 1.5px;overflow-wrap:anywhere}li p b{color:#1F3A52;font-weight:600;margin-right:2px}
.by{font:400 10.2px/1.2 'EB Garamond',serif!important;color:#5A4632}.url{color:#8A7A66;font-size:7.6px!important}
footer{margin-top:auto;display:flex;gap:.16in;align-items:center;border-top:1px solid #B9A88C;padding-top:.09in}
footer svg{width:.92in;height:.92in;flex:none}
footer p{font:400 9.2px/1.4 Inter,sans-serif;margin:0}footer b{font:600 15px/1.2 Cormorant,serif;color:#1F3A52;display:block}
.small{color:#6B5A46;font-size:8px!important;margin-top:3px!important}
@media screen{body{padding:20px 0}.page{margin:0 auto;box-shadow:0 2px 14px rgba(0,0,0,.18);background:#F3EDE1}}
</style></head><body><div class="page">
<header><h1>Stand where the painters stood</h1><p><b>Painted Gloucester</b> · a pocket chart of nine places on Cape Ann where Lane, Homer, Hassam and others set up their easels.</p></header>
<div class="top">${chart}<ol class="a">${cardsA}</ol></div>
<ol class="b">${cardsB}</ol>
<footer>${qr}<p><b>paintedgloucester.github.io</b>The free field guide: the sun’s path for any day and hour, 131 Cape Ann paintings in public collections, palettes, and local shops, classes and galleries. In ten languages, no ads, no sign-up.<span class="small" style="display:block">Check tides, weather and access before you go; several sites are on private or protected land. Chart: coastline from MassGIS. Printed from the guide, ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</span></p></footer>
</div></body></html>`;
fs.writeFileSync('print/map.html', html);
console.log('print/map.html', MW, MH, 'km px', kmPx.toFixed(1));
