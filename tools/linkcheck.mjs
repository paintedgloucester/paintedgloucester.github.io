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

// Every other outside link on the site: painting records, sources in the Brief, trail and site pages.
// A page can answer 200 and still be gone (a "Page not found" page, or a redirect to an unrelated page), so the title is checked too.
const LANG_DIRS = /^(es|fr|de|it|pt|nl|fi|zh|ko)$/, SKIP = /google\.com\/maps|goatcounter|gc\.zgo\.at|openstreetmap\.org\/(?!copyright)|nominatim|arcgisserver/;
const pages = []; (function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (e.name.startsWith('.') || ['node_modules', 'vendor', 'i18n', 'print'].includes(e.name) || (d === '.' && LANG_DIRS.test(e.name))) continue; const p = `${d}/${e.name}`; if (e.isDirectory()) walk(p); else if (p.endsWith('.html')) pages.push(p); } })('.');
const where = new Map(); for (const p of pages) for (const m of fs.readFileSync(p, 'utf8').matchAll(/href="(https?:\/\/[^"#]+)/g)) { const u = m[1].replace(/&amp;/g, '&'); if (/paintedgloucester\.github\.io/.test(u) || SKIP.test(u)) continue; if (!where.has(u)) where.set(u, p.slice(2)); }
const deadPage = [], softPage = [], NOTFOUND = /not found|page not found|404|no longer available|does not exist/i;
async function probePage(url) {
  try { const r = await fetch(url, { redirect: 'follow', headers: { 'user-agent': UA, accept: 'text/html,*/*' }, signal: AbortSignal.timeout(25000) });
    if ([401, 403, 405, 429, 999].includes(r.status) || (r.status >= 520 && r.status <= 530)) return { soft: true, why: `HTTP ${r.status} (site blocks automated checks; open it by hand)` };
    if (!r.ok) return { why: `HTTP ${r.status}` };
    const type = r.headers.get('content-type') || ''; if (!type.includes('html')) return null;
    const title = ((await r.text()).match(/<title[^>]*>([^<]*)/i) || [])[1] || '';
    if (NOTFOUND.test(title)) return { why: `page says "${title.trim().slice(0, 80)}"` };
    const host = h => new URL(h).hostname.replace(/^www\./, '');
    if (host(r.url) !== host(url) && new URL(r.url).pathname === '/') return { why: `redirects to the home page of ${host(r.url)}` };
    return null;
  } catch (e) { return { why: e.name === 'TimeoutError' ? 'timed out' : (e.cause?.code || e.message) }; }
}
const queue = [...where.keys()]; await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) { const u = queue.shift(); const bad = await probePage(u); if (bad) (bad.soft ? softPage : deadPage).push(`- ${u} — ${bad.why} (first seen on \`${where.get(u)}\`)`); } }));
console.log(`${where.size} other outside links: ${deadPage.length} broken, ${softPage.length} could not be tested`);
if (deadPage.length) broken.push(`- **Other pages of the site** (${deadPage.length}):`, ...deadPage.map(x => '  ' + x));
for (const x of softPage) soft.push(x);
console.log(`${items.length} entries: ${broken.length} broken links, ${soft.length} could not be tested, ${stale.length} stale`);
if (broken.length || stale.length) {
  const md = [`The monthly check of the site's links and of \`js/places.js\` found items that need a look. A link that says "timed out" may only have been down for a moment: open it by hand before changing it.`, '',
    broken.length ? `### Links that failed\n${broken.join('\n')}` : '', stale.length ? `### Listings not re-checked in over ${STALE_MONTHS} months\n${stale.join('\n')}` : '',
    soft.length ? `### Could not be tested automatically\n${soft.join('\n')}` : '', '',
    'After verifying an entry against its sources, update its `checked` month in `js/places.js`.'].filter(x => x !== '').join('\n\n');
  fs.writeFileSync('linkcheck-report.md', md + '\n');
}
