// Field-guide content. Pigment lists are practical modern suggestions, not historical claims.
window.PG_GUIDE = {
  palettes: [
    {
      id: "luminist", name: "Luminist calm", who: "In the spirit of Fitz Henry Lane", medium: "Oil",
      mood: "Glassy water, an apricot haze low in the sky, rocks and hulls nearly in silhouette.",
      pig: [["Titanium white","#F4F2EC"],["Naples yellow","#EED79E"],["Cadmium yellow light","#F4CF2A"],["Yellow ochre","#C38F2E"],["Raw sienna","#B4733A"],["Burnt sienna","#8A3F22"],["Permanent rose","#C8325F"],["Ultramarine blue","#2F3C8F"],["Cerulean blue","#3E86B8"],["Raw umber","#6B5537"]],
      tips: [
        "Lay the sky first in one sitting: warm and light at the horizon, cooler and a little darker toward the top. Blend until no brushmark shows.",
        "Paint reflections with vertical strokes, a shade darker than the sky they mirror. A single horizontal wipe makes the water lie flat.",
        "Keep the darkest values for the near shore and boat hulls. Everything past the middle distance stays close to the sky's value.",
        "Lane worked from careful pencil studies. A quick, accurate line drawing of the shore is time well spent."
      ],
      sites: ["fort-point","braces-cove","normans-woe","coffins-beach"]
    },
    {
      id: "homer-wc", name: "Harbor watercolor", who: "In the spirit of Winslow Homer, 1873 & 1880", medium: "Watercolor",
      mood: "Fast transparent washes, white paper left for sails and glints, a few bold opaque accents.",
      pig: [["Aureolin","#EDD43A"],["New gamboge","#E9A21A"],["Burnt sienna","#8A3F22"],["Quinacridone rose","#C23A68"],["Cobalt blue","#1F4FA0"],["Ultramarine blue","#2F3C8F"],["Prussian blue","#1D3346"],["Sepia","#5C4632"],["Chinese white (gouache)","#F2F0EA"]],
      tips: [
        "Wet the sky and drop color in, then leave it. Lifting with a damp brush or tissue gives you clouds and moonlight.",
        "Reserve the white of the paper for sails, gulls and sparkle. Masking fluid is a modern shortcut; Homer mostly painted around them.",
        "The MFA describes his 1880 method: let paint soak into the paper, blot it out, then add thick opaque dashes. Try it on a test sheet first.",
        "Sit low on the shore so the horizon falls in the upper third and the boys, dories and pots read against the water."
      ],
      sites: ["ten-pound","fort-point"]
    },
    {
      id: "impressionist", name: "High-key Impressionist", who: "In the spirit of Childe Hassam and Willard Metcalf", medium: "Oil",
      mood: "Broken color, bright mid-morning light, shadows painted in blues and violets instead of black.",
      pig: [["Titanium white","#F4F2EC"],["Cadmium lemon","#F3E33C"],["Cadmium yellow","#F2B51F"],["Cadmium orange","#EE7A1F"],["Cadmium red light","#D6362A"],["Permanent rose","#C8325F"],["Cobalt violet","#8E4E8F"],["Ultramarine blue","#2F3C8F"],["Cerulean blue","#3E86B8"],["Viridian","#2F7A63"]],
      tips: [
        "Leave black off the palette. Mix shadow color from ultramarine, rose and a touch of the local color.",
        "Set dabs of pure color side by side and let them mix in the eye, especially on water and foliage.",
        "Mid-morning side light, around 9 to 10 a.m. in summer, gives the strong color and modeling these painters favored on Banner Hill.",
        "Work on a mid-value warm ground so the bright notes sing and the gaps don't read as glaring white."
      ],
      sites: ["banner-hill","eastern-point"]
    },
    {
      id: "tonal", name: "Tonal harbor", who: "In the spirit of John Twachtman", medium: "Oil",
      mood: "Close, chalky values and a muted, limited palette. Atmosphere over detail.",
      pig: [["Titanium white","#F4F2EC"],["Yellow ochre","#C38F2E"],["Raw sienna","#B4733A"],["Ultramarine blue","#2F3C8F"],["Viridian","#2F7A63"],["Ivory black (sparingly)","#2A2A2A"]],
      tips: [
        "Mix three or four piles of value before you start and paint only from them.",
        "Thin paint, scrubbed and scumbled, keeps the surface dry and matte like pastel.",
        "Overcast days and late-afternoon haze suit this palette. Leave the sunny postcard view for another day.",
        "Squint constantly. If two shapes are the same value, paint them the same value."
      ],
      sites: ["harbor-view","annisquam"]
    },
    {
      id: "mosaic", name: "Mosaic of color", who: "In the spirit of Maurice Prendergast", medium: "Watercolor & gouache",
      mood: "Crowds, umbrellas and boats turned into flat, jewel-like dabs of color.",
      pig: [["Lemon yellow","#F3E33C"],["Vermilion hue","#E0482B"],["Permanent rose","#C8325F"],["Cobalt turquoise","#1E9AA3"],["Ultramarine blue","#2F3C8F"],["Sap green","#4E7A2A"],["Permanent white gouache","#F2F0EA"]],
      tips: [
        "Draw in color, not pencil: outline figures with a fine brush, then fill them in flat.",
        "Repeat each color three or four times around the sheet to knit the picture together.",
        "Busy beaches and harbor days, such as Good Harbor Beach or the Fiesta waterfront, give plenty of subjects."
      ],
      sites: ["fort-point","banner-hill"]
    },
    {
      id: "modern", name: "Hard light, plain shapes", who: "In the spirit of Edward Hopper and Stuart Davis", medium: "Oil or watercolor",
      mood: "Clapboard houses, strong cast shadows, simplified shapes and flat color.",
      pig: [["Titanium white","#F4F2EC"],["Cadmium yellow","#F2B51F"],["Cadmium red","#C42B24"],["Yellow ochre","#C38F2E"],["Burnt sienna","#8A3F22"],["Ultramarine blue","#2F3C8F"],["Cerulean blue","#3E86B8"],["Payne's gray","#3A4652"]],
      tips: [
        "Design the shadows first. Morning or late-afternoon sun throws long shadow shapes across the houses of East Gloucester and Rocky Neck.",
        "Simplify: one value for the sunlit wall, one for the shadow side, one for the sky.",
        "Paint buildings from public sidewalks. Don't set up in front of someone's door or driveway."
      ],
      sites: ["harbor-view","banner-hill"]
    }
  ],
  tod: [
    { name:"Blue hour", when:"About 30 minutes before sunrise or after sunset", c:"linear-gradient(90deg,#2C3E6B,#7E8DB8)", text:"Cool, shadowless light and quiet water. Lay in the big shapes quickly; the light changes minute by minute." },
    { name:"Sunrise on the back shore", when:"Rockport, Brace's Cove, Good Harbor", c:"linear-gradient(90deg,#F2B77A,#F6DDB0)", text:"The Atlantic side of Cape Ann faces east. Low sun rakes across the granite and backlights the surf." },
    { name:"Mid-morning", when:"About 9 to 11 a.m.", c:"linear-gradient(90deg,#F6E7B5,#DCE6EC)", text:"Clear side light and full color. Banner Hill looking over Smith Cove works well now, as it did for Metcalf and Hassam." },
    { name:"Midday", when:"About 11 a.m. to 2 p.m. in summer", c:"linear-gradient(90deg,#F4F2EC,#CFDDE6)", text:"Flat, overhead light with small shadows. A good time for museum visits, drawing, or painting under an umbrella in the shade." },
    { name:"Lane's hour", when:"About two hours before sunset", c:"linear-gradient(90deg,#F0C98E,#E7A86A)", text:"Warm haze over the harbor, still water, long reflections. The Lane catalogue calls the light of Ten Pound Island the hazy light of a late summer afternoon." },
    { name:"Sunset and afterglow", when:"Sunset to 30 minutes after", c:"linear-gradient(90deg,#E58A62,#8E4E8F)", text:"From Rocky Neck and Ten Pound Island the sun goes down behind the western shore of the harbor. Homer painted a series of these sunsets in 1880." },
    { name:"Sea fog", when:"Most common on calm late-spring and early-summer mornings", c:"linear-gradient(90deg,#C9CDCE,#E9EAE6)", text:"Fog flattens values and swallows distance. Lane's Ship in Fog shows it burning off in stages. Paint the near shapes dark and let everything else dissolve." },
    { name:"Moonlight", when:"Clear nights near the full moon", c:"linear-gradient(90deg,#1D2B44,#4A5F82)", text:"Homer's Eastern Point Light is a moonlit night. Work small, with a headlamp on a red setting, and judge colors the next morning." }
  ],
  cond: [
    { name:"Tides change the picture", text:"Gloucester's mean tidal range is about 8.8 feet. Ledges, weed lines and mudflats appear and vanish within an hour or two, so check the tide table and choose your tide the way you choose your light.", link:["NOAA station 8441841, Gloucester","https://tidesandcurrents.noaa.gov/stationhome.html?id=8441841"] },
    { name:"Wind off the water", text:"Afternoon sea breezes are common in summer. Weight your easel, clip down paper and canvas, and keep a brick-sized stone or a hook for your bag." },
    { name:"Granite is slippery", text:"Wet, weedy rock at Brace's Cove, Eastern Point and Halibut Point is treacherous. Set up above the high-water line and never turn your back on the surf." },
    { name:"Seasons", text:"Summer brings haze and crowds. September and October bring clear air, lower sun and fewer people; Cape Ann Plein Air takes place in early October. Winter light is low and golden all day, with the sun setting far to the southwest." },
    { name:"Who owns the shore", text:"In Massachusetts much of the shore between high and low water is privately owned, and the public right there is limited to fishing, fowling and navigation. Paint from public ways, beaches and parks, or ask permission." },
    { name:"Parking", text:"Beach lots charge seasonal fees and fill early on summer weekends. Rocky Neck and Bearskin Neck have little parking; walk or use the Cape Ann Transportation Authority buses." }
  ],
  kit: [
    { g:"Painting", items:["Pochade box or lightweight easel","Panels or watercolor block (two more than you think)","Palette, knife and brushes","Paint: your palette plus extra white","Odorless solvent in a sealed jar, or water containers","Paper towels and a trash bag for rags"] },
    { g:"Comfort", items:["Wide-brimmed hat and sunscreen","Layers and a windbreaker, even in August","Folding stool","Water and a snack","Insect repellent for marshes and dusk"] },
    { g:"On the shore", items:["Tide table for the day","Shoes with grip for wet granite","Umbrella or shade for your palette","Clips or bungees for windy days","Wet-panel carrier for the ride home"] }
  ],
  manners: [
    "Carry out every rag, solvent drop and paper towel. Never rinse brushes in tide pools or the harbor.",
    "Keep sidewalks, causeways and wharf edges clear. On Rocky Neck and Bearskin Neck, set up where people can walk past.",
    "Ask before painting on private wharves or lawns, and honor 'No Trespassing' signs.",
    "Buy your paint, panels and frames from Cape Ann shops when you can. They keep the art community here.",
    "If people ask what you're painting, tell them. Plein-air painters have been Gloucester's ambassadors since the 1850s."
  ],
  prompts: {
    a: ["a four-color palette","a palette knife only","one hour, start to finish","a 6 × 8 inch panel","three values only","no green at all","a palette of earth colors","a brush wider than you'd like"],
    s: ["Ten Pound Island from the Rocky Neck public way","the harbor mouth from Fort Point","the rocks at Brace's Cove","Motif No. 1 from the T-Wharf","Smith Cove from Banner Hill","Annisquam Light from Wingaersheek Beach","Eastern Point Light from the breakwater","Norman's Woe from the western shore"],
    t: ["at sunrise","two hours before sunset","in morning fog","at low tide","at high tide","on an overcast afternoon","at the afterglow","in the first ten minutes of rain"]
  },
  days: [
    {
      name:"Lane's harbor", img:"lane-ten-pound-cam", sum:"Downtown Gloucester: see Lane's canvases, stock up, then paint the harbor in the light he loved.",
      steps:[
        ["10:00 a.m.","Cape Ann Museum","See Ten Pound Island and The Western Shore with Norman's Woe in the Lane galleries.","place:cape-ann-museum"],
        ["12:00 p.m.","Island Art & Hobby","Pick up panels and paint on Main Street. Local Colors gallery is next door.","place:island-art-hobby"],
        ["Afternoon","Fort Point","Look south-southwest to Ten Pound Island and Eastern Point. Shore access on Fort Point itself is unconfirmed.","site:fort-point"],
        ["2 h before sunset","Rocky Neck public way","Paint Ten Pound Island and the western shore as the haze turns apricot.","site:ten-pound"]
      ]
    },
    {
      name:"Eastern Point and the colony", img:"metcalf-gloucester-harbor", sum:"East Gloucester: Impressionist morning light, the galleries of Rocky Neck, and Lane's rocks at dusk.",
      steps:[
        ["9:00 a.m.","Banner Hill","Mid-morning over Smith Cove, as in Metcalf's Gloucester Harbor. The exact spot is approximate.","site:banner-hill"],
        ["11:30 a.m.","Rocky Neck Art Colony","Walk the studios and galleries; check the Cultural Center for workshops.","place:rocky-neck"],
        ["1:30 p.m.","North Shore Arts Association","Exhibitions in the barn on Pirates Lane.","place:north-shore-arts"],
        ["Late afternoon","Brace's Cove","Lane's Brace's Rock, two hours before sunset. Mind the tide and the wet rock.","site:braces-cove"]
      ]
    },
    {
      name:"Rockport", img:"twachtman-fishing-boats", sum:"Rockport's harbor, Motif No. 1 and the town's art association, with the Rusty and Ingrid screen-print studio on Dock Square.",
      steps:[
        ["Sunrise","T-Wharf and Motif No. 1","The inner harbor at first light, before the crowds.","event:Motif No. 1 Day paint-out"],
        ["10:30 a.m.","Rusty and Ingrid Screen Prints","Watch Cape Ann screen prints being made at the studio on Dock Square.","place:rusty-ingrid"],
        ["1:00 p.m.","Rockport Art Association & Museum","Exhibitions and the Cape Ann Summer School of Art workshop schedule.","place:rockport-art-assn"],
        ["Afternoon","Bearskin Neck","Paint the harbor and the granite breakwater from the end of the Neck.",""]
      ]
    },
    {
      name:"West Gloucester and Annisquam", img:"lane-coffins-beach", sum:"Ipswich Bay: Lane's beach at dawn and Annisquam Light in morning sun.",
      steps:[
        ["Sunrise","The Loaf, Coffin's Beach","Lane's View of Coffin's Beach was drawn from the Two Penny Loaf. Check beach access and parking rules.","site:coffins-beach"],
        ["9:00 a.m.","Wingaersheek Beach","Annisquam Light across the river mouth. This is a modern viewpoint, suggested by us.","site:annisquam"],
        ["Afternoon","Back to town","Lunch downtown and a visit to Cape Ann Art Haven if you have young painters with you.","place:art-haven"]
      ]
    }
  ]
};
