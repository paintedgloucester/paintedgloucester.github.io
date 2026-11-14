// Builds i18n/pt.json and i18n/it.json from the numbered batches in i18n/batches/ and the rules in i18n/rules.json.
// A batch is NN.en.json (an array of English strings) plus NN.tr.txt: one line per string, "Portuguese ||| Italian".
import fs from 'node:fs'; import vm from 'node:vm';
const rules = JSON.parse(fs.readFileSync('i18n/rules.json', 'utf8')), out = { pt: {}, it: {} }; let bad = 0;
const PH = /⟦(\d+)⟧/g, ph = s => (s.match(PH) || []).join('');
for (const f of fs.readdirSync('i18n/batches').filter(f => f.endsWith('.en.json')).sort()) {
  const en = JSON.parse(fs.readFileSync('i18n/batches/' + f, 'utf8')), tf = 'i18n/batches/' + f.replace('.en.json', '.tr.txt'); if (!fs.existsSync(tf)) continue;
  const tr = fs.readFileSync(tf, 'utf8').replace(/\n+$/, '').split('\n');
  if (tr.length !== en.length) { console.error(`${f}: ${en.length} strings but ${tr.length} lines`); bad++; continue; }
  en.forEach((k, i) => { const mm = tr[i].match(/^(\d+): ([\s\S]*)$/); if (!mm || +mm[1] !== i + 1) { console.error(`${f} line ${i + 1}: expected "${i + 1}: "`); bad++; return; } const p = mm[2].split(' ||| '); if (p.length !== 2) { console.error(`${f} line ${i + 1}: need "pt ||| it"`); bad++; return; }
    [['pt', p[0]], ['it', p[1]]].forEach(([l, v]) => { v = v.trim(); if (v === '=') v = k; if (ph(v) !== ph(k)) { console.error(`${f} line ${i + 1} (${l}): placeholders differ\n  ${k}\n  ${v}`); bad++; return; } out[l][k] = v; }); });
}
// hand-written vocabulary: NN.all.txt, lines of "English ||| Portuguese ||| Italian"
for (const f of fs.readdirSync('i18n/batches').filter(f => f.endsWith('.all.txt')).sort()) fs.readFileSync('i18n/batches/' + f, 'utf8').split('\n').forEach((line, i) => { if (!line.trim()) return; const p = line.split(' ||| ');
  if (p.length !== 3 || ph(p[0]) !== ph(p[1]) || ph(p[0]) !== ph(p[2])) { console.error(`${f} line ${i + 1}: need "en ||| pt ||| it" with the same placeholders`); bad++; return; } out.pt[p[0].trim()] = p[1].trim(); out.it[p[0].trim()] = p[2].trim(); });
// the same sentence without some of its inline marks (the scripts show trail text without citation numbers): derive it
{ const strip = s => s.replace(PH, '').replace(/\s+/g, ' ').trim(), byPlain = new Map(); for (const k of Object.keys(out.pt)) if (/\u27E6/.test(k)) byPlain.set(strip(k), k);
  const want = fs.existsSync('i18n/derive.json') ? JSON.parse(fs.readFileSync('i18n/derive.json', 'utf8')) : []; let n = 0;
  for (const m of want) { if (out.pt[m] !== undefined) continue; const K = byPlain.get(strip(m)); if (!K) continue;
    const tk = K.split(/(\u27E6\d+\u27E7)/), tm = m.split(/(\u27E6\d+\u27E7)/), keepIdx = new Map(); // walk K; a mark is kept when M has one at the same point in the text
    let textK = '', textM = tm[0].replace(/\s+/g, ''), mi = 1, next = 0;
    for (let i = 0; i < tk.length; i++) { if (i % 2 === 0) { textK += tk[i].replace(/\s+/g, ''); continue; } const idx = +tk[i].slice(1, -1);
      if (mi < tm.length && textM.length === textK.length) { keepIdx.set(idx, next); textM += tm[mi + 1].replace(/\s+/g, ''); mi += 2; next++; } }
    if (keepIdx.size !== (tm.length - 1) / 2) continue;
    for (const l of ['pt', 'it']) out[l][m] = out[l][K].replace(PH, (x, i) => keepIdx.has(+i) ? '\u27E6' + keepIdx.get(+i) + '\u27E7' : '').replace(/ +([.,;:])/g, '$1').replace(/\s+/g, ' ').trim(); n++; }
  if (want.length) console.log('derived ' + n + ' of ' + want.length); }
// catalogue data that is never translated: titles, painters, museums
const ctx = { window: {} }; vm.createContext(ctx); for (const f of ['data.js', 'places.js']) vm.runInContext(fs.readFileSync('js/' + f, 'utf8'), ctx);
const keep = new Set(); for (const w of ctx.window.DATA.works) for (const v of [w.t, w.by, w.mus, (w.mus || '').split(' (')[0]]) if (v) keep.add(v);
for (const p of ctx.window.PLACES.places || []) if (p.name) keep.add(p.name);
for (const k of rules.keep) keep.add(k);
const parts = new Set(); for (const w of ctx.window.DATA.works) for (const v of [w.med, w.d, w.st, w.place, w.cr]) if (v && !keep.has(v)) parts.add(v);
for (const s of ctx.window.DATA.sites) for (const v of [s.title, s.V[2], s.S[2], s.chipl, s.sun0 && s.sun0.label, s.sun0 && s.sun0.date, s.sun0 && s.sun0.time]) if (v && !keep.has(v)) parts.add(v);
for (const l of ['pt', 'it']) fs.writeFileSync(`i18n/${l}.json`, JSON.stringify({ lang: l, months: rules[l].months, days: rules[l].days, rules: rules[l].rules, keep: [...keep], parts: [...parts], t: out[l] }));
console.log(Object.keys(out.pt).length + ' strings per language' + (bad ? `, ${bad} problems` : '')); if (bad) process.exit(1);
