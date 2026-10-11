import { photos } from './photos';
import type { CategorySlug, Offer, Property } from './types';

/**
 * Every bookable place. Prices and capacities come from the client's mockups;
 * fields the mockups did not specify are left out rather than guessed, and the
 * UI shows "ask us" instead.
 */
// TODO(client): add each space's road distance from Rajahmundry as `distanceKm` so the distance filter covers it.
const realProperties: Property[] = [
  {
    id: 'br-farm-house',
    name: 'B.R Farm House',
    tagline: 'A private farm house built around a big blue pool.',
    description:
      'Spend the night by a sweeping, curved pool with plenty of deck space to lounge on. A relaxed farm house getaway for families and friends.',
    area: 'Rajahmundry',
    hasPool: true,
    highlights: ['Swimming pool', 'Pool deck', 'Private stay'],
    card: photos.brFarmCard,
    wide: photos.brFarmWide,
  },
  {
    id: 'into-the-triangle',
    name: 'Into The Triangle',
    tagline: 'An A-frame villa with a glowing pool deck.',
    description:
      'A striking A-frame villa with a lit-up pool, sun loungers and a rooftop deck. Made for late-night pool sessions and stays with your crew.',
    area: 'Rajahmundry',
    hasPool: true,
    highlights: ['Swimming pool', 'A-frame villa', 'Rooftop deck', 'Outdoor seating'],
    card: photos.triangleCard,
    wide: photos.triangleWide,
  },
  {
    id: 'seera-studio-space',
    name: 'Seera Studio Space',
    tagline: 'Sculpted lawns for big celebrations and stays.',
    description:
      'Manicured lawns, white lion sculptures and a grand pergola entrance. Book it for a night stay, or take over the whole venue for weddings, receptions and functions of 100 to 250 guests.',
    area: 'Rajahmundry',
    // Listed with the swimming pool filter switched on in the client's Night Stay mockup.
    hasPool: true,
    highlights: ['Landscaped lawn', 'Photo-ready sculptures', 'Large gatherings'],
    card: photos.seeraCard,
    wide: photos.seeraWide,
  },
  {
    id: 'brimmies-all-day-cafe',
    name: 'Brimmies All Day Cafe',
    tagline: 'A cosy cafe for birthdays and small parties.',
    description:
      'An all-day cafe you can book by the hour for birthdays, surprises and small get-togethers. Pair it with a cake and our birthday package for a hassle-free party.',
    area: 'Rajahmundry',
    hasPool: false,
    highlights: ['Cafe', 'Book by the hour'],
    card: photos.brimmiesCard,
  },
  {
    // TODO(client): the mockups show this venue's photo without a name; rename as needed.
    id: 'palm-grove',
    name: 'The Palm Grove',
    tagline: 'A tiled-roof cottage under the coconut palms.',
    description:
      'A traditional tiled-roof cottage surrounded by coconut palms. Book it by the hour for parties, or for the day for intimate events of up to 80 guests.',
    area: 'Rajahmundry',
    hasPool: false,
    highlights: ['Coconut grove', 'Tiled-roof cottage'],
    card: photos.palmGroveCard,
  },
];

const realOffers: Offer[] = [
  { id: 'br-farm-night', propertyId: 'br-farm-house', category: 'night-stay', price: 15000, unit: 'night' },
  { id: 'triangle-night', propertyId: 'into-the-triangle', category: 'night-stay', price: 18000, unit: 'night' },
  { id: 'seera-night', propertyId: 'seera-studio-space', category: 'night-stay', price: 25000, unit: 'night' },

  { id: 'brimmies-party', propertyId: 'brimmies-all-day-cafe', category: 'party-space', price: 2000, unit: 'hour', capacity: { min: 10, max: 25 } },
  { id: 'palm-grove-party', propertyId: 'palm-grove', category: 'party-space', price: 3000, unit: 'hour', capacity: { min: 10, max: 80 } },

  { id: 'seera-event', propertyId: 'seera-studio-space', category: 'event-space', price: 30000, unit: 'event', durationHours: 15, capacity: { min: 100, max: 250 } },
  { id: 'palm-grove-event', propertyId: 'palm-grove', category: 'event-space', price: 35000, unit: 'event', capacity: { min: 10, max: 80 } },
];

// Demo builds load the sample catalogue; in production `__DEMO__` is false and this import is dropped.
const samples = __DEMO__ ? await import('./samples') : null;

/** Live listings, plus the sample catalogue in demo builds. */
export const properties: Property[] = samples ? [...realProperties, ...samples.sampleProperties] : realProperties;
export const offers: Offer[] = samples ? [...realOffers, ...samples.sampleOffers] : realOffers;

const propertyById = new Map(properties.map((p) => [p.id, p]));

export function getProperty(id: string): Property | undefined {
  return propertyById.get(id);
}

export function getOffer(id: string): Offer | undefined {
  return offers.find((o) => o.id === id);
}

export function offersForProperty(propertyId: string): Offer[] {
  return offers.filter((o) => o.propertyId === propertyId);
}

/**
 * Offers listed under a category. Hourly Stay also picks up every space that is
 * priced by the hour, so it is never empty while hourly-priced spaces exist.
 */
export function offersForCategory(category: CategorySlug): Offer[] {
  if (category === 'hourly-stay') {
    return offers.filter((o) => o.category === 'hourly-stay' || o.unit === 'hour');
  }
  return offers.filter((o) => o.category === category);
}

/** The cheapest offer listed under a service, for "From ₹X per night" lines. Undefined when nothing is listed. */
export function startingPrice(category: CategorySlug): { price: number; unit: Offer['unit'] } | undefined {
  const list = offersForCategory(category);
  if (!list.length) return undefined;
  const cheapest = list.reduce((a, b) => (b.price < a.price ? b : a));
  return { price: cheapest.price, unit: cheapest.unit };
}
