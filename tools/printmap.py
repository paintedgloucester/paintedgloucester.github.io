"""Render print/map.html to print/Painted-Gloucester-map.pdf (letter, one page).
Needs a local server on port 8765 and Playwright with Chrome. Run from the repository root: python3 tools/printmap.py"""
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page()
        await pg.goto('http://127.0.0.1:8765/print/map.html', wait_until='networkidle')
        await pg.evaluate('document.fonts.ready')
        over = await pg.evaluate("""() => { const P = document.querySelector('.page').getBoundingClientRect(); const bad = [];
          document.querySelectorAll('.page *').forEach(e => { if (e.closest('svg') && e.tagName !== 'svg') return; const r = e.getBoundingClientRect(); if (!r.width) return;
            const box = e.closest('li') || e.closest('footer') || e.closest('header') || document.querySelector('.page'); const B = box.getBoundingClientRect();
            if (r.bottom > P.bottom + .5 || r.right > B.right + .5 || r.left < B.left - .5) bad.push(e.tagName + ':' + (e.textContent || '').slice(0, 30)); });
          const f = document.querySelector('footer').getBoundingClientRect(), b = document.querySelector('ol.b').getBoundingClientRect();
          return { bad: bad.slice(0, 8), gapAboveFooter: Math.round(f.top - b.bottom) }; }""")
        print(over)
        await pg.pdf(path='print/Painted-Gloucester-map.pdf', format='Letter', print_background=True, margin={'top': '0', 'bottom': '0', 'left': '0', 'right': '0'})
        await b.close()
asyncio.run(main())
