"""Print brief.html to Painted-Gloucester-brief.pdf, then stamp a running footer on every page after the cover.

Needs a local server on port 8765 (python3 -m http.server 8765), Playwright with Google Chrome, pypdf, reportlab and fontTools.
Run from the repository root:  python3 tools/pdf.py            (English, Painted-Gloucester-brief.pdf)
                               python3 tools/pdf.py fr de zh …  (each language's brief, <lang>/Painted-Gloucester-brief-<lang>.pdf)
A language PDF gets its footer drawn by Chrome, so Chinese and Korean set in the same fonts as the page.
"""
import asyncio, io, os, sys
from PIL import Image
from playwright.async_api import async_playwright
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont as RLFont
from fontTools.ttLib import TTFont

URL = 'http://127.0.0.1:8765/brief.html'
OUT = 'Painted-Gloucester-brief.pdf'

async def render(url=URL):
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await (await b.new_context(service_workers='block')).new_page()
        # Chrome stores WebP images losslessly in a PDF, which makes the file huge; hand it JPEGs instead.
        async def as_jpeg(route):
            path = route.request.url.split('8765/')[1].split('?')[0]
            im = Image.open(path).convert('RGB'); out = io.BytesIO(); im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
            await route.fulfill(status=200, content_type='image/jpeg', body=out.getvalue())
        await pg.route('**/*.webp', as_jpeg)
        await pg.route('**/gc.zgo.at/**', lambda route: route.abort())  # no visit counts from printing
        await pg.goto(url, wait_until='networkidle')
        await pg.wait_for_timeout(1500)  # language pages translate their map labels after load
        await pg.evaluate("document.querySelectorAll('.langhint').forEach(e => e.remove())")
        await pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')")
        await pg.evaluate("Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })))")
        await pg.evaluate("document.fonts.ready")
        await pg.emulate_media(media='print')
        pdf = await pg.pdf(format='Letter', scale=0.72, print_background=True, prefer_css_page_size=True)
        meta = await pg.evaluate("({ title: document.title, lang: document.documentElement.lang, kicker: (document.querySelector('.kicker') || {}).textContent || '' })")
        await b.close()
        return pdf, meta

def stamp(pdf):
    f = TTFont('fonts/inter-500.woff2'); f.flavor = None; buf = io.BytesIO(); f.save(buf); buf.seek(0)
    pdfmetrics.registerFont(RLFont('Inter', buf))
    r = PdfReader(io.BytesIO(pdf)); w = PdfWriter()
    for i, page in enumerate(r.pages):
        if i:
            W, H = float(page.mediabox.width), float(page.mediabox.height)
            o = io.BytesIO(); c = canvas.Canvas(o, pagesize=(W, H))
            c.setStrokeColorRGB(0.847, 0.816, 0.749); c.setLineWidth(0.5); c.line(43.2, 38, W - 43.2, 38)
            c.setFillColorRGB(0.373, 0.369, 0.345); c.setFont('Inter', 6.8)
            c.drawString(43.2, 26, 'PAINTED GLOUCESTER  ·  RESEARCH BRIEF  ·  NOVEMBER 2026')
            c.drawRightString(W - 43.2, 26, str(i + 1)); c.save(); o.seek(0)
            page.merge_page(PdfReader(o).pages[0])
        w.add_page(page)
    w.add_metadata({'/Title': 'Painted Gloucester: research brief', '/Author': 'Painted Gloucester', '/Subject': 'Paintings of Gloucester and Cape Ann, Massachusetts, and where they hang'})
    with open(OUT, 'wb') as fh: w.write(fh)
    return len(r.pages)

async def footers(n, W, H, text, lang):
    # one page per content page, footer on every page but the cover, printed by Chrome so any script works
    css = ("@page{size:%.2fpt %.2fpt;margin:0} body{margin:0} .p{position:relative;width:%.2fpt;height:%.2fpt;page-break-after:always;overflow:hidden}"
           ".r{position:absolute;left:43.2pt;right:43.2pt;bottom:38pt;border-top:.5pt solid #D8D0BF}"
           ".t{position:absolute;left:43.2pt;right:43.2pt;bottom:21pt;display:flex;justify-content:space-between;"
           "font:500 6.8pt Inter,'Noto Sans CJK SC','Noto Sans CJK KR',sans-serif;letter-spacing:.06em;color:#5F5E58}") % (W, H, W, H)
    esc = lambda x: x.replace('&', '&amp;').replace('<', '&lt;')
    pages = ''.join('<div class="p"></div>' if i == 0 else f'<div class="p"><div class="r"></div><div class="t"><span>{esc(text)}</span><span>{i + 1}</span></div></div>' for i in range(n))
    html = f'<!doctype html><html lang="{lang}"><head><meta charset="utf-8"><link rel="stylesheet" href="http://127.0.0.1:8765/css/fonts.css"><style>{css}</style></head><body>{pages}</body></html>'
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await b.new_page(); await pg.goto('http://127.0.0.1:8765/'); await pg.set_content(html, wait_until='networkidle'); await pg.evaluate('document.fonts.ready')
        out = await pg.pdf(width=f'{W/72:.4f}in', height=f'{H/72:.4f}in', print_background=True, prefer_css_page_size=True); await b.close(); return out

def stamp_lang(pdf, meta, out):
    r = PdfReader(io.BytesIO(pdf)); n = len(r.pages); W, H = float(r.pages[0].mediabox.width), float(r.pages[0].mediabox.height)
    parts = [x.strip() for x in meta['kicker'].split('·')]
    text = ('PAINTED GLOUCESTER  ·  ' + '  ·  '.join(parts[:2])).upper()
    f = PdfReader(io.BytesIO(asyncio.run(footers(n, W, H, text, meta['lang'])))); w = PdfWriter()
    assert len(f.pages) == n, (len(f.pages), n)
    for i, page in enumerate(r.pages):
        if i: page.merge_page(f.pages[i])
        w.add_page(page)
    w.add_metadata({'/Title': meta['title'], '/Author': 'Painted Gloucester', '/Lang': meta['lang']})
    with open(out, 'wb') as fh: w.write(fh)
    return n

if __name__ == '__main__':
    langs = sys.argv[1:]
    if not langs: print(stamp(asyncio.run(render())[0]), 'pages written to', OUT)
    for l in langs:
        out = f'{l}/Painted-Gloucester-brief-{l}.pdf'; pdf, meta = asyncio.run(render(f'http://127.0.0.1:8765/{l}/brief.html'))
        print(stamp_lang(pdf, meta, out), 'pages written to', out)
