// NOAA solar position (General Solar Position Calculations). Returns azimuth (deg from true north) and elevation (deg, refraction-corrected).
const SUN = (() => {
  const rad = Math.PI / 180, deg = 180 / Math.PI;
  function pos(utcMs, lat, lon) {
    const jd = utcMs / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
    const L0 = (280.46646 + T * (36000.76983 + T * 0.0003032)) % 360;
    const M = 357.52911 + T * (35999.05029 - 0.0001537 * T);
    const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T);
    const C = Math.sin(M * rad) * (1.914602 - T * (0.004817 + 0.000014 * T)) + Math.sin(2 * M * rad) * (0.019993 - 0.000101 * T) + Math.sin(3 * M * rad) * 0.000289;
    const tl = L0 + C, om = 125.04 - 1934.136 * T, lam = tl - 0.00569 - 0.00478 * Math.sin(om * rad);
    const e0 = 23 + (26 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60) / 60, ep = e0 + 0.00256 * Math.cos(om * rad);
    const dec = Math.asin(Math.sin(ep * rad) * Math.sin(lam * rad));
    const y = Math.tan(ep * rad / 2) ** 2;
    const eqt = 4 * deg * (y * Math.sin(2 * L0 * rad) - 2 * e * Math.sin(M * rad) + 4 * e * y * Math.sin(M * rad) * Math.cos(2 * L0 * rad) - 0.5 * y * y * Math.sin(4 * L0 * rad) - 1.25 * e * e * Math.sin(2 * M * rad));
    const d = new Date(utcMs), mins = d.getUTCHours() * 60 + d.getUTCMinutes() + d.getUTCSeconds() / 60;
    let tst = (mins + eqt + 4 * lon) % 1440; if (tst < 0) tst += 1440;
    let ha = tst / 4 - 180; if (ha < -180) ha += 360;
    const la = lat * rad, h = ha * rad;
    const cz = Math.min(1, Math.max(-1, Math.sin(la) * Math.sin(dec) + Math.cos(la) * Math.cos(dec) * Math.cos(h)));
    const zen = Math.acos(cz); let el = 90 - zen * deg;
    let az = Math.atan2(Math.sin(h), Math.cos(h) * Math.sin(la) - Math.tan(dec) * Math.cos(la)) * deg + 180;
    // refraction
    let r = 0; const te = Math.tan(el * rad);
    if (el > 85) r = 0; else if (el > 5) r = 58.1 / te - 0.07 / te ** 3 + 0.000086 / te ** 5;
    else if (el > -0.575) r = 1735 + el * (-518.2 + el * (103.4 + el * (-12.79 + el * 0.711))); else r = -20.774 / te;
    el += r / 3600;
    return { az: (az + 360) % 360, el };
  }
  const TZ = 'America/New_York';
  const fmtParts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  function offsetMin(utcMs) { const p = Object.fromEntries(fmtParts.formatToParts(new Date(utcMs)).map(x => [x.type, x.value])); const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second); return Math.round((asUTC - utcMs) / 60000); }
  function localToUtc(y, mo, d, minutes) { let g = Date.UTC(y, mo - 1, d, 0, minutes); let o = offsetMin(g); let u = g - o * 60000; o = offsetMin(u); return g - o * 60000; }
  function riseSet(y, mo, d, lat, lon) {
    let rise = null, set = null, prev = null;
    for (let m = 0; m <= 1440; m += 2) { const e = pos(localToUtc(y, mo, d, m), lat, lon).el + 0.833 - 0.833; const v = e; // el already refracted; sunrise when upper limb at horizon ≈ center at -0.27 refracted
      const f = v + 0.27; if (prev !== null) { if (prev < 0 && f >= 0 && rise === null) rise = m - 2 + 2 * (-prev) / (f - prev); if (prev >= 0 && f < 0) set = m - 2 + 2 * prev / (prev - f); } prev = f; }
    return { rise, set };
  }
  function tzLabel(y, mo, d) { return offsetMin(localToUtc(y, mo, d, 720)) === -240 ? 'EDT' : 'EST'; }
  return { pos, localToUtc, riseSet, tzLabel };
})();


(() => {
'use strict';
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const D = window.DATA, $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const WBY = Object.fromEntries(D.works.map(w => [w.id, w]));
/* image sizes: thumbnails for lists, 1200px 'medium' for the page, the full JPEG only when zooming in */
const IMG = { t: id => `thumbs/${id}.webp`, m: id => `img/m/${id}.webp`, full: id => `img/${id}.jpg` };
const SITE_NAME = 'Painted Gloucester', BASE_TITLE = document.title;
const VIEW_TITLE = { home: '', map: 'Map & sites', works: 'The works', paint: 'Paint it', shops: 'Shops & studios', plan: 'Plan & passport', about: 'About' };
let curView = 'home';
function setTitle(t) { document.title = t ? `${t} — ${SITE_NAME}` : BASE_TITLE; }
function viewTitle() { setTitle(curView === 'map' && cur ? `Site ${cur.n}: ${cur.title}` : VIEW_TITLE[curView]); }
const SITE_OF = {}; D.sites.forEach(s => { if (s.main) SITE_OF[s.main] = s; s.comp.forEach(c => { SITE_OF[c] = SITE_OF[c] || s; }); });
const toast = msg => { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('on'), 1400); };
const COMPASS = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
const compass = b => COMPASS[Math.floor(((b + 11.25) % 360) / 22.5)];
function relation(az, view) {
  const r = (az - view + 360) % 360;
  if (r <= 30 || r >= 330) return 'ahead of you: the scene is backlit';
  if (r >= 150 && r <= 210) return 'behind you: the scene is lit full-face';
  if (r < 150) return 'to your right' + (r > 90 ? ' and behind' : ' and ahead');
  return 'to your left' + (r < 270 ? ' and behind' : ' and ahead');
}
const fmtT = m => { m = Math.round(m); const h = Math.floor(m / 60) % 24, mm = m % 60, ap = h < 12 ? 'a.m.' : 'p.m.', h12 = ((h + 11) % 12) + 1; return `${h12}:${String(mm).padStart(2, '0')} ${ap}`; };
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/* ---------------- tabs / routing ---------------- */
function show(v) {
  window.PGX?.onShow?.(v);
  curView = v; document.body.dataset.view = v; viewTitle();
  $$('.view').forEach(x => x.classList.toggle('on', x.id === v + 'view'));
  $$('nav.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.v === v));
  if (v === 'map') requestAnimationFrame(() => { MAP.resize(); });
  if (v === 'works') renderWorks();
  if (v !== 'map' && v !== 'works') scrollTo(0, 0);
}
$$('nav.tabs button').forEach(b => b.addEventListener('click', () => { show(b.dataset.v); setHash(b.dataset.v === 'map' ? (cur ? 'site-' + cur.n : 'map') : b.dataset.v); }));
function setHash(h) { history.replaceState(null, '', '#' + (h || 'map')); }

/* ---------------- notes ---------------- */
document.addEventListener('click', e => {
  const s = e.target.closest('sup.nr'); if (!s) return;
  e.stopPropagation(); const n = +s.dataset.n, p = $('#notepop');
  p.innerHTML = `<button class="x" aria-label="Close note">×</button><b>Note ${n}</b>${D.notes[n] || ''}<br><a class="more" href="brief.html#note-${n}" >All notes in the brief ↗</a>`;
  p.classList.add('on');
});
document.addEventListener('click', e => { if (e.target.closest('#notepop .x') || (!e.target.closest('#notepop') && !e.target.closest('sup.nr'))) $('#notepop').classList.remove('on'); });
document.querySelectorAll('a[href^="http"]').forEach(a => a.target = '_blank');
document.addEventListener('click', e => { const a = e.target.closest('a[href^="http"]'); if (a) { a.target = '_blank'; a.rel = 'noopener'; } }, true);

/* ---------------- map ---------------- */
const M = D.map, NS = 'http://www.w3.org/2000/svg';
const kx = Math.cos(M.c[0] * Math.PI / 180), mpdLat = 111320, mpdLon = mpdLat * kx, sc = M.W / M.span;
const P = (lat, lon) => [(lon - M.c[1]) * mpdLon * sc + M.W / 2, M.H / 2 - (lat - M.c[0]) * mpdLat * sc];
const svg = $('#map'), gScaled = [];
const el = (tag, attrs, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
// labels
const gl = el('g', { class: 'lbl' }, svg);
D.labels_map.forEach(([la, lo, t, c]) => { const [x, y] = P(la, lo); const g = el('g', {}, gl); g.dataset.x = x; g.dataset.y = y; el('text', { class: c }, g).textContent = t; gScaled.push(g); });
const gSel = el('g', {}, svg), gSites = el('g', {}, svg);
const SITEG = {};
D.sites.forEach(s => {
  const [x, y] = P(s.V[0], s.V[1]); const g = el('g', { class: 'site', tabindex: 0, role: 'button', 'aria-label': `Site ${s.n}: ${s.title}` }, gSites);
  g.dataset.x = x; g.dataset.y = y; el('circle', { class: 'halo', r: 17 }, g); el('circle', { class: 'o', r: 12 }, g); el('text', {}, g).textContent = s.n;
  g.addEventListener('click', () => { if (!MAP.moved) selectSite(s, true); });
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectSite(s, true); } });
  gScaled.push(g); SITEG[s.id] = g;
});
const MAP = (() => {
  const wrap = $('.mapwrap'); let vb = { x: 0, y: 0, w: M.W, h: M.H }, cw = 1, ch = 1, k = 1, anim = null;
  const api = { moved: false };
  function apply() {
    svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`); k = vb.w / cw;
    gScaled.forEach(g => g.setAttribute('transform', `translate(${g.dataset.x},${g.dataset.y}) scale(${k})`));
    // scale bar
    const mPerPx = k / sc; const target = 110 * mPerPx; const steps = [50, 100, 200, 250, 500, 1000, 2000, 2500, 5000];
    let m = steps[0]; for (const s of steps) if (s <= target) m = s; const px = m / mPerPx;
    $('.scale').innerHTML = `${m < 1000 ? m + ' m' : m / 1000 + ' km'} <span style="color:#7A7870">(${m < 1609 ? Math.round(m * 3.28084).toLocaleString() + ' ft' : (m / 1609.344).toFixed(1) + ' mi'})</span><div style="width:${px}px"></div>`;
    drawSel();
  }
  api.k = () => k; api.toScreen = (x, y) => [(x - vb.x) / k, (y - vb.y) / k]; api.cw = () => cw;
  function fitBox(x0, y0, x1, y1, pad = 0.12) {
    let w = x1 - x0, h = y1 - y0; w *= 1 + pad * 2; h *= 1 + pad * 2; const a = cw / ch;
    if (w / h < a) w = h * a; else h = w / a; return { x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h };
  }
  function clamp(v) { const minW = 260, maxW = M.W * 1.25; let w = Math.min(maxW, Math.max(minW, v.w)), h = w * ch / cw; const cx = v.x + v.w / 2, cy = v.y + v.h / 2; let x = cx - w / 2, y = cy - h / 2;
    x = Math.min(M.W - w * 0.3, Math.max(-w * 0.7, x)); y = Math.min(M.H - h * 0.3, Math.max(-h * 0.7, y)); return { x, y, w, h }; }
  function go(t, ms = 550) {
    t = clamp(t); cancelAnimationFrame(anim); const f = { ...vb }, t0 = performance.now();
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) ms = 0;
    const step = now => { const p = ms ? Math.min(1, (now - t0) / ms) : 1, e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      // zoom in log space for smoothness
      const w = Math.exp(Math.log(f.w) + (Math.log(t.w) - Math.log(f.w)) * e); const cx = f.x + f.w / 2 + ((t.x + t.w / 2) - (f.x + f.w / 2)) * e, cy = f.y + f.h / 2 + ((t.y + t.h / 2) - (f.y + f.h / 2)) * e;
      vb = { x: cx - w / 2, y: cy - w * ch / cw / 2, w, h: w * ch / cw }; apply(); if (p < 1) anim = requestAnimationFrame(step); };
    anim = requestAnimationFrame(step);
  }
  api.overview = (ms) => { const pts = D.sites.map(s => P(s.V[0], s.V[1])); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]); go(fitBox(Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys), 0.16), ms); };
  api.site = s => {
    const a = P(s.V[0], s.V[1]), b = P(s.S[0], s.S[1]);
    const mx = cw < 600 ? 120 : 165, my = cw < 600 ? 70 : 115;
    let x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1]);
    const minSpan = 260; if (x1 - x0 < minSpan) { const c = (x0 + x1) / 2; x0 = c - minSpan / 2; x1 = c + minSpan / 2; } if (y1 - y0 < minSpan * .6) { const c = (y0 + y1) / 2; y0 = c - minSpan * .3; y1 = c + minSpan * .3; }
    // solve for scale so that pixel margins fit: w = bw + 2*mx*k, k = w/cw
    const bw = x1 - x0, bh = y1 - y0; let w = Math.max(bw / Math.max(0.15, 1 - 2 * mx / cw), (bh / Math.max(0.15, 1 - 2 * my / ch)) * cw / ch);
    const h = w * ch / cw; go({ x: (x0 + x1) / 2 - w / 2, y: (y0 + y1) / 2 - h / 2, w, h });
  };
  api.resize = () => { const r = wrap.getBoundingClientRect(); if (!r.width) return; const oldcx = vb.x + vb.w / 2, oldcy = vb.y + vb.h / 2; cw = r.width; ch = r.height; vb.h = vb.w * ch / cw; vb.x = oldcx - vb.w / 2; vb.y = oldcy - vb.h / 2; apply(); };
  function zoomAt(f, px, py) { const r = wrap.getBoundingClientRect(); const mx = vb.x + (px - r.left) * k, my = vb.y + (py - r.top) * k; let w = vb.w * f; w = Math.min(M.W * 1.25, Math.max(260, w)); f = w / vb.w; vb = clamp({ x: mx - (mx - vb.x) * f, y: my - (my - vb.y) * f, w, h: w * ch / cw }); apply(); }
  api.zoomBy = f => { const r = wrap.getBoundingClientRect(); const t = { ...vb }; const cx = t.x + t.w / 2, cy = t.y + t.h / 2; t.w *= f; t.h *= f; t.x = cx - t.w / 2; t.y = cy - t.h / 2; go(t, 250); };
  wrap.addEventListener('wheel', e => { e.preventDefault(); cancelAnimationFrame(anim); zoomAt(Math.exp(e.deltaY * (e.ctrlKey ? 0.01 : 0.0016)), e.clientX, e.clientY); }, { passive: false });
  const ptrs = new Map(); let start = null;
  wrap.addEventListener('pointerdown', e => { if (e.target.closest('.mapctl')) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); wrap.setPointerCapture?.(e.pointerId); cancelAnimationFrame(anim); api.moved = false; start = { vb: { ...vb }, pts: new Map(ptrs) }; svg.classList.add('drag'); });
  wrap.addEventListener('pointermove', e => {
    if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const now = [...ptrs.values()], was = [...start.pts.values()];
    if (now.length === 1 && was.length === 1) { const dx = now[0].x - was[0].x, dy = now[0].y - was[0].y; if (Math.hypot(dx, dy) > 4) api.moved = true; vb = clamp({ ...start.vb, x: start.vb.x - dx * k, y: start.vb.y - dy * k }); apply(); }
    else if (now.length >= 2 && was.length >= 2) { api.moved = true; const d0 = Math.hypot(was[0].x - was[1].x, was[0].y - was[1].y), d1 = Math.hypot(now[0].x - now[1].x, now[0].y - now[1].y);
      const r = wrap.getBoundingClientRect(), m0x = (was[0].x + was[1].x) / 2 - r.left, m0y = (was[0].y + was[1].y) / 2 - r.top, m1x = (now[0].x + now[1].x) / 2 - r.left, m1y = (now[0].y + now[1].y) / 2 - r.top;
      const k0 = start.vb.w / cw, ax = start.vb.x + m0x * k0, ay = start.vb.y + m0y * k0; let w = start.vb.w * d0 / d1; w = Math.min(M.W * 1.25, Math.max(260, w)); const k1 = w / cw;
      vb = clamp({ x: ax - m1x * k1, y: ay - m1y * k1, w, h: w * ch / cw }); apply(); }
  });
  const end = e => { ptrs.delete(e.pointerId); start = { vb: { ...vb }, pts: new Map(ptrs) }; if (!ptrs.size) { svg.classList.remove('drag'); setTimeout(() => api.moved = false, 0); } };
  wrap.addEventListener('pointerup', end); wrap.addEventListener('pointercancel', end);
  addEventListener('resize', () => api.resize());
  $('#zin').onclick = () => api.zoomBy(0.6); $('#zout').onclick = () => api.zoomBy(1.6); $('#zall').onclick = () => { selectSite(null); };
  return api;
})();

/* selected-site overlay */
const OFF = { r: [14, 4, 'start'], l: [-14, 4, 'end'], t: [0, -15, 'middle'], b: [0, 25, 'middle'] };
function placeLabel(tx, cands, gap = 0, avoid = []) {
  const wr = $('.mapwrap').getBoundingClientRect(); const av = avoid.filter(Boolean).map(e => e.getBoundingClientRect());
  const hit = r => av.some(a => r.left < a.right && a.left < r.right && r.top < a.bottom && a.top < r.bottom);
  for (const c of cands) { const o = OFF[c]; tx.setAttribute('x', o[0] * (1 + gap)); tx.setAttribute('y', o[1] + (c === 't' ? -gap * 6 : c === 'b' ? gap * 6 : 0)); tx.style.textAnchor = o[2];
    const r = tx.getBoundingClientRect(); if (r.left >= wr.left + 4 && r.right <= wr.right - 62 && r.top >= wr.top + 4 && r.bottom <= wr.bottom - 44 && !hit(r)) return c; }
  const c = cands[0], o = OFF[c]; tx.setAttribute('x', o[0] * (1 + gap)); tx.setAttribute('y', o[1]); tx.style.textAnchor = o[2]; return c;
}
let cur = null, sunState = null;
function drawSel() {
  window.PGX?.onDraw?.();
  let sunCircle = null; gSel.innerHTML = ''; gl.style.display = cur ? 'none' : ''; if (!cur) return; const k = MAP.k(), s = cur;
  const [vx, vy] = P(s.V[0], s.V[1]), [sx, sy] = P(s.S[0], s.S[1]);
  el('line', { class: 'vline', x1: vx, y1: vy, x2: sx, y2: sy }, gSel);
  const sg = el('g', { class: 'subj', transform: `translate(${sx},${sy}) scale(${k})` }, gSel); el('rect', { x: -7, y: -7, width: 14, height: 14, transform: 'rotate(45)' }, sg);
  const dx = sx - vx, dy = sy - vy;
  const st = el('text', { class: 'tag' }, sg); st.textContent = s.S[2];
  const others = [...gSites.querySelectorAll('.site')].filter(g => g !== SITEG[s.id]).map(g => g.querySelector('circle.o'));
  const away = (dx >= 0 ? ['r', 'l'] : ['l', 'r']); placeLabel(st, Math.abs(dy) > Math.abs(dx) ? (dy > 0 ? ['b', ...away, 't'] : ['t', ...away, 'b']) : [away[0], 't', 'b', away[1]], 0, others);
  if (sunState) {
    const a = sunState.az * Math.PI / 180, L = (innerWidth < 600 ? 62 : 95) * k, ex = vx + L * Math.sin(a), ey = vy - L * Math.cos(a), down = sunState.el < -0.833;
    el('line', { class: 'sunline' + (down ? ' down' : ''), x1: ex, y1: ey, x2: vx + 16 * k * Math.sin(a), y2: vy - 16 * k * Math.cos(a) }, gSel);
    const ag = el('g', { transform: `translate(${vx + 16 * k * Math.sin(a)},${vy - 16 * k * Math.cos(a)}) rotate(${sunState.az + 180}) scale(${k})` }, gSel);
    el('path', { class: 'arr' + (down ? ' down' : ''), d: 'M0,0 L-6,-11 L6,-11 Z' }, ag);
    const sg2 = el('g', { transform: `translate(${ex},${ey}) scale(${k})` }, gSel); el('circle', { class: 'sunc' + (down ? ' down' : ''), r: 11 }, sg2);
    const tx = Math.sin(a), ty = -Math.cos(a); const t = el('text', { class: 'tag sunt' }, sg2); t.textContent = down ? 'sun (set)' : 'sun';
    const pri = Math.abs(tx) > 0.5 ? (tx > 0 ? 'r' : 'l') : (ty > 0 ? 'b' : 't'); placeLabel(t, [pri, 't', 'b', 'r', 'l'], 0.3, [st, ...others]); sunCircle = sg2.querySelector('circle');
  }
  // V label on side away from both line and sun
  const g = SITEG[s.id]; const vl = g.querySelector('text.vt') || el('text', { class: 'tag vt' }, g);
  const dirs = { r: [1, 0], l: [-1, 0], t: [0, -1], b: [0, 1] }, n = Math.hypot(dx, dy) || 1, dl = [dx / n, dy / n];
  const sd = sunState ? [Math.sin(sunState.az * Math.PI / 180), -Math.cos(sunState.az * Math.PI / 180)] : [0, 0];
  const order = Object.keys(dirs).map(kk => { const d = dirs[kk]; return [kk, Math.max(d[0] * sd[0] + d[1] * sd[1], d[0] * dl[0] + d[1] * dl[1]) + (kk === 't' || kk === 'b' ? 0.05 : 0)]; }).sort((a, b) => a[1] - b[1]).map(x => x[0]);
  vl.textContent = s.V[2]; placeLabel(vl, order, 0.45, [sunCircle, gSel.querySelector('.sunt'), st, ...others]);
  gSites.appendChild(g); // keep selected on top
}

/* ---------------- site panel ---------------- */
const panel = $('.panel');
function introPanel() {
  panel.innerHTML = `<div class="kicker">Painting where they painted</div><h1 class="disp">Stand where they stood</h1>
  <p class="lead">Nine places on Cape Ann where a painting can be tied to a spot on the ground. Pick a number on the map, or a site below, to see the painting, where the painter stood, and where the sun is at any hour you choose.</p>
  <p class="small">Each site is tagged with how firm its standing point is: documented, area documented, secondary source, or our own suggested viewpoint. Sun positions are computed for Gloucester in local time.</p>
  <div class="inlegend"><span><i style="width:11px;height:11px;border-radius:50%;background:var(--navy)"></i>Where the painter stood</span> &nbsp; <span><i style="width:9px;height:9px;background:var(--ochre);transform:rotate(45deg)"></i>What they painted</span> &nbsp; <span><i style="width:11px;height:11px;border-radius:50%;background:var(--sun)"></i>The sun</span> &nbsp; <span><i style="width:16px;border-top:2px dashed #B5762A;height:0"></i>Historic shoreline</span><br>Drag to move the map; pinch to zoom.</div>
  <ul class="sitelist">${D.sites.map(s => `<li><button data-s="${s.id}"><span class="num">${s.n}</span><span><span class="t">${esc(s.title)}</span><span class="a">${esc(s.artist)} · <span class="chip ${s.chip}" style="padding:2px 6px">${esc(s.chipl)}</span></span></span></button></li>`).join('')}</ul>
  <h4>Before you go</h4><p class="small">Check the tide table (NOAA station 8441841; mean range about 8.8 ft), reserve non-resident beach parking in summer, and paint from public ways: several historic vantage points, Banner Hill among them, are now private. The full brief has sources for all of this.</p>
  <p class="small"><a href="sites/">The nine sites as a plain list, with directions</a> · <a href="brief.html#vantage">The vantage section of the brief ↗</a></p>`;
  panel.querySelectorAll('[data-s]').forEach(b => b.onclick = () => selectSite(D.sites.find(s => s.id === b.dataset.s), true));
  window.PGX?.onIntro?.();
  panel.scrollTop = 0;
}
function selectSite(s, zoom) {
  if (cur) { const old = SITEG[cur.id]; old.classList.remove('sel'); old.querySelector('text.vt')?.remove(); }
  cur = s;
  if (!s) { sunState = null; drawSel(); introPanel(); MAP.overview(); setHash(''); viewTitle(); return; }
  SITEG[s.id].classList.add('sel'); setHash('site-' + s.n); viewTitle();
  const w = s.main ? WBY[s.main] : WBY['twachtman-harbor-view-hotel'];
  const img = s.main ? `<button class="pimg" data-w="${w.id}" aria-label="Open the painting full screen"><img src="${IMG.m(w.id)}" alt="${esc(w.by)}, ${esc(w.t)}, ${esc(w.d)}" decoding="async"><span class="zoomhint">⤢ Zoom</span></button>`
    : `<div class="pimg none"><div class="sans" style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#D9B07A">Image at the museum</div><div class="big">${esc(w.t)}, ${esc(w.d)}</div><a href="${w.url}" target="_blank" rel="noopener">${esc(w.mus.split(' (')[0])} ↗</a></div>`;
  const comps = s.comp.length ? `<div class="comps">${s.comp.map(id => { const c = WBY[id]; return `<button data-w="${id}"><img src="${IMG.t(id)}" alt="" loading="lazy" decoding="async"><span>${esc(c.by)}, <i>${esc(c.t)}</i>, ${esc(c.d)}</span></button>`; }).join('')}</div>` : '';
  const i = D.sites.indexOf(s), prev = D.sites[(i + 8) % 9], next = D.sites[(i + 1) % 9];
  panel.innerHTML = `<div class="sitenav"><button class="back">← All nine sites</button><span class="pn"><button data-go="${prev.id}" aria-label="Previous site">‹ ${prev.n}</button><button data-go="${next.id}" aria-label="Next site">${next.n} ›</button></span></div>
  <div class="kicker">Site ${s.n} · ${esc(s.artist)}</div><h2 class="disp">${esc(s.title)}</h2><span class="chip ${s.chip}">${esc(s.chipl)}</span>
  <div style="margin-top:14px">${img}<p class="cap">${esc(w.by)}, <a href="${w.url}" target="_blank" rel="noopener"><i>${esc(w.t)}</i></a>, ${esc(w.d)}. ${esc(w.mus.split(' (')[0])}.<sup class="nr" data-n="${w.n}">${w.n}</sup></p>${comps}</div>
  ${s.main ? `<div class="btnrow"><button class="btn" id="cmpbtn">Compare painting and map ⟷</button></div>` : ''}
  <div class="stats"><div><b>${esc(s.dist)}</b><span>vantage to subject</span></div><div><b>${s.compass} · ${Math.round(s.bearing)}°</b><span>direction of view (true north)</span></div></div>
  <div class="sunbox" id="sunbox"></div>
  <div class="ptext"><h4>Where they stood</h4><p>${s.where}</p><h4>The light</h4><p>${s.light}</p></div>
  <div class="today ptext"><h4>Paint it today</h4><ul>${s.today.map(t => `<li>${t}</li>`).join('')}</ul>
  ${s.pal.length ? `<h4>Palette sampled from the painting</h4><div class="pal">${s.pal.map(h => `<button style="background:${h}" data-hex="${h}" aria-label="Copy colour ${h}"></button>`).join('')}</div><div class="palk">Tap a swatch to copy its hex code · ${s.pal.join(' · ')}</div>` : ''}</div>`;
  panel.querySelector('.back').onclick = () => selectSite(null);
  panel.querySelectorAll('[data-go]').forEach(b => b.onclick = () => selectSite(D.sites.find(x => x.id === b.dataset.go), true));
  panel.querySelectorAll('[data-w]').forEach(b => b.onclick = () => openViewer(b.dataset.w, [s.main, ...s.comp].filter(Boolean)));
  panel.querySelectorAll('.pal button').forEach(b => b.onclick = () => { navigator.clipboard?.writeText(b.dataset.hex).then(() => toast('Copied ' + b.dataset.hex), () => toast(b.dataset.hex)); });
  const cb = $('#cmpbtn'); if (cb) cb.onclick = () => openCompare(s);
  initSun(s); window.PGX?.onSite?.(s); panel.scrollTop = 0;
  if (zoom) MAP.site(s); else drawSel();
}

/* sun controls */
const RULEDATE = { aug1: [8, 1], aug25: [8, 25], jun21: [6, 21], sep22: [9, 22], oct15: [10, 15] };
function initSun(s) {
  const [mo, d] = RULEDATE[s.rule[0]]; const yr = 2027;
  const box = $('#sunbox');
  box.innerHTML = `<h4>Sun at the site</h4>
   <div class="sunrow"><label for="sdate">Date</label><input type="date" id="sdate" value="${yr}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}" min="2026-01-01" max="2035-12-31"></div>
   <input type="range" id="stime" min="240" max="1320" step="5" aria-label="Time of day">
   <div class="timeaxis"><span>4 a.m.</span><span>8</span><span>noon</span><span>4 p.m.</span><span>9 p.m.</span></div>
   <div class="quick"><button data-q="rise">Sunrise</button><button data-q="paint" class="on">The painting's hour</button><button data-q="gold">Golden hour</button><button data-q="set">Sunset</button><button data-q="now">Now</button></div>
   <div class="sunread" id="sunread" aria-live="polite"></div>`;
  const dI = $('#sdate'), tI = $('#stime');
  const parts = () => dI.value.split('-').map(Number);
  const rs = () => { const [y, m, dd] = parts(); return SUN.riseSet(y, m, dd, s.V[0], s.V[1]); };
  const paintMin = () => { const r = rs(); const w = s.rule[1]; return w === 'sunset' ? r.set : w === 'sunrise' ? r.rise : w === 'ss-2h' ? r.set - 120 : 540; };
  function upd(fromQuick) {
    if (!dI.value) return; const [y, m, dd] = parts(), min = +tI.value, u = SUN.localToUtc(y, m, dd, min); const p = SUN.pos(u, s.V[0], s.V[1]); sunState = { az: p.az, el: p.el };
    const r = rs(), tz = SUN.tzLabel(y, m, dd);
    const up = p.el > -0.833; const rel = up ? `${relation(p.az, s.bearing)}` : 'below the horizon';
    const elTxt = Math.abs(p.el) < 0.84 ? 'on the horizon' : p.el > 0 ? `${p.el.toFixed(0)}° above the horizon` : `${Math.abs(p.el).toFixed(0)}° below the horizon`;
    let mood = '';
    if (p.el <= -6) mood = 'Night. No direct light; the town and the water read as silhouettes against the sky.';
    else if (p.el < -0.833) mood = 'Twilight. Soft, shadowless light; the sky carries the color.';
    else if (p.el < 6) mood = 'Sun on the horizon. Long shadows, warm color: the low light Lane favored for his harbor views.';
    else if (p.el < 18) mood = 'Golden-hour range. Warm side-light and long shadows; colors shift quickly, so work fast.';
    else if (p.el < 40) mood = 'Mid-height sun. Clear modeling of forms; shadows shorten through the session.';
    else mood = 'High sun. Short shadows and flatter, cooler light on the water.';
    $('#sunread').innerHTML = `<div class="big">${fmtT(min)} ${tz}</div>
      <span class="k">Date</span><span class="v">${MONTHS[m - 1]} ${dd}, ${y}</span>
      <span class="k">Sun</span><span class="v">${compass(p.az)} · ${p.az.toFixed(0)}°, ${elTxt}</span>
      <span class="k">For you</span><span class="v">${up ? 'The sun is ' + rel : 'The sun is below the horizon'}</span>
      <span class="k">That day</span><span class="v">Sunrise ${r.rise != null ? fmtT(r.rise) : '—'} · sunset ${r.set != null ? fmtT(r.set) : '—'} ${tz}</span>
      <span class="k">Light</span><span class="v" style="font-weight:400">${mood}</span>`;
    window.PGX?.onSun?.(s, y, m, dd, min);
    if (!fromQuick) box.querySelectorAll('.quick button').forEach(b => b.classList.remove('on'));
    drawSel();
  }
  const setQ = q => { const r = rs(); let m;
    if (q === 'rise') m = r.rise; else if (q === 'set') m = r.set; else if (q === 'gold') m = r.set - 50; else if (q === 'paint') m = paintMin();
    else { const now = new Date(); const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now); const o = Object.fromEntries(f.map(x => [x.type, x.value])); dI.value = `${o.year}-${o.month}-${o.day}`; m = (+o.hour) * 60 + (+o.minute); }
    if (m == null) return; tI.value = Math.max(240, Math.min(1320, Math.round(m / 5) * 5)); box.querySelectorAll('.quick button').forEach(b => b.classList.toggle('on', b.dataset.q === q)); upd(true); };
  box.querySelectorAll('.quick button').forEach(b => b.onclick = () => setQ(b.dataset.q));
  tI.oninput = () => upd(false); dI.onchange = () => { const q = box.querySelector('.quick button.on')?.dataset.q; if (q && q !== 'now') setQ(q); else upd(false); };
  setQ('paint');
}

/* ---------------- compare ---------------- */
function openCompare(s) {
  const o = $('#compare'); const w = WBY[s.main];
  o.innerHTML = `<button class="vclose" aria-label="Close">×</button><div class="cmpbox" id="cmpbox"><div class="layer"><img src="${IMG.m(w.id)}" alt="${esc(w.by)}, ${esc(w.t)}"></div><div class="layer top" id="cmptop">${s.svg}</div><div class="handle" id="cmph"></div></div>
   <div class="cmplab"><span>◂ The painting</span><span>The ground today ▸</span></div><div class="cmpnote">Drag across to wipe between ${esc(w.by)}'s picture and the map of where the painter stood (dark circle), the subject (diamond) and the sun at the painting's hour. The map looks down from above; the painting looks out along the dashed line.</div>`;
  o.classList.add('on'); document.body.style.overflow = 'hidden';
  const box = $('#cmpbox'), top = $('#cmptop'), h = $('#cmph');
  const set = x => { const r = box.getBoundingClientRect(); const p = Math.max(0, Math.min(100, (x - r.left) / r.width * 100)); top.style.clipPath = `inset(0 0 0 ${p}%)`; h.style.left = p + '%'; };
  let dn = false; box.onpointerdown = e => { dn = true; box.setPointerCapture(e.pointerId); set(e.clientX); }; box.onpointermove = e => { if (dn) set(e.clientX); }; box.onpointerup = box.onpointercancel = () => dn = false;
  box.tabIndex = 0; let kp = 50; box.onkeydown = e => { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { kp = Math.max(0, Math.min(100, kp + (e.key === 'ArrowLeft' ? -5 : 5))); const r = box.getBoundingClientRect(); set(r.left + r.width * kp / 100); } };
  o.querySelector('.vclose').onclick = closeOverlays;
}
function closeOverlays() { $$('.overlay').forEach(o => o.classList.remove('on')); document.body.style.overflow = ''; }
addEventListener('keydown', e => { if (e.key === 'Escape') { closeOverlays(); $('#notepop').classList.remove('on'); } });
(() => {
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])';
  const visible = n => n.getClientRects().length && getComputedStyle(n).visibility !== 'hidden';
  const open = () => $$('.overlay.on').pop();
  const bg = () => [$('header.top'), $('main'), $('footer.foot')].filter(Boolean);
  let last = null, was = false;
  const sync = () => { const o = open();
    if (o && !was) { last = document.activeElement; bg().forEach(n => n.inert = true); }
    if (o && !o.contains(document.activeElement)) { const t = o.querySelector('.vclose') || [...o.querySelectorAll(FOCUSABLE)].find(visible); if (t) t.focus({ preventScroll: true }); }
    if (!o && was) { bg().forEach(n => n.inert = false); viewTitle(); if (last && document.contains(last)) last.focus({ preventScroll: true }); last = null; }
    was = !!o; };
  const mo = new MutationObserver(sync);
  $$('.overlay').forEach(o => mo.observe(o, { attributes: true, attributeFilter: ['class'], childList: true }));
  addEventListener('keydown', e => { const o = open(); if (!o || e.key !== 'Tab') return;
    const f = [...o.querySelectorAll(FOCUSABLE)].filter(visible); if (!f.length) { e.preventDefault(); return; }
    const first = f[0], end = f[f.length - 1], a = document.activeElement;
    if (!o.contains(a)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && a === first) { e.preventDefault(); end.focus(); }
    else if (!e.shiftKey && a === end) { e.preventDefault(); first.focus(); } });
})();

/* ---------------- viewer ---------------- */
let vlist = [], vi = 0;
const V = { s: 1, x: 0, y: 0, fit: 1 };
function openViewer(id, list) {
  vlist = list && list.length ? list : [id]; vi = Math.max(0, vlist.indexOf(id));
  $('#viewer').classList.add('on'); document.body.style.overflow = 'hidden'; renderViewer();
}
function renderViewer() {
  const w = WBY[vlist[vi]], st = $('#stage'), site = SITE_OF[w.id];
  st.querySelectorAll('img,.noimg').forEach(n => n.remove());
  $$('.vnav').forEach(b => b.style.visibility = vlist.length > 1 ? 'visible' : 'hidden');
  $('.vctl').style.display = w.img ? 'flex' : 'none';
  if (w.img) { const im = new Image(); im.src = IMG.m(w.id); im.dataset.id = w.id; im.alt = `${w.by}, ${w.t}, ${w.d}`; im.draggable = false; st.appendChild(im); im.onload = () => fitImg(); if (im.complete) fitImg(); }
  else st.insertAdjacentHTML('beforeend', `<div class="noimg"><div><div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#D9B07A">${w.pd ? 'Image not included' : 'Image at the museum · not openly licensed'}</div><div class="big"><i>${esc(w.t)}</i></div><a href="${w.url}" target="_blank" rel="noopener">See it on the ${esc(w.mus.split(' (')[0])} website ↗</a></div></div>`);
  $('#vinfo').innerHTML = `<div class="kicker">${esc(D.labels[w.g] || '')}${vlist.length > 1 ? ` · ${vi + 1} of ${vlist.length}` : ''}</div><div class="tt">${esc(w.t)}</div>
    <div style="font:15px Inter,sans-serif;margin-top:6px">${esc(w.by)}, ${esc(w.d)}</div>
    <dl><dt>Medium</dt><dd>${esc(w.med)}</dd><dt>Collection</dt><dd>${esc(w.mus)}</dd><dt>Acc. no.</dt><dd>${esc(w.acc)}</dd>${w.place ? `<dt>Place</dt><dd>${esc(w.place)}</dd>` : ''}<dt>Checked</dt><dd>${esc(w.st)}</dd><dt>Image</dt><dd>${w.pd ? 'Public-domain image' + (w.img ? '' : ' (not included here)') : 'Not released for reuse by the museum, or still in copyright: see the museum page'}</dd></dl>
    <div class="btnrow"><a class="btn solid" style="border-bottom:1px solid var(--navy)" href="${w.url}" target="_blank" rel="noopener">Museum page ↗</a>${site ? `<button class="btn" id="tosite">Where it was painted (site ${site.n})</button>` : ''}<button class="btn" id="cpl">Copy link</button></div>
    ${w.n ? `<div class="note"><b>Source · note ${w.n}</b>${D.notes[w.n] || ''}</div>` : ''}
    ${w.cr ? `<div class="cr">Image: ${esc(w.cr)}</div>` : ''}`;
  const ts = $('#tosite'); if (ts) ts.onclick = () => { closeOverlays(); show('map'); selectSite(site, true); };
  $('#cpl').onclick = () => { const u = new URL(`works/${w.id}.html`, location.href.split('#')[0]).href; navigator.clipboard?.writeText(u).then(() => toast('Link copied'), () => toast(u)); };
  setHash('work-' + w.id); setTitle(`${w.t}, ${w.by}`);
  window.PGX?.onViewer?.(w);
}
function placeImg() { const im = $('#stage img'); if (im) im.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.s})`; }
function fitImg() { const im = $('#stage img'), st = $('#stage'); if (!im || !im.naturalWidth) return; const r = st.getBoundingClientRect(), pad = 40;
  V.fit = Math.min((r.width - pad * 2) / im.naturalWidth, (r.height - pad * 2) / im.naturalHeight); V.s = V.fit; V.x = (r.width - im.naturalWidth * V.s) / 2; V.y = (r.height - im.naturalHeight * V.s) / 2; placeImg(); }
/* swap in the full-size JPEG the first time someone zooms well past the fitted size */
function upgradeImg() { const im = $('#stage img'); if (!im || im.dataset.full || !im.naturalWidth || V.s < V.fit * 1.25) return; im.dataset.full = '1';
  const hi = new Image(); hi.onload = () => { if ($('#stage img') !== im || !hi.naturalWidth) return; const r = im.naturalWidth / hi.naturalWidth; hi.alt = im.alt; hi.draggable = false; hi.dataset.id = im.dataset.id; hi.dataset.full = '1'; V.s *= r; V.fit *= r; im.replaceWith(hi); placeImg(); };
  hi.src = IMG.full(im.dataset.id); }
function zoomImg(f, cx, cy) { const st = $('#stage').getBoundingClientRect(); const px = cx - st.left, py = cy - st.top; const ns = Math.max(V.fit * 0.8, Math.min(V.fit * 8, V.s * f)); f = ns / V.s; V.x = px - (px - V.x) * f; V.y = py - (py - V.y) * f; V.s = ns; placeImg(); upgradeImg(); }
(() => {
  const st = $('#stage'); const ptr = new Map(); let s0 = null;
  st.addEventListener('wheel', e => { e.preventDefault(); zoomImg(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0018)), e.clientX, e.clientY); }, { passive: false });
  st.addEventListener('dblclick', e => { if (V.s > V.fit * 1.2) fitImg(); else zoomImg(2.5, e.clientX, e.clientY); });
  st.addEventListener('pointerdown', e => { if (e.target.closest('button,a')) return; ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); st.setPointerCapture(e.pointerId); st.classList.add('drag'); s0 = { V: { ...V }, p: new Map(ptr) }; });
  st.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, { x: e.clientX, y: e.clientY }); const n = [...ptr.values()], o = [...s0.p.values()];
    if (n.length === 1 && o.length === 1) { V.x = s0.V.x + n[0].x - o[0].x; V.y = s0.V.y + n[0].y - o[0].y; placeImg(); }
    else if (n.length >= 2 && o.length >= 2) { const d0 = Math.hypot(o[0].x - o[1].x, o[0].y - o[1].y), d1 = Math.hypot(n[0].x - n[1].x, n[0].y - n[1].y), r = st.getBoundingClientRect();
      const m0 = [(o[0].x + o[1].x) / 2 - r.left, (o[0].y + o[1].y) / 2 - r.top], m1 = [(n[0].x + n[1].x) / 2 - r.left, (n[0].y + n[1].y) / 2 - r.top];
      const ns = Math.max(V.fit * 0.8, Math.min(V.fit * 8, s0.V.s * d1 / d0)), f = ns / s0.V.s; V.s = ns; V.x = m1[0] - (m0[0] - s0.V.x) * f; V.y = m1[1] - (m0[1] - s0.V.y) * f; placeImg(); upgradeImg(); } });
  const up = e => { ptr.delete(e.pointerId); s0 = { V: { ...V }, p: new Map(ptr) }; if (!ptr.size) st.classList.remove('drag'); };
  st.addEventListener('pointerup', up); st.addEventListener('pointercancel', up);
  $('#vzin').onclick = () => { const r = st.getBoundingClientRect(); zoomImg(1.6, r.left + r.width / 2, r.top + r.height / 2); };
  $('#vzout').onclick = () => { const r = st.getBoundingClientRect(); zoomImg(1 / 1.6, r.left + r.width / 2, r.top + r.height / 2); };
  $('#vfit').onclick = fitImg;
  $('.vnav.p').onclick = () => { vi = (vi - 1 + vlist.length) % vlist.length; renderViewer(); };
  $('.vnav.n').onclick = () => { vi = (vi + 1) % vlist.length; renderViewer(); };
  $('#viewer .vclose').onclick = () => { closeOverlays(); setHash($('#worksview').classList.contains('on') ? 'works' : (cur ? 'site-' + cur.n : '')); };
  addEventListener('keydown', e => { if (!$('#viewer').classList.contains('on')) return; if (e.key === 'ArrowLeft') $('.vnav.p').click(); if (e.key === 'ArrowRight') $('.vnav.n').click(); });
  addEventListener('resize', () => { if ($('#viewer').classList.contains('on')) fitImg(); });
})();

/* ---------------- works ---------------- */
const F = { q: '', g: new Set(), mus: '', dec: null, img: false, pd: false, site: false, sort: 'date' };
const museumOf = w => w.mus.split(' (')[0].replace(/, (Gloucester|Washington|Boston|New York|Kansas City)$/, m => m);
function initWorks() {
  const order = ['lane', 'homer', 'hunt_bricher', 'hassam', 'twachtman', 'prendergast', 'others', 'modern', 'colony'];
  const cnt = g => D.works.filter(w => w.g === g).length;
  $('#achips').innerHTML = `<button data-g="" class="on">All painters</button>` + order.map(g => `<button data-g="${g}">${esc(D.labels[g])}<span class="c">${cnt(g)}</span></button>`).join('');
  $$('#achips button').forEach(b => b.onclick = () => { const g = b.dataset.g; if (!g) F.g.clear(); else F.g.has(g) ? F.g.delete(g) : F.g.add(g); $$('#achips button').forEach(x => x.classList.toggle('on', x.dataset.g ? F.g.has(x.dataset.g) : !F.g.size)); renderWorks(); });
  const mus = {}; D.works.forEach(w => { const m = museumOf(w); mus[m] = (mus[m] || 0) + 1; });
  $('#fmus').innerHTML = `<option value="">All collections (${Object.keys(mus).length})</option>` + Object.entries(mus).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([m, n]) => `<option value="${esc(m)}">${esc(m)} (${n})</option>`).join('');
  $('#fq').oninput = e => { F.q = e.target.value.trim().toLowerCase(); renderWorks(); };
  $('#fmus').onchange = e => { F.mus = e.target.value; renderWorks(); };
  $('#fimg').onchange = e => { F.img = e.target.checked; renderWorks(); };
  $('#fpd').onchange = e => { F.pd = e.target.checked; renderWorks(); };
  $('#fsite').onchange = e => { F.site = e.target.checked; renderWorks(); };
  $('#fsort').onchange = e => { F.sort = e.target.value; renderWorks(); };
  $('#freset').onclick = () => { Object.assign(F, { q: '', mus: '', dec: null, img: false, pd: false, site: false }); F.g.clear(); $('#fq').value = ''; $('#fmus').value = ''; ['fimg', 'fpd', 'fsite'].forEach(i => $('#' + i).checked = false); $$('#achips button').forEach(x => x.classList.toggle('on', !x.dataset.g)); renderWorks(); };
}
function match(w, skipDec) {
  if (F.g.size && !F.g.has(w.g)) return false; if (F.mus && museumOf(w) !== F.mus) return false;
  if (F.img && !w.img) return false; if (F.pd && !w.pd) return false; if (F.site && !SITE_OF[w.id]) return false;
  if (!skipDec && F.dec != null && !(w.y && Math.floor(w.y / 10) * 10 === F.dec)) return false;
  if (F.q) { const h = `${w.t} ${w.by} ${w.mus} ${w.place} ${w.d} ${w.med} ${D.labels[w.g]}`.toLowerCase(); if (!F.q.split(/\s+/).every(t => h.includes(t))) return false; }
  return true;
}
function renderWorks() {
  // timeline
  const decs = []; for (let d = 1840; d <= 1940; d += 10) decs.push(d);
  const base = D.works.filter(w => match(w, true)); const c = Object.fromEntries(decs.map(d => [d, base.filter(w => w.y && Math.floor(w.y / 10) * 10 === d).length])); const mx = Math.max(1, ...Object.values(c));
  $('#timeline').innerHTML = decs.map(d => `<button data-d="${d}" class="${F.dec === d ? 'on' : ''}" aria-label="${d}s: ${c[d]} works" aria-pressed="${F.dec === d}"><span class="nc">${c[d] || ''}</span><span class="bar" style="height:${c[d] ? Math.max(4, c[d] / mx * 44) : 2}px"></span><span class="yl">${d}<span class="s">s</span></span></button>`).join('');
  $$('#timeline button').forEach(b => b.onclick = () => { const d = +b.dataset.d; F.dec = F.dec === d ? null : d; renderWorks(); });
  let list = D.works.filter(w => match(w));
  const sorters = { date: (a, b) => (a.y || 9999) - (b.y || 9999) || a.t.localeCompare(b.t), artist: (a, b) => a.by.localeCompare(b.by) || (a.y || 0) - (b.y || 0), title: (a, b) => a.t.localeCompare(b.t), img: (a, b) => (b.img - a.img) || (a.y || 0) - (b.y || 0) };
  list.sort(sorters[F.sort]);
  const ids = list.map(w => w.id);
  $('#wcount').innerHTML = `Showing <b style="color:var(--ink)">${list.length}</b> of ${D.works.length} works${F.dec != null ? ` · ${F.dec}s` : ''}`;
  $('#grid').innerHTML = list.length ? list.map(w => { const s = SITE_OF[w.id]; const inner = `${w.img ? `<span class="im"><img src="${IMG.t(w.id)}" alt="${esc(w.by)}, ${esc(w.t)}" loading="lazy" decoding="async"></span>` : `<span class="im none">${w.pd ? 'No image here' : 'Image at the museum'}<b>${esc(w.t)}</b></span>`}
     <span class="tx"><span class="tt">${esc(w.t)}</span><span class="by" style="display:block">${esc(w.by)}, ${esc(w.d)}</span><span class="mu" style="display:block">${esc(museumOf(w))}</span>
     <span class="badges">${w.pd ? '' : '<span class="badge">Image at museum</span>'}${s ? `<span class="badge site">Site ${s.n}</span>` : ''}${w.place ? `<span class="badge">${esc(w.place)}</span>` : ''}</span></span>`;
      return w.img ? `<button class="card" data-w="${w.id}">${inner}</button>`
        : `<div class="card noimgcard"><button class="cardin" data-w="${w.id}" aria-label="${esc(w.t)}, ${esc(w.by)}: details">${inner}</button><a class="musbtn" href="${esc(w.url)}" target="_blank" rel="noopener">View at the museum ↗<span class="vh"> (${esc(w.t)}, ${esc(museumOf(w))})</span></a></div>`; }).join('')
    : `<div class="empty">No works match these filters. <button class="btn" onclick="document.getElementById('freset').click()">Clear filters</button></div>`;
  $$('#grid [data-w]').forEach(b => b.onclick = () => openViewer(b.dataset.w, ids));
}


/* ---------------- boot ---------------- */
initWorks(); introPanel();
function route() {
  const h = location.hash.slice(1);
  if (h === 'works') { show('works'); return; }
  if (['about','home','paint','shops','plan'].includes(h) || h === '') { show(h || 'home'); return; }
  if (h.startsWith('work-') && WBY[h.slice(5)]) { show('works'); openViewer(h.slice(5), D.works.filter(w => match(w)).map(w => w.id)); return; }
  show('map'); MAP.resize();
  const m = h.match(/^site-(\d)$/); if (m) { const s = D.sites.find(x => x.n === +m[1]); MAP.overview(0); selectSite(s, true); } else MAP.overview(0);
}
window.PG = { IMG, setTitle, D, $, $$, esc, show, selectSite, setHash, MAP, P, svg, gSel, gSites, el, NS, toast, openViewer, closeOverlays, WBY, SITE_OF, compass, fmtT, relation, panel, get cur(){ return cur; }, get sunState(){ return sunState; } };
window.PGX?.init?.();
addEventListener('hashchange', () => { if (!location.hash.startsWith('#work-')) route(); });
requestAnimationFrame(route);
})();

