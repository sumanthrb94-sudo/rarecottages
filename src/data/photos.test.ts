import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { addOns, packages } from './addons';
import { cars } from './cars';
import { categories } from './categories';
import { offers, properties } from './listings';
import { photos } from './photos';
import { sampleCars, sampleOffers, samplePackages, sampleProperties } from './samples';
import type { Photo } from './types';

/** Every URL a photo can request: src plus each srcSet candidate. */
function urls(photo: Photo): string[] {
  const set = photo.srcSet?.split(',').map((c) => c.trim().split(/\s+/)[0]) ?? [];
  return [photo.src, ...set];
}

const referenced: [string, Photo | undefined][] = [
  ...Object.entries(photos),
  ...[...properties, ...sampleProperties].flatMap((p) => [
    [`${p.id}.card`, p.card] as [string, Photo],
    [`${p.id}.wide`, p.wide] as [string, Photo | undefined],
  ]),
  ...[...cars, ...sampleCars].map((c) => [`car ${c.id}`, c.photo] as [string, Photo | undefined]),
  ...[...packages, ...samplePackages].map((p) => [`package ${p.id}`, p.image] as [string, Photo | undefined]),
  ...addOns.map((a) => [`add-on ${a.id}`, a.image] as [string, Photo | undefined]),
  ...categories.map((c) => [`category ${c.slug}`, c.image] as [string, Photo | undefined]),
];

describe('photos', () => {
  it('every referenced image file exists in public/', () => {
    const missing = referenced
      .filter((entry): entry is [string, Photo] => Boolean(entry[1]))
      .flatMap(([label, photo]) => urls(photo).map((u) => [label, u] as const))
      .filter(([, u]) => !existsSync(resolve('public', `.${u}`)))
      .map(([label, u]) => `${label}: ${u}`);
    expect(missing, 'run `npm run images` (see docs/IMAGE-HANDOFF.md)').toEqual([]);
  });

  it('every photo has alt text', () => {
    const noAlt = referenced.filter(([, p]) => p && !p.alt.trim()).map(([label]) => label);
    expect(noAlt).toEqual([]);
  });
});

describe('sample catalogue (demo builds only)', () => {
  it('is flagged as sample, with representative photos', () => {
    for (const p of sampleProperties) {
      expect(p.sample, p.id).toBe(true);
      expect(p.card.representative, p.id).toBe(true);
      expect(p.wide?.representative ?? true, p.id).toBe(true);
    }
    for (const c of sampleCars) expect(c.sample && c.photo?.representative, c.id).toBe(true);
    for (const p of samplePackages) expect(p.sample && p.image?.representative, p.id).toBe(true);
  });

  it('uses sample- ids and points offers at sample properties', () => {
    const ids = new Set(sampleProperties.map((p) => p.id));
    for (const id of ids) expect(id.startsWith('sample-'), id).toBe(true);
    for (const o of sampleOffers) expect(ids.has(o.propertyId), o.id).toBe(true);
  });

  it('never reaches the live site', () => {
    // Tests run without VITE_DEMO, like the production build.
    expect(properties.some((p) => p.sample)).toBe(false);
    expect(offers.some((o) => o.id.startsWith('sample-'))).toBe(false);
    expect(cars.some((c) => c.sample)).toBe(false);
    expect(packages.some((p) => p.sample)).toBe(false);
  });
});
