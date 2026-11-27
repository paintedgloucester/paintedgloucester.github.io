// Tells Bing, Yandex and the other IndexNow search engines which pages changed in a push.
// Run by the deploy workflow after the site is published:
//   node tools/indexnow.mjs <before-sha> <after-sha>
// Only pages whose files changed between the two commits are sent. The key file
// (a44ea50c6b02ca52267f9dc54747b52f.txt) at the site root proves the site is ours.
import { execFileSync } from 'node:child_process';

const HOST = 'paintedgloucester.github.io', ORIGIN = `https://${HOST}`;
const KEY = 'a44ea50c6b02ca52267f9dc54747b52f';
const [before, after = 'HEAD'] = process.argv.slice(2);

const zero = !before || /^0+$/.test(before);
const range = zero ? ['HEAD~1', after] : [before, after];
let files;
try { files = execFileSync('git', ['diff', '--name-only', ...range], { encoding: 'utf8' }).split('\n').filter(Boolean); }
catch { console.log('IndexNow: could not compare commits; nothing sent.'); process.exit(0); }

const urls = [...new Set(files
  .filter(f => /\.(html|pdf)$/.test(f) && !/^(vendor|tools|node_modules)\//.test(f))
  // not pages of the guide: the "page not found" page, Google's ownership file and the print layouts kept out of search
  .filter(f => !/^(404\.html|google[0-9a-f]+\.html|print\/.*\.html)$/.test(f))
  .map(f => `${ORIGIN}/${f.replace(/(^|\/)index\.html$/, '$1')}`))].slice(0, 10000);
for (const s of ['sitemap-pages.xml', 'sitemap.xml']) if (files.includes(s)) urls.push(`${ORIGIN}/${s}`);
if (!urls.length) { console.log('IndexNow: no pages changed; nothing sent.'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: urls })
});
console.log(`IndexNow: sent ${urls.length} URLs, response ${res.status} ${res.statusText}`);
// 200 and 202 mean accepted. Anything else is reported but does not fail the deploy.
