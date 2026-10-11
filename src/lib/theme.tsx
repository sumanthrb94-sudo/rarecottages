import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Mode = 'light' | 'dark';
export type ModePreference = Mode | 'system';

const STORAGE_KEY = 'rc-mode';
const media = () => window.matchMedia('(prefers-color-scheme: dark)');

function readPreference(): ModePreference {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === 'light' || v === 'dark' || v === 'system') return v;
  } catch {
    /* storage blocked: fall back to the system setting */
  }
  return 'system';
}

function applyMode(mode: Mode) {
  const root = document.documentElement;
  root.dataset.mode = mode;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', mode === 'dark' ? '#000000' : '#ffffff');
}

interface ThemeValue {
  mode: Mode;
  preference: ModePreference;
  setPreference: (p: ModePreference) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPref] = useState<ModePreference>(readPreference);
  const [systemDark, setSystemDark] = useState(() => media().matches);

  useEffect(() => {
    const m = media();
    const onChange = () => setSystemDark(m.matches);
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, []);

  const mode: Mode = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useEffect(() => applyMode(mode), [mode]);

  const setPreference = useCallback((p: ModePreference) => {
    setPref(p);
    try {
      localStorage.setItem(STORAGE_KEY, p);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<ThemeValue>(
    () => ({ mode, preference, setPreference, toggle: () => setPreference(mode === 'dark' ? 'light' : 'dark') }),
    [mode, preference, setPreference],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
}
