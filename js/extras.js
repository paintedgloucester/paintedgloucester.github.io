/* Painted Gloucester — trails, seasons, the working waterfront, photographers, teachers and translations.
   Read by tools/build.mjs, which turns each [[key]] into a numbered note with a full link.
   Coordinates: OpenStreetMap / Nominatim, checked November 2026, unless a stop says otherwise. */
window.PG_EXTRAS = {
checked: 'November 2026',

/* sources: key -> [label, full URL] */
src: {
  "cam_avery": ["Cape Ann Museum, “Milton Avery (1885–1965),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/milton-avery-18851965"],
  "cam_davis": ["Cape Ann Museum, “Stuart Davis (1892–1964),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/stuart-davis-18921964"],
  "cam_duveneck": ["Cape Ann Museum, “Frank Duveneck (1848–1919),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/frank-duveneck-18481919"],
  "cam_gruppe": ["Cape Ann Museum, “Emile A. Gruppé (1896–1978),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/emile-a.-gruppe-18961978"],
  "cam_hartley": ["Cape Ann Museum, “Marsden Hartley (1877–1943),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/marsden-hartley-18771943"],
  "cam_homer": ["Cape Ann Museum, “Winslow Homer,” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/winslow-homer-18351910"],
  "cam_hopper": ["Cape Ann Museum, “Edward Hopper (1882–1967),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/edward-hopper-18821967"],
  "cam_hunt": ["Cape Ann Museum, “William Morris Hunt (1824–1879),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/william-morris-hunt-18241879"],
  "cam_kroll": ["Cape Ann Museum, “Leon Kroll (1884–1974),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/leon-kroll-18841974"],
  "cam_lane": ["Cape Ann Museum, “Fitz Henry Lane (1804–1865),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/fitz-henry-lane-18041865"],
  "cam_mellen": ["Cape Ann Museum, “Mary Blood Mellen (1819–1886),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/mary-blood-mellen-18191886"],
  "cam_meyerowitz": ["Cape Ann Museum, “William Meyerowitz (1887–1981),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/william-meyerowitz-18871981"],
  "cam_prendergast": ["Cape Ann Museum, “Maurice Prendergast,” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/maurice-prendergast-18591924"],
  "cam_sloan": ["Cape Ann Museum, “John Sloan (1871–1951),” artists in the collection", "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/john-sloan-18711951"],
  "antiques": ["“The Flowering of American Impressionism in Gloucester,” The Magazine Antiques", "https://www.themagazineantiques.com/?p=29411"],
  "jht_201": ["John Henry Twachtman Catalogue Raisonné, entry 201, Harbor View Hotel", "https://www.jhtwachtman.org/catalogue/entry.php?id=201"],
  "pafa_box": ["Pennsylvania Academy of the Fine Arts, Charles Demuth, Box of Tricks, 1984.8", "https://pafa.org/museum/collection/item/box-tricks"],
  "risd_demuth": ["RISD Museum, Charles Demuth, Gloucester, 39.098", "https://risdmuseum.org/art-design/collection/gloucester-39098"],
  "moma_friedlander": ["Museum of Modern Art, Lee Friedlander, Gloucester, Massachusetts, 1981, 274.1995", "https://www.moma.org/collection/works/49854"],

  "cr_283": ["Mark Rothko: Works on Paper (National Gallery of Art), [Figures playing handball on the beach], 1986.56.538.a", "https://rothko.nga.gov/Detail/objects/283"],
  "cr_284": ["Mark Rothko: Works on Paper (National Gallery of Art), [Schooner at wharf], 1986.56.538.b", "https://rothko.nga.gov/Detail/objects/284"],
  "cr_314": ["Mark Rothko: Works on Paper (National Gallery of Art), [Figures with gill-net reels], 1986.43.206.b", "https://rothko.nga.gov/Detail/objects/314"],
  "cr_918": ["Mark Rothko: Works on Paper (National Gallery of Art), [Studies of bridge, bathers, standing woman], 1986.56.84", "https://rothko.nga.gov/Detail/objects/918"],
  "cr_4098": ["Mark Rothko: Works on Paper (National Gallery of Art), The Bathers, 1986.43.198", "https://rothko.nga.gov/Detail/objects/4098"],
  "cr_search": ["Mark Rothko: Works on Paper (National Gallery of Art), search results for “Gloucester” (38 works)", "https://rothko.nga.gov/MultiSearch/Index?search=Gloucester"],

  "rnat": [
   "Rocky Neck Art Colony, “Rocky Neck Historic Art Trail”",
   "https://rockyneckartcolony.org/historic-art-trail"
  ],
  "rnat_pdf": [
   "Rocky Neck Art Colony, Rocky Neck Historic Art Trail site sheets (Gloucester HarborWalk copy)",
   "https://harborwalk.gloucester-ma.gov/wp-content/uploads/2023/02/rockyneck.pdf"
  ],
  "rnat_walter": [
   "Rocky Neck Art Colony, “7. Martha Walter Studio”",
   "https://www.rockyneckartcolony.org/program-events/art-trail/7-martha-walter-studio"
  ],
  "rnat_hopper": [
   "Rocky Neck Historic Art Trail, “Edward Hopper’s Mansard Roof House”",
   "https://trail.rockyneckartcolony.org/index.php/edward-hoppers-mansard-roof-house"
  ],
  "rnat_avery": [
   "Rocky Neck Historic Art Trail, “Studios of Leonard Craske and Milton Avery”",
   "https://trail.rockyneckartcolony.org/index.php/studios-of-leonard-craske-and-milton-avery"
  ],
  "women2024": [
   "Berkshire Fine Arts, review of “Women Artists on Cape Ann: 1870–1970,” Cape Ann Museum, July 13–September 29, 2024",
   "https://berkshirefinearts.com/08-30-2024_women-artists-on-cape-ann-1870-1970.htm"
  ],
  "cam_beaux": [
   "Cape Ann Museum, “Cecilia Beaux (1855–1942),” artists in the collection",
   "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/cecilia-beaux-18551942"
  ],
  "beaux_talk": [
   "Cape Ann Chamber of Commerce, “CAMTalk: Cecilia Beaux’s Green Alley Days” (Cape Ann Museum, 2024)",
   "https://business.capeannchamber.com/events/details/camtalk-exhibition-series-cecilia-beaux-s-green-alley-days-32437"
  ],
  "fhl_home": [
   "Fitz Henry Lane Online (Cape Ann Museum), home page: Mary Blood Mellen, Field Beach, Stage Fort Park",
   "https://www.fitzhenrylaneonline.org/homepage.php"
  ],
  "wiki_mellen": [
   "Wikipedia, “Mary Blood Mellen”",
   "https://en.wikipedia.org/wiki/Mary_Blood_Mellen"
  ],
  "bowdoin_mellen": [
   "Bowdoin College Museum of Art, Mary Blood Mellen, Gloucester Harbor, 1971.42",
   "https://artmuseum.bowdoin.edu/Obj7699"
  ],
  "cam_bernstein": [
   "Cape Ann Museum, “Theresa Bernstein (1890–2002),” artists in the collection",
   "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/theresa-bernstein-18902002"
  ],
  "brooklyn_bernstein": [
   "Brooklyn Museum, Theresa F. Bernstein, Rabbits, Good Harbor Beach, Gloucester, 2019.44.6",
   "https://www.brooklynmuseum.org/objects/224463"
  ],
  "cam_blaine": [
   "Cape Ann Museum, “Nell Blaine (1922–1996),” artists in the collection",
   "https://capeannmuseum.quartexcollections.com/resources/artists-in-the-collection-of-the-cape-ann-museuma-partial-list/nell-blaine-19221996"
  ],
  "whitney_blaine": [
   "Whitney Museum of American Art, Nell Blaine, Harbor and Green Cloth, II, 58.48",
   "https://whitney.org/collection/works/1946"
  ],
  "cook_blaine": [
   "Greg Cook, “Nell Blaine,” The Wonderland, April 23, 2026",
   "https://gregcookland.com/wonderland/2026/04/23/nell-blaine/"
  ],
  "peterson": [
   "Hirschl & Adler Galleries, Jane Peterson, Fishermen’s Huts, Gloucester (biographical note)",
   "https://hirschlandadler.com/galleries-inventory/jane-peterson-1876-196514"
  ],
  "risd_peterson": [
   "RISD Museum, Jane Peterson, Gloucester Street Scene, 72.007",
   "https://risdmuseum.org/art-design/collection/gloucester-street-scene-72007"
  ],
  "artsfuse": [
   "Charles Giuliano, “In Gloucester, Edward Hopper Became Hopper,” The Arts Fuse, 2023",
   "https://artsfuse.org/277946/"
  ],
  "ryan": [
   "Catherine Ryan, “Edward Hopper All Around Gloucester,” online catalogue",
   "https://sites.google.com/view/catherineryanartimagedesign/edward-hopper-all-around-gloucester"
  ],
  "fc_aid": [
   "Cape Ann Museum Library & Archives, Folly Cove Designers Collection finding aid",
   "https://capeannmuseum.quartexcollections.com/resources/finding-aids/folly-cove-designers-collection-finding-aid"
  ],
  "fc_neh": [
   "National Endowment for the Humanities, “In Mid-Twentieth Century, Folly Cove Artisans Reunited Designers and Craft,” Humanities, May/June 2015",
   "https://www.neh.gov/humanities/2015/mayjune/curio/in-mid-twentieth-century-folly-cove-artisans-reunited-designers-and-cr"
  ],
  "fc_wiki": [
   "Wikipedia, “Folly Cove Designers”",
   "https://en.wikipedia.org/wiki/Folly_Cove_Designers"
  ],
  "haskell": [
   "Good Morning Gloucester (Catherine Ryan), “Hopper fans take note: Haskell’s House, 316 Main Street”",
   "https://goodmorninggloucester.com/tag/l-b-haskell-and-sons/"
  ],
  "aic_hopper": [
   "Art Institute of Chicago, Edward Hopper archive, “Gloucester”",
   "https://archive.artic.edu/hopper/gloucester"
  ],
  "cam_hoppertour": [
   "Cape Ann Chamber of Commerce listing, “Walking Tour: Hopper’s Houses Downtown” (Cape Ann Museum)",
   "https://business.capeannchamber.com/events/details/walking-tour-hopper-s-houses-downtown-35943"
  ],
  "nga_rothko": [
   "National Gallery of Art, Mark Rothko, Untitled (wharf, Gloucester, Massachusetts), 1986.56.531",
   "https://www.nga.gov/collection/art-object-page.69133.html"
  ],
  "cr_2238": [
   "Mark Rothko: Works on Paper (National Gallery of Art), [Wharf, Gloucester, Massachusetts], 1986.56.531",
   "https://rothko.nga.gov/Detail/objects/2238"
  ],
  "cr_2486": ["Mark Rothko: Works on Paper (National Gallery of Art), [Wharf, Gloucester, Massachusetts], Cape Ann Museum 2026.022.001", "https://rothko.nga.gov/Detail/objects/2486"],
  "wbur_gift": [
   "WBUR, “Cape Ann Museum gifted Rothko painting that depicts Gloucester,” August 24, 2026",
   "https://www.wbur.org/news/2026/08/24/cape-ann-museum-rothko-donation-gloucester"
  ],
  "wbur_trio": [
   "WBUR, “Cape Ann summers inspired lifelong bromance between painters Rothko, Avery and Gottlieb,” June 30, 2026",
   "https://www.wbur.org/news/2026/06/30/cape-ann-museum-rothko-avery-gottlieb"
  ],
  "phillips": [
   "The Phillips Collection, “The Phillips Collection Announces 2026–27 Exhibition Schedule”",
   "https://www.phillipscollection.org/press/phillips-collection-announces-2026-27-exhibition-schedule"
  ],
  "siskind": [
   "Greg Cook, “A New Way of Looking: Aaron Siskind in Gloucester,” 2004",
   "https://gregcookland.com/siskind.html"
  ],
  "nga_avery43": [
   "National Gallery of Art, Milton Avery, Avery Sketchbook (Mother Ann Cottage, Eastern Point, Gloucester, Mass.), c. 1943, associated works",
   "https://www.nga.gov/artworks/85547-beach/associated-artworks"
  ],
  "vassar_avery": [
   "Frances Lehman Loeb Art Center, Vassar College, Milton Avery, Gloucester Dawn, 2000.37.1",
   "https://emuseum.vassar.edu/objects/11380/gloucester-dawn"
  ],
  "fhl_flakes": [
   "Fitz Henry Lane Online (Cape Ann Museum), “Drying fish” and fish flakes, entry 271",
   "https://fitzhenrylaneonline.org/catalog/entry.php?id=271"
  ],
  "fhl_gill": [
   "Fitz Henry Lane Online (Cape Ann Museum), gill netting, entry 198",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=198"
  ],
  "hmdb_salt": [
   "Historical Marker Database, “Salting Fish,” Gloucester HarborWalk marker 6",
   "https://www.hmdb.org/m.asp?m=115459"
  ],
  "wiki_memorial": [
   "Wikipedia, “Gloucester Fisherman’s Memorial”",
   "https://en.wikipedia.org/wiki/Gloucester_Fisherman%27s_Memorial"
  ],
  "hmdb_memorial": [
   "Historical Marker Database, “Gloucester Fishermen’s Memorial”",
   "https://www.hmdb.org/m.asp?m=156491"
  ],
  "parks": [
   "The Gordon Parks Foundation, “Gloucester Fisherman and Fulton Fish Market, 1943”",
   "https://www.gordonparksfoundation.org/gordon-parks/photography-archive/gloucester-fisherman-and-fulton-fish-market-1943/gordon-parks"
  ],
  "nypl_rothstein": [
   "New York Public Library Digital Collections, Arthur Rothstein, “Fishing boats. Gloucester, Massachusetts,” October 1937",
   "https://digitalcollections.nypl.org/items/5f2ab5f0-45d8-0138-bef1-45a6d0136898"
  ],
  "moma_siskind": [
   "Museum of Modern Art, Aaron Siskind, Gloucester, 1944, 227.1979",
   "https://www.moma.org/collection/works/49141"
  ],
  "brooklyn_siskind": [
   "Brooklyn Museum, Aaron Siskind, Gloucester 16A, 1944, 1999.127.9",
   "https://opencollection.brooklynmuseum.org/objects/160807"
  ],
  "high_siskind": [
   "High Museum of Art, Aaron Siskind, Gloucester 16, 1944, 1977.75",
   "https://high.org/collection/gloucester-16/"
  ],
  "risd_siskind": [
   "RISD Museum, Aaron Siskind, Gloucester, 1944, 73.003",
   "https://risdmuseum.org/art-design/collection/gloucester-73003"
  ],
  "whitney_chiarenza": [
   "Whitney Museum of American Art, Carl Chiarenza, Gloucester Window, Sailing Ship, 1962, 2016.21",
   "https://whitney.org/collection/works/47976"
  ],
  "whitney_siskind": [
   "Whitney Museum of American Art, Aaron Siskind, Gloucester, 1944, 2003.313",
   "https://whitney.org/collection/works/19941"
  ],
  "seasmoke": [
   "Catherine Schmitt, “Cold Enough Yet? The Science behind Sea Smoke,” Maine Sea Grant (Maine Boats, Homes & Harbors, Winter 2015)",
   "https://seagrant.umaine.edu/resource/cold-enough-yet-the-science-behind-sea-smoke"
  ],
  "vose_hibbard": [
   "Vose Galleries, “Aldro T. Hibbard (1886–1972)”",
   "https://vosegalleries.com/artist/aldro-t-hibbard/"
  ],
  "wiki_hibbard": [
   "Wikipedia, “Aldro Hibbard”",
   "https://en.wikipedia.org/wiki/Aldro_Hibbard"
  ],
  "saam_hibbard": [
   "Smithsonian American Art Museum, Aldro T. Hibbard, Rockport Winter, 1969.122",
   "https://dashboard.si.edu/object/rockport-winter:saam_1969.122"
  ],
  "fhl_ice": [
   "Fitz Henry Lane Online (Cape Ann Museum), catalogue",
   "https://www.fitzhenrylaneonline.org/"
  ],
  "dese": [
   "Massachusetts Department of Elementary and Secondary Education, Massachusetts Curriculum Framework for Arts (2019)",
   "https://carver.org/wp-content/uploads/2024/12/Arts-Curriculum-Framwork-2019-08.pdf"
  ],
  "cp_34": [
   "Massachusetts Visual Arts Standards, Grades 3–4 (2019 Framework), standards listing",
   "https://www.commonplanner.com/standards/massachusetts-006fdb4d/arts/visual-arts-grades-3-4-a5796362"
  ],
  "cp_78": [
   "Massachusetts Visual Arts Standards, Grades 7–8 (2019 Framework), standards listing",
   "https://www.commonplanner.com/standards/massachusetts-006fdb4d/arts/visual-arts-grades-7-8-ccd564db"
  ],
  "cp_hs": [
   "Massachusetts Visual Arts Standards, High School Foundations (2019 Framework), standards listing",
   "https://www.commonplanner.com/standards/massachusetts-006fdb4d/arts/visual-arts-high-school-foundations-51d0c1ec"
  ],
  "maritime": [
   "Maritime Gloucester",
   "https://maritimegloucester.org/"
  ],
  "cr_331": [
   "Mark Rothko: Works on Paper (National Gallery of Art), catalogue entry 331",
   "https://rothko.nga.gov/Detail/objects/331"
  ],
  "obs_vocab": [
   "Schooner Adventure education pages (archived Outward Bound site), “Schooner Vocabulary”",
   "https://archives.obs-us.com/obs/adventur/schooner/vocabulary/schooner.htm"
  ],
  "obs_dory": [
   "Schooner Adventure education pages (archived Outward Bound site), dory vocabulary",
   "https://archives.obs-us.com/obs/adventur/schooner/vocabulary/dory.htm"
  ],
  "mfr_gloss": [
   "NOAA Fisheries, Marine Fisheries Review, glossary of fishing terms (PDF)",
   "https://spo.nmfs.noaa.gov/sites/default/files/pdf-content/mfr3661c.pdf"
  ],
  "fhl_141": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 141, Study of Ships, 1851",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=141"
  ],
  "fhl_19": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 19, On the Wharves, Gloucester Harbor, 1847",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=19"
  ],
  "fhl_150": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 150, Near West Beach, Beverly, 1850s",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=150"
  ],
  "fhl_265": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 265, Ships Leaving Boston Harbor, 1847",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=265"
  ],
  "fhl_351": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 351, View of the Town of Gloucester, Mass., 1836",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=351"
  ],
  "fhl_44": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 44, Ships in Ice off Ten Pound Island, Gloucester",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=44"
  ],
  "fhl_563": [
   "Fitz Henry Lane Online (Cape Ann Museum), entry 563",
   "https://www.fitzhenrylaneonline.org/catalogue/entry.php?id=563"
  ],
  "garland89": [
   "Joseph E. Garland, “The Gloucestermen,” Sea History 49 (Spring 1989)",
   "https://issuu.com/seahistory/docs/sh_049_spring-1989/17"
  ],
  "seahist77": [
   "Sea History 6 (Winter 1976–1977), on the Gloucester fishing schooner",
   "https://issuu.com/seahistory/docs/sh_006_winter-1977/8"
  ],
  "adv_1800s": [
   "Schooner Adventure, “Gloucester Fishing Industry—1800s” (timeline)",
   "https://schooner-adventure.org/?p=339"
  ],
  "adv_1900s": [
   "Schooner Adventure, “Gloucester Fishing Industry—1900s” (timeline)",
   "https://schooner-adventure.org/?p=341"
  ],
  "usfc_haddock": [
   "G. Brown Goode and J. W. Collins, “The Winter Haddock Fishery of New England,” Bulletin of the U.S. Fish Commission, 1881 (transcription, penbay.org)",
   "https://www.penbay.org/usfc/usfc1881_haddock.html"
  ],
  "usfc_1884": [
   "Bulletin of the U.S. Fish Commission, 1884, notes on the fisheries of Gloucester, fall and winter 1883 (transcription, penbay.org)",
   "https://penbay.org/usfc/usfc1884_fisheriesgloucfallwin83.html"
  ],
  "noaa_groundfish": [
   "NOAA Fisheries, “A Brief History of the Groundfishing Industry of New England”",
   "https://www.fisheries.noaa.gov/new-england-mid-atlantic/commercial-fishing/brief-history-groundfishing-industry-new-england"
  ],
  "dft_cod": [
   "Downeast Fisheries Trail, “Fisheries Then: Cod”",
   "https://www.downeastfisheriestrail.org/fisheries-then/cod/"
  ],
  "neh_georges": [
   "New England Historical Society, articles on Georges Bank",
   "https://newenglandhistoricalsociety.com/tag/georges-banks/"
  ],
  "cam_lumpers": [
   "Cape Ann Museum Library & Archives, Matthew Cooney Lumpers Research Collection, finding aid",
   "https://capeannmuseum.quartexcollections.com/resources/finding-aids/matthew-cooney-lumpers-research-collection-finding-aid"
  ],
  "nscc_pier": [
   "North Shore Community College, Gloucester poetry site, history of the State Fish Pier",
   "https://appsprod.northshore.edu/poetry/gloucester/fishpierhistory.htm"
  ],
  "gmg_rail": [
   "Good Morning Gloucester, “Did You Know? (Gloucester Marine Railways),” April 20, 2011, quoting the railways’ history",
   "https://goodmorninggloucester.com/2011/04/20/did-you-know-gloucester-marine-railways"
  ],
  "gg_cut": [
   "Joseph E. Garland, The Gloucester Guide (1990), chapter 4, “Annisquam and Mill Rivers: The Cut to Goose Cove”",
   "https://obs.com/gloucesterguide/c4b.htm"
  ],
  "gmg_cut": [
   "Jude Seminara, “The Cut,” Good Morning Gloucester, April 30, 2020",
   "https://goodmorninggloucester.com/2020/04/30/the-cut"
  ],
  "discover_fiesta": [
   "Discover Gloucester, “St. Peter’s Fiesta and the Greasy Pole”",
   "https://discovergloucester.com/blog/st-peters-fiesta-and-the-greasy-pole/"
  ],
  "nshore_pole": [
   "Northshore Magazine, on the Greasy Pole at St. Peter’s Fiesta",
   "https://nshoremag.com/?p=183344"
  ],
  "gregcook": [
   "Greg Cook, Wonderland, photographs and notes from St. Peter’s Fiesta, June 2024",
   "https://gregcookland.com/wonderland/?p=25272"
  ],
  "cnhi_blessing": [
   "Gloucester Daily Times (CNHI), Fiesta Mass and the blessing of the fleet",
   "https://www.cnhi.com/?p=47660"
  ],
  "pilot_fleet": [
   "The Pilot (Archdiocese of Boston), “Into the Deep: The tradition of the Blessing of the Fleet”",
   "https://www.thebostonpilot.com/article.php?ID=200209"
  ],
  "natfish_memorial": [
   "National Fisherman, “Annual service honors Gloucester’s lost fishermen”",
   "https://www.nationalfisherman.com/northeast/annual-service-honors-gloucester-s-lost-fishermen"
  ],
  "cnhi_cenotaph": [
   "Gloucester Daily Times (CNHI), “Ten names added to cenotaph in time for Saturday’s Fishermen’s Memorial Service”",
   "https://www.cnhi.com/rss_feed/ten-names-added-to-cenotaph-in-time-for-saturdays-fishermens-memorial-service/"
  ],
  "ch_flores": [
   "Daniel F. Flores, “Faith to face the deep,” Christian History 159",
   "https://christianhistoryinstitute.org/magazine/article/ch159-faith-to-face-the-deep"
  ],
  "fma_bluenose": [
   "Fisheries Museum of the Atlantic (Nova Scotia), history of Bluenose",
   "https://fisheriesmuseum.novascotia.ca/node/113"
  ],
  "wiki_thebaud": [
   "Wikipedia, “Gertrude L. Thebaud”",
   "https://en.wikipedia.org/wiki/Gertrude_L._Thebaud"
  ]
},

/* ------------------------------------------------------------------ trails */
trails: [
{ id: 'women', short: 'A full day by car', span: '1850s to 1980', title: 'Women of Cape Ann', kicker: 'Trail · by car, with a walk on Rocky Neck',
  lead: 'Ten stops for the women who painted Gloucester, from Fitz Henry Lane’s circle in the 1850s to Nell Blaine’s harbor in the 1950s. Most stops are outdoors and free; the museum stop is the one place to see several of their paintings at once.',
  intro: 'In 2024 the Cape Ann Museum gathered this history in <i>Women Artists on Cape Ann, 1870–1970</i>, curated by Martha Oaks [[women2024]]. This trail follows the places that can still be visited. Several houses on it are private homes: view them from the street and keep the sidewalk clear.',
  time: 'A full day. Stops 4–7 are a short walk on Rocky Neck; drive between the rest.',
  legs: [[0, 3, 'drive'], [3, 7, 'walk'], [7, 10, 'drive']],
  stops: [
  { name: 'Stage Fort Park', addr: 'Hough Avenue, Gloucester', ll: [42.6057, -70.67845], who: 'Mary Blood Mellen (1819–1886)',
    text: 'A minister’s wife from Sterling, Massachusetts, Mellen came into Fitz Henry Lane’s world after her brother-in-law took the Universalist pulpit in Gloucester in 1855. By the middle of the decade she was working beside Lane, with free use of his drawings and at times his canvases; one painting, <i>Coast of Maine</i>, carries both their signatures [[cam_mellen]]. Her <i>Field Beach, Stage Fort Park</i>, about 1850, shows this shore and is at the Cape Ann Museum [[cam_mellen]]; Bowdoin owns her <i>Gloucester Harbor (Laying Nets)</i> [[bowdoin_mellen]].',
    works: ['mellen-field-beach', 'mellen-gloucester-harbor'] },
  { name: 'Cape Ann Museum', addr: '27 Pleasant Street, Gloucester', ll: [42.61402, -70.66162], who: 'The collection',
    text: 'The museum owns Theresa Bernstein’s <i>Gloucester in Blue</i> (1925) [[cam_bernstein]], Nell Blaine’s <i>Wharf Studio, Gloucester</i> (1958) [[cam_blaine]] and the archive of the Folly Cove Designers [[fc_aid]]; the Rocky Neck Art Colony also credits it with Martha Walter’s <i>Rocky Neck Store and My Studio</i> (1920) [[rnat_walter]]. Ask at the desk which are on view.',
    works: ['bernstein-gloucester-in-blue', 'blaine-wharf-studio'] },
  { name: 'Our Lady of Good Voyage', addr: '142 Prospect Street, Gloucester', ll: [42.61718, -70.65715], who: 'Josephine Nivison (1883–1968)',
    text: 'In the summer of 1923 Jo Nivison painted <i>Church Towers, Gloucester</i>, a head-on view of this church’s twin towers. It was the summer she and Edward Hopper painted together here, and she encouraged him to take up watercolor [[artsfuse]]. We have not found the painting in a public collection.' },
  { name: 'Rocky Neck Guest House', addr: '1 Eastern Point Road, Gloucester', ll: [42.59873, -70.6548], who: 'Theresa Bernstein (1890–2002)',
    text: 'Bernstein first came to Gloucester in 1916. She and the painter William Meyerowitz stayed here after their marriage in 1919, and in 1924 bought a house on Mount Pleasant Avenue in East Gloucester (a private home), where they hosted friends including Milton Avery. Both helped found the North Shore Arts Association [[rnat_pdf]].' },
  { name: 'Martha Walter’s studio', addr: '37 Rocky Neck Avenue, Gloucester', ll: [42.60581, -70.65739], who: 'Martha Walter (1875–1976)',
    text: 'A Philadelphia painter trained under William Merritt Chase, Walter had joined the Gloucester colony by 1913 and kept a studio and gallery on Rocky Neck from the later 1910s into the 1920s. The building is now a gallery [[rnat_walter]].' },
  { name: 'Sally Michel’s studio', addr: '77–78 Rocky Neck Avenue, Gloucester', ll: [42.60757, -70.6559], who: 'Sally Michel Avery (1902–2003)',
    text: 'In 1924 Sally Michel rented the studio next to Milton Avery’s here. They married in 1926, and her work supported the family while he painted [[rnat_avery]].' },
  { name: 'Rocky Neck wharves', addr: 'Rocky Neck Avenue, Gloucester', ll: [42.6050, -70.6570], approx: true, who: 'Nell Blaine (1922–1996)',
    text: 'Blaine rented studios on Rocky Neck in 1954 and 1958 [[cam_blaine]]; the Whitney’s <i>Harbor and Green Cloth, II</i> dates from the second summer [[whitney_blaine]]. From 1974 until her death she summered in East Gloucester [[cook_blaine]]. The marker is placed on the avenue; the studio addresses are not published.',
    works: ['blaine-harbor-green-cloth'] },
  { name: 'Bass Rocks', addr: 'Atlantic Road, Gloucester', ll: [42.61426, -70.63532], who: 'Martha Walter',
    text: 'Walter’s entries at the Pennsylvania Academy in 1915 included a crowded beach at Bass Rocks; Philadelphia critics praised the Gloucester picture [[rnat_walter]]. Parking along Atlantic Road is limited.' },
  { name: 'Good Harbor Beach', addr: 'Thatcher Road, Gloucester', ll: [42.61954, -70.63143], who: 'Theresa Bernstein',
    text: 'Bernstein was still painting this beach around 1980, when she was about ninety: the Brooklyn Museum owns <i>Rabbits, Good Harbor Beach, Gloucester</i> [[brooklyn_bernstein]]. Summer parking is by fee.',
    works: ['bernstein-rabbits'] },
  { name: 'Folly Cove, Lanesville', addr: 'Washington Street (Route 127), Lanesville', ll: [42.68839, -70.64125], who: 'Virginia Lee Burton (1909–1968)',
    text: 'The children’s author of <i>Mike Mulligan and His Steam Shovel</i> taught block printing to her neighbors here and in 1941 founded the Folly Cove Designers, who printed textiles by hand until 1969 [[fc_neh]] [[fc_wiki]]. Their blocks, fabrics and records are at the Cape Ann Museum [[fc_aid]].' }
  ],
  asides: [
    { h: 'Cecilia Beaux at Green Alley', text: 'The portrait painter Cecilia Beaux (1855–1942) summered at Green Alley, her house on Eastern Point, from 1906 until her death [[cam_beaux]] [[beaux_talk]]. The road is private, so the house is not a stop. Her <i>Half-Tide, Annisquam River</i> is in the guide.', works: ['beaux-half-tide'] },
    { h: 'Jane Peterson’s streets', text: 'Jane Peterson (1876–1965) painted Gloucester’s streets and wharves in bright, broken color in the 1910s and 1920s [[peterson]]. The RISD Museum owns her <i>Gloucester Street Scene</i> [[risd_peterson]].', works: ['peterson-street'] }
  ] },

{ id: 'hopper', short: 'About four hours, walk and drive', span: '1912 to 1934', title: 'Edward Hopper’s Gloucester', kicker: 'Trail · a downtown walk, then a drive',
  lead: 'Hopper came to Gloucester in 1912 with his friend Leon Kroll, and again in the summers of 1923, 1924, 1926 and 1928, mostly painting houses in watercolor. Twelve of his subjects can still be found. The downtown walk passes eight of them and ends at the train station.',
  intro: 'The summers are the Cape Ann Museum’s count [[cam_hopper]]; the oil <i>Sun on Prospect Street</i> is dated 1934. Street addresses follow Catherine Ryan’s catalogue <i>Edward Hopper All Around Gloucester</i> [[ryan]], with the museum records for each painting. The Cape Ann Museum also runs docent-led “Hopper’s Houses” walks from Pleasant Street [[cam_hoppertour]]. Nearly every house is a private home: look from the sidewalk.',
  time: 'Walk: about 2 hours with stops. Drive: about 2 hours for stops 9–12.',
  legs: [[0, 8, 'walk'], [8, 12, 'drive']],
  stops: [
  { name: 'Cape Ann Museum', addr: '27 Pleasant Street', ll: [42.61402, -70.66162], who: 'Start',
    text: 'Start here: the museum has the most Hopper context in town, and its docent walks cover the downtown houses [[cam_hoppertour]].' },
  { name: 'Universalist Church', addr: '10 Church Street', ll: [42.6133, -70.66623], who: '<i>Universalist Church</i>, 1926',
    text: 'The church on Church Street [[ryan]]. The watercolor is at the Princeton University Art Museum.', works: ['hopper-universalist'] },
  { name: 'Anderson’s House', addr: '18 Western Avenue', ll: [42.61065, -70.66692], who: '<i>Anderson’s House</i>',
    text: 'A tall yellow Italianate house just up Western Avenue from Stacy Boulevard [[ryan]] [[cam_hopper]]. The watercolor is at the Museum of Fine Arts, Boston.', works: ['hopper-andersons'] },
  { name: 'The Fort', addr: 'Fort Square, off Commercial Street', ll: [42.60832, -70.66457], who: '<i>Italian Quarter, Gloucester</i>, 1912',
    text: 'On his first visit, in 1912, Hopper painted the fishermen’s houses of the Fort, Gloucester’s Italian neighborhood [[ryan]].', works: ['hopper-italian-quarter'] },
  { name: 'Haskell’s House', addr: '316 Main Street, at Prospect Street', ll: [42.61595, -70.65585], who: '<i>Haskell’s House</i>, 1924',
    text: 'The Second Empire house at the corner of Main and Prospect Streets [[haskell]] [[ryan]]. The watercolor is at the National Gallery of Art.', works: ['hopper-haskells-house'] },
  { name: 'Our Lady of Good Voyage', addr: 'from Mount Vernon Street', ll: [42.61775, -70.6575], who: 'Hopper and Jo Nivison, 1923',
    text: 'Hopper painted the church’s towers from a distance, from about 15–17 Mount Vernon Street [[ryan]]; in the same summer Jo Nivison painted them head-on [[artsfuse]].' },
  { name: 'Sun on Prospect Street', addr: '98–102 Prospect Street', ll: [42.61593, -70.66034], who: '<i>Sun on Prospect Street</i>, 1934',
    text: 'An oil, at the Cincinnati Art Museum [[ryan]].', works: ['hopper-prospect'] },
  { name: 'Freight cars and the box factory', addr: 'Maplewood Avenue and Cleveland Street', ll: [42.61943, -70.66763], who: '<i>Freight Cars</i> and <i>Box Factory</i>, 1928',
    text: 'The rail yard by the station gave Hopper <i>Freight Cars, Gloucester</i>, with the steeple of St. Ann’s Church behind the cars [[cam_hopper]]; the box factory on Cleveland Street has been torn down [[ryan]]. The station is the end of the walk, with trains back to Boston.', works: ['hopper-freight-cars', 'hopper-box-factory'] },
  { name: 'The Mansard Roof', addr: '2 Clarendon Street, Rocky Neck', ll: [42.60666, -70.65874], who: '<i>The Mansard Roof</i>, 1923',
    text: 'The Brooklyn Museum bought this watercolor after its 1923 show. The house was part of Augustus Wonson’s estate [[rnat_pdf]].', works: ['hopper-mansard'] },
  { name: 'Above Cripple Cove', addr: 'East Main Street, East Gloucester', ll: [42.61505, -70.6484], approx: true, who: '<i>Gloucester Harbor</i>, 1912',
    text: 'Hopper’s 1912 oil of the harbor was painted from the ground above Cripple Cove [[ryan]]. The marker is the cove; the exact spot is not recorded.', works: ['hopper-gloucester-harbor'] },
  { name: 'Briar Neck', addr: 'Good Harbor Beach', ll: [42.61954, -70.63143], approx: true, who: '<i>Briar Neck, Gloucester</i>, 1912',
    text: 'The point at the end of Good Harbor Beach [[ryan]]. The marker is the beach.', works: ['hopper-briar-neck'] },
  { name: 'Squam Light', addr: 'Wigwam Point, Annisquam', ll: [42.6619, -70.68149], who: '<i>Houses of ’Squam Light</i>, 1923',
    text: 'Hopper’s view of the light and its keeper’s houses. The light can be seen from Wingaersheek Beach across the river; the keeper’s house is Coast Guard housing (see site 8).', works: ['hopper-squam-light'] }
  ] },

{ id: 'rothko', short: 'Half a day', span: '1921 to 1945', title: 'Rothko, Avery and Gottlieb', kicker: 'Trail · East Gloucester',
  lead: 'In 1932 Milton Avery invited two young New York painters, Mark Rothko and Adolph Gottlieb, to Gloucester. They drew the bathers on the beaches and the wharfs across the harbor. Six stops, from the beach to the fish flakes.',
  intro: 'The three painters’ summers here are the subject of <i>Avery, Gottlieb &amp; Rothko: By the Sea</i>, shown at the Cape Ann Museum in 2026 [[wbur_trio]] and at the Phillips Collection in Washington from October 24, 2026, to January 24, 2027 [[phillips]]. Rothko and Gottlieb rented cheap rooms and kept apart from the art colony’s social life, so few addresses survive [[rnat_avery]].',
  time: 'Half a day. Stops 3–5 are a short walk.',
  legs: [[0, 2, 'drive'], [2, 5, 'walk'], [5, 6, 'drive']],
  stops: [
  { name: 'Cape Ann Museum', addr: '27 Pleasant Street', ll: [42.61402, -70.66162], who: 'Rothko’s wharf',
    text: 'In August 2026 Christopher Rothko gave the museum his father’s <i>Untitled (wharf, Gloucester, Massachusetts)</i> of 1934, the first Rothko in its collection [[wbur_gift]]. It shows the salt-fish sheds of the Reed and Gamage wharfs near Smith Cove, painted from Banner Hill (stop 5) [[cr_2486]].', works: ['rothko-wharf-cam'] },
  { name: 'Good Harbor Beach', addr: 'Thatcher Road', ll: [42.61954, -70.63143], who: 'Bathers and handball',
    text: 'Avery painted the crowd watching the total solar eclipse of 1932 at Good Harbor [[wbur_trio]]. Two years later the friends met here daily: Edith Rothko remembered that they would “go swimming and play handball,” and Rothko painted the game [[cr_283]]. A sketch in his notebook shows the footbridge at Bass Rocks by Good Harbor Beach, a subject Leon Kroll had painted before him [[cr_918]].' },
  { name: 'Avery’s studio', addr: '77–78 Rocky Neck Avenue', ll: [42.60757, -70.6559], who: 'Milton Avery (1885–1965)',
    text: 'Avery first summered in Gloucester in 1921; in 1926 he and the sculptor Leonard Craske rented cottages here, the one record of where he stayed [[rnat_avery]]. His <i>Gloucester Dawn</i> of about 1921 is at Vassar [[vassar_avery]].', works: ['avery-dawn'] },
  { name: 'Smith Cove', addr: 'Rocky Neck causeway', ll: [42.60665, -70.65528], approx: true, who: 'The wharfs',
    text: 'Smith Cove was the center of Gloucester’s gill-net fishing. Rothko painted its wharfs again and again in 1934: the Reed and Gamage salt-fish sheds with a water tank on the roof, and rows of fish flakes covered with white cloths to keep the sun off the fillets [[cr_2238]] [[nga_rothko]]; fishermen among the gill-net reels on a wharf [[cr_314]]; and a schooner at a wharf with its sails lowered to dry, perhaps with City Hall on the skyline [[cr_284]].', works: ['rothko-wharf-nga'] },
  { name: 'Banner Hill', addr: 'above 186–220 East Main Street', ll: [42.60644, -70.65084], approx: true, who: 'The high view',
    text: 'The ridge above Smith Cove, where the Impressionists painted (site 3) [[rnat_pdf]]. Rothko painted the Reed and Gamage wharfs from Banner Hill, and Gottlieb sketched them from a similar spot, possibly beside him [[cr_2486]]. The hilltop is private; look from the road.' },
  { name: 'Calder Street', addr: 'Calder Street, East Gloucester', ll: [42.60897, -70.64384], approx: true, who: 'Rothko, summer 1934',
    text: 'In the summer of 1934 Rothko and his wife, Edith Sachar, rented a house on Calder Street, about half a mile from the wharfs, while the Averys and the Gottliebs summered nearby [[cr_331]]. The Rothkos arrived first and took the house the Gottliebs had wanted [[cr_4098]]. The house number is not recorded; this is a quiet residential street.' }
  ],
  table: { caption: 'Rothko’s Gloucester works on paper in public collections. Titles in brackets were supplied by the catalogue raisonné, which lists 38 works for Gloucester; the other 14 belong to the artist’s family [[cr_search]].', rows: [["[Harbor scene]", "1932/1934", "McNay Art Museum, San Antonio", "1998.8", 10, ""], ["[Wharf, Gloucester, Massachusetts]", "1934", "National Gallery of Art", "1986.56.531", 2238, ""], ["[Wharf, Gloucester, Massachusetts]", "1934", "Cape Ann Museum", "2026.022.001", 2486, ""], ["[Wharf]", "1934", "National Gallery of Art", "1986.56.607", 2244, ""], ["[Waterfront]", "1934", "National Gallery of Art", "1986.56.610.a", 310, ""], ["[Harbor]", "1934", "National Gallery of Art", "1986.56.610.b", 311, "Back of [Waterfront]"], ["[Schooner at wharf]", "1934", "National Gallery of Art", "1986.56.538.b", 284, ""], ["[Figures with gill-net reels]", "1934", "National Gallery of Art", "1986.43.206.b", 314, ""], ["[Girl on red sofa]", "1934/1935", "National Gallery of Art", "1986.43.206.a", 313, "Back of the gill-net sheet; probably painted later"], ["[Figures playing handball on the beach]", "1934", "National Gallery of Art", "1986.56.538.a", 283, ""], ["The Bathers", "1934", "National Gallery of Art", "1986.43.198", 4098, ""], ["[Bathers on the beach]", "1934", "National Gallery of Art", "1986.43.199", 3090, ""], ["[Bathers on the beach]", "1934", "National Gallery of Art", "1986.43.207", 2322, ""], ["[Bathers on the beach]", "1934", "National Gallery of Art", "1986.56.539", 2154, ""], ["[Bathers on the beach]", "1934", "National Gallery of Art", "1986.56.600.a", 301, ""], ["[Reclining man with mandolin]", "1934", "National Gallery of Art", "1986.56.600.b", 302, "Back of the beach scene above"], ["[Bathers on the beach]", "1934", "National Gallery of Art", "1986.56.601", 2122, ""], ["[Bathers on the beach]", "1934/1935", "National Gallery of Art", "1986.56.599.a", 287, "Possibly Gloucester"], ["[Figures near rocky coast]", "1934", "National Gallery of Art", "1986.56.620.a", 289, ""], ["[Coastal path]", "1934", "National Gallery of Art", "1986.56.620.b", 290, "Back of the sheet above"], ["[Studies of bridge, bathers, standing woman]", "1934", "National Gallery of Art", "1986.56.84", 918, "Graphite; the Bass Rocks footbridge"], ["[Street with hydrant]", "1934", "National Gallery of Art", "1986.56.581.b", 86, "Graphite; possibly Gloucester"], ["[Figures in ice cream parlor]", "1934/1935", "National Gallery of Art", "1986.56.593", 2086, "Setting not identified"], ["[Figures in ice cream parlor]", "1934/1935", "National Gallery of Art", "1986.56.606", 2092, "Setting not identified"]] },
  asides: [
    { h: '1945: Rothko with Aaron Siskind', text: 'Rothko came back in 1945 and painted watercolors while staying with the photographer Aaron Siskind in East Gloucester, in the studio Gottlieb had found for Siskind the year before [[siskind]]. See <a href="{up}photographers.html">the photographers</a>.' },
    { h: 'Gottlieb’s boxes', text: 'Some of Gottlieb’s Cape Ann pictures show dead fish he gathered on the beach and set in boxes [[wbur_trio]]. His <i>Harbor Scene</i> of about 1934 is in the guide.', works: ['gottlieb-harbor'] },
    { h: 'Avery at Eastern Point, 1943', text: 'A sketchbook Avery used about 1943 is inscribed for the Mother Ann Cottage on Eastern Point; it is at the National Gallery of Art [[nga_avery43]].' }
  ] }
],

/* ------------------------------------------------------------------ waterfront */
waterfront: {
  lead: 'The harbor in the paintings was a factory. This page explains what the painters were looking at — fish flakes, dories, schooners, nets — and where the working waterfront can still be seen.',
  stops: [
  { name: 'Fishermen’s Memorial', addr: 'Stacy Boulevard at Babson Court', ll: [42.610051, -70.670223],
    text: 'Leonard Craske’s <i>Man at the Wheel</i>, dedicated August 23, 1925 [[rnat_avery]]. The plaques list 5,368 men known to have been lost at sea; a single storm in 1862 took 120 men, and storms in 1879 took 159 [[hmdb_memorial]].' },
  { name: 'Salting Fish marker', addr: '25 Rogers Street, at Porter Street', ll: [42.61171, -70.66452],
    text: 'At its peak Gorton’s ran dozens of wharves and many flake yards, where cod from the North Atlantic banks was split, salted and dried [[hmdb_salt]].' },
  { name: 'Maritime Gloucester', addr: 'Harbor Loop', ll: [42.61166, -70.66069],
    text: 'The harbor’s museum of its own working history, on the inner harbor [[maritime]].' },
  { name: 'The Fort', addr: 'Fort Square', ll: [42.60832, -70.66457],
    text: 'The point where Lane painted Ten Pound Island (site 1) and Hopper painted the fishermen’s houses of the Italian Quarter [[ryan]].' },
  { name: 'Smith Cove', addr: 'East Gloucester', ll: [42.60665, -70.65528],
    text: 'Rothko’s 1934 wharfs had fish flakes on the pier, the last generation of the racks Lane had painted eighty years before [[wbur_gift]].' }
  ],
  terms: [
  { c: 'cure', t: 'Fish flakes', d: 'Low wooden racks on which split, salted cod was laid out in the sun to dry. Whole fields of them appear in Lane’s and later paintings of the waterfront [[fhl_flakes]] [[hmdb_salt]].', works: ['rothko-wharf-cam'] },
  { c: 'fishing', t: 'Gill nets', d: 'Nets hung like a curtain in the water, catching fish by the gills. Mellen’s <i>Gloucester Harbor (Laying Nets)</i> shows crews setting them [[fhl_gill]].', works: ['mellen-gloucester-harbor'] },
  { c: 'dory', t: 'Dories', d: 'Small flat-bottomed boats carried on the schooners and rowed out to set lines and nets; Gordon Parks photographed Gloucester crews laying nets by hand from them in 1943 [[parks]]. Homer drew boys in dories in 1873.', works: ['homer-boys-in-a-dory', 'homer-green-dory'] },
  { c: 'boats', t: 'Schooners', d: 'The fore-and-aft rigged vessels of the Gloucester fleet that brought fish home from the banks [[hmdb_salt]].', works: ['homer-schooners-waterboat', 'lane-harbor-1852'] },
  { c: 'boats', t: 'Draggers', d: 'Motor trawlers that drag a net along the bottom; Emile Gruppé painted them at the wharves.', works: ['gruppe-draggers'] },
  { c: 'harbor', t: 'Drydock', d: 'A berth where a vessel is taken out of the water for repair. Hassam painted one in the 1890s.', works: ['hassam-drydock'] }
  ],
  wordsIntro: 'A glossary of the working harbor, from the vessels and their rigging to the cure, the pay and the customs, with a source for every word. Terms with a picture can be seen in paintings on this site.',
  cats: [['boats', 'Vessels'], ['rig', 'Rig and deck'], ['dory', 'The dory and its gear'], ['fishing', 'Grounds, lines and nets'], ['cure', 'The catch and the cure'], ['harbor', 'Wharves and the harbor'], ['pay', 'Life and pay aboard'], ['custom', 'Customs, races and memory']],
  words: [
  { c: 'boats', t: 'Shallop', d: 'A small colonial working boat, the ancestor of many New England fishing craft, among them the Chebacco boat, the dogbody and the pinky [[fhl_141]].' },
  { c: 'boats', t: 'Chebacco boat', d: 'A heavily built two-masted fishing boat that grew out of the shallop in Chebacco Parish, the part of Ipswich that became the town of Essex in 1819. The name was in use in the second half of the 1700s [[fhl_141]] [[garland89]].' },
  { c: 'boats', t: 'Dogbody', d: 'The square-sterned version of the Chebacco boat. Where the name came from is now forgotten [[fhl_141]].' },
  { c: 'boats', t: 'Pinky', d: 'A schooner-rigged fishing vessel that descended from the Chebacco boat at the end of the 1700s. The name refers to its narrow “pink” stern, from a Dutch word for pinched [[fhl_141]] [[fhl_351]].' },
  { c: 'boats', t: 'Jigger', d: 'A Chebacco boat converted to a schooner rig by adding a bowsprit and a jib [[fhl_563]]. Gloucester’s fishing timeline records jiggers of 30 tons and more built for mackerel fishing in 1816 [[adv_1800s]].' },
  { c: 'boats', t: 'Sharpshooter', d: 'The new fishing schooner of the 1840s: a long hull, a straight keel, sharp bilges and the first hint of a hollow, slicing bow [[garland89]]. Lane’s <i>Ships in Ice off Ten Pound Island</i> shows fishing schooners with the finer hulls of the sharpshooters and clippers [[fhl_44]].', works: ['lane-ships-in-ice'] },
  { c: 'boats', t: 'Clipper schooner', d: 'A fast fishing schooner: sharp-ended, shallow, beamy and over-canvassed. The first clipper owned in Gloucester was built at Essex in 1850 [[adv_1800s]]; the <i>Smuggler</i> of 1877 was one [[garland89]].' },
  { c: 'boats', t: 'Plumb-stem schooner', d: 'Dennison J. Lawlor’s design, with an upright stem and a deeper, more stable hull than the clippers. The Fish Commission’s research schooner <i>Grampus</i>, launched in 1885, helped set the new pattern [[garland89]].' },
  { c: 'boats', t: 'Fredonia schooner', d: 'Schooners named after their prototype, the <i>Fredonia</i>: a graceful bow, a roomier foredeck and the rounded stern typical of the Gloucesterman [[garland89]].' },
  { c: 'boats', t: 'Knockabout', d: 'A schooner with no bowsprit [[obs_vocab]]. The first was built in Essex in 1902 to make the work safer for fishermen [[adv_1900s]]; Joseph Garland counts the type among the last of the classic Gloucester schooners [[garland89]].' },
  { c: 'boats', t: 'Gloucesterman', d: 'The classic Gloucester fishing schooner of the late 1800s. Built for a hard-fought trade without engines, it was sailed hard, because speed on the voyage home meant success [[seahist77]].' },
  { c: 'boats', t: 'Tern', d: 'A schooner with three masts [[obs_vocab]].' },
  { c: 'boats', t: 'Georgesman', d: 'A schooner that fished Georges Bank. Gloucester was using the name by the 1850s [[adv_1800s]].' },
  { c: 'boats', t: 'Salt banker', d: 'A schooner that sailed from Gloucester to the Grand Banks of Newfoundland for cod. Kipling’s <i>Captains Courageous</i> (1897) gives an accurate picture of their life [[noaa_groundfish]].' },
  { c: 'boats', t: 'Auxiliary', d: 'A sailing vessel with an engine as well. Gloucester’s first fishing vessel with an auxiliary engine came in 1900, and in the 1920s the fleet began converting to engines, mostly diesel [[adv_1900s]].' },
  { c: 'boats', t: 'Coasting schooner', d: 'Any merchant schooner carrying cargo from one port on the coast to another [[fhl_265]].' },
  { c: 'boats', t: 'Packet', d: 'A vessel that carried passengers and higher-value goods between particular ports on a regular schedule. The packet sloops were the most elegant [[fhl_265]].' },
  { c: 'boats', t: 'Stone sloop', d: 'A heavily built, undecorated sloop that carried granite blocks from the quarry piers around Cape Ann to other ports [[fhl_141]].' },
  { c: 'boats', t: 'Half brig', d: 'The New England name for the hermaphrodite brig: square sails on the foremast only, and a spanker and gaff topsail on the main. It was the commonest brig in the coasting trade [[fhl_141]].' },
  { c: 'boats', t: 'Salt ship', d: 'A ship or bark that brought salt to Gloucester for curing fish. Too deep to reach the wharves fully loaded, it was partly unloaded at anchor first [[fhl_19]].' },
  { c: 'boats', t: 'Lighter', d: 'A small vessel that takes cargo off a deep-loaded ship so that she can reach a wharf. Gloucester did much of this “lightering” in the Stream [[fhl_19]] [[fhl_351]].' },
  { c: 'boats', t: 'Yawl boat', d: 'A schooner’s own boat, usually twenty feet long or less, round-bottomed and square-sterned, hung in davits at the stern [[fhl_265]]. It was the lifeboat at sea and carried the captain and crew ashore in port [[fhl_563]]. Lane painted one frozen into the harbor ice [[fhl_44]].', works: ['lane-ships-in-ice'] },
  { c: 'boats', t: 'Moses boat', d: 'A boat carried in a schooner’s stern davits and used to bring barrels of rum and molasses out from a beach [[fhl_19]].' },
  { c: 'boats', t: 'Wherry', d: 'A larger, wider relative of the dory, used for bulky coastal gear such as gill nets and fish traps [[fhl_150]].' },
  { c: 'boats', t: 'Seine boat', d: 'The big rowing boat used in seining. During St. Peter’s Fiesta, crews still race seine boats a half mile out from Pavilion Beach and back [[gregcook]].' },
  { c: 'rig', t: 'Bowsprit', d: 'The long spar at the bow that carries the headsails out over the water. Sailors called it the widow-maker, because men were lost falling from it while tending sail [[obs_vocab]].' },
  { c: 'rig', t: 'Gaff', d: 'On a schooner, the spar along the head of a four-sided sail [[obs_vocab]]. In a dory, a gaff was the hook carried for bringing fish aboard [[usfc_haddock]].' },
  { c: 'rig', t: 'Foremast and mainmast', d: 'A schooner has at least two masts: the foremast, nearest the bow, and the mainmast behind it, the taller of the two [[obs_vocab]].' },
  { c: 'rig', t: 'Topmast', d: 'A second spar carried on top of a lower mast, used to fly more sail [[obs_vocab]].' },
  { c: 'rig', t: 'Jumbo', d: 'The larger of a schooner’s headsails, set forward of the foremast with the jib [[obs_vocab]].' },
  { c: 'rig', t: 'Yankee', d: 'A headsail flown above and forward of the jib, usually on vessels with a bowsprit [[obs_vocab]].' },
  { c: 'rig', t: 'Queen topsail', d: 'A small staysail set between the foremast and the mainmast [[obs_vocab]].' },
  { c: 'rig', t: 'Halyards', d: 'The lines that hoist the sails, and the gaffs and booms that hold them [[obs_vocab]].' },
  { c: 'rig', t: 'Lazyjacks', d: 'Lines from the topping lifts to under the boom that catch the sail like a net when it is lowered [[obs_vocab]].' },
  { c: 'rig', t: 'Baggywrinkle', d: 'Clumps of frayed rope tied into the rigging so that the sails do not chafe against the lines [[obs_vocab]].' },
  { c: 'rig', t: 'Hanging in the gear', d: 'Sails partly lowered or clewed up to dry, as Lane drew them on a half brig in 1851 [[fhl_141]].' },
  { c: 'rig', t: 'Crosstrees', d: 'Horizontal timbers high on the mast that spread the shrouds [[obs_vocab]].' },
  { c: 'rig', t: 'Davits', d: 'Small cranes, usually at the stern, for raising and lowering a boat [[obs_vocab]]. Banks schooners carried their yawl boats in stern davits [[fhl_563]].' },
  { c: 'rig', t: 'Scuppers', d: 'Holes in the vessel’s sides at deck level that drain water overboard [[obs_vocab]].' },
  { c: 'rig', t: 'Fo’c’sle', d: 'Short for forecastle: the crew’s quarters in the forward part of the hull [[obs_vocab]].' },
  { c: 'rig', t: 'Charley Noble', d: 'The stovepipe of the galley, the ship’s kitchen [[obs_vocab]].' },
  { c: 'rig', t: 'Pilothouse', d: 'A small cabin on deck that shelters the wheel and the helmsman [[obs_vocab]].' },
  { c: 'rig', t: 'Iron Mike', d: 'Fishermen’s name for the autopilot, the electrical device that holds a vessel on a set course [[mfr_gloss]].' },
  { c: 'rig', t: 'Gypsyhead', d: 'A metal drum with a smooth, curved face, usually mounted on a winch [[mfr_gloss]].' },
  { c: 'rig', t: 'Slaughterhouse', d: 'The square compartments of the fish hold along the centerline over the keel, between the pens on either side [[mfr_gloss]].' },
  { c: 'rig', t: 'Pen boards', d: 'Removable dividers of wood or metal that slot into the hold to make pens; when all are in, the hold is “penned up” [[mfr_gloss]]. Dorymen used smaller ones to section off the dory for fish [[obs_dory]].' },
  { c: 'dory', t: 'Doryman', d: 'One of the two men who fished from a dory [[obs_dory]].' },
  { c: 'dory', t: 'Dory trawling', d: 'Fishing long trawl lines of baited hooks from six to ten dories carried on a schooner. The Gloucester schooner <i>Anna</i> made a successful dory-trawling trip to the Grand Banks in 1854, but Gloucester was slow to take up the method [[fhl_150]]. Gloucester’s timeline marks 1941 as the year draggers replaced dory fishing [[adv_1900s]].' },
  { c: 'dory', t: 'Trawl', d: 'A long ground line, buoyed and anchored, hung with many short lines of baited hooks [[obs_dory]]. In 1881 a tub of haddock trawl held 500 hooks on about 292 fathoms of line [[usfc_haddock]].' },
  { c: 'dory', t: 'Trawl tub', d: 'A half-barrel holding a coiled trawl and its hooks [[obs_dory]]. In 1881 a dory set out with six to eight of them [[usfc_haddock]].' },
  { c: 'dory', t: 'Slivers', d: 'Strips of salted menhaden, the main bait for the winter haddock trawls of 1881; when menhaden ran short, fresh herring took its place. Baiting a tub of 500 hooks took 45 minutes to an hour [[usfc_haddock]].' },
  { c: 'dory', t: 'Dory anchor', d: 'A small iron anchor that holds one end of a trawl to the bottom [[obs_dory]].' },
  { c: 'dory', t: 'Buoy and black ball', d: 'The float marking a trawl: a numbered wooden barrel with a flag [[obs_dory]]. In 1881 each end buoy also carried a black ball [[usfc_haddock]].' },
  { c: 'dory', t: 'Gurdy', d: 'A hand crank fitted across the bow of a dory to haul in lines heavy with fish [[obs_dory]].' },
  { c: 'dory', t: 'Nippers', d: 'Doughnut-shaped grips that protected a fisherman’s fingers from the running trawl line [[obs_dory]]. In 1881 each dory carried two pairs, made of wool [[usfc_haddock]].' },
  { c: 'dory', t: 'Gob stick', d: 'A heavy two-pronged wooden stick for stunning fish and taking hooks from their throats [[obs_dory]].' },
  { c: 'dory', t: 'Halibut killer', d: 'A heavy wooden club for stunning or killing big fish such as halibut, which can weigh more than 200 pounds [[obs_dory]].' },
  { c: 'dory', t: 'Bailer', d: 'A wooden or metal scoop for throwing water out of the dory [[obs_dory]].' },
  { c: 'dory', t: 'Tholepins', d: 'Narrow wooden pegs set in a dory’s rail that hold the oars in place while rowing [[obs_dory]].' },
  { c: 'dory', t: 'Fog horn', d: 'Dorymen carried a fog horn and a kerosene lamp to signal the schooner, by sound or by light, in thick fog or darkness [[obs_dory]].' },
  { c: 'dory', t: 'Tombstone', d: 'The dory’s narrow, V-shaped stern board [[fhl_150]].' },
  { c: 'dory', t: 'Pay out', d: 'To feed a line over the side, hand over hand [[obs_vocab]].' },
  { c: 'fishing', t: 'Hand-lining', d: 'Fishing with a single line carrying one or two hooks. Dory trawling, with many hooks on one line, later replaced it [[fhl_19]].' },
  { c: 'fishing', t: 'Sling ding', d: 'A metal rod that held the two hooks of a Georges Bank hand line 12 to 18 inches apart [[fhl_19]].' },
  { c: 'fishing', t: 'Highliner', d: 'The top boat, or the top fisherman, of the fleet. The word goes back to fishing from the deck, when the best fisherman held the highest place in the bow [[obs_vocab]].' },
  { c: 'fishing', t: 'Purse seine', d: 'A net about 1,000 feet long set in a circle around a school of mackerel. It replaced hand-lining for mackerel [[fhl_19]]; Gloucester’s timeline dates it to 1848 [[adv_1800s]].' },
  { c: 'fishing', t: 'Otter trawl', d: 'A net towed along the bottom and held open by two otter doors [[mfr_gloss]]. Its arrival in 1905 changed fishing on the New England banks [[adv_1900s]].' },
  { c: 'fishing', t: 'Footrope and headrope', d: 'The bottom and top lines of a trawl net. Floats of metal, plastic or glass on the headrope hold the mouth of the net open [[mfr_gloss]].' },
  { c: 'fishing', t: 'Warps', d: 'The cables from a trawler’s winches to the two sides of the net, which carry the pull of the boat to the trawl [[mfr_gloss]].' },
  { c: 'fishing', t: 'Georges', d: 'Fishermen’s short name for Georges Bank. The Fish Commission’s reports from Gloucester in 1883 list the cod and halibut landed “from George’s Bank” month by month [[usfc_1884]].' },
  { c: 'fishing', t: 'Grand Banks', d: 'The great fishing banks off Newfoundland, where Gloucester’s salt bankers went for cod [[noaa_groundfish]].' },
  { c: 'fishing', t: 'Fare', d: 'A vessel’s catch as landed. A report from Gloucester in December 1883 notes that the vessels from Georges Bank “all brought in good fares of cod” [[usfc_1884]].' },
  { c: 'fishing', t: 'Trip', d: 'Both the voyage and the fish it brings home: the whole catch aboard is “the trip” [[mfr_gloss]].' },
  { c: 'fishing', t: 'Home run', d: 'The passage from the fishing grounds back to the home port [[mfr_gloss]].' },
  { c: 'fishing', t: 'Shore fishery', d: 'Fishing near home in small vessels and boats. In November 1883 Gloucester’s shore fisheries had 56 vessels and 448 men [[usfc_1884]].' },
  { c: 'fishing', t: 'Groundfish', d: 'Fish that live near the bottom, such as cod and haddock, the mainstay of the New England fisheries [[noaa_groundfish]].' },
  { c: 'fishing', t: 'Ice', d: 'Packing fish in ice instead of salt became common about 1845, so that fresh fish could reach market [[adv_1800s]]. With faster schooners and the railroad, it revived Gloucester’s fishing [[fhl_19]]. The ice was cut from fresh-water ponds [[noaa_groundfish]].' },
  { c: 'fishing', t: 'Fast freezing', d: 'Clarence Birdseye’s quick-freezing method, which in 1924 started the processing of frozen fish [[adv_1900s]].' },
  { c: 'fishing', t: 'Lobster trap', d: 'A baited trap set on the bottom, one of the traps of the coastal fisheries in Lane’s time [[fhl_150]]. Homer painted three boys in a dory with lobster pots in 1875.', works: ['homer-three-boys-lobster-pots'] },
  { c: 'cure', t: 'Flake yard', d: 'A field of fish flakes beside the wharves. Lane’s 1836 view of Gloucester shows the Wonson family’s flake yard in East Gloucester, and Five Pound Island later became one [[fhl_351]].' },
  { c: 'cure', t: 'Dressing gang', d: 'The crew that cleaned cod on deck: the throater cut down the belly and took off the head, the gutter removed the insides but saved the liver, and the splitter took out the backbone [[dft_cod]].' },
  { c: 'cure', t: 'Gurry', d: 'The slime, blood and fluids spilled when fish are dressed [[mfr_gloss]]. Schooners kept a gurry pen on deck [[usfc_haddock]].' },
  { c: 'cure', t: 'Kench cure', d: 'A salt cure that used more salt than dunfish but less than pickled “green” cod [[dft_cod]].' },
  { c: 'cure', t: 'Dunfish', d: 'Cod quickly dried and lightly salted, sometimes cured in dark rooms for two or three months under salt hay or eelgrass and weights. The name belongs to the small-boat fisheries of eastern Maine and the Bay of Fundy [[dft_cod]].' },
  { c: 'cure', t: 'Green cod', d: 'Cod pickled in casks of brine rather than dried; the cure took more salt than kenching [[dft_cod]].' },
  { c: 'cure', t: 'Tongues', d: 'Fishermen cut the tongue out of each cod they hauled aboard to keep count of their catch before the fish was salted [[neh_georges]].' },
  { c: 'cure', t: 'Codfish bounty', d: 'A federal payment that helped Gloucester fishermen rebuild their fleet after independence [[fhl_19]].' },
  { c: 'cure', t: 'Surinam trade', d: 'Gloucester’s trade with Surinam, on the north coast of South America, was under way by 1790 and paid for many of the town’s merchant vessels and wharves until it collapsed in 1863 [[fhl_19]].' },
  { c: 'cure', t: 'Lumper', d: 'A dock worker who unloads vessels in Gloucester Harbor [[cam_lumpers]].' },
  { c: 'cure', t: 'Fish pier', d: 'The Jodrey State Fish Pier, opened in 1938 and named for Everett R. Jodrey [[nscc_pier]].' },
  { c: 'harbor', t: 'Crib wharf', d: 'A wharf built on cribs, rectangular frames of timber that look like a log cabin, filled in, with beams laid over the top crib to carry the deck [[fhl_19]].' },
  { c: 'harbor', t: 'Cob wharf', d: 'A pier of piles and timber filled in with rocks. Gloucester built finger piers and bulkheads this way [[fhl_19]].' },
  { c: 'harbor', t: 'Spiles', d: 'Gloucester’s word for the pilings driven along a wharf as fenders where vessels tie up [[fhl_19]].' },
  { c: 'harbor', t: 'Rafting', d: 'Wharf space in Gloucester Harbor was scarce, so coasting vessels moored together and passed cargo to smaller craft that carried it to nearby towns, and the reverse [[fhl_141]].' },
  { c: 'harbor', t: 'The Stream', d: 'The wide channel at the entrance to the Inner Harbor, where vessels anchored while they waited to unload, often lightering there first [[fhl_351]].' },
  { c: 'harbor', t: 'Marine railway', d: 'A cradle on rails that hauls a vessel out of the water for repair. The Rocky Neck railways, begun in 1859 and worked by a steam engine until about 1970, are said to be the oldest still operating in the country [[gmg_rail]].' },
  { c: 'harbor', t: 'The Cut', d: 'The Blynman Canal, dug in 1643 between the harbor and the Annisquam River so that small vessels could avoid the passage around Cape Ann. Storms filled it with sand in 1704 and 1723; it was reopened in 1823 [[gg_cut]].' },
  { c: 'harbor', t: 'Dog Bar Breakwater', d: 'The breakwater at Eastern Point that has kept southerly swells out of the harbor since 1905 [[gmg_cut]]. Stay off it when it is wet or icy.' },
  { c: 'harbor', t: 'Five Pound Island', d: 'A small island in the harbor, once fit only for sheep pounds, that later became a flake yard for drying fish [[fhl_351]].' },
  { c: 'harbor', t: 'Essex-built', d: 'Many Gloucester schooners came from the shipyards on the Essex River [[noaa_groundfish]]. The first knockabout was built in Essex in 1902 and the <i>Adventure</i> in 1926 [[adv_1900s]]; Arthur D. Story launched the <i>Gertrude L. Thebaud</i> there in 1930 [[wiki_thebaud]].' },
  { c: 'pay', t: 'Lay', d: 'The formal word for the share system, under which the money from a trip is divided between the boat and the crew [[mfr_gloss]].' },
  { c: 'pay', t: 'Settling up', d: 'Adding up the trip’s bills and working out each man’s share and the boat’s; the balance sheet is the settlement [[mfr_gloss]].' },
  { c: 'pay', t: 'Gross stock and net stock', d: 'The gross stock is all the money the boat and crew earned from a trip; the net stock is what is left after the bills charged against it are taken out [[mfr_gloss]].' },
  { c: 'pay', t: 'In the hole', d: 'When a trip earned less than its expenses, the crew went in the hole and paid the bills from their own pockets. The deficit was the hole bill [[mfr_gloss]].' },
  { c: 'pay', t: 'Delegate', d: 'The crewman elected to speak for the crew when the settlement is made [[mfr_gloss]].' },
  { c: 'pay', t: 'Site', d: 'An East Coast word for a berth on a fishing boat, or the promise of one [[mfr_gloss]].' },
  { c: 'pay', t: 'Mug-up', d: 'A snack between meals: a cup of coffee and a sandwich [[mfr_gloss]].' },
  { c: 'pay', t: 'Sou’wester', d: 'A wide-brimmed, waterproof oiled hat for foul weather [[mfr_gloss]].' },
  { c: 'pay', t: 'Wristlets', d: 'Cloth tubes worn on the forearms and held by a thumb loop. They keep the arms warm and wash clean of slime and blood more easily than sleeves [[mfr_gloss]].' },
  { c: 'pay', t: 'Ditty bag', d: 'A small bag for carrying and stowing a sailor’s personal things [[obs_vocab]].' },
  { c: 'custom', t: 'St. Peter’s Fiesta', d: 'Gloucester’s June festival for St. Peter, patron saint of fishermen, first held in 1926 and put on by the Italian-American community: an open-air Mass, processions, seine-boat races, the greasy pole and the blessing of the fleet [[adv_1900s]] [[discover_fiesta]].' },
  { c: 'custom', t: 'Greasy pole', d: 'A heavily greased pole run out over the harbor with a flag at the end, which walkers try to grab before they fall in. It was added to the Fiesta in 1931, after a contest in Terrasini, Sicily, the home town of many Gloucester families [[nshore_pole]] [[discover_fiesta]].' },
  { c: 'custom', t: 'Viva San Pietro!', d: '“Long live St. Peter!” The cry is shouted in the Fiesta processions and by the greasy-pole walkers [[gregcook]].' },
  { c: 'custom', t: 'Blessing of the fleet', d: 'On Fiesta Sunday a priest reads out the names of Gloucester’s fishing boats and blesses them [[cnhi_blessing]]. Gloucester’s timeline dates the first blessing to 1945 [[adv_1900s]]. In 1957 the Portuguese and Italian fleets were blessed on separate Sundays; by 1977 the two communities celebrated together [[pilot_fleet]].' },
  { c: 'custom', t: 'Fishermen’s Memorial Service', d: 'Each August a procession goes to the Man at the Wheel, where families lay oars and wreaths and cast flowers into the harbor for the men lost at sea [[natfish_memorial]] [[cnhi_cenotaph]].' },
  { c: 'custom', t: 'Cenotaph', d: 'The plaques beside the Man at the Wheel bearing the names of Gloucester fishermen lost at sea, more than 5,000 of them [[natfish_memorial]]. New names are still added [[cnhi_cenotaph]].' },
  { c: 'custom', t: 'Man at the Wheel', d: 'Leonard Craske’s bronze helmsman on Stacy Boulevard, dedicated in 1925 [[rnat_avery]], with the line from Psalm 107, “They that go down to the sea in ships” [[ch_flores]].' },
  { c: 'custom', t: 'Our Lady of Good Voyage', d: 'The church of Gloucester’s Portuguese community, modeled on Santa Maria Madalena in the Azores. Between its towers a statue of Mary holds a two-masted schooner [[ch_flores]].' },
  { c: 'custom', t: 'Fishermen’s Wives Memorial', d: 'The memorial near the Man at the Wheel that honors the women whose faith kept fishing families going [[ch_flores]].' },
  { c: 'custom', t: 'International Fishermen’s Races', d: 'Races between fishing schooners of Gloucester and Nova Scotia, begun in 1920 [[adv_1900s]]. Lunenburg’s <i>Bluenose</i> never lost a series [[fma_bluenose]]. The last, sailed off Gloucester and Boston in October 1938 against the <i>Gertrude L. Thebaud</i>, was the final race between North Atlantic sailing fishing schooners [[wiki_thebaud]].' }
  ],
  photos: 'The working harbor was photographed for the federal government twice: by Arthur Rothstein in 1937 [[nypl_rothstein]] and by Gordon Parks, who went to sea on the <i>Alden</i> in 1943 [[parks]]. Those photographs are on <a href="{up}photographers.html">the photographers page</a>.'
},

/* ------------------------------------------------------------------ winter */
winter: {
  lead: 'Most painters leave Cape Ann in October. They miss the year’s lowest, warmest light, the empty beaches and, on the coldest mornings, sea smoke over the harbor.',
  seasmoke: 'Sea smoke forms when very cold air moves over water that is much warmer than it, usually when the air is below about 10°F. The water evaporates and condenses at once into fog that rises in columns [[seasmoke]]. Look for it on the first still, clear morning after an Arctic cold front, just after sunrise, from Stacy Boulevard or the Rocky Neck causeway.',
  painters: 'Lane painted the harbor frozen in the 1850s. Aldro Hibbard, who taught in Rockport, painted it under snow; the Museum of Fine Arts bought his <i>Winter Days</i> in 1920 [[vose_hibbard]], and the Smithsonian American Art Museum owns his <i>Rockport Winter</i> [[saam_hibbard]].',
  works: ['lane-ships-in-ice', 'hibbard-rockport-winter'],
  kit: ['Oil paint keeps working in the cold; watercolor and acrylic freeze. If you use water media, work small and fast and keep the water in a vacuum flask.', 'Paint from the car on the worst days. Several historic views are close to public parking, among them Stacy Boulevard and Rocky Neck.', 'Fingerless gloves under mittens, two pairs of socks and a foam pad to stand on.', 'Ice makes the granite ledges and the Dog Bar Breakwater dangerous. Stay off them when they are wet or frozen.', '__SUNSET__']
},

/* ------------------------------------------------------------------ photographers */
photographers: {
  lead: 'Cape Ann was photographed by some of the century’s best: the government’s documentary photographers in the 1930s and 1940s, and Aaron Siskind, who found abstraction on its wharves. None of these photographs is reproduced here; each link goes to the museum or library that holds it.',
  people: [
  { name: 'Aaron Siskind', life: '1903–1991', when: 'Summers of 1944 and 1945, East Gloucester',
    text: 'Siskind came in July 1944 to a studio Adolph Gottlieb had found for him, and spent his mornings on the wharves and beaches with a camera and tripod. In Gloucester he turned from documentary work to close, flat views of peeling walls, rope, a discarded glove and granite. His painter friends Gottlieb, Barnett Newman and Mark Rothko encouraged him [[siskind]]. The curator Jan Howard called these summers his breakthrough [[siskind]].',
    works: [['<i>Gloucester</i>, 1944', 'Museum of Modern Art, 227.1979', 'moma_siskind'], ['<i>Gloucester 16A</i>, 1944', 'Brooklyn Museum, 1999.127.9', 'brooklyn_siskind'], ['<i>Gloucester 16</i>, 1944', 'High Museum of Art, 1977.75', 'high_siskind'], ['<i>Gloucester</i>, 1944', 'RISD Museum, 73.003', 'risd_siskind'], ['<i>Gloucester</i>, 1944', 'Whitney Museum of American Art, 2003.313', 'whitney_siskind']],
    tip: 'Paint as he looked: pick a square meter of a wharf wall, a stack of traps or a weathered door, and fill the whole picture with it.' },
  { name: 'Gordon Parks', life: '1912–2006', when: '1943, for the Office of War Information',
    text: 'Parks photographed Gloucester’s fishing families at home and went to sea with the crew of the <i>Alden</i>, who laid their nets by hand from dories. The assignment was part of a wartime project on food production [[parks]]. The photographs are in the Library of Congress.' },
  { name: 'Arthur Rothstein', life: '1915–1985', when: '1937, for the Farm Security Administration',
    text: 'Rothstein photographed the fishing boats and docks in the fall of 1937; prints are in the New York Public Library and the Library of Congress [[nypl_rothstein]].' },
  { name: 'Lee Friedlander', life: 'born 1934', when: '1981',
    text: 'Friedlander photographed the city in 1981; the Museum of Modern Art owns <i>Gloucester, Massachusetts</i> of that year [[moma_friedlander]].' },
  { name: 'Carl Chiarenza', life: 'born 1935', when: '1962',
    text: 'Chiarenza, later Siskind’s biographer, photographed in Gloucester as a young man; the Whitney owns his <i>Gloucester Window, Sailing Ship</i> of 1962 [[whitney_chiarenza]].' }
  ]
},

/* ------------------------------------------------------------------ teachers */
teachers: {
  lead: 'Three lessons that use the guide’s paintings, sites and sun planner, written for grades 3–4, grades 7–8 and high school Foundations, and keyed to the 2019 Massachusetts Arts Curriculum Framework [[dese]].',
  lessons: [
  { grade: 'Grades 3–4', title: 'Same place, two painters', time: 'Two 45-minute sessions',
    goal: 'Students compare two paintings of one place and say how each painter used color and line to show a mood.',
    std: [['3-4.V.R.07', 'Perceive and analyze artistic work: how color, form, line, shape and texture show intent'], ['3-4.V.R.08', 'Interpret intent and meaning: describe contrasting interpretations'], ['3-4.V.Cr.01', 'Generate artistic ideas that explore line, shape and color']],
    stdsrc: '[[cp_34]]',
    pair: ['metcalf-gloucester-harbor', 'hassam-norton'],
    steps: ['Project the two Banner Hill views of the harbor, painted by Willard Metcalf in 1895 and Childe Hassam in 1899 from the same hill (site 3).', 'In pairs, list three colors each painter used most. Use the guide’s color lab to sample them.', 'Ask: which painting feels warmer? Busier? Which time of day is it? Point to the evidence.', 'Each student paints the same view from a photograph or the window in a different mood, using only three colors.'],
    assess: 'Each student names one choice in their painting and the mood it creates.' },
  { grade: 'Grades 7–8', title: 'Where did they stand?', time: 'Three 50-minute sessions',
    goal: 'Students use a painting, a map and the sun to find a painter’s viewpoint and explain what the painting shows about Gloucester’s history.',
    std: [['7-8.V.R.07', 'Analyze elements of a work that indicate its historical or cultural context'], ['7-8.V.R.08', 'Explain how a work was influenced by its culture or historical context'], ['7-8.V.Co.11', 'Relate artistic ideas and works to societal, cultural and historical contexts']],
    stdsrc: '[[cp_78]]',
    pair: ['lane-ten-pound-cam', 'hopper-mansard'],
    steps: ['Give groups one site page each. From the painting, the map and the direction of view, mark where the painter stood.', 'Use the sun planner to find when the shadows in the painting would fall the way they do. Is the painter’s light morning or evening?', 'List what is in the painting that is gone today (wharves, fish flakes, schooners). Use the working-waterfront page to explain each.', 'Each group presents: what the painting shows about how people lived and worked when it was made.'],
    assess: 'A one-page site report with the viewpoint, the time of day and two pieces of historical evidence from the painting.' },
  { grade: 'High school Foundations', title: 'From documentary to abstraction', time: 'Four 55-minute sessions',
    goal: 'Students trace how Gloucester’s wharves moved artists from description toward abstraction, then make a work that does the same.',
    std: [['F.V.R.07', 'Analyze the style of an artist and how it shows in a given artwork'], ['F.V.Co.11', 'Connect historical and cultural contexts to the stylistic elements of artistic movements'], ['F.V.Cr.02', 'Develop multiple plans for an artwork before selecting one']],
    stdsrc: '[[cp_hs]]',
    pair: ['rothko-wharf-nga', 'davis-gloucester-harbor'],
    steps: ['Look at Lane’s harbor, Hopper’s houses, Rothko’s 1934 wharf and Siskind’s 1944 wharf photographs (linked on the photographers page). Arrange them on a line from “describes” to “abstracts”.', 'Read the Siskind paragraph on the photographers page. What did Gloucester give these artists that New York did not?', 'Photograph or sketch six close-up details of a real wall, boat or dock. Develop three plans for a composition from them.', 'Make the final work and write a 150-word statement placing it on the line.'],
    assess: 'Three dated plans, the finished work and the statement, judged on how clearly the student can explain the move from subject to abstraction.' }
  ],
  field: ['Check the access notes on each site page: several historic viewpoints are on private land.', 'Good Harbor and Wingaersheek beaches charge for parking in summer, and non-residents must reserve.', 'Ask the Cape Ann Museum about school visits before planning a trip around its galleries.', 'Mind the tide: the harbor range averages nearly 9 feet. Keep students off wet ledges.']
},


/* ------------------------------------------------------------------ painters */
painters: {
  lead: 'Cape Ann’s painters arrived by invitation more often than by chance. A teacher brought his class, a friend found a cottage, an older painter asked two young ones to come for the summer. These are their lives on Cape Ann, and the chains that brought them.',
  chains: [
    { title: 'Lane’s circle', years: '1850s', steps: ['William R. G. Mellen', 'took the Universalist pulpit, 1855', 'Mary Blood Mellen', 'worked beside him', 'Fitz Henry Lane'], src: '[[cam_mellen]]' },
    { title: 'Duveneck to Hopper', years: '1890–1923', steps: ['Frank Duveneck', 'brought, 1890s', 'John H. Twachtman', 'taught', 'Leon Kroll', 'came with, 1912', 'Edward Hopper', 'courted here, 1923', 'Josephine Nivison'], src: '[[cam_duveneck]] [[cam_kroll]] [[cam_hopper]]' },
    { title: 'The red cottage', years: '1914–1934', steps: ['Charles Allan Winter', 'urged him to come, 1914', 'John Sloan', 'invited, 1915', 'Stuart Davis'], src: '[[cam_sloan]] [[cam_davis]]' },
    { title: 'East Gloucester friends', years: '1919–1926', steps: ['Ellen Day Hale', 'lent a Folly Cove cottage, early 1920s', 'Theresa Bernstein and William Meyerowitz', 'hosted', 'Milton Avery', 'next-door studio, 1924', 'Sally Michel'], src: '[[cam_bernstein]] [[rnat_pdf]] [[rnat_avery]]' },
    { title: 'Avery’s young friends', years: '1932–1945', steps: ['Milton Avery', 'invited, 1932', 'Mark Rothko, Adolph Gottlieb and Barnett Newman', 'a studio, 1944; a shared summer, 1945', 'Aaron Siskind'], src: '[[cam_avery]] [[siskind]]' }
  ],
  people: [
  { id: 'lane', name: 'Fitz Henry Lane', life: '1804–1865', here: 'Born in Gloucester; painted it 1840s–1865', g: 'lane', works: ['lane-harbor-1852', 'lane-braces-rock'],
    text: 'Gloucester’s own painter learned his trade in the lithography shops before turning to oil, and came home to paint the harbor for two decades [[cam_mellen]]. The Cape Ann Museum holds 40 of his paintings, his first known work (a watercolor of 1830), about 100 drawings and all three of his lithographed views of the town [[cam_lane]]. He worked from careful measured drawings, then painted several canvases from each; see site 4.' },
  { id: 'mellen', name: 'Mary Blood Mellen', life: '1819–1886', here: 'Working with Lane from the mid-1850s', g: 'lane', works: ['mellen-gloucester-harbor', 'mellen-field-beach'],
    text: 'Born in Vermont and schooled in watercolor at a girls’ academy, Mellen married a Universalist minister in 1840. When his brother took the Gloucester pulpit in 1855, she came into Lane’s orbit and was soon working beside him, free to copy his drawings and sometimes his canvases. One painting carries both signatures. The museum notes she is often called a “copyist”, and that Lane plainly respected her work [[cam_mellen]].' },
  { id: 'hunt', name: 'William Morris Hunt', life: '1824–1879', here: 'Summer studio at Magnolia, 1870s', g: 'hunt_bricher', works: ['hunt-gloucester-harbor', 'hunt-sand-bank'],
    text: 'Hunt brought the French Barbizon painters’ ideas to Boston and taught John La Farge and both William and Henry James. His summer studio in Magnolia drew other artists to Cape Ann, and from 1868 he opened his classes to women, many from Boston’s leading families [[cam_hunt]].' },
  { id: 'homer', name: 'Winslow Homer', life: '1836–1910', here: 'Summers of 1873 and 1880', g: 'homer', works: ['homer-breezing-up', 'homer-eastern-point-light'],
    text: 'Homer left the studio in Gloucester. In 1873 he painted outdoors and made himself a master of watercolor, almost to the exclusion of oil; in 1880 he boarded on Ten Pound Island in the middle of the harbor [[cam_homer]]. Both summers are on the guide’s map as sites 1 and 2.' },
  { id: 'duveneck', name: 'Frank Duveneck', life: '1848–1919', here: 'About fifteen summers from 1890', g: 'others', works: ['duveneck-horizon', 'duveneck-braces-rock'],
    text: 'In 1890 the Kentucky-born painter brought a summer class of students from Boston and the Cincinnati Academy, apparently the first large class of its kind in town, and he went on to paint about a hundred Gloucester pictures [[antiques]]. He drew others after him, among them Theodore Wendel, Joseph DeCamp, John W. Alexander and John Twachtman. He is said to have kept two studios, one for the morning light and one for the afternoon [[cam_duveneck]].' },
  { id: 'twachtman', name: 'John H. Twachtman', life: '1853–1902', here: 'Summers of 1900–1902, East Gloucester', g: 'twachtman', works: ['twachtman-fishing-boats', 'twachtman-nbmaa'],
    text: 'Twachtman spent his last summers at the Harbor View Hotel in East Gloucester, painting the boats and wharves. His view of the hotel from the end of its pier was on his easel when he died there in August 1902 [[jht_201]]; Duveneck had been painting beside him only days before [[antiques]]. Through his pupil Leon Kroll, his influence reached Edward Hopper [[cam_kroll]].' },
  { id: 'beaux', name: 'Cecilia Beaux', life: '1855–1942', here: 'Eastern Point, mid-1880s–1942', g: 'others', works: ['beaux-half-tide'],
    text: 'Philadelphia’s great portraitist, and from 1895 to 1915 the first woman to teach at the Pennsylvania Academy, Beaux first came with her family in the mid-1880s and stayed at the Fairview Inn. Fame cost her privacy, so in 1903 she rented a cottage on Eastern Point and by 1906 had built Green Alley, her house and studio there. Her 1930 memoir, <i>Background with Figures</i>, credits her family for planting what grew for her in Gloucester [[cam_beaux]].' },
  { id: 'prendergast', name: 'Maurice Prendergast', life: '1858–1924', here: 'About 1907–1923', g: 'prendergast', works: ['prendergast-barnes', 'prendergast-glimpse'],
    text: 'Prendergast made more than 2,300 paintings and drawings, many of them New England beaches. In his Gloucester watercolors a loose pencil sketch guided rather than governed the brush: he changed his mind as he went, so that figures turned into rocks, and he sharpened edges with touches of pastel [[cam_prendergast]].' },
  { id: 'kroll', name: 'Leon Kroll', life: '1884–1974', here: '1912; Folly Cove from the 1930s', g: null, works: [],
    text: 'Twachtman’s student at the Art Students League, Kroll found Cézanne in Paris and showed at the 1913 Armory Show [[cam_kroll]]. He brought Edward Hopper to Gloucester in 1912 [[cam_hopper]]. From the 1930s he and his wife Genevieve summered at Folly Cove near Halibut Point, bought a house there in 1944, and counted Paul Manship, Walker Hancock and Virginia Lee Burton among their friends [[cam_kroll]]. He also painted the Bass Rocks footbridge that Rothko later sketched [[cr_918]].' },
  { id: 'hopper', name: 'Edward Hopper', life: '1882–1967', here: '1912, 1923, 1924, 1926 and 1928', g: 'modern', works: ['hopper-mansard', 'hopper-haskells-house'],
    text: 'Hopper’s 1912 oils are solid and dark. In 1923 he courted Josephine Nivison here and, at her urging, took up watercolor; the next summer the newlyweds came back on an extended honeymoon, exploring by foot and streetcar [[cam_hopper]]. By 1928 his Gloucester sales had bought him a car [[ryan]]. The <a href="{up}trails/hopper.html">Hopper trail</a> finds twelve of his subjects.' },
  { id: 'sloan', name: 'John Sloan', life: '1871–1951', here: 'Summers of 1914–1918', g: 'modern', works: [],
    text: 'After the 1913 Armory Show, the Ashcan painter went looking for new ground. His friend Charles Winter urged Gloucester, and from 1914 Sloan rented a little red cottage at the head of Rocky Neck for five summers. It filled with painters: Stuart Davis, Agnes Richmond, Charles and Alice Beach Winter, Paul Cornoyer, Paul Tietjens. The Cape Ann Museum owns eight of his Gloucester pictures [[cam_sloan]]. The cottage still stands at 252 East Main Street [[rnat_pdf]].' },
  { id: 'davis', name: 'Stuart Davis', life: '1892–1964', here: 'Summers of 1915–1934', g: 'modern', works: [],
    text: 'Sloan invited him in 1915, and Davis called Gloucester “the place I had been looking for”. He came back for many summers through 1934, drawn to the schooners and the clutter of the docks. In time he left the easel and canvases behind and went out with only a sketchbook and pen, and in Gloucester he began combining several views and moments in one picture, the Cubist idea that runs through his later work [[cam_davis]].' },
  { id: 'demuth', name: 'Charles Demuth', life: '1883–1935', here: 'Summer of 1919', g: 'modern', works: ['demuth-gloucester', 'demuth-box-of-tricks'],
    text: 'In 1919 Demuth painted Gloucester’s masts, roofs and church towers outdoors, cutting them into the ruled, transparent planes that became Precisionism [[pafa_box]]. The RISD Museum’s <i>Gloucester</i> has released its image to the public domain [[risd_demuth]].' },
  { id: 'hartley', name: 'Marsden Hartley', life: '1877–1943', here: '1920, 1931 and 1934', g: 'modern', works: [],
    text: 'Hartley shunned the busy waterfront for Dogtown, the abandoned colonial settlement in the middle of Cape Ann, which he thought looked like a cross between Easter Island and Stonehenge. He wrote poems on the backs of some of the paintings [[cam_hartley]]. In 1931 he boarded with the Wilkens family at 9 Rocky Neck Avenue, treating the summer as a warm-up for a Guggenheim-funded trip to Mexico [[rnat_pdf]].' },
  { id: 'bernstein', name: 'Theresa Bernstein and William Meyerowitz', life: '1890–2002 · 1887–1981', here: 'Summers from 1916 and 1919', g: 'colony', works: ['bernstein-rabbits', 'meyerowitz-town-street'],
    text: 'Bernstein first came in 1916 on a friend’s advice. Meyerowitz, born in Russia, had paid for his training by singing in the Metropolitan Opera; the two met through the People’s Art Guild and married in 1919 [[cam_meyerowitz]]. In the early 1920s Ellen Day Hale lent them a Folly Cove cottage, and Bernstein’s <i>New England Ladies</i> (1925) records an elderberry-wine party there, guest by guest [[cam_bernstein]]. Meyerowitz’s <i>Gloucester Humoresque</i> marks the founding in 1922 of the North Shore Arts Association, which juried its shows, and the Gloucester Society of Artists, which proudly did not [[cam_meyerowitz]].' },
  { id: 'avery', name: 'Milton Avery', life: '1885–1965', here: 'Most summers from 1920 to 1945', g: 'avery', works: ['avery-dawn'],
    text: 'Avery’s first Gloucester pictures still owe something to Twachtman; over his Cape Ann summers the forms flattened and the color took over. He held to one rule: simplify anything, invent nothing. In 1932 he brought his young friends Gottlieb, Rothko and Barnett Newman [[cam_avery]]. The museum dates his first visit to 1920; the Rocky Neck Art Colony says 1921 [[rnat_avery]].' },
  { id: 'rothko', name: 'Mark Rothko', life: '1903–1970', here: '1932, 1934 and 1945', g: 'avery', works: ['rothko-wharf-cam', 'rothko-handball'],
    text: 'In 1934 Rothko and his wife, Edith Sachar, reached Gloucester before the Gottliebs and took the Calder Street house the Gottliebs had wanted [[cr_4098]]. He painted the fish wharfs from Banner Hill, the bathers, and his friends at handball; the catalogue raisonné lists 38 Gloucester sheets [[cr_search]]. In 1965 he gave the memorial address for Avery, calling him above all a great poet [[cam_avery]]. The <a href="{up}trails/rothko.html">Rothko trail</a> has every sheet you can see.' },
  { id: 'gruppe', name: 'Emile Gruppé', life: '1896–1978', here: 'Rocky Neck from 1929', g: 'colony', works: ['gruppe-draggers'],
    text: 'Gruppé opened the Gloucester School of Art on Rocky Neck in 1929 and ran it for thirty years. His advice to students: think of a shape first, not of a horse or a tree or a boat [[cam_gruppe]].' },
  { id: 'blaine', name: 'Nell Blaine', life: '1922–1996', here: '1943; Rocky Neck 1954 and 1958; East Gloucester 1974–1996', g: 'later', works: ['blaine-harbor-green-cloth', 'blaine-wharf-studio'],
    text: 'A Hans Hofmann student and a founder of New York’s Jane Street Gallery, Blaine first came in 1943 and rented Rocky Neck studios in 1954 and 1958. <i>Time</i> named her one of five leading women artists in America in 1957. Two years later polio left her in a wheelchair; she learned to paint again, and from 1974 summered at Eudora Cottage in East Gloucester, painting her garden, the ledges and the harbor [[cam_blaine]].' }
  ]
},
/* ------------------------------------------------------------------ gallery */
gallery: {
  lead: 'Paintings made at the guide’s sites by visitors and local painters. Every entry is sent in by the painter, checked by hand and published with their permission.',
  entries: []
},

/* ------------------------------------------------------------------ translations */
i18n: {
pt: { lang: 'pt-PT', name: 'Português', title: 'Pintar Gloucester: guia de campo', kicker: 'Em português',
  lead: 'Um guia gratuito para pintar no Cape Ann, no Massachusetts: os lugares onde os grandes pintores americanos trabalharam, para onde olhavam e como lá chegar hoje.',
  intro: 'Gloucester é o porto de pesca mais antigo dos Estados Unidos, e a comunidade portuguesa e açoriana faz parte da sua história há mais de um século: a igreja de Nossa Senhora da Boa Viagem, no alto da Prospect Street, foi pintada por Edward Hopper e por Jo Nivison no verão de 1923. Esta página resume os nove lugares do guia. O resto do site está em inglês.',
  how: 'Para cada lugar: onde ficar, para onde olhar e as notas de acesso. Os mapas, o planeador do sol e as imagens das pinturas estão no guia interativo (em inglês).',
  stand: 'Ficar em', face: 'Olhar para', away: 'a', dir: 'Direções', more: 'Página completa (inglês)', open: 'Abrir o guia interativo',
  practical: 'Antes de ir', tips: ['Consulte a tabela de marés: a amplitude média no porto é de quase 2,7 metros. Não fique em rochas molhadas com a maré a subir.', 'Vários pontos de vista históricos estão hoje em terreno privado ou só são acessíveis por barco. Pinte a partir de caminhos públicos.', 'O estacionamento nas praias de Good Harbor e Wingaersheek é pago e, para não residentes, tem de ser reservado no verão.', 'Leve o seu lixo, não bloqueie passeios nem entradas e peça licença antes de pintar pessoas.'],
  more2: 'Também em inglês', links: [['Os percursos', 'trails/'], ['Lojas de material e ateliês', 'shops.html'], ['Notas de campo: paletas e luz', 'field-notes.html']],
  compass: { N: 'norte', NNE: 'norte-nordeste', NE: 'nordeste', ENE: 'leste-nordeste', E: 'leste', ESE: 'leste-sudeste', SE: 'sudeste', SSE: 'sul-sudeste', S: 'sul', SSW: 'sul-sudoeste', SW: 'sudoeste', WSW: 'oeste-sudoeste', W: 'oeste', WNW: 'oeste-noroeste', NW: 'noroeste', NNW: 'norte-noroeste' },
  sites: {
    'fort-point': ['Fort Point, a olhar para Ten Pound Island', 'Fitz Henry Lane pintou a ilha a partir de um cais em Fort Point, nos anos 1850. Os cais desapareceram e o farol foi substituído em 1881. Não confirmámos acesso público à costa em Fort Point; a ilha também se vê de um caminho público em Rocky Neck.'],
    'ten-pound': ['Ten Pound Island, a olhar para a saída do porto', 'Winslow Homer viveu na ilha com o faroleiro no verão de 1880. A ilha pertence à cidade e tem caminhos até ao farol, mas não há cais; o farol é da Guarda Costeira e está fechado. Sem barco, pinte a ilha a partir de Rocky Neck.'],
    'banner-hill': ['Banner Hill, sobre Smith Cove', 'Willard Metcalf e Childe Hassam pintaram o porto a partir desta colina, nos anos 1890. O alto é hoje propriedade privada; veja a vista da estrada. Vá de manhã: à tarde a cidade fica em contraluz.'],
    'braces-cove': ['Brace’s Cove, Eastern Point', 'Lane desenhou a rocha em agosto de 1863, da costa a norte da enseada. Não confirmámos acesso público à costa hoje. Vá ao fim da tarde, com o sol pelas costas.'],
    'normans-woe': ['Norman’s Woe, a costa oeste', 'Lane desenhou a rocha da costa, a olhar para sul, em 1861. Com a maré baixa chega-se lá pelas rochas; com a maré alta é uma ilha. Vá na última meia hora antes do pôr do sol.'],
    'coffins-beach': ['The Loaf, ao longo de Coffin’s Beach', 'Lane desenhou a vista das rochas do Loaf em agosto de 1862. Não verificámos o acesso à praia. Esteja no lugar antes do nascer do sol e pinte os primeiros vinte minutos.'],
    'eastern-point': ['Eastern Point, a olhar para a cidade', 'Frank Duveneck pintou o horizonte da cidade a partir de Eastern Point. O farol é da Guarda Costeira e está fechado. Não suba ao quebra-mar de Dog Bar quando as ondas passam por cima das pedras.'],
    'annisquam': ['Farol de Annisquam, na foz do rio', 'H. Bolton Jones pintou a praia junto ao farol. Hoje o farol vê-se da praia de Wingaersheek, do outro lado do rio, onde o estacionamento de verão tem de ser reservado.'],
    'harbor-view': ['Wonson’s Cove, a última tela de Twachtman', 'John Twachtman pintou o Harbor View Hotel da ponta do cais do hotel; o quadro estava no cavalete quando morreu, em agosto de 1902. O hotel desapareceu; o lugar fica na Eastern Point Road, a pé desde Rocky Neck.']
  } },
it: { lang: 'it', name: 'Italiano', title: 'Dipingere Gloucester: guida sul campo', kicker: 'In italiano',
  lead: 'Una guida gratuita per dipingere a Cape Ann, nel Massachusetts: i luoghi dove hanno lavorato i grandi pittori americani, dove guardavano e come arrivarci oggi.',
  intro: 'Gloucester è il più antico porto peschereccio degli Stati Uniti, e la comunità italiana ne fa parte da oltre un secolo: nel 1912 Edward Hopper dipinse le case dei pescatori del Fort, il quartiere italiano, che compare nel suo <i>Italian Quarter, Gloucester</i>. Questa pagina riassume i nove luoghi della guida. Il resto del sito è in inglese.',
  how: 'Per ogni luogo: dove mettersi, dove guardare e le note sull’accesso. Le mappe, il calcolatore del sole e le immagini dei dipinti sono nella guida interattiva (in inglese).',
  stand: 'Mettersi a', face: 'Guardare verso', away: 'a', dir: 'Indicazioni', more: 'Pagina completa (inglese)', open: 'Apri la guida interattiva',
  practical: 'Prima di partire', tips: ['Controllate la tabella delle maree: l’escursione media nel porto è di quasi 2,7 metri. Non restate su scogli bagnati con la marea che sale.', 'Diversi punti di vista storici sono oggi su terreno privato o raggiungibili solo in barca. Dipingete da luoghi pubblici.', 'Il parcheggio alle spiagge di Good Harbor e Wingaersheek è a pagamento e, per i non residenti, va prenotato d’estate.', 'Portate via i rifiuti, non bloccate marciapiedi e passi carrai e chiedete il permesso prima di ritrarre qualcuno.'],
  more2: 'Anche in inglese', links: [['I percorsi', 'trails/'], ['Negozi di belle arti e atelier', 'shops.html'], ['Note sul campo: tavolozze e luce', 'field-notes.html']],
  compass: { N: 'nord', NNE: 'nord-nordest', NE: 'nordest', ENE: 'est-nordest', E: 'est', ESE: 'est-sudest', SE: 'sudest', SSE: 'sud-sudest', S: 'sud', SSW: 'sud-sudovest', SW: 'sudovest', WSW: 'ovest-sudovest', W: 'ovest', WNW: 'ovest-nordovest', NW: 'nordovest', NNW: 'nord-nordovest' },
  sites: {
    'fort-point': ['Fort Point, verso Ten Pound Island', 'Fitz Henry Lane dipinse l’isola da un molo di Fort Point negli anni Cinquanta dell’Ottocento. I moli sono scomparsi e il faro fu sostituito nel 1881. Non abbiamo potuto confermare un accesso pubblico alla riva di Fort Point; l’isola si vede anche da un passaggio pubblico a Rocky Neck.'],
    'ten-pound': ['Ten Pound Island, verso l’uscita del porto', 'Winslow Homer visse sull’isola con il guardiano del faro nell’estate del 1880. L’isola è del comune e ha sentieri fino al faro, ma non c’è un approdo; il faro appartiene alla Guardia Costiera ed è chiuso. Senza barca, dipingete l’isola da Rocky Neck.'],
    'banner-hill': ['Banner Hill, sopra Smith Cove', 'Willard Metcalf e Childe Hassam dipinsero il porto da questa collina negli anni Novanta dell’Ottocento. La cima è oggi proprietà privata; la vista si gode dalla strada. Andate di mattina: nel pomeriggio la città è in controluce.'],
    'braces-cove': ['Brace’s Cove, Eastern Point', 'Lane disegnò lo scoglio nell’agosto 1863, dalla costa a nord dell’insenatura. Non abbiamo verificato l’accesso pubblico alla riva. Andate nel tardo pomeriggio, con il sole alle spalle.'],
    'normans-woe': ['Norman’s Woe, la costa occidentale', 'Lane disegnò lo scoglio dalla riva, guardando a sud, nel 1861. Con la bassa marea ci si arriva sugli scogli; con l’alta marea è un’isola. Andate nell’ultima mezz’ora prima del tramonto.'],
    'coffins-beach': ['The Loaf, lungo Coffin’s Beach', 'Lane disegnò la veduta dagli scogli del Loaf nell’agosto 1862. Non abbiamo verificato l’accesso alla spiaggia. Siate sul posto prima dell’alba e dipingete i primi venti minuti.'],
    'eastern-point': ['Eastern Point, verso la città', 'Frank Duveneck dipinse il profilo della città da Eastern Point. Il faro appartiene alla Guardia Costiera ed è chiuso. Non salite sul frangiflutti di Dog Bar quando le onde superano le pietre.'],
    'annisquam': ['Il faro di Annisquam, alla foce del fiume', 'H. Bolton Jones dipinse la spiaggia accanto al faro. Oggi il faro si vede dalla spiaggia di Wingaersheek, sull’altra riva, dove d’estate il parcheggio va prenotato.'],
    'harbor-view': ['Wonson’s Cove, l’ultima tela di Twachtman', 'John Twachtman dipinse l’Harbor View Hotel dalla punta del molo dell’albergo; il quadro era sul cavalletto quando morì, nell’agosto 1902. L’albergo non c’è più; il luogo è in Eastern Point Road, a piedi da Rocky Neck.']
  } }
}
};
