/* Painted Gloucester: features layered on the explorer (home, shops, passport, viewfinder, color lab).
   explorer.js exposes window.PG and calls the window.PGX hooks below. */
(function () {
'use strict';
const PGX = window.PGX = {};
let PG = null;
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LS = {
  get(k, d) { try { const v = localStorage.getItem('pg:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('pg:' + k, JSON.stringify(v)); } catch (e) {} }
};
const CFG = { REPO: 'paintedgloucester/paintedgloucester.github.io' };
const PL = () => window.PLACES, G = () => window.PG_GUIDE;
const R = Math.PI / 180;
function dist(a, b) { const dLat = (b[0] - a[0]) * R, dLon = (b[1] - a[1]) * R, h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * R) * Math.cos(b[0] * R) * Math.sin(dLon / 2) ** 2; return 2 * 6371000 * Math.asin(Math.sqrt(h)); }
function brg(a, b) { const y = Math.sin((b[1] - a[1]) * R) * Math.cos(b[0] * R), x = Math.cos(a[0] * R) * Math.sin(b[0] * R) - Math.sin(a[0] * R) * Math.cos(b[0] * R) * Math.cos((b[1] - a[1]) * R); return (Math.atan2(y, x) / R + 360) % 360; }
const fmtD = m => m < 1000 ? `${Math.round(m / 10) * 10} m (${Math.round(m * 3.28084 / 10) * 10} ft)` : `${(m / 1000).toFixed(1)} km (${(m / 1609.344).toFixed(1)} mi)`;
const imgSrc = id => `img/m/${id}.webp`, thumb = id => `thumbs/${id}.webp`;
/* the hero fills the screen: phones get the 1200px copy, large screens the full JPEG */
const heroSrc = id => innerWidth * Math.min(devicePixelRatio || 1, 2) > 1500 ? `img/${id}.jpg` : imgSrc(id);
const loadSlide = el => { if (el && el.dataset.bg) { el.style.backgroundImage = `url('${el.dataset.bg}')`; delete el.dataset.bg; } };
const nyToday = () => { const o = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value])); return { y: +o.year, m: +o.month, d: +o.day, min: +o.hour * 60 + +o.minute }; };
const dirUrl = ll => `https://www.google.com/maps/dir/?api=1&destination=${ll[0]},${ll[1]}`;

/* ================= color mixing ================= */
const PIG = [['Titanium white', '#F4F2EC'], ['Cadmium yellow light', '#F4CF2A'], ['Yellow ochre', '#C38F2E'], ['Raw sienna', '#B4733A'], ['Burnt sienna', '#8A3F22'],
  ['Cadmium red light', '#D6362A'], ['Alizarin crimson', '#8E2236'], ['Ultramarine blue', '#2F3C8F'], ['Cerulean blue', '#3E86B8'], ['Viridian', '#2F7A63'], ['Raw umber', '#5E4B32'], ['Ivory black', '#262626']];
const hex2rgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgb2hex = c => '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('').toUpperCase();
const toLin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const toSrgb = v => 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function lab(lin) { const [r, g, b] = lin; let x = (r * .4124 + g * .3576 + b * .1805) / .95047, y = r * .2126 + g * .7152 + b * .0722, z = (r * .0193 + g * .1192 + b * .9505) / 1.08883;
  const f = t => t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116; x = f(x); y = f(y); z = f(z); return [116 * y - 16, 500 * (x - y), 200 * (y - z)]; }
const PLIN = PIG.map(p => hex2rgb(p[1]).map(toLin).map(v => Math.log(Math.max(v, 1e-4))));
// paint mixing approximated as a weighted geometric mean of linear reflectance (subtractive-ish)
function mixLin(parts) { const out = [0, 0, 0]; let t = 0; parts.forEach(([i, w]) => { t += w; for (let c = 0; c < 3; c++) out[c] += w * PLIN[i][c]; }); return out.map(v => Math.exp(v / t)); }
function bestMix(hex) {
  const target = lab(hex2rgb(hex).map(toLin)); let best = null;
  const tryParts = parts => { const L = lab(mixLin(parts)); const dE = Math.hypot(L[0] - target[0], L[1] - target[1], L[2] - target[2]) + (parts.length - 1) * 0.7; if (!best || dE < best.dE) best = { dE, parts }; };
  const n = PIG.length;
  for (let a = 0; a < n; a++) tryParts([[a, 1]]);
  for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let i = 1; i < 10; i++) tryParts([[a, i], [b, 10 - i]]);
  for (let a = 1; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++)
    for (let i = 1; i <= 8; i++) for (let j = 1; i + j <= 9; j++) { const k = 10 - i - j; tryParts([[a, i], [b, j], [c, k]]); tryParts([[0, i], [a, j], [b, k]]); }
  for (let a = 1; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++)
    for (let w = 1; w <= 7; w++) for (let i = 1; w + i <= 9; i++) for (let j = 1; w + i + j <= 9; j++) { const k = 10 - w - i - j; if (k < 1) continue; tryParts([[0, w], [a, i], [b, j], [c, k]]); }
  // near-whites and pale tints: finer steps with lots of white
  for (let a = 1; a < n; a++) { for (let i = 1; i <= 4; i++) tryParts([[0, 20 - i], [a, i]]);
    for (let b = a + 1; b < n; b++) for (let i = 1; i <= 3; i++) for (let j = 1; j <= 3; j++) tryParts([[0, 20 - i - j], [a, i], [b, j]]); }
  const parts = best.parts.filter(p => p[1] > 0).sort((x, y) => y[1] - x[1]);
  return { parts: parts.map(([i, w]) => ({ name: PIG[i][0], hex: PIG[i][1], w })), result: rgb2hex(mixLin(best.parts).map(toSrgb)), dE: best.dE };
}
function mixHTML(hex) {
  const m = bestMix(hex); const tot = m.parts.reduce((a, p) => a + p.w, 0);
  return `<div class="mix"><div class="mixsw"><span style="background:${hex}"></span><span style="background:${m.result}"></span></div>
    <div class="mixtx"><b>${hex}</b><span class="small">Starting mix, about ${m.parts.map(p => `${p.w} part${p.w > 1 ? 's' : ''} ${esc(p.name.toLowerCase())}`).join(', ')}.</span>
    <div class="mixbar">${m.parts.map(p => `<i style="flex:${p.w};background:${p.hex}" title="${esc(p.name)}"></i>`).join('')}</div>
    <span class="tiny">Left: the painting. Right: the predicted mix${m.dE > 12 ? ', the closest these twelve colors get' : ''}. Mixing is estimated; adjust by eye.</span></div></div>`;
}
/* sampling from an image */
const cvCache = {};
function sampler(src) { if (cvCache[src]) return cvCache[src]; return cvCache[src] = new Promise(res => { const im = new Image(); im.onload = () => { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; const x = c.getContext('2d', { willReadFrequently: true }); x.drawImage(im, 0, 0); res(x); }; im.src = src; }); }
function avgAt(ctx, x, y, r = 3) { const d = ctx.getImageData(Math.max(0, x - r), Math.max(0, y - r), r * 2 + 1, r * 2 + 1).data; const s = [0, 0, 0]; let n = 0; for (let i = 0; i < d.length; i += 4) { s[0] += toLin(d[i]); s[1] += toLin(d[i + 1]); s[2] += toLin(d[i + 2]); n++; } return rgb2hex(s.map(v => toSrgb(v / n))); }

/* ================= init ================= */
PGX.init = () => {
  PG = window.PG;
  buildHome(); buildMapLayers(); buildPaint(); buildShops(); buildPlan(); viewerSampling(); initOffline();
  document.addEventListener('click', e => { const a = e.target.closest('[data-go-site]'); if (!a) return; e.preventDefault(); goSite(a.dataset.goSite); });
  document.addEventListener('click', e => { const a = e.target.closest('[data-shops-map]'); if (!a) return; e.preventDefault(); PG.show('shops'); PG.setHash('shops'); requestAnimationFrame(() => { initShopMap(); $('#shopmap').scrollIntoView({ block: 'center' }); }); });
  document.addEventListener('click', e => { const a = e.target.closest('[data-go-place]'); if (!a) return; e.preventDefault(); goPlace(a.dataset.goPlace); });
};
function goSite(id) { const s = PG.D.sites.find(x => x.id === id); if (!s) return; PG.show('map'); requestAnimationFrame(() => { PG.MAP.resize(); PG.selectSite(s, true); }); }
function goPlace(id) { if (!PL().places.find(x => x.id === id)) return; PG.show('shops'); PG.setHash('shops'); requestAnimationFrame(() => focusPlace(id)); }
/* ================= offline ================= */
const OFFLINE_CACHE = 'pg-paintings';
function initOffline() {
  const btn = $('#offlinebtn'), msg = $('#offlinemsg'); if (!btn) return;
  if (!('serviceWorker' in navigator) || !('caches' in window)) { btn.hidden = true; msg.textContent = 'This browser cannot save the guide for offline use.'; return; }
  const ids = PG.D.works.filter(w => w.img).map(w => w.id), urls = ids.map(imgSrc).concat(ids.map(thumb));
  const done = () => { btn.textContent = 'Saved for offline use ✓'; btn.disabled = true; msg.textContent = `All ${ids.length} paintings are stored on this device. The chart, sun planner, passport and paintings now work without a signal. The street map on the Shops page and museum links still need a connection.`; };
  if (LS.get('offline', 0) === ids.length) caches.has(OFFLINE_CACHE).then(h => { if (h) done(); });
  btn.onclick = async () => {
    btn.disabled = true; let n = 0, bad = 0;
    try { const c = await caches.open(OFFLINE_CACHE);
      for (const u of urls) { try { if (!(await c.match(u))) { const r = await fetch(u); if (!r.ok) throw 0; await c.put(u, r); } } catch (e) { bad++; } n++; if (n % 4 === 0 || n === urls.length) msg.textContent = `Saving paintings… ${Math.round(n / urls.length * 100)}%`; }
    } catch (e) { bad = urls.length; }
    if (bad) { btn.disabled = false; msg.textContent = `${bad} image${bad === 1 ? '' : 's'} could not be saved. Check your connection and try again.`; }
    else { LS.set('offline', ids.length); done(); }
  };
}
if ('serviceWorker' in navigator && (location.protocol === 'https:' || ['localhost', '127.0.0.1'].includes(location.hostname))) {
  addEventListener('load', () => { const had = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && PG) PG.toast('Guide updated. Reload for the latest.'); }); });
}
PGX.onShow = v => { if (v === 'home') heroPlay(true); else heroPlay(false); if (v === 'plan') renderPassport(); if (v === 'paint') labInit(); if (v === 'shops') requestAnimationFrame(initShopMap); };

/* ================= home ================= */
const SLIDES = ['lane-braces-rock', 'homer-gloucester-harbor-1880', 'hassam-norton', 'lane-ten-pound-cam', 'metcalf-gloucester-harbor', 'twachtman-fishing-boats', 'duveneck-horizon', 'homer-green-dory'];
let slideI = 0, slideT = null;
function buildHome() {
  const box = $('#slides'); const W = PG.WBY;
  box.innerHTML = SLIDES.filter(id => W[id]).map((id, i) => `<div class="slide${i === 0 ? ' on' : ''}" data-bg="${heroSrc(id)}"></div>`).join('');
  loadSlide(box.firstElementChild);
  setCap();
  // today's light at Fort Point
  const t = nyToday(), s0 = PG.D.sites[0], rs = SUN.riseSet(t.y, t.m, t.d, s0.V[0], s0.V[1]);
  const tz = SUN.tzLabel(t.y, t.m, t.d), f = PG.fmtT;
  const dateTxt = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'long', month: 'long', day: 'numeric' });
  $('#todaybar').innerHTML = `<div><span class="k">Today on the harbor</span><b>${dateTxt}</b></div>
    <div><span class="k">Sunrise · sunset</span><b>${f(rs.rise)} · ${f(rs.set)}</b><span class="small">${tz}</span></div>
    <div><span class="k">Lane's hour</span><b>${f(rs.set - 120)}</b><span class="small">two hours before sunset</span></div>
    <div><span class="k">Golden hour</span><b>${f(rs.set - 50)}</b><span class="small">low warm light until sunset</span></div>`;
  // painters
  const cnt = {}, img = {}; PG.D.works.forEach(w => { cnt[w.g] = (cnt[w.g] || 0) + 1; if (w.img && !img[w.g]) img[w.g] = w.id; });
  $('#ptrs').innerHTML = PG.D.artists.map(a => `<button class="ptr" data-g="${a.k}">${img[a.k] ? `<img src="${thumb(img[a.k])}" alt="" loading="lazy">` : '<span class="ph"></span>'}<span><b>${esc(a.name)}</b><span class="small">${esc([a.life, a.tie].filter(Boolean).join(' · '))}</span><span class="tiny">${cnt[a.k] || 0} works</span></span></button>`).join('');
  $$('#ptrs .ptr').forEach(b => b.onclick = () => { PG.show('works'); PG.setHash('works'); const c = $(`#achips button[data-g="${b.dataset.g}"]`); const on = $$('#achips button.on').map(x => x.dataset.g).filter(Boolean); on.forEach(g => $(`#achips button[data-g="${g}"]`).click()); if (c) c.click(); });
  $$('.door[data-vf]').forEach(d => d.onclick = () => { setTimeout(() => goSite('braces-cove'), 0); });
  renderDoorStamps();
}
function setCap() { const w = PG.WBY[SLIDES[slideI]]; $('#herocap').innerHTML = w ? `${esc(w.by)}, <i>${esc(w.t)}</i>, ${esc(w.d)}. ${esc(w.mus.split(' (')[0])}.` : ''; }
function heroPlay(on) {
  clearInterval(slideT); if (!on || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  loadSlide($$('#slides .slide')[(slideI + 1) % SLIDES.length]);
  slideT = setInterval(() => { const ss = $$('#slides .slide'); ss[slideI].classList.remove('on'); slideI = (slideI + 1) % ss.length; loadSlide(ss[slideI]); ss[slideI].classList.add('on'); setCap(); loadSlide(ss[(slideI + 1) % ss.length]); }, 7000);
}

/* ================= map: places + you ================= */
let gP, gYou, you = null, watchId = null, plOn = true;
const inMap = ll => { if (!ll) return false; const [x, y] = PG.P(ll[0], ll[1]); return x > 0 && y > 0 && x < PG.D.map.W && y < PG.D.map.H; };
function buildMapLayers() {
  gP = PG.el('g', { class: 'plc' }); PG.svg.insertBefore(gP, PG.gSites);
  gYou = PG.el('g', { class: 'you' }); PG.svg.appendChild(gYou);
  PL().places.filter(p => inMap(p.ll)).forEach(p => {
    const [x, y] = PG.P(p.ll[0], p.ll[1]); const g = PG.el('g', { class: 'pm ' + p.type, tabindex: 0, role: 'button', 'aria-label': p.name }, gP);
    g.dataset.x = x; g.dataset.y = y; PG.el('rect', { x: -7, y: -7, width: 14, height: 14, rx: 2 }, g);
    const t = PG.el('title', {}, g); t.textContent = p.name;
    g.addEventListener('click', () => { if (!PG.MAP.moved) showPlace(p, false); });
    g.addEventListener('keydown', e => { if (e.key === 'Enter') showPlace(p, false); });
  });
  $('#pltog').onclick = () => { plOn = !plOn; $('#pltog').classList.toggle('on', plOn); $('#pltog').setAttribute('aria-pressed', plOn); gP.style.display = plOn ? '' : 'none'; };
  $('#locate').onclick = locate;
}
PGX.onDraw = () => {
  if (!PG) return; const k = PG.MAP.k();
  gP && [...gP.children].forEach(g => g.setAttribute('transform', `translate(${g.dataset.x},${g.dataset.y}) scale(${k})`));
  if (gYou && you) { const [x, y] = PG.P(you.lat, you.lon); const accPx = you.acc / (PG.D.map.span / PG.D.map.W);
    gYou.innerHTML = `<circle cx="${x}" cy="${y}" r="${Math.max(accPx, 0)}" class="acc"/><g transform="translate(${x},${y}) scale(${k})"><circle r="9" class="ring"/><circle r="6" class="dot"/></g>`; }
};
function locate() {
  if (!navigator.geolocation) { PG.toast('Location is not available in this browser'); return; }
  if (watchId != null) { // second tap: center on you
    if (you && inMap([you.lat, you.lon])) PG.MAP.site({ V: [you.lat, you.lon], S: [you.lat + 0.002, you.lon + 0.002] }); return; }
  PG.toast('Finding you…');
  watchId = navigator.geolocation.watchPosition(p => {
    const first = !you; you = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy };
    $('#locate').classList.add('on'); PG.MAP.k && PGX.onDraw();
    if (first) { if (inMap([you.lat, you.lon])) { PG.toast('You are on the chart'); PG.MAP.site({ V: [you.lat, you.lon], S: [you.lat + 0.002, you.lon + 0.002] }); }
      else PG.toast(`You're ${fmtD(dist([you.lat, you.lon], [42.6125, -70.6625]))} from Gloucester`); }
    updateYouDist();
  }, err => { watchId = null; PG.toast(err.code === 1 ? 'Location permission was declined' : 'Could not find your location'); }, { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 });
}
function updateYouDist() {
  const el = $('#youdist'); const s = PG.cur; if (!el || !s) return;
  if (!you) { el.innerHTML = `<button class="linkbtn" id="youbtn">Show how far I am from here</button>`; $('#youbtn').onclick = locate; return; }
  const d = dist([you.lat, you.lon], s.V), b = brg([you.lat, you.lon], s.V);
  el.innerHTML = d < 60 ? `<b>You're here.</b> Face ${s.compass} (${Math.round(s.bearing)}°) to see what ${esc(s.artist.split(' and ')[0])} saw.` : `<b>${fmtD(d)}</b> from the vantage point, heading ${PG.compass(b)} (${Math.round(b)}°).`;
}
function showPlace(p, zoom) {
  if (PG.cur) PG.selectSite(null);
  const panel = PG.panel, T = { supply: 'Art supplies', school: 'Workshops & associations', museum: 'Museum', gallery: 'Gallery' };
  panel.innerHTML = `<button class="back">← All nine sites</button><div class="kicker">${T[p.type]} · ${esc(p.town)}</div><h2 class="disp">${esc(p.name)}</h2>${placeBody(p)}`;
  panel.querySelector('.back').onclick = () => PG.selectSite(null);
  panel.scrollTop = 0; if (zoom) PG.MAP.site({ V: p.ll, S: [p.ll[0] + 0.0015, p.ll[1] + 0.0015] });
}
function placeBody(p) {
  return `<p class="addr">${esc(p.addr)}${p.phone ? ` · <span class="sel">${esc(p.phone)}</span>` : ''}</p>
    <p>${esc(p.what)}</p>
    ${p.hours ? `<div class="hrs"><div class="hl">Hours</div><div>${esc(p.hours)}</div></div>` : ''}${p.winter ? `<div class="hrs"><div class="hl">In winter</div><div>${esc(p.winter)}</div></div>` : ''}
    ${p.special && p.special.length ? `<h4>What makes it special</h4><ul class="plist">${p.special.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${p.confirm ? `<p class="confirm">${esc(p.confirm)}</p>` : ''}
    <div class="btnrow">${p.url ? `<a class="btn solid" href="${esc(p.url)}" target="_blank" rel="noopener">Website ↗</a>` : ''}<a class="btn" href="${dirUrl(p.ll)}" target="_blank" rel="noopener">Directions ↗</a></div>
    <p class="src"><span class="chk">Checked ${esc(p.checked || PL().checked)}</span> · Source: ${p.src.map(([n, u]) => `<a translate="no" href="${esc(u)}" ${u.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${esc(n)}</a>`).join('; ')}</p>`;
}

/* ================= panel decorations ================= */
PGX.onIntro = () => setTimeout(() => {
  if (!PG) return; const panel = PG.panel; if (panel.querySelector('.newbox')) return;
  const lead = panel.querySelector('.lead');
  lead && lead.insertAdjacentHTML('afterend', `<div class="newbox"><b>On Cape Ann today?</b> Tap <span class="kbd">ME</span> to see yourself on the chart. Open a site and tap <i>Line it up</i> to hold the painting over your camera view, then stamp your passport. Square markers are art shops and studios; <a href="#shops" data-shops-map="1">see them all on one map</a>.</div>`);
}, 0);
PGX.onSite = s => {
  const panel = PG.panel, w = s.main ? PG.WBY[s.main] : null, st = LS.get('passport', {})[s.id];
  const row = `<div class="btnrow onsite">
    ${w && w.img ? `<button class="btn solid" id="vfbtn">Line it up with your camera</button>` : ''}
    <button class="btn" id="stampbtn">${st ? (st.on ? 'Stamped on site ✓' : 'Stamped from afar · stamp again') : 'Stamp my passport'}</button>
    <a class="btn" href="${dirUrl(s.V)}" target="_blank" rel="noopener">Directions ↗</a></div><p class="youdist" id="youdist"></p>`;
  const anchor = panel.querySelector('.stats'); anchor && anchor.insertAdjacentHTML('beforebegin', row);
  const vb = $('#vfbtn'); if (vb) vb.onclick = () => openVF(s);
  $('#stampbtn').onclick = () => stamp(s);
  updateYouDist();
  // palette mixes
  const pal = panel.querySelector('.pal');
  if (pal) { pal.insertAdjacentHTML('afterend', '<div id="palmix"></div>'); pal.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { $('#palmix').innerHTML = mixHTML(b.dataset.hex); })); }
};
/* daylight ribbon in the sun box */
const ribCache = {};
PGX.onSun = (s, y, m, d, min) => {
  const tI = $('#stime'); if (!tI) return; let rb = $('#ribbon');
  if (!rb) { tI.insertAdjacentHTML('beforebegin', '<div class="ribbon" id="ribbon" aria-hidden="true"><i class="rmark"></i></div>'); rb = $('#ribbon'); }
  const key = `${s.id}|${y}-${m}-${d}`;
  if (!ribCache[key]) { const st = []; for (let t = 240; t <= 1320; t += 10) { const e = SUN.pos(SUN.localToUtc(y, m, d, t), s.V[0], s.V[1]).el;
      const c = e < -6 ? '#26344A' : e < -0.833 ? '#6F7FA8' : e < 6 ? '#E9A55C' : e < 15 ? '#F2CF85' : '#DCE6EC'; st.push(`${c} ${((t - 240) / 1080 * 100).toFixed(2)}%`); }
    ribCache[key] = `linear-gradient(90deg, ${st.join(',')})`; }
  rb.style.background = ribCache[key]; rb.querySelector('.rmark').style.left = `${(min - 240) / 1080 * 100}%`;
};

/* ================= passport ================= */
function stamp(s) {
  const rec = on => { const pp = LS.get('passport', {}); const prev = pp[s.id]; if (prev && prev.on && !on) { PG.toast('Already stamped on site'); return; }
    pp[s.id] = { on, d: new Date().toISOString().slice(0, 10) }; LS.set('passport', pp); renderDoorStamps();
    const b = $('#stampbtn'); if (b) b.textContent = on ? 'Stamped on site ✓' : 'Stamped from afar · stamp again';
    const n = Object.keys(pp).length; PG.toast(on ? `Stamped on site · ${n} of 9` : `Stamped from afar · ${n} of 9`); };
  const check = pos => { const d = dist([pos.lat, pos.lon], s.V); if (d <= 250) rec(true); else { rec(false); setTimeout(() => PG.toast(`You're ${fmtD(d)} away. Stamp again on site for the gold stamp.`), 1500); } };
  if (you) return check(you);
  if (!navigator.geolocation) return rec(false);
  PG.toast('Checking where you are…');
  navigator.geolocation.getCurrentPosition(p => { you = { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy }; PGX.onDraw(); check(you); }, () => rec(false), { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 });
}
function stampSVG(s, st, size = 150) {
  const col = st ? (st.on ? '#8A5A12' : '#1F3A52') : '#B8B2A6', rot = st ? ((s.n * 37) % 24) - 12 : 0;
  const title = s.title.split(',')[0].toUpperCase(), sub = st ? (st.on ? 'ON SITE · ' : 'FROM AFAR · ') + st.d : 'NOT YET STAMPED';
  return `<svg viewBox="-80 -80 160 160" width="${size}" height="${size}" role="img" aria-label="${esc(s.title)}: ${st ? (st.on ? 'stamped on site' : 'stamped from afar') : 'not stamped'}" style="transform:rotate(${rot}deg)">
    <defs><path id="arc${s.n}" d="M-56,0 A56,56 0 0 1 56,0"/><path id="arcb${s.n}" d="M-60,0 A60,60 0 0 0 60,0"/></defs>
    <g fill="none" stroke="${col}" ${st ? '' : 'stroke-dasharray="4 4"'} opacity="${st ? .92 : .8}"><circle r="74" stroke-width="3"/><circle r="66" stroke-width="1.2"/><circle r="38" stroke-width="1.2"/></g>
    <text fill="${col}" font-family="Inter, sans-serif" font-weight="600" font-size="${title.length > 18 ? 9.5 : 11}" letter-spacing="1.5"><textPath href="#arc${s.n}" startOffset="50%" text-anchor="middle">${esc(title)}</textPath></text>
    <text fill="${col}" font-family="Inter, sans-serif" font-size="8.5" letter-spacing="1"><textPath href="#arcb${s.n}" startOffset="50%" text-anchor="middle">${esc(sub)}</textPath></text>
    <text y="13" fill="${col}" font-family="Cormorant, serif" font-weight="600" font-size="40" text-anchor="middle">${s.n}</text>
    ${st && st.on ? `<path d="M-30,-44 l4,-8 l4,8 l-8,-5 h8 z M22,-44 l4,-8 l4,8 l-8,-5 h8 z" fill="${col}"/>` : ''}</svg>`;
}
function renderPassport() {
  const pp = LS.get('passport', {}), S = PG.D.sites, n = S.filter(s => pp[s.id]).length, on = S.filter(s => pp[s.id] && pp[s.id].on).length;
  $('#passport').innerHTML = `<div class="pp-head"><b>${n} of 9</b> stamped${on ? ` · ${on} on site` : ''}${n === 9 ? ' · <span class="done">Passport complete. You have stood where they stood.</span>' : ''}</div>
    <div class="pp-grid">${S.map(s => `<a class="pp" href="#site-${s.n}" data-go-site="${s.id}">${stampSVG(s, pp[s.id])}<span class="pp-t">${esc(s.title)}</span><span class="tiny">${esc(s.artist)}</span></a>`).join('')}</div>
    ${n ? '<p class="small"><button class="linkbtn" id="ppreset">Clear my passport</button></p>' : ''}`;
  const r = $('#ppreset'); if (r) r.onclick = () => { if (r.dataset.sure) { LS.set('passport', {}); renderPassport(); renderDoorStamps(); } else { r.dataset.sure = 1; r.textContent = 'Tap again to clear all stamps'; } };
}
function renderDoorStamps() { const el = $('#doorstamps'); if (!el || !PG) return; const pp = LS.get('passport', {}); el.innerHTML = PG.D.sites.slice(0, 3).map(s => stampSVG(s, pp[s.id] || (s.n === 1 ? { on: true, d: 'example' } : null), 74)).join(''); }

/* ================= viewfinder ================= */
let vfStream = null;
function openVF(s) {
  const w = PG.WBY[s.main], o = $('#vf');
  o.innerHTML = `<div class="vf-stage" id="vfstage"><video id="vfvid" playsinline muted autoplay></video><img id="vfbg" alt="" hidden>
      <img id="vfghost" src="${imgSrc(w.id)}" alt="${esc(w.t)}" draggable="false"><div class="vf-msg" id="vfmsg">Starting the camera…</div></div>
    <div class="vf-bar">
      <div class="vf-t"><div class="kicker" style="color:#E3B97C">Line it up · site ${s.n}</div><b>${esc(w.t)}</b><span>Face ${s.compass} (${Math.round(s.bearing)}°) toward ${esc(s.S[2])}. Drag the painting to match the horizon and the rocks.</span></div>
      <label>Painting <input type="range" id="vfop" min="0" max="100" value="55"></label>
      <label>Size <input type="range" id="vfsz" min="30" max="160" value="92"></label>
      <div class="vf-btns"><button class="btn solid big" id="vfsnap">Capture</button><label class="btn" for="vffile">Use a photo</label><input type="file" id="vffile" accept="image/*" hidden><button class="btn" id="vfclose">Close</button></div>
    </div>
    <div class="vf-res" id="vfres" hidden></div>`;
  o.classList.add('on'); document.body.style.overflow = 'hidden';
  const vid = $('#vfvid'), bg = $('#vfbg'), gh = $('#vfghost'), stg = $('#vfstage'); let off = { x: 0, y: 0 };
  const place = () => { gh.style.opacity = $('#vfop').value / 100; gh.style.width = $('#vfsz').value + '%'; gh.style.transform = `translate(calc(-50% + ${off.x}px), calc(-50% + ${off.y}px))`; };
  $('#vfop').oninput = place; $('#vfsz').oninput = place; place();
  let dn = null; gh.onpointerdown = e => { dn = { x: e.clientX - off.x, y: e.clientY - off.y }; gh.setPointerCapture(e.pointerId); };
  gh.onpointermove = e => { if (!dn) return; off = { x: e.clientX - dn.x, y: e.clientY - dn.y }; place(); }; gh.onpointerup = gh.onpointercancel = () => dn = null;
  const msg = t => { $('#vfmsg').textContent = t; $('#vfmsg').hidden = !t; };
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 } }, audio: false })
      .then(st => { vfStream = st; vid.srcObject = st; msg(''); }).catch(() => msg('The camera is not available here. Tap “Use a photo” to line up a picture you took at the site.'));
  } else msg('The camera is not available in this browser. Tap “Use a photo” to use a picture you took at the site.');
  $('#vffile').onchange = e => { const f = e.target.files[0]; if (!f) return; bg.src = URL.createObjectURL(f); bg.hidden = false; vid.hidden = true; msg(''); stopCam(); };
  $('#vfclose').onclick = closeVF;
  $('#vfsnap').onclick = () => {
    const src = !bg.hidden ? bg : vid; const sw = src.videoWidth || src.naturalWidth, sh = src.videoHeight || src.naturalHeight;
    if (!sw) { PG.toast('No picture yet: allow the camera or use a photo'); return; }
    const res0 = $('#vfres'); res0.hidden = false; res0.innerHTML = '<div class="vf-msg" style="position:static;transform:none">Making your postcard…</div>';
    setTimeout(() => {
    const sr = stg.getBoundingClientRect(), gr = gh.getBoundingClientRect(); const sc = Math.max(sr.width / sw, sr.height / sh), ox = (sr.width - sw * sc) / 2, oy = (sr.height - sh * sc) / 2;
    const cx = (gr.left - sr.left - ox) / sc, cy = (gr.top - sr.top - oy) / sc, cw = gr.width / sc, ch = gr.height / sc; // photo crop under the painting
    const H = 900, pw = Math.round(H * gh.naturalWidth / gh.naturalHeight), pad = 36, band = 120;
    const c = document.createElement('canvas'); c.width = pw * 2 + pad * 3; c.height = H + pad * 2 + band; const x = c.getContext('2d');
    x.fillStyle = '#FBF8F2'; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(gh, pad, pad, pw, H);
    x.fillStyle = '#1E2630'; x.fillRect(pad * 2 + pw, pad, pw, H); x.drawImage(src, cx, cy, cw, ch, pad * 2 + pw, pad, pw, H);
    x.fillStyle = '#1F3A52'; x.font = '600 44px Cormorant, Georgia, serif'; x.fillText(`${w.t}`, pad, H + pad + 62);
    x.font = '24px Inter, sans-serif'; x.fillStyle = '#5F5E58';
    const today = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    x.fillText(`${w.by}, ${w.d}  ·  The same view, ${today}`, pad, H + pad + 100);
    x.textAlign = 'right'; x.fillStyle = '#9A5F22'; x.font = '600 22px Inter, sans-serif'; x.fillText('PAINTED GLOUCESTER', c.width - pad, H + pad + 62);
    // overlay version
    const o2 = document.createElement('canvas'); o2.width = Math.round(cw); o2.height = Math.round(ch); const y2 = o2.getContext('2d');
    y2.drawImage(src, cx, cy, cw, ch, 0, 0, o2.width, o2.height); y2.globalAlpha = $('#vfop').value / 100; y2.drawImage(gh, 0, 0, o2.width, o2.height);
    showResult(c, o2, w, s);
    }, 30);
  };
}
function showResult(post, over, w, s) {
  const res = $('#vfres'); res.hidden = false;
  const mk = (cv, cb) => cv.toBlob(b => cb(b, URL.createObjectURL(b)), 'image/jpeg', 0.9);
  mk(post, (pb, pu) => mk(over, (ob, ou) => {
    const fn = `painted-gloucester-site-${s.n}`;
    res.innerHTML = `<div class="kicker" style="color:#E3B97C">Then and now</div><img src="${pu}" alt="The painting beside your photo of the same view">
      <div class="btnrow"><a class="btn solid" href="${pu}" download="${fn}-postcard.jpg">Save postcard</a><a class="btn" href="${ou}" download="${fn}-overlay.jpg">Save overlay</a>
      ${navigator.canShare && navigator.canShare({ files: [new File([pb], 'p.jpg', { type: 'image/jpeg' })] }) ? '<button class="btn" id="vfshare">Share</button>' : ''}<button class="btn" id="vfagain">Retake</button></div>`;
    $('#vfagain').onclick = () => { res.hidden = true; };
    const sh = $('#vfshare'); if (sh) sh.onclick = () => navigator.share({ files: [new File([pb], fn + '.jpg', { type: 'image/jpeg' })], title: 'Painted Gloucester', text: `${w.t} by ${w.by}, and the same view today.` }).catch(() => {});
  }));
}
function stopCam() { if (vfStream) { vfStream.getTracks().forEach(t => t.stop()); vfStream = null; } }
function closeVF() { stopCam(); $('#vf').classList.remove('on'); $('#vf').innerHTML = ''; document.body.style.overflow = ''; }
addEventListener('keydown', e => { if (e.key === 'Escape' && $('#vf').classList.contains('on')) closeVF(); });

/* ================= viewer color sampling ================= */
let sampling = false;
function viewerSampling() {
  const st = $('#stage'); let down = null;
  $('.vctl').insertAdjacentHTML('beforeend', '<button id="vsample" class="wide" aria-pressed="false">Sample color</button>');
  $('#vsample').onclick = () => { sampling = !sampling; $('#vsample').setAttribute('aria-pressed', sampling); $('#vsample').classList.toggle('on', sampling); st.classList.toggle('sampling', sampling); if (sampling) PG.toast('Tap the painting to sample a color'); };
  st.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; }, true);
  st.addEventListener('pointerup', async e => {
    if (!sampling || !down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 6) return;
    const im = st.querySelector('img'); if (!im) return; const r = im.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
    const ctx = await sampler(im.src), px = (e.clientX - r.left) / r.width * im.naturalWidth, py = (e.clientY - r.top) / r.height * im.naturalHeight;
    const hex = avgAt(ctx, Math.round(px), Math.round(py), Math.max(2, Math.round(im.naturalWidth / 400)));
    let box = $('#vlab'); if (!box) { $('#vinfo .tt').insertAdjacentHTML('beforebegin', '<div id="vlab" class="vlab"></div>'); box = $('#vlab'); }
    box.innerHTML = `<h4 style="margin-top:0">Color lab</h4>${mixHTML(hex)}`;
  });
}
PGX.onViewer = () => { const b = $('#vlab'); if (b) b.remove(); };

/* ================= paint view ================= */
function buildPaint() {
  const g = G();
  $('#palettes').innerHTML = g.palettes.map(p => `<article class="palc"><div class="kicker">${esc(p.who)} · ${esc(p.medium)}</div><h3 class="disp">${esc(p.name)}</h3><p class="small">${esc(p.mood)}</p>
    <ul class="pig">${p.pig.map(([n, c]) => `<li><i style="background:${c}"></i>${esc(n)}</li>`).join('')}</ul>
    <ul class="tips">${p.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>
    <p class="tiny">Try it at ${p.sites.map(id => { const s = PG.D.sites.find(x => x.id === id); return s ? `<a href="#site-${s.n}" data-go-site="${id}">${esc(s.title.split(',')[0])}</a>` : ''; }).join(' · ')}</p></article>`).join('');
  $('#tod').innerHTML = g.tod.map(t => `<div class="todc"><span class="todbar" style="background:${t.c}"></span><b>${esc(t.name)}</b><span class="tiny">${esc(t.when)}</span><p>${esc(t.text)}</p></div>`).join('');
  $('#cond').innerHTML = g.cond.map(c => `<div><b>${esc(c.name)}</b><p>${esc(c.text)}${c.link ? ` <a href="${c.link[1]}" target="_blank" rel="noopener">${esc(c.link[0])} ↗</a>` : ''}</p></div>`).join('');
  const done = LS.get('kit', {});
  $('#kit').innerHTML = g.kit.map((grp, gi) => `<li class="kg">${esc(grp.g)}</li>` + grp.items.map((it, ii) => { const k = grp.g + ':' + it;
    return `<li><label><input type="checkbox" id="kit-${gi}-${ii}" data-k="${esc(k)}" ${done[k] ? 'checked' : ''}> ${esc(it)}</label></li>`; }).join('')).join('');
  $('#kit').addEventListener('change', e => { const k = e.target.dataset.k; if (!k) return; const d = LS.get('kit', {}); d[k] = e.target.checked; LS.set('kit', d); });
  $('#kitreset').onclick = () => { LS.set('kit', {}); $$('#kit input').forEach(i => i.checked = false); };
  $('#manners').innerHTML = g.manners.map(m => `<li>${esc(m)}</li>`).join('');
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const deal = () => { $('#prompt').innerHTML = `Paint <b>${esc(pick(g.prompts.s))}</b> ${esc(pick(g.prompts.t))}, using ${esc(pick(g.prompts.a))}.`; };
  deal(); $('#promptbtn').onclick = deal;
  $('#labw').innerHTML = PG.D.works.filter(w => w.img).map(w => `<option value="${w.id}">${esc(w.by)}: ${esc(w.t)}</option>`).join('');
  $('#labw').value = 'lane-braces-rock'; $('#labw').onchange = () => { labLoaded = null; labInit(); };
}
let labLoaded = null;
async function labInit() {
  const id = $('#labw').value; if (labLoaded === id) return; labLoaded = id;
  const cv = $('#labcv'), ctx = await sampler(imgSrc(id)); const im = ctx.canvas, maxW = Math.min(cv.parentElement.clientWidth || 700, 900);
  const sc = maxW / im.width; cv.width = Math.round(im.width * sc); cv.height = Math.round(im.height * sc); cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
  const s = PG.SITE_OF[id], w = PG.WBY[id];
  const pickAt = (fx, fy) => { const hex = avgAt(ctx, Math.round(fx * im.width), Math.round(fy * im.height), Math.max(2, Math.round(im.width / 300)));
    const lp = $('#labloupe'); lp.hidden = false; lp.style.left = fx * 100 + '%'; lp.style.top = fy * 100 + '%'; lp.style.background = hex;
    $('#labout').innerHTML = `<div class="kicker">${esc(w.by)}, ${esc(w.d)}</div><h3 class="disp" style="font-size:26px">${esc(w.t)}</h3>${mixHTML(hex)}
      ${s ? `<p class="small">Painted from <a href="#site-${s.n}" data-go-site="${s.id}">site ${s.n}, ${esc(s.title)}</a>.</p>` : ''}`; };
  cv.onclick = e => { const r = cv.getBoundingClientRect(); pickAt((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height); };
  pickAt(0.5, 0.3);
}

/* ================= shops map (Leaflet over a vector coastline) ================= */
let smap = null, smMarkers = {}, shopFilter = 'all', smTiles = null;
const matchT = (p, t) => t === 'all' || p.type === t || (t === 'museum' && p.type === 'gallery');
const mkType = p => p.type === 'gallery' ? 'museum' : p.type;
function initShopMap() {
  if (smap || !window.L) { if (smap) smap.invalidateSize(); return; }
  smap = L.map('shopmap', { scrollWheelZoom: false, zoomSnap: 0.25, minZoom: 9, maxZoom: 18 });
  smTiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, className: 'smtile',
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · Coastline: MassGIS' });
  // vector coastline: shown until street tiles load, and whenever they are switched off
  const C = window.COAST || { coast: [], towns: [] }, vec = L.layerGroup();
  C.towns.forEach(t => L.polyline(t.c, { color: '#8A9BA8', weight: t.k === 17 ? .8 : 1, dashArray: t.k === 17 ? '3 4' : null, opacity: .7, interactive: false }).addTo(vec));
  C.coast.forEach(c => L.polyline(c, { color: '#5E7A8C', weight: 1.1, opacity: .8, interactive: false }).addTo(vec));
  vec.addTo(smap);
  let errs = 0, ok = false;
  smTiles.on('tileload', () => { if (!ok) { ok = true; smap.removeLayer(vec); } }).on('tileerror', () => { if (++errs === 4 && !ok) { smap.removeLayer(smTiles); $('#smtiles').checked = false; } });
  smTiles.addTo(smap);
  // painting sites, quietly
  PG.D.sites.forEach(s => L.marker([s.V[0], s.V[1]], { icon: L.divIcon({ className: '', html: '<span class="smsite"></span>', iconSize: [12, 12], iconAnchor: [6, 6] }), title: s.title, keyboard: false })
    .bindTooltip(`Painting site ${s.n}: ${esc(s.title)}`).on('click', () => goSite(s.id)).addTo(smap));
  PL().places.forEach(p => {
    const m = L.marker(p.ll, { icon: L.divIcon({ className: '', html: `<span class="smk ${mkType(p)}">${p.num}</span>`, iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -12] }), title: p.name, riseOnHover: true });
    m.bindPopup(`<div class="smpop"><b>${p.num}. ${esc(p.name)}</b><span>${esc(p.addr)}</span>${p.phone ? `<span>${esc(p.phone)}</span>` : ''}
      <span class="lk"><a href="${dirUrl(p.ll)}" target="_blank" rel="noopener">Directions ↗</a> · <a href="#shops" data-card="${p.id}">Details ↓</a></span></div>`);
    smMarkers[p.id] = m;
  });
  smap.on('popupopen', e => { const a = e.popup.getElement().querySelector('[data-card]'); if (a) a.onclick = ev => { ev.preventDefault(); const el = $('#place-' + a.dataset.card); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 1600); } }; });
  $('#smtiles').onchange = e => { if (e.target.checked) { smTiles.addTo(smap); if (ok) smap.removeLayer(vec); } else { smap.removeLayer(smTiles); vec.addTo(smap); } };
  document.querySelectorAll('.shopmap-bar [data-zoom]').forEach(b => b.onclick = () => { const z = b.dataset.zoom; if (z === 'cape') fitShops(false); else if (z === 'all') fitShops(true); else { const [la, lo, zz] = z.split(',').map(Number); smap.flyTo([la, lo], zz, { duration: .7 }); } });
  syncMarkers(); fitShops(false, true);
}
function syncMarkers() { if (!smap) return; PL().places.forEach(p => { const m = smMarkers[p.id]; if (matchT(p, shopFilter)) m.addTo(smap); else smap.removeLayer(m); }); }
function fitShops(all, instant) {
  const cape = ll => ll[1] > -70.8; // Cape Ann only, unless "whole region"
  const pts = PL().places.filter(p => matchT(p, shopFilter) && (all || cape(p.ll))).map(p => p.ll).concat(all ? [] : PG.D.sites.map(s => [s.V[0], s.V[1]]));
  const away = PL().places.filter(p => matchT(p, shopFilter) && !cape(p.ll)), note = $('#smaway');
  if (note) note.innerHTML = !all && away.length ? `${away.length} more off Cape Ann, in ${[...new Set(away.map(p => p.town))].join(' and ')}. <button class="linkbtn" data-zoom2="all">Show the whole region</button>` : '';
  const nb = note && note.querySelector('[data-zoom2]'); if (nb) nb.onclick = () => fitShops(true);
  if (pts.length) smap.fitBounds(L.latLngBounds(pts).pad(0.08), { animate: !instant });
}
function focusPlace(id) {
  const p = PL().places.find(x => x.id === id); if (!p) return;
  if (!matchT(p, shopFilter)) $('#ptabs button[data-t="all"]').click();
  initShopMap(); $('#shopmap').scrollIntoView({ behavior: 'smooth', block: 'center' });
  setTimeout(() => { smap.invalidateSize(); smap.flyTo(p.ll, 16, { duration: .8 }); setTimeout(() => smMarkers[p.id].openPopup(), 850); }, 250);
}
function chartPlace(id) { const p = PL().places.find(x => x.id === id); if (!p) return; PG.show('map'); PG.setHash('map'); requestAnimationFrame(() => { PG.MAP.resize(); showPlace(p, true); }); }

/* ================= shops view ================= */
function buildShops() {
  const P = PL(); $$('.checked-date').forEach(n => n.textContent = P.checked);
  P.places.forEach((p, i) => p.num = i + 1);
  const render = t => { const T = { supply: 'Art supplies', school: 'Workshops & associations', museum: 'Museum', gallery: 'Gallery' };
    const list = P.places.filter(p => matchT(p, t));
    $('#pcards').innerHTML = list.map(p => `<article class="place ${p.type}" id="place-${p.id}">
      <div class="phead"><button class="pnum ${mkType(p)}" data-focus="${p.id}" aria-label="Show ${esc(p.name)} on the map">${p.num}</button><div><div class="kicker pk">${T[p.type]}${p.far ? ' · further afield' : ''} · ${esc(p.town)}</div><h3 class="disp">${esc(p.name)}</h3></div></div>${placeBody(p)}
      <p class="tiny"><a href="#shops" data-focus="${p.id}">Show on the map ↑</a>${inMap(p.ll) ? ` · <a href="#map" data-chart="${p.id}">On the painters' chart</a>` : ''}</p></article>`).join('');
    $$('#pcards [data-focus]').forEach(a => a.onclick = e => { e.preventDefault(); focusPlace(a.dataset.focus); });
    $$('#pcards [data-chart]').forEach(a => a.onclick = e => { e.preventDefault(); chartPlace(a.dataset.chart); });
    shopFilter = t; syncMarkers(); };
  render('all');
  $$('#ptabs button').forEach(b => b.onclick = () => { $$('#ptabs button').forEach(x => x.classList.toggle('on', x === b)); render(b.dataset.t); });
  $('#events').innerHTML = P.events.map(e => `<div class="event"><b>${esc(e.name)}</b><span class="ew">${esc(e.when)}</span><span class="tiny">${esc(e.where)}</span><p>${esc(e.what)}</p>
    <span class="tiny">${e.src.map(([n, u]) => `<a translate="no" href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join(' · ')} · <span class="chk">Checked ${esc(e.checked || P.checked)}</span></span></div>`).join('');
  $('#suggest').href = `https://github.com/${CFG.REPO}/issues/new?template=listing.yml`;
}

/* ================= plan view ================= */
function buildPlan() {
  $('#days').innerHTML = G().days.map(d => `<article class="day"><img src="${thumb(d.img)}" alt="" loading="lazy"><div><h3 class="disp">${esc(d.name)}</h3><p class="small">${esc(d.sum)}</p>
    <ol class="steps">${d.steps.map(([tm, n, t, ref]) => { const [k, v] = (ref || '').split(':');
      const link = k === 'site' ? `<a href="#map" data-go-site="${v}">Open the site →</a>` : k === 'place' ? `<a href="#shops" data-go-place="${v}">On the map →</a>` : '';
      return `<li><span class="tm">${esc(tm)}</span><div><b>${esc(n)}</b><p>${esc(t)}</p>${link}</div></li>`; }).join('')}</ol></div></article>`).join('');
  renderPassport();
}
})();
