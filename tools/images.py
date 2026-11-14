"""Make WebP copies of the painting images: 1200px 'medium' and thumbnail. Re-run after adding a JPEG to img/."""
import glob,os
from PIL import Image
os.makedirs('img/m',exist_ok=True)
tot=[0,0,0]
for f in sorted(glob.glob('img/*.jpg')):
    b=os.path.basename(f)[:-4]; im=Image.open(f).convert('RGB')
    med=f'img/m/{b}.webp'; th=f'thumbs/{b}.webp'
    if not os.path.exists(med) or os.path.getmtime(med)<os.path.getmtime(f):
        m=im.copy(); m.thumbnail((1200,1200),Image.LANCZOS); m.save(med,'WEBP',quality=80,method=6)
        t=im.copy(); t.thumbnail((520,520),Image.LANCZOS); t.save(th,'WEBP',quality=78,method=6)
    for i,p in enumerate([f,med,th]): tot[i]+=os.path.getsize(p)
print('jpeg %d KB | medium %d KB | thumbs %d KB'%tuple(x//1024 for x in tot))
