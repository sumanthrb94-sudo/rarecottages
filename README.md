# Rare Cottages

**Stay . Relax . Celebrate.** The website for Rare Cottages: farm houses, villas, party spaces and event venues in and around Rajahmundry, with cakes, decor, photography and rental cars arranged alongside.

Visitors pick a service, filter by date, guests, budget and swimming pool, open a space, build their booking (nights or hours, packages, add-ons) and send it as a ready-written WhatsApp message with an estimated total. No backend or payments are needed to go live.

## Colour system

The logo's four coloured tiles each stand for one service. Black and white are the shared brand.

| Service | Logo tile | Used for |
| --- | --- | --- |
| Night Stay | green `#05AE0D` | farm houses & villas, priced per night |
| Hourly Stay | yellow `#F2B30C` | spaces bookable by the hour |
| Party Space | blue `#0C76FE` | birthdays & get-togethers, cakes & packages |
| Event Space | red `#F10F10` | weddings & functions, make-up, catering, photography |
| Shared pages | black & white | home, add-ons, rental cars, about, contact, header & footer |

Each service page, its listings, and every space opened from it take on that service's colour. Themes are CSS custom properties keyed by `data-theme` (`brand`, `night`, `hourly`, `party`, `event`) in `src/styles/global.css`:

- `--brand` is the exact logo hue.
- `--bg` / `--bg-deep` are deep shades of that hue, so white text stays readable.
- `--accent` is the button colour.
- `--tint` is a light tint for icons on dark backgrounds.

Colour is never the only cue: every coloured element also carries the service's icon and name.

## Editing content

All content lives in typed data files. Edit them without touching any components:

| File | What's in it |
| --- | --- |
| `src/config/site.ts` | Business name, **phone, WhatsApp number, email, Instagram**, service area, "Powered by" |
| `src/data/listings.ts` | Spaces (`properties`) and their prices per service (`offers`) |
| `src/data/addons.ts` | Add-ons (cake sizes, decor, photographer, make-up, catering, wedding photography partner) and packages |
| `src/data/categories.ts` | The four services: names, blurbs, theme |
| `src/data/cars.ts` | Rental cars |
| `public/images/` | Photos (wide shots at `-800.webp` and `-1600.webp`, wired up in `src/data/photos.ts`) |

A space can be listed under several services with different prices. For example, Seera Studio Space is ₹25,000 per night as a Night Stay and ₹30,000 per event as an Event Space. Any offer priced per hour also appears under Hourly Stay.

### Before launch

- [ ] Replace the placeholder phone, WhatsApp and email in `src/config/site.ts`. WhatsApp links go nowhere until this is done, and the dev server logs a warning.
- [ ] Confirm the name of **The Palm Grove**. The mockups show this venue's photo without a name.
- [ ] Add guest capacities for the night stays and the rental car fleet and rates. These weren't in the mockups, so the site shows "ask us" instead.
- [ ] Confirm Seera Studio Space has a pool. It's shown in the client's Night Stay mockup with the pool filter on.

## Development

Requires Node 20.19+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests: filters, pricing, WhatsApp message
npm run typecheck
npm run build      # production build in dist/
npm run preview    # serve the production build
```

Stack: React 19, React Router, TypeScript and Vite, with plain CSS (no UI framework) and lucide icons. Fonts are Antonio, Archivo Black, Poppins and Yellowtail from Google Fonts.

```
src/
  config/site.ts        business details
  data/                 spaces, offers, add-ons, packages, categories, cars
  lib/                  filters, enquiry pricing + WhatsApp message, formatting, hooks
  components/           header, footer, search controls, cards, carousel, enquiry builder
  pages/                home, category (×4), space detail, add-ons, cars, about, contact, 404
  styles/global.css     tokens, themes, base styles
```

## Deploying

It's a static single-page app, so any static host works once it rewrites unknown paths to `index.html`.

- **Vercel**: import the repo. `vercel.json` already handles the rewrites.
- **Netlify**: build command `npm run build`, publish directory `dist`. `public/_redirects` handles the rewrites.
