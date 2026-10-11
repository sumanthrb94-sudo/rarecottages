import type { CategorySlug, PriceUnit, Theme } from './types';

export interface Category {
  slug: CategorySlug;
  name: string;
  theme: Theme;
  blurb: string;
  /** Short line for the home page tiles and menus. */
  hint: string;
}

/**
 * The four ways to book. Colours follow the four tiles of the logo:
 * green for stays, yellow for hourly, blue for parties, red for events.
 */
export const categories: Category[] = [
  {
    slug: 'night-stay',
    name: 'Night Stay',
    theme: 'night',
    hint: 'Farm houses & villas',
    blurb: 'Private farm houses and villas with pools, for overnight getaways with family and friends.',
  },
  {
    slug: 'hourly-stay',
    name: 'Hourly Stay',
    theme: 'hourly',
    hint: 'Book by the hour',
    blurb: 'Need a place for just a few hours? These spaces can be booked by the hour.',
  },
  {
    slug: 'party-space',
    name: 'Party Space',
    theme: 'party',
    hint: 'Birthdays & get-togethers',
    blurb: 'Birthdays, surprises and get-togethers, with cakes, decor and reels sorted for you.',
  },
  {
    slug: 'event-space',
    name: 'Event Space',
    theme: 'event',
    hint: 'Weddings & functions',
    blurb: 'Weddings, receptions, haldi and sangeeth, with make-up, catering and photography on call.',
  },
];

export function getCategory(slug: string | undefined): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export const unitLabel: Record<PriceUnit, { per: string; qty: string; qtyPlural: string }> = {
  night: { per: 'per night', qty: 'night', qtyPlural: 'nights' },
  hour: { per: 'per hour', qty: 'hour', qtyPlural: 'hours' },
  event: { per: 'per event', qty: 'event', qtyPlural: 'events' },
};
