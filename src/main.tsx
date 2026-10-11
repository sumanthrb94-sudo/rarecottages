import { MotionConfig } from 'motion/react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
// Base styles first, so component styles can override them.
import './styles/base.css';
import { App } from './App';
import { ThemeProvider } from './lib/theme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  </StrictMode>,
);
