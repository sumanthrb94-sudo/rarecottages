# Rare Cottages

**Stay . Relax . Celebrate.** The website for Rare Cottages: farm houses, villas, party spaces and event venues in and around Rajahmundry, with cakes, decor, photography and rental cars arranged alongside.

Visitors:
1. pick a service
2. filter by date, guests, budget and swimming pool
3. open a space and build their booking (nights or hours, packages, add-ons)
4. send it as a ready-written WhatsApp message with an estimated total.

No backend or payments are needed to go live.

## Design

- **Uber-style minimal.** Black, white and greys do the work, with bold Inter type, generous space and rounded cards.
- **Light and dark mode.** It follows the system setting by default, the sun/moon button in the top bar switches modes, and the choice is remembered. Tokens live in `src/styles/tokens.css`.
- **App-like on phones.** The top bar shows the Rajahmundry location, and a bottom tab bar has Home, Spaces, Add-ons, Cars and Contact. Filters and the enquiry builder open as bottom sheets, cards sit in edge-to-edge rails, and a space page has its own bottom action bar.
- **Motion** comes from [`motion`](https://motion.dev):
  - fade-in-blur page and section reveals
  - staggered lists
  - spring taps
  - sliding active indicators
  - a rolling-digit price total

  The recipes follow ibelick/motion-primitives, as used by the mint-motion skill. Reduced-motion settings are respected.
- **Icons** are [Tabler Icons](https://tabler.io/icons), imported only through `src/components/ui/icons.ts`. Tabler has 5,900+ MIT icons in outline and filled styles, brand marks included.

### Colour system

Colour is reserved for the four services. Each owns one tile of the logo:

| Service | Logo tile | `data-service` |
| --- | --- | --- |
| Night Stay | green `#05AE0D` | `night` |
| Hourly Stay | yellow `#F2B30C` | `hourly` |
| Party Space | blue `#0C76FE` | `party` |
| Event Space | red `#F10F10` | `event` |

Put `data-service="…"` on any element to get its tokens:

- `--svc`: the logo colour, for fills like icon tiles, dots, switches and sliders
- `--svc-text`: the same hue tuned for readable text in light and dark mode
- `--svc-soft`: a faint tint
- `--svc-on`: text on a solid fill

Shared pages stay black and white. Colour is never the only cue: services always show their icon and name.

## Editing content

All content lives in typed data files. Edit them without touching any components:

| File | What's in it |
| --- | --- |
| `src/config/site.ts` | Business name, **phone, WhatsApp number, email, Instagram**, service area, "Powered by" |
| `src/data/listings.ts` | Spaces (`properties`) and their prices per service (`offers`) |
| `src/data/addons.ts` | Add-ons (cake sizes, decor, photographer, make-up, catering, wedding photography partner) and packages |
| `src/data/categories.ts` | The four services: names, blurbs, colour |
| `src/data/cars.ts` | Rental cars |
| `src/data/photos.ts`, `public/images/` | Photos: 4:3 cards (`-card-480/900.webp`) and wide heroes (`-wide-800/1400.webp`) |

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

Stack: React 19, React Router 7, TypeScript and Vite, with plain CSS, `motion`, Tabler Icons and self-hosted Inter (`@fontsource-variable/inter`).

```
src/
  config/site.ts          business details
  data/                   spaces, offers, add-ons, packages, categories, cars, photos
  lib/                    filters, enquiry pricing + WhatsApp message, formatting, theme (light/dark), hooks
  components/ui/          design system: icons, buttons, chips, forms, sheet, cards, motion primitives
  components/shell/       top bar, mobile tab bar, footer, page transitions
  components/<page>/      page-specific pieces (home, category, space, info)
  pages/                  home, service listing, space detail, add-ons, cars, about, contact, 404
  styles/                 tokens.css (light/dark + service colours), base.css
```

## Deploying to Vercel

The repo is ready for Vercel with zero configuration in the dashboard:

1. On [vercel.com/new](https://vercel.com/new), import the GitHub repository.
2. Leave the settings as detected and click **Deploy**. `vercel.json` already sets:
   - framework Vite
   - `npm ci` and then `npm run build`, which typechecks then builds
   - output directory `dist`
   - Node 22, via `engines` in `package.json` and `.nvmrc`
3. Every push to the production branch redeploys, and every other branch or PR gets a preview URL.

`vercel.json` also sets:

- **SPA routing.** Real files are served first, then every other path falls back to `index.html`, so deep links like `/spaces/seera-studio-space` work on refresh.
- **Caching.** Hashed `/assets/*` are cached for a year (immutable), and `/images/*` for a week.
- **Security headers.** `nosniff`, a strict referrer policy, no framing, and camera, mic and location turned off.

From the command line: `npx vercel` for a preview, `npx vercel --prod` for production.

Other static hosts work too. **Netlify** uses build command `npm run build` and publish directory `dist`, and `public/_redirects` handles the routing.
