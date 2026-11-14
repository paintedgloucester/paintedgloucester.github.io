// Builds the plain pages (one per painting and site, plus list pages), the sitemap and the offline worker
// from the data in js/. Run from the repository root:  node tools/build.mjs
// The deploy workflow runs it on every push, so editing js/places.js on github.com is enough.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import vm from 'node:vm';
const ROOT = process.cwd(), ORIGIN = 'https://paintedgloucester.github.io';
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['data.js', 'places.js', 'guide.js', 'extras.js']) vm.runInContext(fs.readFileSync(`js/${f}`, 'utf8'), ctx);
const D = ctx.window.DATA, P = ctx.window.PLACES, G = ctx.window.PG_GUIDE, X = ctx.window.PG_EXTRAS;
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const strip = h => String(h ?? '').replace(/<sup class="nr"[^>]*>.*?<\/sup>/g, '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const WBY = Object.fromEntries(D.works.map(w => [w.id, w]));
const SITE_OF = {}; D.sites.forEach(s => { if (s.main) SITE_OF[s.main] = s; s.comp.forEach(c => { SITE_OF[c] = SITE_OF[c] || s; }); });
const mus = w => w.mus.split(' (')[0];
const dir = ll => `https://www.google.com/maps/dir/?api=1&destination=${ll[0]},${ll[1]}`;
const notes = (h, up) => String(h ?? '').replace(/<sup class="nr" data-n="(\d+)">\d+<\/sup>/g, (m, n) => `<sup><a href="${up}brief.html#note-${n}" aria-label="Note ${n}">${n}</a></sup>`);
const today = new Date().toISOString().slice(0, 10);
const DEFAULT_IMG = 'img/lane-braces-rock.jpg', DEFAULT_ALT = "Fitz Henry Lane, Brace's Rock, Eastern Point, Gloucester, about 1864";
const ICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%231F3A52'/%3E%3Cpath d='M8 44c10-6 16-6 24 0s14 6 24 0' stroke='%23E3B97C' stroke-width='4' fill='none'/%3E%3Ccircle cx='44' cy='20' r='7' fill='%23E3B97C'/%3E%3C/svg%3E`;
const written = [];
function page({ file, title, desc, image = DEFAULT_IMG, imageAlt = DEFAULT_ALT, type = 'website', ld, body, crumbs = [], lang = 'en', alt = null, head = '', tail = '' }) {
  const up = '../'.repeat(file.split('/').length - 1), url = `${ORIGIN}/${file.replace(/index\.html$/, '')}`;
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)} — Painted Gloucester</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="icon" href="${ICON}">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Painted Gloucester">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${ORIGIN}/${image}">
<meta property="og:image:alt" content="${esc(imageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${ORIGIN}/${image}">
<meta name="theme-color" content="#1F3A52">
${alt ? Object.entries(alt).map(([l, f]) => `<link rel="alternate" hreflang="${l}" href="${ORIGIN}/${f.replace(/index\.html$/, '')}">`).join('\n') + '\n' : ''}${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n` : ''}<link rel="stylesheet" href="${up}css/fonts.css">
<link rel="stylesheet" href="${up}css/pages.css">
${head ? head(up) : ''}</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="top"><a class="brand" href="${up}./">Painted Gloucester<small>Cape Ann · Massachusetts</small></a>
<nav aria-label="Sections"><a href="${up}#map">Map</a><a href="${up}works/">Paintings</a><a href="${up}sites/">Sites</a><a href="${up}trails/">Trails</a><a href="${up}shops.html">Shops</a><a href="${up}field-notes.html">Field notes</a><a href="${up}brief.html">Brief</a></nav></header>
<main id="main">
${crumbs.length ? `<nav class="crumbs" aria-label="Breadcrumb"><a href="${up}./">Home</a>${crumbs.map(([n, h]) => ` <span aria-hidden="true">›</span> ${h ? `<a href="${up}${h}">${esc(n)}</a>` : `<span>${esc(n)}</span>`}`).join('')}</nav>` : ''}
${body(up)}
</main>
<footer class="foot"><div class="foot-in">
 <div><b class="foot-b">Painted Gloucester</b><p>A free field guide to painting Cape Ann, Massachusetts. Listings last checked ${esc(P.checked)}.</p><p><a href="https://github.com/paintedgloucester/paintedgloucester.github.io/issues/new?template=listing.yml">Suggest a listing or send a correction ↗</a></p></div>
 <div><b class="foot-h">Explore</b><ul><li><a href="${up}./">The interactive guide</a></li><li><a href="${up}works/">All ${D.works.length} paintings</a></li><li><a href="${up}sites/">The nine sites, with directions</a></li><li><a href="${up}shops.html">Shops, studios and events</a></li><li><a href="${up}field-notes.html">Palettes, light and painting days</a></li><li><a href="${up}brief.html">The research brief</a></li></ul></div>
 <div><b class="foot-h">More guides</b><ul><li><a href="${up}painters.html">The painters and who brought whom</a></li><li><a href="${up}trails/">Walking and driving trails</a></li><li><a href="${up}waterfront.html">The working waterfront</a></li><li><a href="${up}winter.html">Painting in winter</a></li><li><a href="${up}photographers.html">The photographers</a></li><li><a href="${up}teachers.html">For teachers</a></li><li><a href="${up}gallery.html">Visitors’ gallery</a></li><li><a href="${up}pt/" hreflang="pt-PT" lang="pt-PT">Em português</a> · <a href="${up}it/" hreflang="it" lang="it">In italiano</a></li></ul></div>
 <div><b class="foot-h">Credits and license</b><p>Painting images are public-domain releases by the museums that hold the works, credited beside each image. Coastline: MassGIS. Place points © <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>.</p><p>Text and data © Painted Gloucester, free to reuse with credit under <a rel="license" href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>. <a href="${up}LICENSE.md">License details</a>.</p></div>
</div></footer>
${tail ? tail(up) : ''}</body>
</html>
`;
  fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true }); fs.writeFileSync(path.join(ROOT, file), html); written.push(file);
}
const chipLabel = { documented: 'Vantage documented', approx: 'Area documented · spot approximate', secondary: 'Secondary source · spot approximate', inferred: 'Modern viewpoint · our suggestion' };

/* ---------- paintings ---------- */
const byDate = [...D.works].sort((a, b) => (a.y || 9999) - (b.y || 9999) || a.t.localeCompare(b.t));
for (const g of fs.existsSync('works') ? fs.readdirSync('works') : []) fs.rmSync(path.join('works', g));
byDate.forEach((w, i) => {
  const site = SITE_OF[w.id], prev = byDate[i - 1], next = byDate[i + 1];
  const desc = `${w.t} by ${w.by}, ${w.d}. ${w.med}. ${mus(w)}.${site ? ` Painted at site ${site.n}, ${site.title}.` : ''} One of ${D.works.length} paintings of Cape Ann in the Painted Gloucester field guide.`;
  page({ file: `works/${w.id}.html`, title: `${w.t}, ${w.by} (${w.d})`, desc, type: 'article',
    image: w.img ? `img/${w.id}.jpg` : DEFAULT_IMG, imageAlt: w.img ? `${w.by}, ${w.t}, ${w.d}` : DEFAULT_ALT,
    crumbs: [['Paintings', 'works/'], [w.t]],
    ld: { '@context': 'https://schema.org', '@type': 'VisualArtwork', name: w.t, creator: { '@type': 'Person', name: w.by }, dateCreated: w.d, artMedium: w.med, artform: 'Painting',
      ...(w.img ? { image: `${ORIGIN}/img/${w.id}.jpg` } : {}), url: `${ORIGIN}/works/${w.id}.html`, sameAs: w.url, isPartOf: { '@type': 'WebSite', name: 'Painted Gloucester', url: ORIGIN + '/' } },
    body: up => `<article class="work">
<div class="kicker">${esc(D.labels[w.g] || '')}</div>
<h1><i>${esc(w.t)}</i></h1>
<p class="lead">${esc(w.by)}, ${esc(w.d)}</p>
${w.img ? `<figure class="plate"><a href="${up}#work-${w.id}"><img src="${up}img/m/${w.id}.webp" alt="${esc(`${w.by}, ${w.t}, ${w.d}`)}"></a>${w.cr ? `<figcaption>Image: ${esc(w.cr)}</figcaption>` : ''}</figure>`
  : `<div class="plate none"><p class="k">${w.pd ? 'Image not included here' : 'Image at the museum · not openly licensed'}</p><p class="big"><i>${esc(w.t)}</i></p><a class="btn gold" href="${esc(w.url)}">View at the ${esc(mus(w))} ↗</a></div>`}
<div class="btnrow"><a class="btn solid" href="${up}#work-${w.id}">${w.img ? 'Open in the guide: zoom and sample colors' : 'Open in the guide'}</a><a class="btn" href="${esc(w.url)}">${w.img ? 'Museum page ↗' : 'View at the museum ↗'}</a>${site ? `<a class="btn" href="${up}sites/${site.id}.html">Where it was painted (site ${site.n})</a>` : ''}</div>
<dl class="facts"><dt>Medium</dt><dd>${esc(w.med)}</dd><dt>Collection</dt><dd>${esc(w.mus)}</dd><dt>Accession no.</dt><dd>${esc(w.acc)}</dd>${w.place ? `<dt>Place</dt><dd>${esc(w.place)}</dd>` : ''}<dt>Record checked</dt><dd>${esc(w.st)}</dd><dt>Image rights</dt><dd>${w.pd ? 'Public-domain image' + (w.img ? '' : ' (not included here)') : 'Not released for reuse by the museum, or still in copyright: see the museum page'}</dd></dl>
${w.n && D.notes[w.n] ? `<div class="note"><b>Source · <a href="${up}brief.html#note-${w.n}">note ${w.n}</a></b><p>${D.notes[w.n]}</p></div>` : ''}
<nav class="pager" aria-label="More paintings">${prev ? `<a href="${prev.id}.html">‹ ${esc(prev.t)}<small>${esc(prev.by)}, ${esc(prev.d)}</small></a>` : '<span></span>'}${next ? `<a class="nx" href="${next.id}.html">${esc(next.t)} ›<small>${esc(next.by)}, ${esc(next.d)}</small></a>` : '<span></span>'}</nav>
</article>` });
});
page({ file: 'works/index.html', title: `All ${D.works.length} paintings of Cape Ann`, desc: `Every painting in the Painted Gloucester guide, ${byDate[0].y} to ${byDate.filter(w => w.y).pop().y}: title, painter, date and the museum where each one hangs, with a page for each work.`,
  crumbs: [['Paintings']],
  body: up => `<div class="kicker">The works</div><h1>${D.works.length} paintings of Cape Ann</h1>
<p class="lead measure">Every work in the guide, by painter, with the collection where it hangs. ${D.works.filter(w => w.img).length} are shown in public-domain images; the others link to the museum's own page. <a href="${up}#works">Filter and search them in the interactive guide</a>, or read <a href="${up}painters.html">the painters’ lives on Cape Ann</a>.</p>
${D.artists.map(a => { const ws = byDate.filter(w => w.g === a.k); return ws.length ? `<section class="grp" id="g-${a.k}"><h2>${esc(a.name)}</h2><p class="sub">${esc([a.life, a.tie].filter(Boolean).join(' · '))} · ${ws.length} works</p><ul class="wlist">${ws.map(w => `<li>${w.img ? `<a class="th" href="${w.id}.html" tabindex="-1" aria-hidden="true"><img src="${up}thumbs/${w.id}.webp" alt="" loading="lazy" decoding="async"></a>` : '<span class="th none" aria-hidden="true">At the museum</span>'}<div><a class="t" href="${w.id}.html"><i>${esc(w.t)}</i></a><span class="m">${esc(w.by)}, ${esc(w.d)}</span><span class="m">${esc(mus(w))}</span>${w.img ? '' : `<a class="mlink" href="${esc(w.url)}">View at the museum ↗</a>`}</div></li>`).join('')}</ul></section>` : ''; }).join('\n')}` });

/* ---------- sites ---------- */
for (const g of fs.existsSync('sites') ? fs.readdirSync('sites') : []) fs.rmSync(path.join('sites', g));
D.sites.forEach((s, i) => {
  const w = s.main ? WBY[s.main] : null, prev = D.sites[(i + 8) % 9], next = D.sites[(i + 1) % 9];
  const desc = `${strip(s.where).slice(0, 150).replace(/\s\S*$/, '')}… Where ${s.artist} stood, the direction of view, the light and directions for painting it today.`;
  page({ file: `sites/${s.id}.html`, title: `Site ${s.n}: ${s.title}`, desc, type: 'article',
    image: w && w.img ? `img/${w.id}.jpg` : DEFAULT_IMG, imageAlt: w && w.img ? `${w.by}, ${w.t}, ${w.d}` : DEFAULT_ALT,
    crumbs: [['The nine sites', 'sites/'], [`Site ${s.n}`]],
    ld: { '@context': 'https://schema.org', '@type': 'TouristAttraction', name: s.title, description: strip(s.where), geo: { '@type': 'GeoCoordinates', latitude: s.V[0], longitude: s.V[1] }, url: `${ORIGIN}/sites/${s.id}.html`, isAccessibleForFree: true },
    body: up => `<article class="site">
<div class="kicker">Site ${s.n} of 9 · ${esc(s.artist)}</div>
<h1>${esc(s.title)}</h1>
<p><span class="chip ${s.chip}">${esc(s.chipl)}</span></p>
${w && w.img ? `<figure class="plate"><a href="${up}works/${w.id}.html"><img src="${up}img/m/${w.id}.webp" alt="${esc(`${w.by}, ${w.t}, ${w.d}`)}"></a><figcaption>${esc(w.by)}, <i>${esc(w.t)}</i>, ${esc(w.d)}. ${esc(mus(w))}.</figcaption></figure>` : ''}
<div class="btnrow"><a class="btn solid" href="${up}#site-${s.n}">Open on the chart: sun planner and camera</a><a class="btn" href="${dir(s.V)}">Directions to the standing point ↗</a></div>
<dl class="facts"><dt>Standing point</dt><dd>${esc(s.V[2])} (${s.V[0].toFixed(5)}, ${s.V[1].toFixed(5)})</dd><dt>Looking at</dt><dd>${esc(s.S[2])}</dd><dt>Direction of view</dt><dd>${esc(s.compass)}, ${Math.round(s.bearing)}° from true north</dd><dt>Distance to subject</dt><dd>${esc(s.dist)}</dd>${s.sun0 ? `<dt>The painter's light</dt><dd>${esc(s.sun0.label)}: about ${esc(s.sun0.time)} on ${esc(s.sun0.date)}</dd>` : ''}</dl>
<h2>Where they stood</h2><p>${notes(s.where, up)}</p>
<h2>The light</h2><p>${notes(s.light, up)}</p>
<h2>Paint it today</h2><ul class="today">${s.today.map(t => `<li>${notes(t, up)}</li>`).join('')}</ul>
${s.comp.length ? `<h2>Also painted here</h2><ul class="wlist">${s.comp.map(id => { const c = WBY[id]; return `<li>${c.img ? `<a class="th" href="${up}works/${c.id}.html" tabindex="-1" aria-hidden="true"><img src="${up}thumbs/${c.id}.webp" alt="" loading="lazy"></a>` : ''}<div><a class="t" href="${up}works/${c.id}.html"><i>${esc(c.t)}</i></a><span class="m">${esc(c.by)}, ${esc(c.d)}</span><span class="m">${esc(mus(c))}</span></div></li>`; }).join('')}</ul>` : ''}
<nav class="pager" aria-label="More sites"><a href="${prev.id}.html">‹ Site ${prev.n}<small>${esc(prev.title)}</small></a><a class="nx" href="${next.id}.html">Site ${next.n} ›<small>${esc(next.title)}</small></a></nav>
</article>` });
});
page({ file: 'sites/index.html', title: 'The nine painting sites, with directions', desc: 'A plain list of the nine places on Cape Ann where a painting can be tied to a standing point: who painted there, where to stand, which way to look and how to get there.',
  crumbs: [['The nine sites']],
  body: up => `<div class="kicker">Map &amp; sites · text version</div><h1>The nine painting sites</h1>
<p class="lead measure">Everything the chart shows, as a list: where each painter stood, what they were looking at, which way to face and a directions link. <a href="${up}#map">Open the chart</a> for the sun planner and the camera overlay.</p>
<p class="small measure">Check the tide table (NOAA station 8441841; mean range about 8.8 ft) and paint from public ways: several historic vantage points are now private land or reachable only by water. Each site's page has the access notes.</p>
<ol class="sitelist">${D.sites.map(s => { const w = s.main ? WBY[s.main] : null; return `<li><span class="num" aria-hidden="true">${s.n}</span><div><h2><a href="${s.id}.html">${esc(s.title)}</a></h2><p class="m">${esc(s.artist)}${w ? `, <i>${esc(w.t)}</i>, ${esc(w.d)}` : ''} · <span class="chip ${s.chip}">${esc(s.chipl)}</span></p>
<p><b>Stand at</b> ${esc(s.V[2])} (${s.V[0].toFixed(5)}, ${s.V[1].toFixed(5)}). <b>Face</b> ${esc(s.compass)}, ${Math.round(s.bearing)}°, toward ${esc(s.S[2])}, ${esc(s.dist)} away.</p>
<p class="acts"><a href="${dir(s.V)}">Directions ↗</a><a href="${s.id}.html">Access notes and light</a><a href="${up}#site-${s.n}">On the chart</a></p></div></li>`; }).join('')}</ol>
<h2 class="h-sec">How the vantage points are tagged</h2>
<table class="vtab"><thead><tr><th scope="col">Tag</th><th scope="col">What it means</th></tr></thead><tbody><tr><td><span class="chip documented">Vantage documented</span></td><td>A catalogue raisonné, inscription or published study fixes where the painter stood.</td></tr><tr><td><span class="chip approx">Area documented · spot approximate</span></td><td>The sources name the place; the exact spot is placed at the nearest mapped shore point.</td></tr><tr><td><span class="chip secondary">Secondary source · spot approximate</span></td><td>Only a later secondary account places the painter.</td></tr><tr><td><span class="chip inferred">Modern viewpoint · our suggestion</span></td><td>No source says where the painter stood; the marker is a public viewpoint we suggest.</td></tr></tbody></table>` });

/* ---------- shops ---------- */
const TYPE = { supply: 'Art supplies', school: 'Workshops & associations', museum: 'Museums & galleries', gallery: 'Museums & galleries' };
page({ file: 'shops.html', title: 'Art supplies, workshops, galleries and paint-outs on Cape Ann', desc: `Where to buy paint and panels, take a workshop and see the paintings in Gloucester and Rockport, plus the annual paint-outs. ${P.places.length} listings, each with sources and the month it was last checked.`,
  crumbs: [['Shops & studios']],
  body: up => `<div class="kicker">Shops &amp; studios</div><h1>Buy local, learn local</h1>
<p class="lead measure">Independent shops and nonprofits keep Cape Ann's art community going. Each listing shows the month it was last checked against its sources. Hours change with the seasons, so call ahead. <a href="${up}#shops">See them on the street map.</a></p>
${['Art supplies', 'Workshops & associations', 'Museums & galleries'].map(t => `<section class="grp"><h2>${esc(t)}</h2>${P.places.filter(p => TYPE[p.type] === t).map(p => `<article class="place" id="${p.id}"><h3>${esc(p.name)}</h3><p class="m">${esc(p.addr)}${p.phone ? ` · ${esc(p.phone)}` : ''}${p.far ? ' · further afield' : ''}</p><p>${esc(p.what)}</p>${p.special && p.special.length ? `<ul>${p.special.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}${p.confirm ? `<p class="confirm">${esc(p.confirm)}</p>` : ''}<p class="acts">${p.url ? `<a href="${esc(p.url)}">Website ↗</a>` : ''}<a href="${dir(p.ll)}">Directions ↗</a></p><p class="src"><b>Checked ${esc(p.checked || P.checked)}</b> · Source: ${p.src.map(([n, u]) => `<a href="${esc(u.startsWith('http') ? u : up + u)}">${esc(n)}</a>`).join('; ')}</p></article>`).join('')}</section>`).join('\n')}
<section class="grp"><h2>Paint-outs and annual events</h2>${P.events.map(e => `<article class="place"><h3>${esc(e.name)}</h3><p class="m"><b>${esc(e.when)}</b> · ${esc(e.where)}</p><p>${esc(e.what)}</p><p class="src"><b>Checked ${esc(e.checked || P.checked)}</b> · ${e.src.map(([n, u]) => `<a href="${esc(u)}">${esc(n)} ↗</a>`).join(' · ')}</p></article>`).join('')}</section>` });

/* ---------- field notes: palettes, light, conditions, kit, days ---------- */
page({ file: 'field-notes.html', title: 'Field notes: palettes, light, conditions and four painting days', desc: 'Starter palettes in the spirit of Lane, Homer, Hassam and Twachtman, the light through the day on Cape Ann, tides, fog and wind, a packing list and four painting days timed to the light.',
  crumbs: [['Field notes']],
  body: up => `<div class="kicker">Paint it · Plan</div><h1>Field notes for painting Cape Ann</h1>
<p class="lead measure">The practical pages of the guide in one place. The pigment lists are suggestions for today's tube colors, not a record of what each painter used. <a href="${up}#paint">The color lab is in the interactive guide.</a></p>
<section class="grp"><h2>Palettes</h2><div class="pals">${G.palettes.map(p => `<article class="palc"><p class="m">${esc(p.who)} · ${esc(p.medium)}</p><h3>${esc(p.name)}</h3><p>${esc(p.mood)}</p><ul class="pig">${p.pig.map(([n, h]) => `<li><i style="background:${esc(h)}"></i>${esc(n)}</li>`).join('')}</ul>${(p.tips || []).length ? `<ul class="tips">${p.tips.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}</article>`).join('')}</div></section>
<section class="grp"><h2>Light through the day</h2>${G.tod.map(t => `<article class="row"><h3>${esc(t.name)}</h3><p class="m">${esc(t.when)}</p><p>${esc(t.text)}</p></article>`).join('')}</section>
<section class="grp"><h2>Cape Ann conditions</h2>${G.cond.map(c => `<article class="row"><h3>${esc(c.name)}</h3><p>${esc(c.text)}</p>${c.link ? `<p class="acts"><a href="${esc(c.link[1])}">${esc(c.link[0])} ↗</a></p>` : ''}</article>`).join('')}</section>
<section class="grp"><h2>Packing list</h2><div class="cols">${G.kit.map(k => `<div><h3>${esc(k.g)}</h3><ul>${k.items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}</div></section>
<section class="grp"><h2>Good manners on the shore</h2><ul>${G.manners.map(m => `<li>${esc(m)}</li>`).join('')}</ul></section>
<section class="grp"><h2>Four painting days</h2><p class="small measure">Each day pairs a museum or supply stop with sites timed to the light. Check the access notes on each site first: several vantage points are on private land or reachable only by water.</p>${G.days.map(d => `<article class="day"><h3>${esc(d.name)}</h3><p>${esc(d.sum)}</p><ol class="steps">${d.steps.map(([tm, n, t, ref]) => { const [k, v] = (ref || '').split(':'); const link = k === 'site' ? `<a href="${up}sites/${v}.html">Site page →</a>` : k === 'place' ? `<a href="${up}shops.html#${v}">Listing →</a>` : ''; return `<li><span class="tm">${esc(tm)}</span><div><b>${esc(n)}</b><p>${esc(t)} ${link}</p></div></li>`; }).join('')}</ol></article>`).join('')}</section>` });

/* ---------- trails, seasons, waterfront, photographers, teachers, gallery, translations ---------- */
await import('./extras.mjs').then(m => m.default({ page, esc, strip, WBY, D, P, X, ORIGIN, dir, mus, SITE_OF, ctx, fs }));

/* ---------- sitemap ---------- */
const urls = ['', 'brief.html', 'Painted-Gloucester-brief.pdf', ...written.map(f => f.replace(/index\.html$/, ''))];
fs.writeFileSync('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${ORIGIN}/${u}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);

/* ---------- offline worker ---------- */
const ls = d => fs.existsSync(d) ? fs.readdirSync(d).filter(f => !f.startsWith('.')).map(f => `${d}/${f}`) : [];
const siteImgs = [...new Set(D.sites.flatMap(s => [s.main, ...s.comp]).filter(id => id && WBY[id].img))];
const SHELL = ['./', 'index.html', 'manifest.webmanifest', ...ls('css'), ...ls('js').filter(f => f !== 'js/extras.js'), ...ls('fonts'), 'vendor/leaflet/leaflet.js', 'vendor/leaflet/leaflet.css', ...ls('vendor/leaflet/images'), ...ls('icons'),
  ...ls('thumbs').filter(f => f.endsWith('.webp')), ...siteImgs.map(id => `img/m/${id}.webp`), 'img/m/lane-braces-rock.webp', 'sites/index.html', 'works/index.html', 'shops.html', 'field-notes.html'];
const uniq = [...new Set(SHELL)].filter(f => f === './' || fs.existsSync(f));
const h = crypto.createHash('sha256'); for (const f of uniq) h.update(f).update(fs.readFileSync(f === './' ? 'index.html' : f));
const version = h.digest('hex').slice(0, 12);
fs.writeFileSync('sw.js', fs.readFileSync('tools/sw.template.js', 'utf8').replace('__VERSION__', version).replace('__SHELL__', JSON.stringify(uniq)));
const kb = uniq.reduce((n, f) => n + fs.statSync(f === './' ? 'index.html' : f).size, 0) / 1024;
console.log(`${written.length} pages, sitemap ${urls.length} urls, offline shell ${uniq.length} files ${Math.round(kb)} KB, version ${version}`);
