import { describe, expect, it } from 'vitest';
import { getProperty, offers, offersForCategory } from '../data/listings';
import { BUDGET_MAX, filtersToParams, matchesFilters, parseFilters, type Filters } from './filters';

function matching(category: Parameters<typeof offersForCategory>[0], filters: Filters) {
  return offersForCategory(category)
    .filter((o) => matchesFilters(o, getProperty(o.propertyId)!, filters))
    .map((o) => o.id);
}

describe('parseFilters / filtersToParams', () => {
  it('round-trips every filter through the URL', () => {
    const filters: Filters = { date: '2026-10-10', guests: 20, budget: 18000, pool: true };
    expect(parseFilters(filtersToParams(filters))).toEqual(filters);
  });

  it('drops malformed and out-of-range values', () => {
    const parsed = parseFilters(new URLSearchParams('date=10/oct/2026&guests=-3&budget=abc&pool=yes'));
    expect(parsed).toEqual({ date: undefined, guests: undefined, budget: undefined, pool: false });
  });

  it('treats the top of the budget slider as "any budget"', () => {
    expect(parseFilters(new URLSearchParams(`budget=${BUDGET_MAX}`)).budget).toBeUndefined();
    expect(filtersToParams({ pool: false, budget: BUDGET_MAX }).has('budget')).toBe(false);
  });
});

describe('matchesFilters', () => {
  it('lists all three night stays from the mockup with the pool filter on', () => {
    expect(matching('night-stay', { pool: true })).toEqual(['br-farm-night', 'triangle-night', 'seera-night']);
  });

  it('filters by budget', () => {
    expect(matching('night-stay', { pool: false, budget: 18000 })).toEqual(['br-farm-night', 'triangle-night']);
  });

  it('filters by guest capacity but keeps spaces with unknown capacity', () => {
    expect(matching('party-space', { pool: false, guests: 40 })).toEqual(['palm-grove-party']);
    expect(matching('night-stay', { pool: false, guests: 40 })).toHaveLength(3);
  });

  it('shows hourly-priced spaces under Hourly Stay', () => {
    expect(matching('hourly-stay', { pool: false })).toEqual(['brimmies-party', 'palm-grove-party']);
  });

  it('references only properties that exist', () => {
    for (const offer of offers) expect(getProperty(offer.propertyId), offer.id).toBeDefined();
  });
});
