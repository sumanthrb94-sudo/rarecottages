import { useCallback, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { site } from '../config/site';
import { FILTER_PARAMS, filtersToParams, parseFilters, type Filters } from './filters';

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
            if (!(FILTER_PARAMS as readonly string[]).includes(key)) merged.set(key, value);
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
