// Keeps each page's search description short enough to be shown whole (Bing flags descriptions over 160 characters).
// The full sentence stays in the data and in og:description; only <meta name="description"> is shortened, and only
// after translation, because the glossaries are keyed on the full English sentence. Used by build.mjs and i18n.mjs.
export const DESC_MAX = 155;
const len = s => [...s].length;
// A sentence ends at . ! ? when what follows starts a new one (a capital, a digit, an opening quote, or a letter of a
// script without capitals) or the text ends; not after one letter ("c. 1921"), an initial ("U.S.") or a short form that
// is followed by more of the same sentence ("ca. 1900", "St. Ann"). A full-width 。！？ always ends one.
const ENDS = /(?<=[\p{L}\p{N})"'’”»]{2})(?<!\b(?:St|Mt|Dr|Mr|Ms|Mrs|No|no|Ft|Pt|vs|ca|cf|ed|eds|pp|vol|fig|approx))[.!?](?=["'’”»)]?(?:\s+[\p{Lu}\p{Lo}\p{N}“"«‘(¿¡]|\s*$))|[。！？]/gu;
const CLAUSE = /[,;:](?=\s)|[，、；：]/gu;
const tidy = s => s.replace(/[\s,;:·–—-]+$/u, '');

export function fitDesc(text, max = DESC_MAX) {
  // (a description that already ends "sentence.…" loses the stray ellipsis)
  const s = String(text ?? '').replace(/\s+/g, ' ').trim().replace(/([.!?。！？])\s*…$/u, '$1');
  if (len(s) <= max) return s;
  // 1. as many whole sentences as fit
  let cut = 0; for (const m of s.matchAll(ENDS)) { let end = m.index + m[0].length; if (/["'’”»)]/.test(s[end] || '')) end++; if (len(s.slice(0, end)) > max) break; cut = end; }
  const base = s.slice(0, cut).trim();
  if (len(base) >= 110) return base;
  // 2. room to spare: add the start of the next sentence up to its last comma, colon or semicolon, and close with …
  const rest = s.slice(cut).trim(), room = max - len(base) - (base ? 1 : 0) - 1;
  const head = room >= 40 ? [...rest].slice(0, room).join('') : '';
  let stop = 0, mark = ''; for (const m of head.matchAll(CLAUSE)) { stop = m.index; mark = m[0]; }
  const piece = tidy(head.slice(0, stop));
  // a colon or semicolon is a clean place to stop; a comma only after a real clause (40 characters or more)
  if (len(piece) >= (/[:;：；]/.test(mark) ? 25 : 40) && len(base) + len(piece) >= 98) return (base ? base + ' ' : '') + piece + '…';
  // 3. otherwise the whole sentences alone, if they say enough
  if (len(base) >= 50) return base;
  // 4. one long sentence with no usable break: cut at the last word that fits
  const all = [...s].slice(0, max - 1).join('');
  return tidy(/\s/.test(all) ? all.replace(/\s+\S*$/, '') : all) + '…';
}

const dec = s => s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const enc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const META = /(<meta name="description" content=")([^"]*)(")/;
const LEAD = /<p data-desc>([\s\S]*?)<\/p>/;
// Shorten the description of a finished page. A page may mark one paragraph <p data-desc> as the source of its
// description: the description is then taken from that paragraph as it stands on the page, so a translated page
// gets a translated description (the site pages do this with "Where they stood"). The marker is removed.
export function fitMeta(html) {
  const lead = html.match(LEAD);
  const text = lead ? dec(lead[1].replace(/<sup\b[\s\S]*?<\/sup>/g, '').replace(/<[^>]+>/g, '')) : null;
  return html.replace(META, (m, a, v, z) => a + enc(fitDesc(text ?? dec(v))) + z).replace('<p data-desc>', '<p>');
}
// Put a given full description back (for the hand-written pages, before they are translated).
export const setMeta = (html, full) => html.replace(META, (m, a, v, z) => a + enc(full) + z);
