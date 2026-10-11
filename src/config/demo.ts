/**
 * Pitch / demo mode. Run `npm run dev:demo` or build with `npm run build:demo`
 * (or set VITE_DEMO=1 in the build environment, e.g. on a Vercel preview).
 *
 * Demo builds add the sample catalogue in src/data/samples.ts: extra spaces,
 * cars and packages, each badged "Sample". Production builds never include it.
 */
export const DEMO: boolean = __DEMO__;
