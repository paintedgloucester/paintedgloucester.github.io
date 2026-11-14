"""Print brief.html to Painted-Gloucester-brief.pdf, then stamp a running footer on every page after the cover.

Needs a local server on port 8765 (python3 -m http.server 8765), Playwright with Google Chrome, pypdf, reportlab and fontTools.
Run from the repository root:  python3 tools/pdf.py
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

async def render():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
        pg = await (await b.new_context(service_workers='block')).new_page()
        # Chrome stores WebP images losslessly in a PDF, which makes the file huge; hand it JPEGs instead.
        async def as_jpeg(route):
            path = route.request.url.split('8765/')[1].split('?')[0]
            im = Image.open(path).convert('RGB'); out = io.BytesIO(); im.save(out, 'JPEG', quality=84, optimize=True, progressive=True)
            await route.fulfill(status=200, content_type='image/jpeg', body=out.getvalue())
        await pg.route('**/*.webp', as_jpeg)
        await pg.goto(URL, wait_until='networkidle')
        await pg.evaluate("document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager')")
        await pg.evaluate("Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })))")
        await pg.evaluate("document.fonts.ready")
        await pg.emulate_media(media='print')
        pdf = await pg.pdf(format='Letter', scale=0.72, print_background=True, prefer_css_page_size=True)
        await b.close()
        return pdf

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

if __name__ == '__main__':
    print(stamp(asyncio.run(render())), 'pages written to', OUT)
