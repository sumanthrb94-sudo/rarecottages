import type { Offer, Property } from '../data/types';

export const BUDGET_MIN = 1000;
export const BUDGET_MAX = 50000;
export const BUDGET_STEP = 500;
/** "Within N km of Rajahmundry" choices; the service area itself reaches about 30 km. */
export const DISTANCE_OPTIONS = [5, 10, 20] as const;

export interface Filters {
  /** YYYY-MM-DD */
  date?: string;
  guests?: number;
  /** Maximum price in rupees. Undefined means any budget. */
  budget?: number;
  /** Only show spaces within this many km of Rajahmundry. Undefined means any distance. */
  maxKm?: number;
  /** Only show spaces with a swimming pool. */
  pool: boolean;
}

export const emptyFilters: Filters = { pool: false };

function positiveInt(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

export function parseFilters(params: URLSearchParams): Filters {
  const date = params.get('date') ?? undefined;
  const budget = positiveInt(params.get('budget'));
  const km = positiveInt(params.get('km'));
  return {
    date: date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : undefined,
    guests: positiveInt(params.get('guests')),
    budget: budget !== undefined && budget < BUDGET_MAX ? budget : undefined,
    maxKm: km,
    pool: params.get('pool') === '1',
  };
}

export function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.date) params.set('date', filters.date);
  if (filters.guests) params.set('guests', String(filters.guests));
  if (filters.budget !== undefined && filters.budget < BUDGET_MAX) params.set('budget', String(filters.budget));
  if (filters.maxKm) params.set('km', String(filters.maxKm));
  if (filters.pool) params.set('pool', '1');
  return params;
}

export function hasActiveFilters(filters: Filters): boolean {
  return Boolean(filters.guests || filters.budget !== undefined || filters.maxKm || filters.pool);
}

/** URL params the filters own; anything else in the query string (e.g. ?for=) is left alone. */
export const FILTER_PARAMS = ['date', 'guests', 'budget', 'km', 'pool'] as const;

/**
 * Whether an offer fits the filters. Unknown data never hides a space: an offer
 * with no stated capacity passes the guest filter, and a space with no stated
 * distance passes the distance filter, so visitors can still ask.
 */
export function matchesFilters(offer: Offer, property: Property, filters: Filters): boolean {
  if (filters.pool && !property.hasPool) return false;
  if (filters.maxKm && property.distanceKm !== undefined && property.distanceKm > filters.maxKm) return false;
  if (filters.budget !== undefined && offer.price > filters.budget) return false;
  if (filters.guests && offer.capacity && filters.guests > offer.capacity.max) return false;
  return true;
}
