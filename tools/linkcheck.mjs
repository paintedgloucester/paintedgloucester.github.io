// Monthly check of the shop, studio and event listings: tests every link and flags entries not re-checked in six months.
// Run:  node tools/linkcheck.mjs   (exits 0; writes a Markdown report to linkcheck-report.md when something needs attention)
import fs from 'node:fs'; import vm from 'node:vm';
const ctx = { window: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync('js/places.js', 'utf8'), ctx);
const P = ctx.window.PLACES, STALE_MONTHS = 6;
const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
const monthsOld = txt => { const m = /^(\w+)\s+(\d{4})$/.exec(String(txt || '').trim()); if (!m || MONTHS.indexOf(m[1].toLowerCase()) < 0) return null; const now = new Date(); return (now.getUTCFullYear() - +m[2]) * 12 + now.getUTCMonth() - MONTHS.indexOf(m[1].toLowerCase()); };
const UA = 'Mozilla/5.0 (compatible; PaintedGloucesterLinkCheck/1.0; +https://paintedgloucester.github.io/)';
async function probe(url) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try { const r = await fetch(url, { method: 'GET', redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(25000) });
      if (r.ok) return null;
      if ([401, 403, 405, 429, 999].includes(r.status) || (r.status >= 520 && r.status <= 530))   // 52x: Cloudflare turning away the robot, not a dead page return { soft: true, why: `HTTP ${r.status} (site blocks automated checks; open it by hand)` };
      if (attempt) return { why: `HTTP ${r.status}` };
    } catch (e) { if (attempt) return { why: e.name === 'TimeoutError' ? 'timed out' : (e.cause?.code || e.message) }; }
    await new Promise(r => setTimeout(r, 3000));
  }
}
const items = [...P.places.map(p => ({ kind: 'Listing', name: p.name, checked: p.checked || P.checked, links: [p.url, ...p.src.map(s => s[1])] })),
  ...P.events.map(e => ({ kind: 'Event', name: e.name, checked: e.checked || P.checked, links: e.src.map(s => s[1]) }))];
const broken = [], soft = [], stale = [];
for (const it of items) {
  const age = monthsOld(it.checked);
  if (age === null) stale.push(`- **${it.name}**: \`checked\` is "${it.checked}", which is not a month and year`); else if (age > STALE_MONTHS) stale.push(`- **${it.name}**: last checked ${it.checked} (${age} months ago)`);
  for (const u of [...new Set(it.links.filter(u => u && /^https?:/.test(u)))]) { const bad = await probe(u); if (bad) (bad.soft ? soft : broken).push(`- **${it.name}** (${it.kind.toLowerCase()}): ${u} — ${bad.why}`); }
}
console.log(`${items.length} entries: ${broken.length} broken links, ${soft.length} could not be tested, ${stale.length} stale`);
if (broken.length || stale.length) {
  const md = [`The monthly check of \`js/places.js\` found items that need a look.`, '',
    broken.length ? `### Links that failed\n${broken.join('\n')}` : '', stale.length ? `### Listings not re-checked in over ${STALE_MONTHS} months\n${stale.join('\n')}` : '',
    soft.length ? `### Could not be tested automatically\n${soft.join('\n')}` : '', '',
    'After verifying an entry against its sources, update its `checked` month in `js/places.js`.'].filter(x => x !== '').join('\n\n');
  fs.writeFileSync('linkcheck-report.md', md + '\n');
}
