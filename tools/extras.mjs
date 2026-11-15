// Generates the trails, the working-waterfront and winter pages, the photographers, teachers and gallery pages,
// and the Portuguese and Italian landing pages, from js/extras.js. Called by tools/build.mjs.
import vm from 'node:vm';

export default function ({ page, esc, strip, WBY, D, P, X, ORIGIN, dir, mus, SITE_OF, ctx, fs }) {
  /* ---- numbered sources, one list per page ---- */
  const Notes = () => {
    const order = [];
    const cite = (h, up) => String(h ?? '').replace(/\{up\}/g, up).replace(/\s*\[\[(\w+)\]\]/g, (m, k) => {
      if (!X.src[k]) throw new Error('unknown source ' + k);
      let i = order.indexOf(k); if (i < 0) { order.push(k); i = order.length - 1; }
      return `<sup><a href="#src-${i + 1}" id="ref-${i + 1}-${Math.random().toString(36).slice(2, 6)}" aria-label="Source ${i + 1}">${i + 1}</a></sup>`;
    });
    const list = (h = 'Sources') => order.length ? `<section class="srcs" aria-labelledby="srcs-h"><h2 id="srcs-h">${esc(h)}</h2><ol translate="no" lang="en">${order.map((k, i) => { const [label, url] = X.src[k]; return `<li id="src-${i + 1}">${esc(label)}. <a href="${esc(url)}">${esc(url)}</a></li>`; }).join('')}</ol><p class="small">Checked ${esc(X.checked)}.</p></section>` : '';
    return { cite, list };
  };
  // stable ids for references (no random suffix in output)
  const stable = html => { let n = 0; html = html.replace(/<\/a><\/sup><sup><a /g, '</a><span class="sc">,</span><a '); return html.replace(/id="ref-(\d+)-[a-z0-9]{1,4}"/g, (m, i) => `id="ref-${i}-${++n}"`); };

  const workLi = (id, up) => { const w = WBY[id]; if (!w) throw new Error('unknown work ' + id);
    return `<li>${w.img ? `<a class="th" href="${up}works/${w.id}.html" tabindex="-1" aria-hidden="true"><img src="${up}thumbs/${w.id}.webp" alt="" loading="lazy" decoding="async"></a>` : '<span class="th none" aria-hidden="true">At the museum</span>'}<div><a class="t" href="${up}works/${w.id}.html"><i>${esc(w.t)}</i></a><span class="m">${esc(w.by)}, ${esc(w.d)}</span><span class="m">${esc(mus(w))}</span></div></li>`; };
  const works = (ids, up) => ids && ids.length ? `<ul class="wlist tight">${ids.map(id => workLi(id, up)).join('')}</ul>` : '';

  const km = (a, b) => { const r = Math.PI / 180, dla = (b[0] - a[0]) * r, dlo = (b[1] - a[1]) * r; const h = Math.sin(dla / 2) ** 2 + Math.cos(a[0] * r) * Math.cos(b[0] * r) * Math.sin(dlo / 2) ** 2; return 12742 * Math.asin(Math.sqrt(h)); };

  /* ---- Leaflet trail map ---- */
  const mapHead = up => `<link rel="stylesheet" href="${up}vendor/leaflet/leaflet.css">\n`;
  const mapTail = (stops, legs, label) => up => `<script src="${up}vendor/leaflet/leaflet.js"></script>
<script>(function () {
  var S = ${JSON.stringify(stops.map(s => ({ n: s.n, name: strip(s.name), addr: s.addr, ll: s.ll, approx: !!s.approx })))}, L2 = ${JSON.stringify(legs || [])};
  var el = document.getElementById('tmap'); if (!el || !window.L) return;
  el.classList.add('on');
  var m = L.map(el, { scrollWheelZoom: false, zoomSnap: 0.25 });
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' }).addTo(m);
  L2.forEach(function (g) { if (g[2] !== 'walk') return; L.polyline(S.slice(g[0], g[1]).map(function (s) { return s.ll; }), { color: '#9A5F22', weight: 3, dashArray: '2 7', lineCap: 'round', opacity: .9, interactive: false }).addTo(m); });
  S.forEach(function (s) {
    L.marker(s.ll, { title: s.n + '. ' + s.name, icon: L.divIcon({ className: '', html: '<span class="tmk' + (s.approx ? ' ap' : '') + '">' + s.n + '</span>', iconSize: [28, 28], iconAnchor: [14, 14], popupAnchor: [0, -12] }) })
      .bindPopup('<b>' + s.n + '. ' + s.name.replace(/</g, '&lt;') + '</b><br>' + s.addr.replace(/</g, '&lt;') + '<br><a href="#stop-' + s.n + '">Notes ↓</a> · <a href="https://www.google.com/maps/dir/?api=1&destination=' + s.ll[0] + ',' + s.ll[1] + '">Directions ↗</a>').addTo(m);
  });
  var all = L.latLngBounds(S.map(function (s) { return s.ll; })).pad(0.08), walk = L2.filter(function (g) { return g[2] === 'walk'; })[0];
  var wb = walk ? L.latLngBounds(S.slice(walk[0], walk[1]).map(function (s) { return s.ll; })).pad(0.12) : null;
  m.fitBounds(wb && wb.getNorth() - wb.getSouth() < (all.getNorth() - all.getSouth()) * 0.5 ? wb : all);
  var bar = document.getElementById('tmap-bar');
  if (bar && wb) { bar.hidden = false; bar.querySelectorAll('button').forEach(function (b) { b.onclick = function () { bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); m.flyToBounds(b.dataset.v === 'walk' ? wb : all, { duration: .6 }); }; }); }
})();</script>
`;
  const mapBox = label => `<div id="tmap" class="tmap" role="region" aria-label="${esc(label)}"><p class="tmap-off">The map needs JavaScript. Every stop below has an address and a directions link.</p></div>`;

  const stopList = (stops, cite, up, legs) => {
    const legOf = i => (legs || []).find(g => i >= g[0] && i < g[1]);
    return `<ol class="stops">${stops.map((s, i) => {
      const g = legOf(i), gPrev = legOf(i - 1);
      const head = g && (!gPrev || gPrev !== g) ? `<li class="leg" aria-hidden="false"><span>${g[2] === 'walk' ? `On foot · about ${km2(stops.slice(g[0], g[1]))}` : 'By car'}</span></li>` : '';
      return `${head}<li class="stop" id="stop-${s.n}"><span class="num" aria-hidden="true">${s.n}</span><div><h3>${esc(strip(s.name))}</h3><p class="m">${s.who ? `${s.who} · ` : ''}${esc(s.addr)}${s.approx ? ' · marker approximate' : ''}</p><p>${cite(s.text, up)}</p>${works(s.works, up)}<p class="acts"><a href="${dir(s.ll)}">Directions ↗</a></p></div></li>`;
    }).join('')}</ol>`;
  };
  const km2 = ss => { let d = 0; for (let i = 1; i < ss.length; i++) d += km(ss[i - 1].ll, ss[i].ll); return `${(Math.round(d * 1.25 * 2) / 2).toFixed(1)} km (${(Math.round(d * 1.25 * 0.621371 * 2) / 2).toFixed(1)} mi) of streets`; };


  /* ---- trails ---- */
  X.trails.forEach(t => t.stops.forEach((s, i) => { s.n = i + 1; }));
  for (const t of X.trails) {
    const N = Notes();
    const first = t.stops.flatMap(s => s.works || []).map(id => WBY[id]).find(w => w && w.img);
    page({ file: `trails/${t.id}.html`, title: `${t.title}: a trail`, type: 'article',
      desc: strip(t.lead).slice(0, 200).replace(/\s\S*$/, '') + '…',
      image: first ? `img/${first.id}.jpg` : undefined, imageAlt: first ? `${first.by}, ${first.t}, ${first.d}` : undefined,
      crumbs: [['Trails', 'trails/'], [t.title]], head: mapHead, tail: mapTail(t.stops, t.legs, t.title),
      ld: { '@context': 'https://schema.org', '@type': 'TouristTrip', name: t.title, description: strip(t.lead), url: `${ORIGIN}/trails/${t.id}.html`,
        itinerary: { '@type': 'ItemList', itemListElement: t.stops.map(s => ({ '@type': 'ListItem', position: s.n, item: { '@type': 'Place', name: strip(s.name), address: s.addr, geo: { '@type': 'GeoCoordinates', latitude: s.ll[0], longitude: s.ll[1] } } })) } },
      body: up => stable(`<article class="trail">
<div class="kicker">${esc(t.kicker)}</div><h1>${esc(t.title)}</h1>
<p class="lead measure">${N.cite(t.lead, up)}</p>
<p class="measure">${N.cite(t.intro, up)}</p>
<dl class="facts"><dt>Stops</dt><dd>${t.stops.length}</dd><dt>Time</dt><dd>${esc(t.time)}</dd><dt>Start</dt><dd>${esc(strip(t.stops[0].name))}, ${esc(t.stops[0].addr)}</dd></dl>
${t.legs && t.legs.some(g => g[2] === 'walk') ? `<div class="tmap-bar" id="tmap-bar" hidden><button type="button" data-v="walk" aria-pressed="true">The walk</button><button type="button" data-v="all" aria-pressed="false">All ${t.stops.length} stops</button></div>` : ''}${mapBox(`Map of the ${t.title} trail`)}
<p class="small tmap-key"><span class="tmk sm" aria-hidden="true">1</span> stop · <span class="tmk sm ap" aria-hidden="true">1</span> marker approximate${t.legs ? ' · <span class="walkline" aria-hidden="true"></span> walking route, in order (follow the streets)' : ''}</p>
${stopList(t.stops, N.cite, up, t.legs)}
${t.table ? `<h2>${t.id === 'rothko' ? 'Every Gloucester sheet you can see' : 'In public collections'}</h2><div class="tscroll" tabindex="0" role="region" aria-label="Table of works, scrolls sideways"><table class="vtab works"><caption>${N.cite(t.table.caption, up)}</caption><thead><tr><th scope="col">Title</th><th scope="col">Date</th><th scope="col">Collection</th><th scope="col">Note</th></tr></thead><tbody>${t.table.rows.map(([ti, d, c, acc, id, n]) => `<tr><td><a href="https://rothko.nga.gov/Detail/objects/${id}">${esc(ti)}</a></td><td>${esc(d)}</td><td>${esc(c)}, ${esc(acc)}</td><td>${esc(n)}</td></tr>`).join('')}</tbody></table></div>` : ''}
${(t.asides || []).map(a => `<aside class="aside"><h3>${esc(a.h)}</h3><p>${N.cite(a.text, up)}</p>${works(a.works, up)}</aside>`).join('')}
${N.list()}
<nav class="pager" aria-label="More trails">${X.trails.filter(o => o !== t).map((o, i) => `<a${i ? ' class="nx"' : ''} href="${o.id}.html">${i ? '' : '‹ '}${esc(o.title)}${i ? ' ›' : ''}<small>${o.stops.length} stops</small></a>`).join('')}</nav>
</article>`) });
  }
  page({ file: 'trails/index.html', title: 'Trails: women painters, Hopper, Rothko and the working waterfront', desc: 'Self-guided routes through Gloucester for painters and art lovers: the women of Cape Ann, Edward Hopper’s houses, Rothko, Avery and Gottlieb in East Gloucester, and the working waterfront.',
    crumbs: [['Trails']],
    body: up => `<div class="kicker">Trails</div><h1>Trails through painted Gloucester</h1>
<p class="lead measure">Routes that link the places in the paintings, with a map, directions and sources for every stop. Each one works as a walk, a drive or both.</p>
<ul class="cards">${X.trails.map(t => { return `<li><a class="card" href="${t.id}.html"><span class="band" aria-hidden="true"><b>${t.stops.length}</b><i>stops</i><em>${esc(t.span)}</em></span><span class="k">${esc(t.kicker)}</span><b>${esc(t.title)}</b><span>${esc(strip(t.lead).split('. ')[0])}.</span><span class="m">${esc(t.short)}</span></a></li>`; }).join('')}
<li><a class="card" href="${up}waterfront.html"><img src="${up}thumbs/homer-schooners-waterboat.webp" alt="" loading="lazy"><span class="k">Layer · the harbor at work</span><b>The working waterfront</b><span>Fish flakes, dories, schooners and nets: what the painters were looking at.</span><span class="m">${X.waterfront.stops.length} places · ${X.waterfront.terms.length} terms</span></a></li>
<li><a class="card" href="${up}winter.html"><img src="${up}thumbs/lane-ships-in-ice.webp" alt="" loading="lazy"><span class="k">Season</span><b>Painting in winter</b><span>Low light, sea smoke and empty beaches, with the sun’s times for every month.</span><span class="m">November to March</span></a></li></ul>
<p class="small measure">Many stops are private homes or working wharves. Look from public ways, keep sidewalks and driveways clear, and ask before painting people.</p>` });

  /* ---- working waterfront ---- */
  { const N = Notes(), W = X.waterfront; W.stops.forEach((s, i) => { s.n = i + 1; });
    page({ file: 'waterfront.html', title: 'The working waterfront: what the painters were looking at', type: 'article',
      desc: 'Fish flakes, dories, schooners, gill nets and draggers in the paintings of Gloucester Harbor, and five places where the working waterfront can still be seen.',
      image: 'img/homer-schooners-waterboat.jpg', imageAlt: 'Winslow Homer, Gloucester Schooners and Waterboat, 1880', crumbs: [['Trails', 'trails/'], ['Working waterfront']],
      head: mapHead, tail: mapTail(W.stops, null),
      body: up => stable(`<article><div class="kicker">Layer · the harbor at work</div><h1>The working waterfront</h1>
<p class="lead measure">${N.cite(W.lead, up)}</p>
<h2>What is in the paintings</h2>
<dl class="terms">${W.terms.map(t => `<dt>${esc(t.t)}</dt><dd><p>${N.cite(t.d, up)}</p>${works(t.works, up)}</dd>`).join('')}</dl>
<h2>Where to see it today</h2>
${mapBox('Map of five working-waterfront places')}
${stopList(W.stops, N.cite, up, null)}
<aside class="aside"><h3>The documentary photographs</h3><p>${N.cite(W.photos, up)}</p></aside>
${N.list()}</article>`) });
  }

  /* ---- winter: sun data from the guide's own NOAA code ---- */
  { const src = fs.readFileSync('js/explorer.js', 'utf8'); const code = src.slice(src.indexOf('const SUN = (() => {'), src.indexOf('return { pos, localToUtc, riseSet, tzLabel };') + 60);
    const sctx = {}; vm.createContext(sctx); vm.runInContext(code.replace('const SUN =', 'this.SUN =').replace(/\}\)\(\);[\s\S]*$/, '})();'), sctx); const SUN = sctx.SUN;
    const LAT = 42.6100, LON = -70.6620;
    const hm = m => { const h = Math.floor(m / 60), mm = Math.round(m % 60); const H = (mm === 60 ? h + 1 : h), M = mm === 60 ? 0 : mm; return `${((H + 11) % 12) + 1}:${String(M).padStart(2, '0')} ${H < 12 ? 'a.m.' : 'p.m.'}`; };
    const day = (y, mo, d) => { const rs = SUN.riseSet(y, mo, d, LAT, LON); let best = -99, bm = 0; for (let m = 600; m <= 840; m += 1) { const e = SUN.pos(SUN.localToUtc(y, mo, d, m), LAT, LON).el; if (e > best) { best = e; bm = m; } }
      const az = s => SUN.pos(SUN.localToUtc(y, mo, d, s), LAT, LON).az; return { rise: rs.rise, set: rs.set, len: rs.set - rs.rise, noon: best, noonAt: bm, raz: az(rs.rise), saz: az(rs.set), tz: SUN.tzLabel(y, mo, d) }; };
    const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const rows = [[2026, 11, 15], [2026, 12, 21], [2027, 1, 15], [2027, 2, 15], [2027, 3, 15], [2027, 6, 21]].map(([y, mo, d]) => ({ y, mo, d, ...day(y, mo, d) }));
    let early = null; for (let d = 1; d <= 20; d++) { const s = SUN.riseSet(2026, 12, d, LAT, LON).set; if (!early || s < early.s - 0.01) early = { d, s }; }
    let late = null; for (let d = 25; d <= 31; d++) { const r = SUN.riseSet(2026, 12, d, LAT, LON).rise; if (!late || r > late.r + 0.01) late = { d, r, y: 2026, mo: 12 }; } for (let d = 1; d <= 12; d++) { const r = SUN.riseSet(2027, 1, d, LAT, LON).rise; if (r > late.r + 0.01) late = { d, r, y: 2027, mo: 1 }; }
    const monthly = MON.map((n, i) => ({ n, e: day(2027, i + 1, 15).noon }));
    const dec = rows[1], jun = rows[5];
    { let m = 780; while (m < 1200 && SUN.pos(SUN.localToUtc(2027, 7, 15, m), LAT, LON).el > dec.noon) m++; X._jul = Math.round(m / 5) * 5; }
    const cardinal = a => ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'][Math.round(a / 22.5) % 16];
    const sunsetTip = `The sun sets as early as ${hm(early.s)} in early December (earliest around December ${early.d}). Plan to finish by about 3:30 p.m. and pack up in daylight.`;
    const Wn = X.winter; Wn.kit = Wn.kit.map(k => k === '__SUNSET__' ? sunsetTip : k);
    // chart: noon sun height by month
    const cw = 640, ch = 230, pad = { l: 40, r: 10, t: 16, b: 34 }, bw = (cw - pad.l - pad.r) / 12, ymax = 75;
    const yy = e => pad.t + (ch - pad.t - pad.b) * (1 - e / ymax);
    const chart = `<figure class="chart"><svg viewBox="0 0 ${cw} ${ch}" role="img" aria-labelledby="ch-t ch-d"><title id="ch-t">Height of the noon sun over Gloucester, by month</title><desc id="ch-d">On the 15th of each month: ${monthly.map(m => `${m.n} ${m.e.toFixed(0)}°`).join(', ')}.</desc>
${[0, 25, 50, 75].map(v => `<line x1="${pad.l}" x2="${cw - pad.r}" y1="${yy(v)}" y2="${yy(v)}" class="gl"/><text x="${pad.l - 6}" y="${yy(v) + 4}" class="ax" text-anchor="end">${v}°</text>`).join('')}
${monthly.map((m, i) => { const w = [10, 11, 0, 1, 2].includes(i); const x = pad.l + i * bw + 5, h = yy(0) - yy(m.e); return `<rect x="${x.toFixed(1)}" y="${yy(m.e).toFixed(1)}" width="${(bw - 10).toFixed(1)}" height="${h.toFixed(1)}" rx="2" class="${w ? 'bw' : 'bs'}"/><text x="${(x + (bw - 10) / 2).toFixed(1)}" y="${(yy(m.e) - 5).toFixed(1)}" class="vl" text-anchor="middle">${m.e.toFixed(0)}°</text><text x="${(x + (bw - 10) / 2).toFixed(1)}" y="${ch - 14}" class="ax" text-anchor="middle">${m.n.slice(0, 3)}</text>`; }).join('')}
</svg><figcaption>Height of the sun above the horizon at midday, on the 15th of each month. Winter months in ochre. Computed with the guide’s NOAA solar code for Gloucester Harbor.</figcaption></figure>`;
    const N = Notes();
    page({ file: 'winter.html', title: 'Painting Cape Ann in winter: low light, sea smoke and the sun’s times', type: 'article',
      desc: `The winter sun over Gloucester: ${hm(dec.rise)} sunrise and ${hm(dec.set)} sunset at the solstice, a noon sun only ${dec.noon.toFixed(0)}° high, sea smoke, and how to paint in the cold.`,
      image: 'img/lane-ships-in-ice.jpg', imageAlt: 'Fitz Henry Lane, Ships in Ice off Ten Pound Island, Gloucester, 1850s', crumbs: [['Trails', 'trails/'], ['Winter']],
      body: up => stable(`<article><div class="kicker">Season · November to March</div><h1>Painting in winter</h1>
<p class="lead measure">${N.cite(Wn.lead, up)}</p>
<ul class="glance"><li><b>${dec.noon.toFixed(0)}°</b><span>noon sun at the winter solstice, against ${jun.noon.toFixed(0)}° in June</span></li><li><b>${hm(early.s).replace(' p.m.', '')}</b><span>p.m., the earliest sunset, around December ${early.d}</span></li><li><b>${Math.floor(dec.len / 60)} h ${String(Math.round(dec.len % 60)).padStart(2, '0')} m</b><span>of daylight on December 21, against ${Math.floor(jun.len / 60)} h ${String(Math.round(jun.len % 60)).padStart(2, '0')} m in June</span></li><li><b>${cardinal(dec.saz)}</b><span>where the solstice sun sets (${Math.round(dec.saz)}°), far round to the left of the summer sunset</span></li></ul>
<h2>Why the light is different</h2>
<p class="measure">At midday in December the sun is about as high as it is at ${hm(X._jul)} in mid-July, so every hour of a winter day has the long shadows and raking light that summer painters wait for in the evening.</p>
${chart}
<div class="tscroll" tabindex="0" role="region" aria-label="Sun table, scrolls sideways"><table class="vtab sun"><caption>The sun over Gloucester Harbor (${LAT.toFixed(2)}° N, ${Math.abs(LON).toFixed(2)}° W). Times are local clock time.</caption><thead><tr><th scope="col">Date</th><th scope="col">Sunrise</th><th scope="col">Sunset</th><th scope="col">Daylight</th><th scope="col">Noon sun</th><th scope="col">Sunrise · sunset direction</th></tr></thead><tbody>
${rows.map(r => `<tr${r.mo === 6 ? ' class="cmp"' : ''}><th scope="row">${MON[r.mo - 1]} ${r.d}, ${r.y}</th><td>${hm(r.rise)}</td><td>${hm(r.set)} ${r.tz}</td><td>${Math.floor(r.len / 60)} h ${String(Math.round(r.len % 60)).padStart(2, '0')} m</td><td>${r.noon.toFixed(1)}°</td><td>${cardinal(r.raz)} ${Math.round(r.raz)}° · ${cardinal(r.saz)} ${Math.round(r.saz)}°</td></tr>`).join('')}
</tbody></table></div>
<p class="small measure">The latest sunrise is about ${hm(late.r)}, in early January (around ${MON[late.mo - 1]} ${late.d}). For any other day and place, use the sun planner on <a href="${up}#map">the chart</a>.</p>
<h2>Sea smoke</h2><p class="measure">${N.cite(Wn.seasmoke, up)}</p>
<h2>Winter painters</h2><p class="measure">${N.cite(Wn.painters, up)}</p>${works(Wn.works, up)}
<h2 id="open-in-winter">What’s open in winter</h2><p class="measure">Many Cape Ann galleries close or shorten their hours from November to April. Here is what the guide’s listings say for the winter months. Hours change, so call before a long drive.</p>
<ul class="today measure wopen">${P.places.filter(p => p.winter).map(p => `<li><div translate="no"><a href="${up}shops.html#${p.id}"><b>${esc(p.name)}</b></a> · ${esc(p.town)}</div><div>${esc(p.winter)}</div></li>`).join('')}</ul>
<h2>Working in the cold</h2><ul class="today measure">${Wn.kit.map(k => `<li>${esc(k)}</li>`).join('')}</ul>
${N.list()}</article>`) });
    X._sun = { dec, jun, early };
  }

  /* ---- photographers ---- */
  { const N = Notes(), Ph = X.photographers;
    page({ file: 'photographers.html', title: 'The photographers of Gloucester: Siskind, Parks, Rothstein', type: 'article',
      desc: 'Aaron Siskind’s Gloucester abstractions of 1944–45, Gordon Parks aboard the Alden in 1943 and Arthur Rothstein’s 1937 docks: where to see the photographs, with links to every collection.',
      crumbs: [['Trails', 'trails/'], ['Photographers']],
      body: up => stable(`<article><div class="kicker">Companion · photography</div><h1>The photographers</h1>
<p class="lead measure">${N.cite(Ph.lead, up)}</p>
${Ph.people.map(p => `<section class="grp"><h2>${esc(p.name)}</h2><p class="sub">${esc(p.life)} · ${esc(p.when)}</p><p class="measure">${N.cite(p.text, up)}</p>
${p.works ? `<table class="vtab"><caption>Gloucester photographs by ${esc(p.name)} in public collections</caption><thead><tr><th scope="col">Photograph</th><th scope="col">Collection and number</th></tr></thead><tbody>${p.works.map(([t, c, k]) => `<tr><td>${t}</td><td><a href="${esc(X.src[k][1])}">${esc(c)} ↗</a></td></tr>`).join('')}</tbody></table>` : ''}
${p.tip ? `<p class="note"><b>Try it</b>${esc(p.tip)}</p>` : ''}</section>`).join('')}
${N.list()}</article>`) });
  }


  /* ---- painters: profiles and who-brought-whom chains ---- */
  { const N = Notes(), Pn = X.painters;
    const byName = {}; Pn.people.forEach(p => { byName[p.name] = p.id; });
    const nodeHtml = n => byName[n] ? `<a class="cn" href="#p-${byName[n]}">${esc(n)}</a>` : `<span class="cn">${esc(n)}</span>`;
    const first = Pn.people.flatMap(p => p.works).map(id => WBY[id]).find(w => w && w.img);
    page({ file: 'painters.html', title: 'The painters of Cape Ann: their lives here and who brought whom', type: 'article',
      desc: 'Short, sourced lives of the painters who worked in Gloucester and on Cape Ann, from Fitz Henry Lane and Mary Blood Mellen to Rothko and Nell Blaine, and the chains of teachers and friends that brought them.',
      image: first ? `img/${first.id}.jpg` : undefined, imageAlt: first ? `${first.by}, ${first.t}, ${first.d}` : undefined,
      crumbs: [['The painters']],
      ld: { '@context': 'https://schema.org', '@type': 'ItemList', name: 'The painters of Cape Ann', url: `${ORIGIN}/painters.html`,
        itemListElement: Pn.people.flatMap(p => { const names = p.name.split(' and '), lives = p.life.split(' · ');
          return names.map((n, k) => { const m = (lives.length === names.length ? lives[k] : '').match(/^(\d{4})–(\d{4})$/);
            return { '@type': 'Person', name: n, ...(m ? { birthDate: m[1], deathDate: m[2] } : {}), url: `${ORIGIN}/painters.html#p-${p.id}` }; }); })
          .map((person, i) => ({ '@type': 'ListItem', position: i + 1, item: person })) },
      body: up => stable(`<article><div class="kicker">The painters</div><h1>Who came, and who brought them</h1>
<p class="lead measure">${N.cite(Pn.lead, up)}</p>
<section class="grp" aria-labelledby="chains-h"><h2 id="chains-h">Who brought whom</h2>
<p class="small measure">Read each chain left to right: each painter brought, taught or welcomed the next. Names link to the profiles below.</p>
<ol class="chains">${Pn.chains.map(c => `<li class="chain"><div class="ch-h"><b>${esc(c.title)}</b><span>${esc(c.years)}</span>${N.cite(c.src, up)}</div><div class="ch-row">${nodeHtml(c.steps[0])}${c.steps.slice(1).map((st, i, arr) => i % 2 ? '' : `<span class="cg"><span class="ce"><span class="ce-l">${esc(st)}</span><span class="ce-a" aria-hidden="true"></span></span>${nodeHtml(arr[i + 1])}</span>`).join('')}</div></li>`).join('')}</ol></section>
${Pn.people.map(p => `<section class="grp prof" id="p-${p.id}"><div class="prof-h"><h2>${esc(p.name)}</h2><p class="sub">${esc(p.life)} · ${esc(p.here)}</p></div><p class="measure">${N.cite(p.text, up)}</p>${works(p.works, up)}${p.g ? `<p class="acts"><a href="${up}works/#g-${p.g}">${esc(D.artists.find(a => a.k === p.g).name)}: all works</a></p>` : ''}</section>`).join('')}
<p class="small measure">More lives are on the <a href="${up}trails/women.html">Women of Cape Ann trail</a> (Martha Walter, Sally Michel Avery, Jane Peterson, Virginia Lee Burton) and the <a href="${up}photographers.html">photographers page</a>.</p>
${N.list()}</article>`) });
  }
  /* ---- teachers ---- */
  { const N = Notes(), T = X.teachers;
    page({ file: 'teachers.html', title: 'For teachers: three lessons on painting Cape Ann', type: 'article',
      desc: 'Classroom and field lessons for grades 3–4, grades 7–8 and high school Foundations, using the guide’s paintings, sites and sun planner, keyed to the 2019 Massachusetts Arts Curriculum Framework.',
      crumbs: [['For teachers']],
      body: up => stable(`<article><div class="kicker">For teachers</div><h1>Three lessons on painting Cape Ann</h1>
<p class="lead measure">${N.cite(T.lead, up)}</p>
<p class="measure small">Free to use and adapt in class under CC BY 4.0. Print this page from the browser: the header, buttons and footer drop out.</p>
${T.lessons.map((l, i) => `<section class="grp lesson" id="lesson-${i + 1}"><p class="kicker">${esc(l.grade)} · ${esc(l.time)}</p><h2>${esc(l.title)}</h2><p class="measure"><b>Goal.</b> ${esc(l.goal)}</p>
<table class="vtab std"><caption>Standards addressed, from the 2019 Massachusetts Arts Curriculum Framework${N.cite(l.stdsrc || '', up)}</caption><thead><tr><th scope="col">Code</th><th scope="col">Standard</th></tr></thead><tbody>${l.std.map(([c, d]) => `<tr><td class="code">${esc(c)}</td><td>${N.cite(d, up)}</td></tr>`).join('')}</tbody></table>
<h3>Paintings</h3>${works(l.pair, up)}
<h3>Steps</h3><ol class="lsteps">${l.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>
<p class="note"><b>Assessment</b>${esc(l.assess)}</p></section>`).join('')}
<section class="grp"><h2>Before a field trip</h2><ul class="today">${T.field.map(f => `<li>${esc(f)}</li>`).join('')}</ul><p><a href="${up}sites/">The nine sites, with access notes</a> · <a href="${up}field-notes.html">Palettes and light</a> · <a href="${up}waterfront.html">The working waterfront</a> · <a href="${up}photographers.html">The photographers</a></p></section>
${N.list()}</article>`) });
  }

  /* ---- visitors' gallery ---- */
  { const G = X.gallery, form = 'https://github.com/paintedgloucester/paintedgloucester.github.io/issues/new?template=gallery.yml';
    page({ file: 'gallery.html', title: 'Visitors’ gallery: paintings made at the sites', desc: 'Paintings made at the Painted Gloucester sites by visitors and local painters, sent in by the painters and published with their permission.',
      crumbs: [['Visitors’ gallery']],
      body: up => `<div class="kicker">Visitors’ gallery</div><h1>Painted at the sites</h1>
<p class="lead measure">${esc(G.lead)}</p>
${G.entries.length ? `<ul class="gal">${G.entries.map(e => `<li><figure><img src="${up}img/gallery/${esc(e.file)}" alt="${esc(e.alt)}" loading="lazy"><figcaption><b><i>${esc(e.title)}</i></b><span>${esc(e.by)}, ${esc(e.date)} · ${esc(e.med)}</span>${e.site ? `<a href="${up}sites/${esc(e.site)}.html">Painted at site ${D.sites.find(s => s.id === e.site).n}</a>` : ''}</figcaption></figure></li>`).join('')}</ul>`
  : `<div class="plate none"><p class="k">Opening November 2026</p><p class="big">The first paintings are on their way.</p><a class="btn gold" href="${form}">Send in a painting ↗</a></div>`}
<h2>How to send a painting</h2>
<ol class="lsteps measure"><li>Paint at one of <a href="${up}sites/">the nine sites</a>, on a trail, or anywhere on Cape Ann.</li><li>Photograph it square-on in daylight, without glare or frame, and crop to the edges of the painting.</li><li>Open <a href="${form}">the submission form</a> and drag the photo into it. The form asks for the title, the date, the medium and where you painted it, and for your permission to publish.</li><li>We check every entry by hand and add it here, usually within a few weeks. We will reply on the form if anything is missing.</li></ol>
<div class="note"><b>Before you send</b>The form is on GitHub, so you need a free GitHub account, and your GitHub username and the form are public. Use the name you want credited, not your address, phone number or email. Do not send paintings that show people who have not agreed to be shown, and if you are under 18, ask a parent or guardian to send it for you.</div>
<p class="small measure">By sending a painting you confirm that you made it and that you allow Painted Gloucester to show the photograph on this site, credited to you. You keep the copyright. To have a painting taken down, reply on its form or send a correction through <a href="https://github.com/paintedgloucester/paintedgloucester.github.io/issues/new?template=listing.yml">the corrections form</a>.</p>` });
  }


  /* ---- data for the home page's trail explorer (js/home-trails.js reads window.PG_TRAILS) ---- */
  { const plain = (h, lim = 340) => { let s = String(h ?? '').replace(/\s*\[\[\w+\]\]/g, '').replace(/<a [^>]*>(.*?)<\/a>/g, '$1').replace(/\s*\((?:site|stop) \d+\)/g, '').trim();
      if (s.length <= lim) return s; const cut = s.slice(0, lim); const k = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; ')); return (k > 120 ? cut.slice(0, k) : cut.replace(/\s\S*$/, '')).replace(/[;,]$/, '') + (k > 120 && cut[k] === '.' ? '.' : '…'); };
    const wk = id => { const w = WBY[id]; return { id: w.id, t: strip(w.t), by: w.by, d: w.d, img: !!w.img, mus: mus(w) }; };
    const stopsOf = (ss) => ss.map((s, i) => ({ n: i + 1, name: strip(s.name), who: s.who || '', addr: s.addr, ll: s.ll, approx: !!s.approx, text: plain(s.text), works: (s.works || []).slice(0, 2).map(wk) }));
    const firstImg = ss => { const w = ss.flatMap(s => s.works || []).map(id => WBY[id]).find(w => w && w.img); return w ? { id: w.id, alt: `${w.by}, ${strip(w.t)}, ${w.d}` } : null; };
    const out = {
      trails: [...X.trails.map(t => ({ id: t.id, url: `trails/${t.id}.html`, title: t.title, kicker: t.kicker.replace(/^Trail · /, ''), span: t.span, short: t.short, lead: plain(t.lead, 260), legs: t.legs || [], hero: firstImg(t.stops), stops: stopsOf(t.stops) })),
        { id: 'waterfront', url: 'waterfront.html', title: 'The working waterfront', kicker: 'the harbor at work', span: 'Fish flakes to draggers', short: 'A harbor walk, then a short drive', lead: plain(X.waterfront.lead, 260), legs: [[0, 4, 'walk'], [4, 5, 'drive']], hero: { id: 'homer-schooners-waterboat', alt: 'Winslow Homer, Gloucester Schooners and Waterboat, 1880' }, stops: stopsOf(X.waterfront.stops) }],
      words: X.waterfront.terms.map(w => ({ t: w.t, d: plain(w.d, 400), w: (w.works || []).map(wk).find(x => x.img) || null })),
      chains: X.painters.chains.map(c => ({ title: c.title, years: c.years, steps: c.steps }))
    };
    fs.writeFileSync('js/trailhome.js', '/* Generated by tools/build.mjs from js/extras.js. Do not edit by hand. */\nwindow.PG_TRAILS = ' + JSON.stringify(out) + ';\n');
  }
}
