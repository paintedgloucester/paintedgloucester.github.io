"""One-time: pull the base64 fonts out of a stylesheet into fonts/*.woff2, subset to the characters the site uses."""
import re,base64,io,os,glob,sys
from fontTools.ttLib import TTFont
from fontTools import subset
src=sys.argv[1]
css=open(src).read()
faces=re.findall(r"@font-face\{font-family:'([^']+)';font-style:(\w+);font-weight:(\d+);src:url\(data:font/woff2;base64,([^)]+)\)[^}]*\}",css)
chars=set()
for f in ['index.html','brief.html']+glob.glob('js/*.js'):
    if 'coast' in f: continue
    chars|=set(open(f,encoding='utf-8').read())
chars|={chr(c) for c in range(0x20,0x7f)}|{chr(c) for c in range(0xa0,0x180)}|set('‘’“”–—…·•′″×÷°←→↑↓↗⤢‹›✓−½¼¾⅓⅔⅛')
chars={c for c in chars if ord(c)>=0x20}
out=[]
for fam,style,wt,b64 in faces:
    data=base64.b64decode(b64)
    name=f"{fam.lower().replace(' ','-')}-{wt}{'i' if style=='italic' else ''}.woff2"
    f=TTFont(io.BytesIO(data)); cmap=f.getBestCmap()
    missing=[c for c in chars if ord(c) not in cmap and ord(c)>0x17f]
    opt=subset.Options(); opt.flavor='woff2'; opt.layout_features=['*']; opt.notdef_outline=True
    s=subset.Subsetter(opt); s.populate(unicodes=[ord(c) for c in chars]); s.subset(f)
    subset.save_font(f,'fonts/'+name,opt)
    print(name,len(data),'->',os.path.getsize('fonts/'+name),'not in font:',''.join(sorted(missing)))
    out.append(f"@font-face{{font-family:'{fam}';font-style:{style};font-weight:{wt};font-display:swap;src:url(../fonts/{name}) format('woff2')}}")
open('css/fonts.css','w').write('\n'.join(out)+'\n')
