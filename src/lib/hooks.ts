import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { site } from '../config/site';
import type { Theme } from '../data/types';
import { filtersToParams, parseFilters, type Filters } from './filters';

/** Filters kept in the URL, so searches can be shared and survive navigation. */
export function useFilterParams(): [Filters, (next: Filters) => void] {
  const [params, setParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(params), [params]);
  const setFilters = useCallback(
    (next: Filters) => {
      setParams(
        (prev) => {
          const merged = filtersToParams(next);
          // keep unrelated params (e.g. ?for=) intact
          for (const [key, value] of prev) {
            if (!['date', 'guests', 'budget', 'pool'].includes(key)) merged.set(key, value);
          }
          return merged;
        },
        { replace: true, preventScrollReset: true },
      );
    },
    [setParams],
  );
  return [filters, setFilters];
}

const DEFAULT_DESCRIPTION =
  'Book farm houses, villas, party spaces and event venues in and around Rajahmundry.';

export function usePageMeta(title: string | undefined, description = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline} | ${site.city}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [title, description]);
}

/** Paints the page (and the overscroll area) in a category's colours. */
export function usePageTheme(theme: Theme) {
  useEffect(() => {
    document.body.dataset.theme = theme;
    const colours: Record<Theme, string> = {
      brand: '#141414',
      night: '#0e4a25',
      hourly: '#5c4100',
      party: '#0b3d91',
      event: '#7a0e0f',
    };
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colours[theme]);
  }, [theme]);
}
