/* Home page extras: the "Who painted it?" game, the counting numbers, and the hero's jump buttons. */
(function () {
  const PG = window.PG; if (!PG) return;
  const D = PG.D, esc = PG.esc, still = window.matchMedia('(prefers-reduced-motion: reduce)');
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } } };
  const mus = w => w.mus.split(' (')[0];

  /* ---- jump buttons in the hero ---- */
  document.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', e => { const t = document.getElementById(a.dataset.jump); if (!t) return; e.preventDefault(); t.scrollIntoView({ behavior: still.matches ? 'auto' : 'smooth', block: 'center' }); const f = t.querySelector('button'); if (f) f.focus({ preventScroll: true }); }));

  /* ---- the guide in numbers ---- */
  const stats = document.getElementById('stats');
  if (stats) {
    const vals = { works: D.works.length, painters: new Set(D.works.map(w => w.by)).size, sites: D.sites.length, trails: window.PG_TRAILS ? window.PG_TRAILS.trails.length : 4 };
    const els = [...stats.querySelectorAll('b[data-n]')]; els.forEach(b => { b.textContent = vals[b.dataset.n]; });
    if (!still.matches && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(en => { if (!en.some(x => x.isIntersecting)) return; io.disconnect(); const t0 = performance.now();
        const step = now => { const u = Math.min(1, (now - t0) / 1100), e = 1 - Math.pow(1 - u, 3); els.forEach(b => { b.textContent = Math.round(vals[b.dataset.n] * e); }); if (u < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step); }, { threshold: 0.4 });
      io.observe(stats);
    }
  }

  /* ---- who painted it? ---- */
  const quiz = document.getElementById('quiz'); if (!quiz) return;
  const pool = D.works.filter(w => w.img), painters = [...new Set(D.works.map(w => w.by))];
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  let deck = [], cur = null, opts = [], picked = null, streak = 0, best = +(store.get('pg-quiz-best') || 0), seen = 0, right = 0;
  const COLORS = ['#C38F2E', '#3E86B8', '#C8325F', '#2F3C8F', '#B4733A', '#5E8C61', '#EED79E'];
  function next() { if (!deck.length) deck = shuffle(pool.slice()); cur = deck.pop(); picked = null;
    opts = shuffle([cur.by, ...shuffle(painters.filter(p => p !== cur.by)).slice(0, 3)]); draw(); }
  function draw() {
    const done = picked !== null, ok = picked === cur.by;
    quiz.innerHTML = `<div class="quiz-img"><img src="img/m/${cur.id}.webp" alt="${done ? esc(cur.by + ', ' + cur.t + ', ' + cur.d) : 'A painting of Cape Ann. Who painted it is the question.'}" decoding="async"><div class="quiz-burst" aria-hidden="true"></div></div>
      <div class="quiz-side"><p class="quiz-score"><span><b>${streak}</b> in a row</span><span>best <b>${best}</b></span>${seen ? `<span>${right} of ${seen} right</span>` : ''}</p>
      <p class="quiz-q">${done ? (ok ? 'Yes!' : 'Not this time.') : 'Who painted this view of Cape Ann?'}</p>
      <div class="quiz-opts" role="group" aria-label="Choose the painter">${opts.map(p => `<button type="button" data-p="${esc(p)}"${done ? ' disabled' : ''} class="${done && p === cur.by ? 'right' : done && p === picked ? 'wrong' : ''}">${esc(p)}</button>`).join('')}</div>
      <div class="quiz-ans" aria-live="polite">${done ? `<p><i>${esc(cur.t)}</i>, ${esc(cur.d)}<br><span>${esc(cur.by)} · ${esc(mus(cur))}</span></p><div class="quiz-acts"><button type="button" class="btn solid" data-a="next">Next painting ›</button><a href="works/${cur.id}.html">About this painting</a></div>` : '<p class="quiz-hint">Pick a name. No peeking at the caption!</p>'}</div></div>`;
  }
  function burst() { if (still.matches) return; const box = quiz.querySelector('.quiz-burst'); if (!box) return;
    for (let i = 0; i < 18; i++) { const d = document.createElement('i'), ang = Math.random() * Math.PI * 2, r = 70 + Math.random() * 130;
      d.style.cssText = `background:${COLORS[i % COLORS.length]};--dx:${(Math.cos(ang) * r).toFixed(0)}px;--dy:${(Math.sin(ang) * r).toFixed(0)}px;width:${10 + Math.random() * 14}px;height:${10 + Math.random() * 14}px;animation-delay:${(Math.random() * 90).toFixed(0)}ms`; box.appendChild(d); }
    setTimeout(() => { box.innerHTML = ''; }, 1100); }
  quiz.addEventListener('click', e => {
    const o = e.target.closest('.quiz-opts button'), n = e.target.closest('[data-a="next"]');
    if (o && picked === null) { picked = o.dataset.p; seen++; const ok = picked === cur.by; if (ok) { right++; streak++; if (streak > best) { best = streak; store.set('pg-quiz-best', String(best)); } } else streak = 0;
      draw(); if (ok) burst(); const nb = quiz.querySelector('[data-a="next"]'); if (nb && e.detail === 0) nb.focus(); }
    else if (n) { next(); const fb = quiz.querySelector('.quiz-opts button'); if (fb && e.detail === 0) fb.focus(); }
  });
  next();
})();
