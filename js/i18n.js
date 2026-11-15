/* Painted Gloucester translation layer. One implementation, used twice:
   - by tools/build.mjs (Node) to write the translated copies of every page under pt/ and it/;
   - in the browser on those copies, to translate what the scripts draw after the page loads.
   A page is cut into "segments": the text between block-level tags, with inline tags replaced by
   numbered placeholders ⟦0⟧ ⟦1⟧ … so a sentence is translated whole. The glossaries are i18n/<lang>.json. */
(function (root) {
  const BLOCK = new Set('address article aside blockquote body br caption dd details dialog div dl dt fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hr html li main nav ol p pre section table tbody td tfoot th thead tr ul button option select label summary legend title head'.split(' '));
  const ATOM = new Set(['sup', 'svg', 'img', 'input', 'script', 'style', 'code', 'textarea', 'canvas', 'noscript-x']);
  const ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  const PH = i => '⟦' + i + '⟧', PH_RE = /⟦(\d+)⟧/g;
  const hasLetters = s => /[A-Za-zÀ-ɏ]{2}/.test(s);
  const collapse = s => s.replace(/\s+/g, ' ');

  function make(dict) {
    const map = dict.t || {}, rules = (dict.rules || []).map(([re, to]) => [new RegExp(re), to]), months = dict.months, days = dict.days, lang = dict.lang;
    const missing = new Set();
    const EN_M = 'January February March April May June July August September October November December'.split(' ');
    const EN_D = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(' ');
    const DATEWORDS = new RegExp('(?<![A-Za-z\\u00C0-\\u024F])(?:' + [...(months || []), ...(days || []), ...(dict.datewords || []), 'de', 'del', 'EST', 'EDT'].map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|') + ')(?![A-Za-z\\u00C0-\\u024F])', 'gi');
    function generic(s) {
      let o = s.replace(/\b(\d{1,2}):(\d\d) ([ap])\.m\.?(?=$|[^a-z])/g, (m, h, mm, ap) => `${(+h % 12) + (ap === 'p' ? 12 : 0)}:${mm}`).replace(/\b(\d{1,2}) ([ap])\.m\.?(?=$|[^a-z])/g, (m, h, ap) => `${(+h % 12) + (ap === 'p' ? 12 : 0)}:00`);
      if (months) {
        const F = dict.datefmt || { dmy: '{d} {m} {y}', dm: '{d} {m}', my: '{m} {y}' }, put = (tpl, d, mi, y) => tpl.replace('{d}', d).replace('{m}', months[mi]).replace('{M}', String(mi + 1)).replace('{y}', y);
        o = o.replace(new RegExp('\\b(' + EN_M.join('|') + ') (\\d{1,2})(?!\\d)(?:[–-](\\d{1,2}))?(?:, (\\d{4}))?', 'g'), (m, mo, d, d2, y) => put(y ? F.dmy : F.dm, d + (d2 ? '–' + d2 : ''), EN_M.indexOf(mo), y || ''));
        o = o.replace(new RegExp('\\b(' + EN_M.join('|') + ')(?: (\\d{4}))?\\b', 'g'), (m, mo, y) => y ? put(F.my, '', EN_M.indexOf(mo), y) : months[EN_M.indexOf(mo)]);
        o = o.replace(new RegExp('\\b(' + EN_D.join('|') + ')\\b', 'g'), (m, d) => days[EN_D.indexOf(d)]);
      }
      return o;
    }
    /* Translate one plain-text string. Order: the glossary; catalogue data (titles, painters, museums: kept as they are);
       pattern rules; then, for short strings only, the parts either side of a separator. What stays English is noted in `missing`. */
    const vals = new Set(Object.values(map)); // text that is already translated is left alone
    const keep = new Set(dict.keep || []), parts = new Set((dict.parts || []).filter(p => !keep.has(p)));
    const esc = k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), all = [...keep, ...parts].filter(k => k.length > 3).sort((a, b) => b.length - a.length);
    const keepRe = all.length ? new RegExp(all.map(esc).join('|'), 'g') : null, MASK = /(\d+)/g;
    const inert = k => !hasLetters(k.replace(MASK, ' ').replace(/\b(?:ca|in|cm|mm|km|mi|ft|inv|cat|no|OP|EST|EDT|[NSEW]{2,3})\b\.?/g, ' '));
    const sentence = k => { const w = k.replace(PH_RE, ' ').replace(MASK, ' ').trim().split(/\s+/).length; return w > 9 || (w > 5 && /[a-zà-ÿ]{3}[.!?…]["”]?$/.test(k)); };
    const NONE = { v: null, ok: true }, FAIL = { v: null, ok: false };
    function tr(s, depth, quiet) {
      const k = collapse(s).trim(); if (!k) return NONE;
      if (map[k] !== undefined) return { v: map[k], ok: true };
      if (keep.has(k) || vals.has(k) || !/[A-Za-z\u00C0-\u024F]/.test(k)) return NONE;
      for (const [re, to] of rules) if (re.test(k)) { let ok = true; const v = k.replace(re, (...a) => { let o = to; const n = a.length - 2; for (let i = n - 1; i >= 1; i--) { if (o.includes('$T' + i)) { const r = tr(a[i] || '', depth + 1, quiet); ok = ok && r.ok; o = o.split('$T' + i).join(r.v === null ? (a[i] || '') : r.v); } o = o.split('$' + i).join(a[i] === undefined ? '' : a[i]); } return o; }); return { v, ok }; }
      const g0 = generic(k); if (g0 !== k && !hasLetters(g0.replace(DATEWORDS, ' '))) return { v: g0, ok: true }; // a bare date or time
      if (inert(k)) return NONE;
      // catalogue data inside the string: titles, painters and museums are kept; media, dates and the like are translated on their own
      const saved = [], mk = keepRe && depth < 5 ? k.replace(keepRe, m => m === k ? m : (saved.push(m), '' + (saved.length - 1) + '')) : k, un = v => v.replace(MASK, (m, i) => saved[+i]);
      if (inert(mk)) { let ok = true, any = false; const v = mk.replace(MASK, (m, i) => { const p = saved[+i]; if (!parts.has(p)) return p; const r = tr(p, depth + 1, quiet); ok = ok && r.ok; if (r.v === null) return p; any = true; return r.v; }); return any ? { v, ok } : (ok ? NONE : FAIL); }
      if (sentence(mk) && !mk.includes(' · ')) { if (!quiet) missing.add(k); return FAIL; }
      if (depth < 5) {
        const pm = mk.match(/^([\s,.;:·–—-]*)([\s\S]*?)([\s,.;:·]*)$/);
        if (pm && (pm[1] || pm[3]) && pm[2]) { const r = tr(un(pm[2]), depth + 1, quiet); return { v: r.v === null ? null : un(pm[1]) + r.v + un(pm[3]), ok: r.ok }; }
        for (const sep of [' · ', '; ', ': ', ' (', ', ']) { const i = mk.indexOf(sep); if (i > 0 && (sep !== ' (' || mk.endsWith(')'))) { let a = un(mk.slice(0, i)), b = un(mk.slice(i + sep.length)), tail = ''; if (sep === ' (') { b = b.slice(0, -1); tail = ')'; } const ra = tr(a, depth + 1, true), rb = tr(b, depth + 1, true), ok = ra.ok && rb.ok;
          if (!ok && !quiet) missing.add(k);
          return { v: ra.v === null && rb.v === null ? null : (ra.v === null ? a : ra.v) + sep + (rb.v === null ? b : rb.v) + tail, ok }; } }
      }
      if (!quiet) missing.add(k);
      return FAIL;
    }
    const text = (s, depth, quiet) => tr(s, depth || 0, quiet).v;
    /* tokens: {t:'text', s, set(v)} | {t:'open'|'close'|'atom', put(where, v)} | {t:'block'} */
    function run(tokens) {
      let seg = [];
      const flush = () => { if (seg.length) segment(seg); seg = []; };
      for (let i = 0; i < tokens.length; i++) { const k = tokens[i];
        if (k.t === 'block') { flush(); continue; }
        if (k.t === 'open' && seg.length) { let j = seg.length - 1; while (j >= 0 && seg[j].t === 'text' && !seg[j].s.trim()) j--; if (j >= 0 && seg[j].t === 'close') flush(); }
        seg.push(k); }
      flush();
    }
    function segment(seg) {
      let a = 0, b = seg.length - 1;
      while (a <= b && !(seg[a].t === 'text' && seg[a].s.trim())) a++;
      while (b >= a && !(seg[b].t === 'text' && seg[b].s.trim())) b--;
      if (a > b) return;
      const inner = seg.slice(a, b + 1), slots = [[]]; let key = '', n = 0;
      for (const k of inner) { if (k.t === 'text') { slots[slots.length - 1].push(k); key += k.s; } else { key += PH(n++); slots.push([]); k._i = n - 1; } }
      key = collapse(key).trim(); if (!/[A-Za-z\u00C0-\u024F]/.test(key.replace(PH_RE, ''))) return;
      const lead = (inner[0].s.match(/^\s*/) || [''])[0], trail = (inner[inner.length - 1].s.match(/\s*$/) || [''])[0];
      const hit = n ? map[key] : text(key);
      if (hit !== undefined && hit !== null) {
        const parts = hit.split(PH_RE); // text, idx, text, idx, …
        const order = []; for (let i = 1; i < parts.length; i += 2) order.push(+parts[i]);
        if (order.length === n && order.every((v, i) => v === i)) {
          for (let i = 0; i <= n; i++) { let v = parts[i * 2]; if (i === 0) v = lead + v; if (i === n) v = v + trail; put(slots[i], inner, i, v); }
          return;
        }
        if (n) missing.add('!order ' + key);
      }
      if (n) { // not in the glossary as a whole: translate each piece of text on its own, when every piece can be
        const whole = sentence(keepRe ? key.replace(keepRe, '\uE0000\uE001') : key), res = [], set = () => res.forEach(([k, r]) => { if (r.v !== null) k.set((k.s.match(/^\s*/) || [''])[0] + r.v + (k.s.match(/\s*$/) || [''])[0]); });
        for (let i = 0; i <= n; i++) for (const k of slots[i]) res.push([k, tr(k.s, 0, true)]);
        if (res.every(([, r]) => r.ok)) return set();
        if (whole) { missing.add(key); return; }
        res.forEach(([k]) => tr(k.s, 0, false)); set(); }
    }
    function put(slot, inner, i, v) {
      if (slot.length) { slot[0].set(v); for (let j = 1; j < slot.length; j++) slot[j].set(''); return; }
      if (!v) return; const tag = inner.find(k => k._i === i - 1); if (tag && tag.put) tag.put(v);
    }

    /* ---------- strings of HTML (Node) ---------- */
    const DEC = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'", '&nbsp;': ' ' };
    const dec = s => s.replace(/&(?:amp|lt|gt|quot|#x27|#39|nbsp);/g, m => DEC[m]), enc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    function html(src) {
      const out = [], tokens = []; const re = /<!--[\s\S]*?-->|<![^>]*>|<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>/g; let last = 0, m, skip = 0;
      const pushText = s => { if (!s) return; const o = { s }; out.push(o); if (!skip) tokens.push({ t: 'text', s: dec(s), set(v) { o.s = enc(v); } }); };
      const raw = s => { const o = { s }; out.push(o); return o; };
      while ((m = re.exec(src))) {
        pushText(src.slice(last, m.index)); last = re.lastIndex;
        if (m[0].startsWith('<!')) { raw(m[0]); continue; }
        const close = !!m[1], tag = m[2].toLowerCase(); let attrs = m[3];
        if (!close && ATOM.has(tag) || !close && /\stranslate="no"/.test(attrs)) {
          const voidTag = tag === 'img' || tag === 'input' || /\/\s*$/.test(attrs); let end = last;
          if (!voidTag) { const cre = new RegExp('<(/?)' + tag + '\\b[^>]*>', 'gi'); cre.lastIndex = last; let depth = 1, c; while (depth && (c = cre.exec(src))) depth += c[1] ? -1 : 1; end = c ? cre.lastIndex : src.length; }
          if (tag === 'img' || tag === 'input') attrs = attrs.replace(/\b(alt|title|aria-label|placeholder)="([^"]*)"/g, (x, n, v) => { const tv = text(dec(v)); return tv === null ? x : `${n}="${enc(tv).replace(/"/g, '&quot;')}"`; });
          const o = raw(tag === 'img' || tag === 'input' ? `<${tag}${attrs}>` : src.slice(m.index, end)); last = end; re.lastIndex = end;
          if (!skip) tokens.push(BLOCK.has(tag) || tag === 'script' || tag === 'style' ? { t: 'block' } : { t: 'atom', put(v) { o.s += enc(v); } }); continue;
        }
        if (!close) attrs = attrs.replace(/\b(alt|title|aria-label|placeholder)="([^"]*)"/g, (x, n, v) => { const tv = text(dec(v)); return tv === null ? x : `${n}="${enc(tv).replace(/"/g, '&quot;')}"`; });
        if (!close && tag === 'meta' && /(name="description"|property="og:(title|description|image:alt)")/.test(attrs)) attrs = attrs.replace(/content="([^"]*)"/, (x, v) => { const tv = text(dec(v)); return tv === null ? x : `content="${enc(tv).replace(/"/g, '&quot;')}"`; });
        const o = raw(`<${close ? '/' : ''}${m[2]}${attrs}>`);
        if (BLOCK.has(tag) || tag === 'meta' || tag === 'link') tokens.push({ t: 'block' });
        else tokens.push(close ? { t: 'close', put(v) { o.s += enc(v); } } : { t: 'open', put(v) { o.s += enc(v); } });
      }
      pushText(src.slice(last)); run(tokens);
      return out.map(o => o.s).join('');
    }

    /* ---------- live DOM (browser) ---------- */
    const DONE = typeof WeakMap !== 'undefined' ? new WeakMap() : null;
    function walk(el, tokens) {
      for (const n of el.childNodes) {
        if (n.nodeType === 3) { if (DONE.get(n) === n.nodeValue) { tokens.push({ t: 'block' }); continue; } tokens.push({ t: 'text', s: n.nodeValue, set(v) { n.nodeValue = v; DONE.set(n, v); } }); continue; }
        if (n.nodeType !== 1) continue; const tag = n.tagName.toLowerCase();
        if (n.getAttribute('translate') === 'no' || ATOM.has(tag) || tag === 'noscript' || (n.classList && n.classList.contains('leaflet-control-attribution'))) { if (tag === 'img' || tag === 'input') attrsOf(n); tokens.push(BLOCK.has(tag) || tag === 'script' || tag === 'style' ? { t: 'block' } : { t: 'atom', put(v) { n.after(document.createTextNode(v)); } }); continue; }
        attrsOf(n);
        if (BLOCK.has(tag)) { tokens.push({ t: 'block' }); walk(n, tokens); tokens.push({ t: 'block' }); }
        else { tokens.push({ t: 'open', put(v) { n.insertBefore(document.createTextNode(v), n.firstChild); } }); walk(n, tokens); tokens.push({ t: 'close', put(v) { n.after(document.createTextNode(v)); } }); }
      }
    }
    function attrsOf(n) { for (const a of ATTRS) { const v = n.getAttribute(a); if (v && n['_pg_' + a] !== v) { const tv = text(v); if (tv !== null) { n.setAttribute(a, tv); n['_pg_' + a] = tv; } else n['_pg_' + a] = v; } } }
    function dom(rootEl) { const tokens = [{ t: 'block' }]; walk(rootEl, tokens); run(tokens); }
    return { html, dom, text, missing };
  }
  const api = { make, BLOCK };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.PGI18N = api;
})(typeof window !== 'undefined' ? window : globalThis);

/* In the browser, on a translated copy: translate what scripts add to the page, and keep links inside the language. */
(function () {
  if (typeof document === 'undefined' || !window.PG_DICT || !window.PGI18N) return;
  const T = window.PGI18N.make(window.PG_DICT), dir = window.PG_DICT.lang, based = !!document.querySelector('base');
  const PAGE = /^(?:(?:works|sites|trails)\/|(?:painters|waterfront|winter|photographers|teachers|gallery|shops|field-notes|brief)\.html)/;
  const links = el => { if (!based || !el.querySelectorAll) return; el.querySelectorAll('a[href]').forEach(a => { const h = a.getAttribute('href'); if (PAGE.test(h)) a.setAttribute('href', dir + '/' + h); }); };
  const blockOf = n => { let e = n.nodeType === 1 ? n : n.parentElement; while (e && e !== document.body && !window.PGI18N.BLOCK.has(e.tagName.toLowerCase())) e = e.parentElement; return e || document.body; };
  const svgText = r => { if (!r || !r.querySelectorAll) return; r.querySelectorAll('svg text.msl, svg text.sunt').forEach(t => { const v = T.text(t.textContent, 0, true); if (v && v !== t.textContent) t.textContent = v; }); };
  const start = () => {
    T.dom(document.body); links(document.body); svgText(document.body);
    new MutationObserver(list => { const seen = new Set(); for (const m of list) { const b = blockOf(m.target); if (b.closest && b.closest('svg')) { svgText(b.closest('svg').parentNode || b); continue; } if (b.closest && b.closest('[translate="no"]')) continue; seen.add(b); }
      const all = [...seen].filter(b => ![...seen].some(o => o !== b && o.contains(b))); all.forEach(b => { T.dom(b); links(b); svgText(b); }); })
      .observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['alt', 'title', 'aria-label', 'placeholder'] });
  };
  if (based) document.addEventListener('click', e => { if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return; const a = e.target.closest && e.target.closest('a[href^="#"]'); if (!a) return; e.preventDefault(); const h = a.getAttribute('href'); if (location.hash === h) window.dispatchEvent(new HashChangeEvent('hashchange')); else location.hash = h; });
  window.PG_T = T;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
