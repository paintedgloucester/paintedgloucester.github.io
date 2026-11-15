/* Painted Gloucester: language menu behaviour, and a one-line offer of the same page in the reader's own language.
   Nothing redirects on its own: search engines and readers always get the page they asked for. */
(function () {
  var KEY = 'pg-lang-choice', store = { get: function () { try { return localStorage.getItem(KEY); } catch (e) { return null; } }, set: function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} } };
  var base = function (c) { return (c || '').toLowerCase().split('-')[0]; };
  var page = base(document.documentElement.lang) || 'en';
  // the menu: close when tapping elsewhere or pressing Escape; remember a choice
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[data-lang]'); if (a) store.set(a.getAttribute('data-lang'));
    document.querySelectorAll('.langs details[open]').forEach(function (d) { if (!d.contains(e.target)) d.removeAttribute('open'); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') document.querySelectorAll('.langs details[open]').forEach(function (d) { d.removeAttribute('open'); d.querySelector('summary').focus(); }); });
  // the offer
  var TEXT = {
    en: ['This page is also in English.', 'Read in English', 'No thanks'],
    es: ['Esta página también está en español.', 'Leer en español', 'No, gracias'],
    fr: ['Cette page existe aussi en français.', 'Lire en français', 'Non merci'],
    de: ['Diese Seite gibt es auch auf Deutsch.', 'Auf Deutsch lesen', 'Nein, danke'],
    it: ['Questa pagina è disponibile anche in italiano.', 'Leggi in italiano', 'No, grazie'],
    pt: ['Esta página também existe em português.', 'Ler em português', 'Não, obrigado'],
    nl: ['Deze pagina is ook in het Nederlands.', 'Lees in het Nederlands', 'Nee, bedankt'],
    fi: ['Tämä sivu on saatavilla myös suomeksi.', 'Lue suomeksi', 'Ei kiitos'],
    zh: ['本页面也有中文版本。', '阅读中文版', '不用了'],
    ko: ['이 페이지는 한국어로도 볼 수 있습니다.', '한국어로 보기', '괜찮습니다']
  };
  if (store.get()) return;
  var alt = {}; document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (l) { var c = l.getAttribute('hreflang'); if (c !== 'x-default') alt[base(c)] = l.href; });
  var want = null, langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
  for (var i = 0; i < langs.length; i++) { var c = base(langs[i]); if (c === page) return; if (alt[c] && TEXT[c]) { want = c; break; } }
  if (!want) return;
  var t = TEXT[want], bar = document.createElement('div');
  bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', t[0]); bar.setAttribute('lang', want); bar.setAttribute('translate', 'no');
  bar.style.cssText = 'position:fixed;left:12px;right:12px;bottom:12px;z-index:5000;max-width:560px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;padding:12px 14px;background:#1F3A52;color:#F3EDE1;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.3);font:15px/1.35 Inter,system-ui,sans-serif';
  var msg = document.createElement('span'); msg.textContent = t[0]; msg.style.cssText = 'flex:1 1 220px';
  var go = document.createElement('a'); go.textContent = t[1]; go.href = alt[want] + (location.hash || ''); go.setAttribute('hreflang', want);
  go.style.cssText = 'display:inline-flex;align-items:center;min-height:44px;padding:0 16px;border-radius:8px;background:#D9B07A;color:#1F3A52;font-weight:600;text-decoration:none;border:0';
  var no = document.createElement('button'); no.type = 'button'; no.textContent = t[2];
  no.style.cssText = 'min-height:44px;padding:0 12px;border:1px solid rgba(243,237,225,.5);border-radius:8px;background:transparent;color:#F3EDE1;font:inherit;cursor:pointer';
  go.addEventListener('click', function () { store.set(want); });
  no.addEventListener('click', function () { store.set(page); bar.remove(); });
  bar.appendChild(msg); bar.appendChild(go); bar.appendChild(no); document.body.appendChild(bar);
})();
