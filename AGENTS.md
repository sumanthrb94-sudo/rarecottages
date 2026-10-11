# Rare Cottages: agent guide

A React 19 + Vite + TypeScript site for booking farm houses, villas, party spaces and event venues in Rajahmundry. Bookings go out as pre-written WhatsApp messages; there is no backend.

**Image work (Gemini):** follow [`docs/IMAGE-HANDOFF.md`](docs/IMAGE-HANDOFF.md) and its shot list [`docs/image-shotlist.json`](docs/image-shotlist.json).

## Commands

```bash
npm run dev            # live site (real listings only)
npm run dev:demo       # pitch build: adds the sample catalogue, badged "Sample"
npm run images         # images-src/<name>.<card|wide|square>.png -> public/images/*.webp
npm run images -- --check   # which shot-list images are still placeholders
npm run typecheck && npm test && npm run build   # run all three before committing
```

## Where things live

- `src/data/`: all content.
  - `listings.ts`: real spaces and offers
  - `samples.ts`: demo-only samples
  - `addons.ts`, `cars.ts`, `categories.ts`
  - `photos.ts`: the `card()`, `wide()` and `square()` photo helpers
- `src/config/site.ts`: business contacts. The phone, WhatsApp and email are placeholders until the client confirms them.
- `src/components/ui/`: the design system.
  - icons: Tabler, imported only through `ui/icons.ts`
  - buttons, chips, form fields, the bottom `Sheet`, `SpaceCard`, `PackageCard`
  - motion primitives
- `src/components/shell/`: the top bar, mobile tab bar and footer.
- `src/pages/`: one file per page, plus page-specific parts in `src/components/<page>/`.
- `src/styles/tokens.css`: the light/dark tokens and service colours.

## Rules

1. **Honest content.**
   - Never invent real listings, prices, capacities, reviews or ratings.
   - AI images never represent a real property unless the photo has `representative: true`, which shows a badge.
   - Samples stay in `samples.ts` with `sample: true` and `sample-` ids. Tests enforce this.
2. **Colour = service.** Each logo colour belongs to one service:
   - green: Night Stay
   - yellow: Hourly Stay
   - blue: Party Space
   - red: Event Space

   Use `data-service="night|hourly|party|event"` and the `--svc*` tokens; everything else stays black and white. Never hard-code hex colours in components.
3. **Both modes.** Every change must look right in light and dark mode, at 360px and 1440px wide, with no horizontal overflow.
4. **Mobile feels like an app.** Keep the bottom tab bar, bottom sheets, edge-to-edge rails and ≥44px tap targets.
5. **CSS.** Use plain CSS files next to their component, with a page prefix on class names (`home-`, `cat-`, `sp-`, `info-`).
6. **Accessibility.**
   - real buttons and links
   - labelled fields
   - alt text on every photo
   - colour is never the only cue
   - motion respects reduced-motion settings
