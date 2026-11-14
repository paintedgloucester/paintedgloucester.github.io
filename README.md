# Painted Gloucester

A free public field guide to painting Cape Ann, Massachusetts, in the footsteps of Fitz Henry Lane, Winslow Homer, Childe Hassam, John Twachtman and the Gloucester and Rockport art colonies.

## What's on the site

- **Map & sites**: a hand-drawn chart of Cape Ann with the nine places where a painting can be tied to a standing point, the line of sight, the 1800s shoreline, and the sun at any date and hour. Drag across *Compare painting and map* to wipe between the picture and the ground.
- **On site**: *ME* shows where you are on the chart and how far you are from each vantage point. *Line it up* ghosts the painting over your phone's camera; capture it as a then-and-now postcard.
- **Painter's passport**: stamp all nine sites, in gold when your phone confirms you're on the spot.
- **The works**: 131 Cape Ann paintings in public collections, filterable by painter, collection and decade, with a zoomable viewer and a color sampler.
- **Paint it**: a color lab that turns any spot in a painting into a starting mix of tube colors, palettes in the spirit of each school, light through the day, tides, fog and wind, a packing list and painting prompts.
- **Shops & studios**: a street map of every listing, with town zoom buttons and directions, plus local art-supply shops, workshops, associations, museums, galleries and annual paint-outs, each with sources. Businesses can suggest a listing through the issue form.
- **Plan**: four painting days timed to the light.
- **The brief**: the full research brief as a web page and a PDF.

## How it's built

Plain HTML, CSS and JavaScript. One small script, `tools/build.mjs`, writes the plain pages, the sitemap and the offline worker from the data files; the deploy workflow runs it on every push, so editing a data file on github.com is enough. The only outside service is OpenStreetMap's street tiles on the Shops page and the trail maps; if they can't load, that map falls back to its own coastline. Location, photos and passport stamps never leave the visitor's browser.

```
index.html          page shell, chart SVG and all views
brief.html          the research brief
css/                fonts, explorer styles, additions
js/data.js          works, sites, notes and map data
js/explorer.js      chart, sun, viewer, works browser
js/more.js          home, shops on the chart, location, passport, camera, color lab
js/guide.js         palettes, light, conditions, kit, prompts, itineraries
js/places.js        shops, schools, galleries and events  <- most edits happen here
js/extras.js        trails, waterfront, winter, photographers, teachers, gallery entries, Portuguese and Italian text
img/, thumbs/       public-domain painting images (img/m/ and *.webp are smaller copies made by tools/images.py)
fonts/              the three typefaces, subset to the characters the site uses
works/, sites/      one plain page per painting and per site (generated; do not edit by hand)
shops.html, field-notes.html   plain list pages (generated)
trails/, waterfront.html, winter.html, photographers.html, teachers.html, gallery.html, pt/, it/   companion pages (generated from js/extras.js)
sw.js, manifest.webmanifest, icons/   offline use and Add to Home Screen
tools/              build.mjs (pages, sitemap, sw.js), extras.mjs (companion pages), images.py (image copies), linkcheck.mjs (monthly link test)
```

Run it locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The camera and location features need HTTPS or localhost.

After changing a data file, run `node tools/build.mjs` to refresh the generated pages locally. After adding a painting image to `img/`, run `python3 tools/images.py` (needs Pillow) and commit the new files.

## Offline use

A service worker (`sw.js`) keeps the guide, the thumbnails and the nine sites' paintings on the visitor's device after the first visit. The About page has a button that saves the remaining paintings. The street map tiles and museum links still need a connection.

## Adding or correcting a listing

Open an issue with the **Suggest a listing or correction** form, or edit `js/places.js`. Each place needs a `type` (`supply`, `school`, `museum` or `gallery`), an address, coordinates in `ll` (latitude, longitude), at least one public source in `src`, and a `checked` month (for example `"November 2026"`): the last time the listing was compared with its sources. Update `checked` whenever you re-verify an entry. Use `confirm` for anything visitors should check before travelling.

## Keeping listings fresh

On the first of each month the **Check listing links** workflow tests every link in `js/places.js` and lists any entry whose `checked` month is more than six months old. If anything needs attention it opens (or updates) an issue labelled `link-check`.

## License

Text and data are CC BY 4.0; code is MIT. See [LICENSE.md](LICENSE.md).

## Credits

- Painting images are public-domain releases by the holding museums, credited in the viewer.
- Coastline and historic high-water line: MassGIS and the Massachusetts Office of Coastal Zone Management.
- Sun positions: NOAA solar position equations, calculated in the browser.
- Street map on the Shops page: © OpenStreetMap contributors, via Leaflet (vendored in `vendor/leaflet`).

## Visitors' gallery

Painters send work through the [gallery form](https://github.com/paintedgloucester/paintedgloucester.github.io/issues/new?template=gallery.yml) (label `gallery`). To publish one: check the consent boxes are ticked and the photo shows no one who hasn't agreed, save a copy of the photo at about 1600 px on the long side as `img/gallery/<short-name>.jpg`, then add an entry to `gallery.entries` in `js/extras.js`:

```js
{ file: 'jane-d-fort-point.jpg', title: 'Harbor, Late Light', by: 'Jane D.', date: 'August 2026', med: 'Oil on panel, 9 × 12 in.', site: 'fort-point', alt: 'One sentence describing the painting' }
```

`site` is a site id (`fort-point`, `ten-pound`, `banner-hill`, `braces-cove`, `normans-woe`, `coffins-beach`, `eastern-point`, `annisquam`, `harbor-view`) or leave it out. Close the issue with a link to the gallery once it is live. To take a painting down, delete its entry and image.
