import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  define: {
    // Pitch / demo build: `npm run build:demo` (mode "demo") or VITE_DEMO=1 in the environment.
    // A compile-time constant, so production bundles drop the sample catalogue entirely.
    __DEMO__: JSON.stringify(mode === 'demo' || process.env.VITE_DEMO === '1'),
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
}));
