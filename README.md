# Painted Gloucester

A free public field guide to painting Cape Ann, Massachusetts, in the footsteps of Fitz Henry Lane, Winslow Homer, Childe Hassam, John Twachtman and the Gloucester and Rockport art colonies.

## What's on the site

- **Map & sites**: a hand-drawn chart of Cape Ann with the nine places where a painting can be tied to a standing point, the line of sight, the 1800s shoreline, and the sun at any date and hour. Drag across *Compare painting and map* to wipe between the picture and the ground.
- **On site**: *ME* shows where you are on the chart and how far you are from each vantage point. *Line it up* ghosts the painting over your phone's camera; capture it as a then-and-now postcard.
- **Painter's passport**: stamp all nine sites, in gold when your phone confirms you're on the spot.
- **The works**: 115 Cape Ann paintings in public collections, filterable by painter, collection and decade, with a zoomable viewer and a color sampler.
- **Paint it**: a color lab that turns any spot in a painting into a starting mix of tube colors, palettes in the spirit of each school, light through the day, tides, fog and wind, a packing list and painting prompts.
- **Shops & studios**: local art-supply shops, workshops, associations, museums, galleries and annual paint-outs, each with sources. Businesses can suggest a listing through the issue form.
- **Plan**: four painting days timed to the light.
- **The brief**: the full research brief as a web page and a PDF.

## How it's built

Plain HTML, CSS and JavaScript with no build step and no outside services. Location, photos and passport stamps never leave the visitor's browser.

```
index.html          page shell, chart SVG and all views
brief.html          the research brief
css/                fonts, explorer styles, additions
js/data.js          works, sites, notes and map data
js/explorer.js      chart, sun, viewer, works browser
js/more.js          home, shops on the chart, location, passport, camera, color lab
js/guide.js         palettes, light, conditions, kit, prompts, itineraries
js/places.js        shops, schools, galleries and events  <- most edits happen here
img/, thumbs/       public-domain painting images
```

Run it locally:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000. The camera and location features need HTTPS or localhost.

## Adding or correcting a listing

Open an issue with the **Suggest a listing or correction** form, or edit `js/places.js`. Each place needs a `type` (`supply`, `school`, `museum` or `gallery`), an address, coordinates in `ll` (latitude, longitude) and at least one public source in `src`. Use `confirm` for anything visitors should check before travelling.

## Credits

- Painting images are public-domain releases by the holding museums, credited in the viewer.
- Coastline and historic high-water line: MassGIS and the Massachusetts Office of Coastal Zone Management.
- Sun positions: NOAA solar position equations, calculated in the browser.
