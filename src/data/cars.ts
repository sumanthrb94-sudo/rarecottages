import type { Car } from './types';

// TODO(client): add the real fleet (model, seats, rates) here.
const realCars: Car[] = [
  {
    id: 'premium-sedan',
    name: 'Premium Sedan',
    description: 'A sleek black sedan to arrive in style at weddings, receptions and special occasions.',
    goodFor: ['Weddings', 'Receptions', 'Special occasions'],
    // TODO(client): add the original car photo (without the "Rental Cars" title) as images-src/premium-sedan.card.jpg.
  },
];

const samples = __DEMO__ ? await import('./samples') : null;

/** Live fleet, plus sample cars in demo builds. */
export const cars: Car[] = samples ? [...realCars, ...samples.sampleCars] : realCars;
