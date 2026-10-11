import { card, wide } from './photos';
import type { Car, Offer, Package, Property } from './types';

/**
 * Sample catalogue for pitch / demo builds only (see src/config/demo.ts).
 *
 * These spaces, cars and packages are illustrative: names, prices,
 * capacities and distances are placeholders that show how the product scales, not signed
 * inventory. Every item is flagged `sample: true` and its photos
 * `representative: true`, so the UI badges them as "Sample".
 *
 * Images: one entry per photo in docs/image-shotlist.json. Until Gemini
 * images are generated (docs/IMAGE-HANDOFF.md), placeholders stand in.
 */
const rep = { representative: true } as const;

function sampleProperty(p: Omit<Property, 'card' | 'wide' | 'sample' | 'area'> & { alt: string }): Property {
  const { alt, ...rest } = p;
  return {
    ...rest,
    area: 'Rajahmundry',
    card: card(p.id, alt, rep),
    wide: wide(p.id, alt, rep),
    sample: true,
  };
}

export const sampleProperties: Property[] = [
  sampleProperty({
    id: 'sample-riverbend-villa',
    name: 'Riverbend Villa',
    distanceKm: 12,
    tagline: 'A riverside villa with an infinity pool and a sunset deck.',
    description:
      'A four-bedroom villa on the Godavari with an infinity pool that faces the river, a sunset deck and an open lawn for bonfire nights.',
    hasPool: true,
    highlights: ['Infinity pool', 'River view', 'Sunset deck', 'Bonfire lawn'],
    alt: 'Riverside villa with an infinity pool at sunset',
  }),
  sampleProperty({
    id: 'sample-palm-haven',
    name: 'Palm Haven Farm Stay',
    distanceKm: 18,
    tagline: 'A coconut-farm stay with a private pool and hammocks.',
    description:
      'Wake up among coconut palms in a tiled-roof farmhouse with a private pool, hammocks and a courtyard made for long lunches.',
    hasPool: true,
    highlights: ['Private pool', 'Coconut farm', 'Courtyard', 'Hammocks'],
    alt: 'Tiled-roof farmhouse with a pool among coconut palms',
  }),
  sampleProperty({
    id: 'sample-sunset-glasshouse',
    name: 'Sunset Glasshouse',
    distanceKm: 9,
    tagline: 'A glass-walled cottage for slow mornings and quiet nights.',
    description: 'A glass-walled cottage in a garden of frangipani, with a fire pit, a reading nook and a deck for stargazing.',
    hasPool: false,
    highlights: ['Glass walls', 'Fire pit', 'Garden deck'],
    alt: 'Glass-walled cottage in a lush garden at golden hour',
  }),
  sampleProperty({
    id: 'sample-azure-pool-lounge',
    name: 'Azure Pool Lounge',
    distanceKm: 4,
    tagline: 'A poolside lounge you can book by the hour.',
    description: 'A shaded poolside lounge with sun loungers, a snack bar and a music system, booked by the hour for small groups.',
    hasPool: true,
    highlights: ['Pool access', 'Sun loungers', 'Music system'],
    alt: 'Poolside lounge with sun loungers and umbrellas',
  }),
  sampleProperty({
    id: 'sample-skyline-deck',
    name: 'Skyline Rooftop Deck',
    distanceKm: 2,
    tagline: 'A rooftop deck under fairy lights, by the hour.',
    description: 'An open rooftop with string lights, lounge seating and a view over the city: for get-togethers, surprises and small parties.',
    hasPool: false,
    highlights: ['Rooftop', 'String lights', 'Lounge seating'],
    alt: 'Rooftop deck with string lights and lounge seating at dusk',
  }),
  sampleProperty({
    id: 'sample-lantern-garden',
    name: 'Lantern Garden Cafe',
    distanceKm: 5,
    tagline: 'A garden cafe strung with lanterns, for birthdays.',
    description: 'A leafy garden cafe with paper lanterns and long tables, ready for birthdays and surprise parties with cake and decor.',
    hasPool: false,
    highlights: ['Garden seating', 'Lanterns', 'Cafe menu'],
    alt: 'Garden cafe with paper lanterns over long tables',
  }),
  sampleProperty({
    id: 'sample-neon-room',
    name: 'The Neon Room',
    distanceKm: 3,
    tagline: 'A party hall with a DJ booth and a dance floor.',
    description: 'An indoor party hall with neon accents, a DJ booth, a dance floor and a stage for the cake cutting.',
    hasPool: false,
    highlights: ['DJ booth', 'Dance floor', 'Stage'],
    alt: 'Party hall with neon lights, a DJ booth and a dance floor',
  }),
  sampleProperty({
    id: 'sample-riverfront-lawns',
    name: 'Riverfront Lawns',
    distanceKm: 14,
    tagline: 'Sprawling lawns on the river for grand weddings.',
    description: 'Manicured lawns along the river with space for a mandap, a reception stage and dining for large weddings.',
    hasPool: false,
    highlights: ['River frontage', 'Mandap space', 'Large parking'],
    alt: 'Wedding mandap with marigold decor on a riverside lawn',
  }),
  sampleProperty({
    id: 'sample-heritage-courtyard',
    name: 'Heritage Courtyard',
    distanceKm: 25,
    tagline: 'A pillared courtyard for haldi, sangeeth and receptions.',
    description: 'A traditional pillared courtyard with brass lamps and a central lawn, styled for haldi, mehendi and sangeeth nights.',
    hasPool: false,
    highlights: ['Pillared courtyard', 'Traditional decor', 'Haldi & sangeeth'],
    alt: 'Traditional pillared courtyard decorated for a haldi ceremony',
  }),
];

export const sampleOffers: Offer[] = [
  { id: 'sample-riverbend-night', propertyId: 'sample-riverbend-villa', category: 'night-stay', price: 22000, unit: 'night', capacity: { max: 12 } },
  { id: 'sample-palm-haven-night', propertyId: 'sample-palm-haven', category: 'night-stay', price: 12000, unit: 'night', capacity: { max: 10 } },
  { id: 'sample-glasshouse-night', propertyId: 'sample-sunset-glasshouse', category: 'night-stay', price: 9500, unit: 'night', capacity: { max: 4 } },
  { id: 'sample-azure-hourly', propertyId: 'sample-azure-pool-lounge', category: 'hourly-stay', price: 1500, unit: 'hour', capacity: { min: 4, max: 20 } },
  { id: 'sample-skyline-hourly', propertyId: 'sample-skyline-deck', category: 'hourly-stay', price: 2500, unit: 'hour', capacity: { min: 10, max: 40 } },
  { id: 'sample-skyline-party', propertyId: 'sample-skyline-deck', category: 'party-space', price: 3000, unit: 'hour', capacity: { min: 10, max: 40 } },
  { id: 'sample-lantern-party', propertyId: 'sample-lantern-garden', category: 'party-space', price: 2500, unit: 'hour', capacity: { min: 15, max: 40 } },
  { id: 'sample-neon-party', propertyId: 'sample-neon-room', category: 'party-space', price: 4000, unit: 'hour', capacity: { min: 20, max: 60 } },
  { id: 'sample-riverfront-event', propertyId: 'sample-riverfront-lawns', category: 'event-space', price: 75000, unit: 'event', durationHours: 15, capacity: { min: 300, max: 800 } },
  { id: 'sample-heritage-event', propertyId: 'sample-heritage-courtyard', category: 'event-space', price: 45000, unit: 'event', durationHours: 12, capacity: { min: 100, max: 300 } },
];

export const sampleCars: Car[] = [
  {
    id: 'sample-luxury-suv',
    name: 'Luxury SUV',
    description: 'A seven-seater SUV for family trips, airport runs and arriving together.',
    goodFor: ['Family trips', 'Airport runs', 'Weddings'],
    seats: 7,
    photo: card('sample-luxury-suv', 'White luxury SUV on a palm-lined road', rep),
    sample: true,
  },
  {
    id: 'sample-vintage-convertible',
    name: 'Vintage Convertible',
    description: 'A classic open-top car decked with flowers for the wedding entry and the photo shoot.',
    goodFor: ['Wedding entries', 'Photo shoots'],
    seats: 2,
    photo: card('sample-vintage-convertible', 'Vintage convertible decorated with flowers', rep),
    sample: true,
  },
  {
    id: 'sample-tempo-traveller',
    name: 'Tempo Traveller',
    description: 'A twelve-seater for moving guests between the venue, hotels and the station.',
    goodFor: ['Wedding guests', 'Group outings'],
    seats: 12,
    photo: card('sample-tempo-traveller', 'Twelve-seater passenger van outside a venue', rep),
    sample: true,
  },
];

export const samplePackages: Package[] = [
  {
    id: 'sample-anniversary',
    title: ['Anniversary', 'Package'],
    price: 9000,
    includes: ['Candlelight table', '½kg cake', 'Flower decor', '30-min couple shoot'],
    appliesTo: ['night-stay', 'party-space'],
    image: card('sample-anniversary', 'Candlelit dinner table with flowers by a pool', rep),
    sample: true,
  },
  {
    id: 'sample-bride-to-be',
    title: ['Bride-to-be', 'Package'],
    price: 18000,
    includes: ['Theme decor', '1kg cake', 'Mocktail bar', '1min reel', '20 edited photos'],
    appliesTo: ['party-space', 'hourly-stay'],
    image: card('sample-bride-to-be', 'Bride-to-be party decor with balloons and a cake', rep),
    sample: true,
  },
  {
    id: 'sample-baby-shower',
    title: ['Baby Shower', 'Package'],
    price: 15000,
    includes: ['Pastel decor', '1kg cake', 'Welcome drinks', 'Games host', '10 edited photos'],
    appliesTo: ['party-space'],
    image: card('sample-baby-shower', 'Pastel baby shower decor with balloons', rep),
    sample: true,
  },
  {
    id: 'sample-team-day-out',
    title: ['Team Day-out', 'Package'],
    price: 25000,
    includes: ['Venue for 6 hours', 'Lunch buffet', 'Projector & sound', 'Group photos'],
    appliesTo: ['event-space', 'hourly-stay'],
    image: card('sample-team-day-out', 'Team lunch setup on a garden lawn', rep),
    sample: true,
  },
];
