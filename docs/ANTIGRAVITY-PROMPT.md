# Antigravity prompt: paste this whole block

````text
You are working in the Rare Cottages repository (React 19 + Vite + TypeScript). Your job: generate the pitch-build images with Gemini, put them in the site with the repo's image script, verify, and commit. Work through every step and don't stop until the DONE check passes.

CONTEXT
- Rare Cottages books farm houses, villas, party spaces and event venues in and around Rajahmundry, Andhra Pradesh, India.
- The pitch build (`npm run dev:demo`) adds a sample catalogue: 9 spaces, 3 cars and 4 packages, in src/data/samples.ts. Each is badged "Sample" in the UI. The live build never includes samples.
- All 25 images below currently show branded placeholders. Replace each with a real Gemini render. The data already points at these file names, so no code changes are needed.

RULES
1. Change images only. Don't edit listings, names, prices, capacities or code, except the optional wiring at the end, and only if asked.
2. Never present an AI image as a real property. AI images are for samples, packages, service moods and add-ons only.
3. Clean images only:
   - no text, letters, signage, logos, brand names or watermarks
   - no people facing the camera
   - no warped architecture or furniture
   - photoreal, never cartoon or 3D-render
4. Never commit images-src/ (it is git-ignored). Commit public/images/*.webp and docs/image-placeholders.json.

SETUP
  npm install
  npm run images -- --check      # lists every image still on a placeholder

GEMINI SETTINGS
- Model: Gemini 3 Pro Image ("Nano Banana Pro"), or the newest Gemini image model available.
- Aspect ratio: card = 4:3, wide = 21:9. The pipeline crops wide to the site's 2.05:1 frame.
- Resolution: 2K or higher (minimum 900x675 for card, 1400x682 for wide).
- Full prompt = <subject from the shot list> + STYLE + NEGATIVE:
  STYLE: Photorealistic hospitality photography, full-frame camera, 24-35mm lens, natural light, warm but true-to-life colours (no oversaturation, no HDR halos), clean uncluttered composition with breathing room. Setting: Rajahmundry, Andhra Pradesh, India, in the Godavari delta: coconut palms, banana plants, red Mangalore-tiled roofs, lush greenery, the wide Godavari river.
  NEGATIVE: No text, letters, signage, logos, brand names or watermarks. No people facing the camera (people only small, from behind or out of focus). No distorted architecture, no fisheye, no cartoon or 3D-render look.
- Card and wide of the same space must look like the same place. Generate the card first. Then, in the same chat with the card attached as a reference, ask for: "The same property, same architecture and materials, wider establishing view" + the wide subject.
- Re-roll any image with flaws (warped pool edges, melted furniture, garbled text, extra limbs, floating objects) instead of accepting it.

FOR EACH IMAGE
1. Generate it with the settings above.
2. Save the original as images-src/<name>.<shape>.png, e.g. images-src/sample-neon-room.card.png.
3. Run: npm run images -- <name>
   This writes public/images/<name>-<shape>-<width>.webp at the site's sizes with a smart crop, and clears its placeholder flag.
4. Check it in `npm run dev:demo` on the listing card and the space page, in light and dark mode, at phone and desktop width.
5. QA: it matches the subject and the alt text in src/data/samples.ts; the card and wide images agree; it reads well at 480px; it is plausible for the Godavari region; nothing breaks rule 3.

SHOT LIST (25 required) — format: name.shape | aspect | label (service), then the subject
1. sample-riverbend-villa.card | 4:3 | Riverbend Villa (Night Stay)
   A modern two-storey villa with white walls and timber accents on the bank of the Godavari river, an infinity pool on the terrace that seems to merge with the river, sun loungers, warm lights coming on at golden hour
2. sample-riverbend-villa.wide | 21:9 | Riverbend Villa (Night Stay)
   Wide establishing view across the infinity pool towards the Godavari at sunset, villa on the left, palms framing the edges
3. sample-palm-haven.card | 4:3 | Palm Haven Farm Stay (Night Stay)
   A traditional farmhouse with a red Mangalore-tiled roof and a wraparound verandah in a coconut grove, a private rectangular pool in front, two hammocks between palms, late-afternoon light
4. sample-palm-haven.wide | 21:9 | Palm Haven Farm Stay (Night Stay)
   Wide view of the coconut farm with the tiled-roof farmhouse and pool in the middle distance, soft morning mist
5. sample-sunset-glasshouse.card | 4:3 | Sunset Glasshouse (Night Stay)
   A small glass-walled cottage with a black steel frame in a lush garden of frangipani trees, warm interior lights, a timber deck with a fire pit, golden hour
6. sample-sunset-glasshouse.wide | 21:9 | Sunset Glasshouse (Night Stay)
   Wide view of the glasshouse cottage glowing at blue hour with the garden and fire pit in front
7. sample-azure-pool-lounge.card | 4:3 | Azure Pool Lounge (Hourly Stay)
   A shaded poolside lounge with white sun loungers, cream umbrellas and a small snack bar, turquoise pool, bright late-morning light
8. sample-azure-pool-lounge.wide | 21:9 | Azure Pool Lounge (Hourly Stay)
   Wide view of the pool deck with loungers in a row, palms behind, calm water reflections
9. sample-skyline-deck.card | 4:3 | Skyline Rooftop Deck (Hourly Stay)
   An open rooftop deck with warm string lights overhead, low lounge sofas with cushions, potted palms, a city skyline of low-rise buildings at dusk
10. sample-skyline-deck.wide | 21:9 | Skyline Rooftop Deck (Hourly Stay)
   Wide view of the rooftop deck at dusk with string lights and the city lights beyond
11. sample-lantern-garden.card | 4:3 | Lantern Garden Cafe (Party Space)
   A leafy garden cafe with paper lanterns strung between trees over long wooden tables set for a birthday, a small cake table with a simple balloon arch, evening
12. sample-lantern-garden.wide | 21:9 | Lantern Garden Cafe (Party Space)
   Wide view of the lantern-lit garden cafe with tables set for a party
13. sample-neon-room.card | 4:3 | The Neon Room (Party Space)
   An indoor party hall with tasteful neon accent lighting in blue and pink, a DJ booth, a polished dance floor and a small stage for cake cutting, balloons at the edges, no visible text on neon
14. sample-neon-room.wide | 21:9 | The Neon Room (Party Space)
   Wide view of the party hall from the back, dance floor in the centre, DJ booth and stage ahead
15. sample-riverfront-lawns.card | 4:3 | Riverfront Lawns (Event Space)
   A grand South Indian wedding mandap decorated with marigold and white flowers on a manicured riverside lawn, rows of chairs, the Godavari behind, evening lights
16. sample-riverfront-lawns.wide | 21:9 | Riverfront Lawns (Event Space)
   Wide aerial-style view of the riverside lawns set for a wedding: mandap, dining area and fairy-lit trees
17. sample-heritage-courtyard.card | 4:3 | Heritage Courtyard (Event Space)
   A traditional pillared courtyard with carved wooden pillars and brass lamps, decorated in yellow marigolds for a haldi ceremony, low seating with cushions, warm daylight
18. sample-heritage-courtyard.wide | 21:9 | Heritage Courtyard (Event Space)
   Wide view of the heritage courtyard decorated for a sangeeth night with lights and drapes
19. sample-luxury-suv.card | 4:3 | Luxury SUV (Rental car)
   A white seven-seater luxury SUV with no visible badges or logos, parked on a palm-lined road at golden hour, three-quarter front view
20. sample-vintage-convertible.card | 4:3 | Vintage Convertible (Rental car)
   A cream vintage convertible car with no visible badges, decorated with white flowers and ribbons for a wedding entry, outside a tiled-roof house
21. sample-tempo-traveller.card | 4:3 | Tempo Traveller (Rental car)
   A white twelve-seater passenger van with no visible badges or text, parked outside a garden wedding venue, clean side view
22. sample-anniversary.card | 4:3 | Anniversary Package (Package)
   A candlelit dinner table for two beside a pool at night, rose petals, a small cake, soft fairy lights
23. sample-bride-to-be.card | 4:3 | Bride-to-be Package (Package)
   Bride-to-be party decor in blush and white: balloon arch, floral backdrop, a two-tier cake on a table, no text on banners
24. sample-baby-shower.card | 4:3 | Baby Shower Package (Package)
   Pastel baby shower setup: soft balloon garland, floral backdrop, a dessert table with a small cake, no text
25. sample-team-day-out.card | 4:3 | Team Day-out Package (Package)
   A team lunch setup on a garden lawn: long tables with white linen, a buffet counter, a small projector screen under a canopy

OPTIONAL (only if the user asks; fine on the live site after client approval)
1. category-night-stay.wide | 21:9 | Night Stay mood (Night Stay)
   A private villa pool at blue hour with warm lights, coconut palms silhouetted, calm and inviting
2. category-hourly-stay.wide | 21:9 | Hourly Stay mood (Hourly Stay)
   A bright poolside lounge at midday with loungers and umbrellas, relaxed and airy
3. category-party-space.wide | 21:9 | Party Space mood (Party Space)
   A birthday party setup in a garden cafe: balloon garland, cake table, warm string lights, no text
4. category-event-space.wide | 21:9 | Event Space mood (Event Space)
   A South Indian wedding mandap with marigold decor at dusk, warm lights, elegant and grand
5. addon-cake.card | 4:3 | Cake (Add-on)
   A two-tier celebration cake with fresh flowers on a marble table, soft daylight, shallow depth of field
6. addon-decor.card | 4:3 | Decors (Add-on)
   Balloon garland and floral backdrop for a birthday, pastel and gold, no text
7. addon-photographer.card | 4:3 | Photographer & reels (Add-on)
   A photographer with a camera and a phone gimbal at a garden party, seen from behind, bokeh fairy lights
8. addon-makeup.card | 4:3 | Make-up (Add-on)
   A bridal make-up table with brushes, jewellery and a mirror with bulbs, no faces
9. addon-catering.card | 4:3 | Catering (Add-on)
   A South Indian banquet buffet: banana leaves, brass vessels, rice, curries and sweets, warm light
Wiring, after `npm run images`:
- Service moods: in src/data/categories.ts add `image: wide('category-night-stay', '<alt text>', { representative: true })` to that category (import wide from './photos').
- Add-on photos: in src/data/addons.ts add `image: card('addon-cake', '<alt text>')` to that add-on (import card from './photos').

DONE WHEN
1. `npm run images -- --check` prints "All shot-list images are real renders."
2. `npm run typecheck && npm test && npm run build:demo` all pass.
3. You have visually checked, in light and dark mode at phone and desktop width:
   - Home
   - Night Stay, Hourly Stay, Party Space and Event Space
   - one sample space page
   - Rental Cars
   - Add-ons (packages)
4. Commit "Add Gemini renders for the pitch build" with public/images/*.webp and docs/image-placeholders.json, then push.

Full reference: docs/IMAGE-HANDOFF.md (also summarised in AGENTS.md).
````
