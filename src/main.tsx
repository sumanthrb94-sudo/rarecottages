import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Base styles first, so component styles can override them.
import './styles/global.css';
import { App } from './App';
import { site } from './config/site';

if (import.meta.env.DEV && /^9?10+$/.test(site.whatsapp)) {
  console.warn('[Rare Cottages] Placeholder contact details in src/config/site.ts — replace before launch.');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
