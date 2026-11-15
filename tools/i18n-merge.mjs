// Builds the glossaries i18n/<lang>.json that tools/build.mjs and js/i18n.js use.
//
// Portuguese and Italian (the first two languages) are kept as they were written:
//   i18n/batches/NN.en.json + NN.tr.txt ("N: Portuguese ||| Italian") and NN.all.txt ("English ||| Portuguese ||| Italian").
// Every other language reads one numbered list, the same for all of them:
//   i18n/master.json     every English string, in a fixed order (new strings are added at the end, never reordered)
//   i18n/tr/<lang>/*.txt  "N: translation" for string N of master.json ("=" keeps the English)
//   i18n/tr/<lang>/rules.txt  "N: replacement" for pattern rule N (the patterns themselves are the Portuguese list in rules.json)
import fs from 'node:fs'; import vm from 'node:vm';
const rules = JSON.parse(fs.readFileSync('i18n/rules.json', 'utf8')); let bad = 0;
const PH = /⟦(\d+)⟧/g, ph = s => (s.match(PH) || []).join('');
const LANGS = ['pt', 'it', ...fs.readdirSync('i18n/tr').filter(d => fs.statSync('i18n/tr/' + d).isDirectory()).sort()];
const out = Object.fromEntries(LANGS.map(l => [l, {}]));

// ---- Portuguese and Italian ----
const batchEn = [];
for (const f of fs.readdirSync('i18n/batches').filter(f => f.endsWith('.en.json')).sort()) {
  const en = JSON.parse(fs.readFileSync('i18n/batches/' + f, 'utf8')), tf = 'i18n/batches/' + f.replace('.en.json', '.tr.txt'); batchEn.push(...en); if (!fs.existsSync(tf)) continue;
  const tr = fs.readFileSync(tf, 'utf8').replace(/\n+$/, '').split('\n');
  if (tr.length !== en.length) { console.error(`${f}: ${en.length} strings but ${tr.length} lines`); bad++; continue; }
  en.forEach((k, i) => { const mm = tr[i].match(/^(\d+): ([\s\S]*)$/); if (!mm || +mm[1] !== i + 1) { console.error(`${f} line ${i + 1}: expected "${i + 1}: "`); bad++; return; } const p = mm[2].split(' ||| '); if (p.length !== 2) { console.error(`${f} line ${i + 1}: need "pt ||| it"`); bad++; return; }
    [['pt', p[0]], ['it', p[1]]].forEach(([l, v]) => { v = v.trim(); if (v === '=') v = k; if (ph(v) !== ph(k)) { console.error(`${f} line ${i + 1} (${l}): placeholders differ\n  ${k}\n  ${v}`); bad++; return; } out[l][k] = v; }); });
}
for (const f of fs.readdirSync('i18n/batches').filter(f => f.endsWith('.all.txt')).sort()) fs.readFileSync('i18n/batches/' + f, 'utf8').split('\n').forEach((line, i) => { if (!line.trim()) return; const p = line.split(' ||| ');
  if (p.length !== 3 || ph(p[0]) !== ph(p[1]) || ph(p[0]) !== ph(p[2])) { console.error(`${f} line ${i + 1}: need "en ||| pt ||| it" with the same placeholders`); bad++; return; } batchEn.push(p[0].trim()); out.pt[p[0].trim()] = p[1].trim(); out.it[p[0].trim()] = p[2].trim(); });

// ---- the numbered master list ----
let master = fs.existsSync('i18n/master.json') ? JSON.parse(fs.readFileSync('i18n/master.json', 'utf8')) : [];
{ const have = new Set(master); let added = 0; for (const k of batchEn) if (!have.has(k)) { master.push(k); have.add(k); added++; }
  if (added) { fs.writeFileSync('i18n/master.json', JSON.stringify(master, null, 0).replace(/","/g, '",\n"')); console.log(`master list: ${added} new strings, ${master.length} in all`); } }

// ---- the other languages ----
const ptRules = rules.pt.rules;
for (const l of LANGS.slice(2)) {
  const dir = 'i18n/tr/' + l; let n = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.txt') && f !== 'rules.txt').sort()) fs.readFileSync(dir + '/' + f, 'utf8').split('\n').forEach((line, i) => { if (!line.trim()) return;
    const mm = line.match(/^(\d+): ([\s\S]*)$/); if (!mm) { console.error(`${l}/${f} line ${i + 1}: expected "N: text"`); bad++; return; }
    const k = master[+mm[1] - 1]; if (k === undefined) { console.error(`${l}/${f} line ${i + 1}: no string ${mm[1]}`); bad++; return; }
    let v = mm[2].trim(); if (v === '=') v = k;
    if (ph(v) !== ph(k)) { console.error(`${l}/${f} line ${i + 1} (#${mm[1]}): placeholders differ\n  ${k}\n  ${v}`); bad++; return; }
    out[l][k] = v; n++; });
  const R = rules[l] || (rules[l] = {}), reps = {};
  if (fs.existsSync(dir + '/rules.txt')) fs.readFileSync(dir + '/rules.txt', 'utf8').split('\n').forEach((line, i) => { if (!line.trim()) return; const mm = line.match(/^(\d+): ([\s\S]*)$/);
    if (!mm || !ptRules[+mm[1] - 1]) { console.error(`${l}/rules.txt line ${i + 1}: expected "N: replacement" for one of ${ptRules.length} rules`); bad++; return; } reps[+mm[1] - 1] = mm[2].trim(); });
  R.rules = ptRules.map(([re], i) => reps[i] !== undefined ? [re, reps[i]] : null).filter(Boolean);
  const missingRules = ptRules.length - R.rules.length; if (missingRules) console.log(`${l}: ${missingRules} pattern rules not yet translated`);
  const missingStr = master.filter(k => out[l][k] === undefined).length; if (missingStr) console.log(`${l}: ${missingStr} of ${master.length} strings not yet translated`);
}

// ---- sentences shown without some of their inline marks (trail text without citation numbers): derive them ----
{ const strip = s => s.replace(PH, '').replace(/\s+/g, ' ').trim();
  const want = fs.existsSync('i18n/derive.json') ? JSON.parse(fs.readFileSync('i18n/derive.json', 'utf8')) : [];
  for (const l of LANGS) { const byPlain = new Map(); for (const k of Object.keys(out[l])) if (/⟦/.test(k)) byPlain.set(strip(k), k);
    for (const m of want) { if (out[l][m] !== undefined) continue; const K = byPlain.get(strip(m)); if (!K) continue;
      const tk = K.split(/(⟦\d+⟧)/), tm = m.split(/(⟦\d+⟧)/), keepIdx = new Map(); // walk K; a mark is kept when M has one at the same point in the text
      let textK = '', textM = tm[0].replace(/\s+/g, ''), mi = 1, next = 0;
      for (let i = 0; i < tk.length; i++) { if (i % 2 === 0) { textK += tk[i].replace(/\s+/g, ''); continue; } const idx = +tk[i].slice(1, -1);
        if (mi < tm.length && textM.length === textK.length) { keepIdx.set(idx, next); textM += tm[mi + 1].replace(/\s+/g, ''); mi += 2; next++; } }
      if (keepIdx.size !== (tm.length - 1) / 2) continue;
      out[l][m] = out[l][K].replace(PH, (x, i) => keepIdx.has(+i) ? '⟦' + keepIdx.get(+i) + '⟧' : '').replace(/ +([.,;:])/g, '$1').replace(/\s+/g, ' ').trim(); } } }

// ---- catalogue data that is never translated (titles, painters, museums), and data pieces translated on their own ----
const ctx = { window: {} }; vm.createContext(ctx); for (const f of ['data.js', 'places.js']) vm.runInContext(fs.readFileSync('js/' + f, 'utf8'), ctx);
const keep = new Set(); for (const w of ctx.window.DATA.works) for (const v of [w.t, w.by, w.mus, (w.mus || '').split(' (')[0]]) if (v) keep.add(v);
for (const p of ctx.window.PLACES.places || []) if (p.name) keep.add(p.name);
for (const k of rules.keep) keep.add(k);
const parts = new Set(); for (const w of ctx.window.DATA.works) for (const v of [w.med, w.d, w.st, w.place, w.cr]) if (v && !keep.has(v)) parts.add(v);
for (const s of ctx.window.DATA.sites) for (const v of [s.title, s.V[2], s.S[2], s.chipl, s.sun0 && s.sun0.label, s.sun0 && s.sun0.date, s.sun0 && s.sun0.time]) if (v && !keep.has(v)) parts.add(v);
for (const l of LANGS) { const R = rules[l];
  fs.writeFileSync(`i18n/${l}.json`, JSON.stringify({ lang: l, months: R.months, days: R.days, datefmt: R.datefmt, datewords: R.datewords, rules: R.rules, keep: [...keep], parts: [...parts], t: out[l] })); }
console.log(LANGS.map(l => `${l} ${Object.keys(out[l]).length}`).join(', ') + ' strings' + (bad ? `; ${bad} problems` : '')); if (bad) process.exit(1);
