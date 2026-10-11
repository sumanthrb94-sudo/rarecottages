import { photos } from './photos';
import type { AddOn, CategorySlug, Package } from './types';

const ALL: CategorySlug[] = ['night-stay', 'hourly-stay', 'party-space', 'event-space'];

export const addOns: AddOn[] = [
  {
    id: 'cake',
    name: 'Celebration Cake',
    short: 'Cake',
    description: 'Freshly made cakes delivered to your venue, ready for the big moment.',
    options: [
      { id: 'cake-1kg', label: '1 kg', price: 899 },
      { id: 'cake-half', label: '½ kg', price: 499 },
    ],
    appliesTo: ALL,
  },
  {
    id: 'decor',
    name: 'Decors',
    short: 'Decors',
    description: 'Balloons, backdrops, lights and theme decor set up before you arrive.',
    appliesTo: ALL,
  },
  {
    id: 'photographer',
    name: 'Photographer & Reel Maker',
    short: 'Photographer / Reel Maker',
    description: 'Candid photos and short, share-ready reels of your celebration.',
    appliesTo: ALL,
  },
  {
    id: 'wedding-photography',
    name: 'Wedding Photography',
    short: 'Wedding Photography',
    description: 'Full wedding coverage by our photography partner, RC Studios.',
    includes: ['Haldi', 'Sangeeth', 'Reception', 'Wedding', 'Album', '4K video'],
    partner: { name: 'RC Studios', logo: photos.rcStudios },
    appliesTo: ['event-space'],
  },
  {
    id: 'makeup',
    name: 'Make-up',
    short: 'Make-up',
    description: 'Make-up artists for the bride, groom and family, at the venue.',
    appliesTo: ['event-space', 'party-space'],
  },
  {
    id: 'catering',
    name: 'Catering',
    short: 'Catering',
    description: 'Menus for every function size, served at your venue.',
    appliesTo: ['event-space', 'party-space'],
  },
];

const realPackages: Package[] = [
  {
    id: 'birthday',
    title: ['Birthday', 'Package'],
    price: 12000,
    includes: ['1kg cake', 'Welcome drink', 'Samosa & Sweet', 'Decor', '1min reel', '10 edited photos'],
    appliesTo: ['party-space', 'hourly-stay'],
  },
];

const samples = __DEMO__ ? await import('./samples') : null;

/** Live packages, plus sample packages in demo builds. */
export const packages: Package[] = samples ? [...realPackages, ...samples.samplePackages] : realPackages;

export function addOnsFor(category: CategorySlug): AddOn[] {
  return addOns.filter((a) => a.appliesTo.includes(category));
}

export function packagesFor(category: CategorySlug): Package[] {
  return packages.filter((p) => p.appliesTo.includes(category));
}

export function getAddOn(id: string): AddOn | undefined {
  return addOns.find((a) => a.id === id);
}
