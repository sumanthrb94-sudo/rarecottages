# Image handoff: Gemini images for the Rare Cottages pitch build

The pitch/demo build needs the 25 images in [`image-shotlist.json`](./image-shotlist.json), generated with Gemini, optimised, and live in the build.

Who it's for: an agent in Antigravity (or a person) with Gemini image generation.

The plumbing is already done. Branded placeholders stand in for every image today, so you only:
1. generate
2. save under the right name
3. run one command

## 1. What this is for

- **Pitch / demo build** (`npm run dev:demo`, `npm run build:demo`). It shows the full product to investors with a sample catalogue:
  - 9 extra spaces across the four services
  - 3 cars
  - 4 packages

  Every sample is labelled **Sample** in the UI, and a slim "Preview" ribbon sits at the top. The data is in `src/data/samples.ts`.
- **Live site** (`npm run build`). It never includes samples; a test enforces this. Real listings keep the client's real photos.
- **Optional, both builds.** Mood images for the four service pages and photos for add-ons (cake, decor, photographer, make-up, catering). Their slots exist and stay hidden until filled; see §7.

## 2. Ground rules

1. **Never present an AI image as a real property.** AI images go only on:
   - samples
   - service moods
   - add-ons and packages
   - real listings explicitly marked `representative: true`. This shows a "Representative image" badge, and is only for a stopgap until the real photo arrives.
2. **Don't add or rename real listings, prices or capacities.** Real data comes from the client.
3. **Pitch honestly.** The samples show how the product scales, not signed partners. Keep real traction numbers separate.
4. **Clean images only.**
   - No text, logos, brand names, signage or watermarks.
   - No recognisable faces; people appear small, from behind or out of focus.
   - No real landmarks presented as a venue.
5. **Stay on-brand.** Use the house style in §4: realistic, natural light, set in the Godavari delta around Rajahmundry. No cartoon or 3D-render look, no oversaturated HDR.

## 3. Setup

```bash
npm install
npm run dev:demo        # http://localhost:5173 with the sample catalogue + placeholders
npm run images -- --check   # lists every shot-list image still on a placeholder
```

Requires Node 22. `sharp` (used by `npm run images`) installs with the dev dependencies.

## 4. Gemini settings and house style

- **Model:** Gemini's image model, **Gemini 3 Pro Image ("Nano Banana Pro")** or the newest Gemini image model you have.
- **Aspect ratio:** use the shot list's `aspect` field.
  - `card` images: **4:3**
  - `wide` images: **21:9**. The site's wide frame is about 2.05:1, which Gemini doesn't offer; the pipeline crops it.
- **Resolution:** 2K or higher. Minimums are 900×675 for cards and 1400×682 for wides; the script warns if a source is smaller.
- **Prompt:** build every prompt from three parts in the shot list, in this order:

  ```
  <entry.prompt>. <shotlist.style> <shotlist.negative>
  ```

  - `style`: photorealistic hospitality photography, natural light, Godavari delta setting (coconut palms, Mangalore-tiled roofs, the river)
  - `negative`: no text or logos, no faces to camera, no distortion, no 3D-render look
- **Consistency:** each sample space has a `card` and a `wide` image of the same place.
  1. Generate the **card first**.
  2. In the same chat, ask for the **wide** version "of the same property, same architecture and materials, wider establishing view". Attaching the card as a reference image helps.
- **Re-roll** rather than accept a flaw: warped pool edges, melted furniture, garbled text, extra limbs, floating objects.

### Example (copy-paste ready)

> A modern two-storey villa with white walls and timber accents on the bank of the Godavari river, an infinity pool on the terrace that seems to merge with the river, sun loungers, warm lights coming on at golden hour. Photorealistic hospitality photography, full-frame camera, 24-35mm lens, natural light, warm but true-to-life colours (no oversaturation, no HDR halos), clean uncluttered composition with breathing room. Setting: Rajahmundry, Andhra Pradesh, India, in the Godavari delta: coconut palms, banana plants, red Mangalore-tiled roofs, lush greenery, the wide Godavari river. No text, letters, signage, logos, brand names or watermarks. No people facing the camera (people only small, from behind or out of focus). No distorted architecture, no fisheye, no cartoon or 3D-render look.

Aspect ratio 4:3. Save the result as `images-src/sample-riverbend-villa.card.png`.

## 5. The workflow, per image

1. Pick the next entry from `npm run images -- --check`, or from `images[]` in `docs/image-shotlist.json`.
2. Generate it in Gemini with the settings above.
3. Save the original as **`images-src/<name>.<shape>.png`**, using `name` and `shape` from the entry, e.g. `images-src/sample-neon-room.card.png`. JPG and WebP also work. `images-src/` is git-ignored, so originals are never committed.
4. Run:

   ```bash
   npm run images -- sample-neon-room   # or plain `npm run images` for everything in images-src/
   ```

   This writes `public/images/<name>-<shape>-<width>.webp` at the sizes the site uses (card 480 and 900, wide 800 and 1400), with a smart crop. It also removes the entry from `docs/image-placeholders.json`.
5. Look at it in `npm run dev:demo`, on the listing card and the space page, in light and dark mode, on phone and desktop width.
6. Repeat. When `npm run images -- --check` says **"All shot-list images are real renders."**, you're done.

No code changes are needed for the 25 shot-list images. The data already points at these file names.

## 6. Quality checklist (each image)

- [ ] Matches the entry's prompt and the space's description and alt text in `src/data/samples.ts` (e.g. "infinity pool facing the river").
- [ ] Card and wide of the same space look like the same place.
- [ ] No text, logos, watermarks or faces; nothing warped.
- [ ] Reads well small: the card crop at 480px still shows the subject.
- [ ] Plausible for Rajahmundry: tropical, Godavari region, not alpine chalets or desert resorts.
- [ ] Optimised file exists: `npm test` passes, which checks every referenced image file exists.

## 7. Optional images (both builds)

These are in `optional[]` in the shot list. They are AI moods and illustrations, not specific properties, so they're fine on the live site once approved by the client.

1. Generate and save them the same way, then run `npm run images`.
2. Wire each one in its data file:
   - **Service page moods** (`category-*.wide`), in `src/data/categories.ts`:

     ```ts
     import { wide } from './photos';
     // in the Night Stay entry:
     image: wide('category-night-stay', 'Private villa pool at blue hour under coconut palms', { representative: true }),
     ```

     They show as a 21:9 banner under the service title.
   - **Add-on photos** (`addon-*.card`), in `src/data/addons.ts`:

     ```ts
     import { card } from './photos';
     // in the cake entry:
     image: card('addon-cake', 'Two-tier celebration cake with fresh flowers'),
     ```

     They show at the top of the add-on card on `/add-ons`.
3. Run `npm test` to confirm the files exist and the alt text is present.

## 8. Adding more samples (bigger pitch)

1. Add a `sampleProperty({...})` entry and one or more offers to `src/data/samples.ts`. Keep ids starting with `sample-`.
2. Add matching `card` and `wide` entries to `images[]` in `docs/image-shotlist.json`, with the same `name` as the id.
3. Run `npm run images -- --placeholders` so the demo works immediately, then generate the real images as in §5.
4. Run `npm test`. It checks that samples are flagged, their images exist, and no sample can reach the live build.

Cars and packages work the same way (`sampleCars`, `samplePackages`).

## 9. Real listings (live site)

- Real spaces go in `src/data/listings.ts`, with the client's real photos:
  1. save them as `images-src/<property-id>.card.jpg` and `.wide.jpg`
  2. run `npm run images`
  3. reference them with `card('<property-id>', alt)` and `wide('<property-id>', alt)`
- **Real car:** ask the client for the original Premium Sedan photo without the "Rental Cars" title.
  1. save it as `images-src/premium-sedan.card.jpg`
  2. run `npm run images`
  3. set `photo: card('premium-sedan', 'Black premium sedan')` in `src/data/cars.ts`
- **AI stopgap:** if a real listing must temporarily use an AI image, pass `{ representative: true }`. The UI then badges it "Representative image". Replace it with the real photo as soon as possible.

## 10. Deploying the pitch build on Vercel

The repo deploys as-is (`vercel.json`). For a stable pitch URL, use one of these.

- **Recommended:** a second Vercel project from the same repo.
  1. Name it, for example, `rarecottages-pitch`.
  2. Add the environment variable **`VITE_DEMO=1`** (Production).
  3. Deploy. Every push redeploys the pitch site; the main project stays real-only.
- **Same project:** set `VITE_DEMO=1` for the **Preview** environment, scoped to a `pitch` branch, and push that branch.
- **One-off from the CLI:** `npx vercel deploy --build-env VITE_DEMO=1`

## 11. Definition of done

- `npm run images -- --check` prints "All shot-list images are real renders."
- `npm run typecheck`, `npm test` and `npm run build:demo` all pass.
- The demo has been checked by eye in light and dark mode, on phone and desktop:
  - Home
  - all four service pages
  - a sample space page
  - Rental Cars
  - Add-ons (packages)
- The new `public/images/*.webp` files and the updated `docs/image-placeholders.json` are committed. `images-src/` is not.
