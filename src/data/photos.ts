import type { Photo } from './types';

/**
 * Photos live in /public/images and are produced by `npm run images`
 * (see scripts/images.mjs and docs/IMAGE-HANDOFF.md).
 *   card:   4:3,   files <name>-card-480.webp and <name>-card-900.webp
 *   wide:   ~2:1,  files <name>-wide-800.webp and <name>-wide-1400.webp
 *   square: 1:1,   files <name>-square-480.webp and <name>-square-900.webp
 */
interface PhotoOptions {
  /** Set when the image is AI-generated or stock rather than the real place. */
  representative?: boolean;
  /** False when only the small (480w) file exists. */
  large?: boolean;
}

export function card(name: string, alt: string, { representative, large = true }: PhotoOptions = {}): Photo {
  return {
    src: `/images/${name}-card-480.webp`,
    srcSet: large ? `/images/${name}-card-480.webp 480w, /images/${name}-card-900.webp 900w` : undefined,
    width: 480,
    height: 360,
    alt,
    representative,
  };
}

export function wide(name: string, alt: string, { representative }: PhotoOptions = {}): Photo {
  return {
    src: `/images/${name}-wide-1400.webp`,
    srcSet: `/images/${name}-wide-800.webp 800w, /images/${name}-wide-1400.webp 1400w`,
    width: 1400,
    height: 682,
    alt,
    representative,
  };
}

export function square(name: string, alt: string, { representative }: PhotoOptions = {}): Photo {
  return {
    src: `/images/${name}-square-480.webp`,
    srcSet: `/images/${name}-square-480.webp 480w, /images/${name}-square-900.webp 900w`,
    width: 480,
    height: 480,
    alt,
    representative,
  };
}

export const photos = {
  brFarmCard: card('br-farm', 'Curved swimming pool with steps at B.R Farm House'),
  brFarmWide: wide('br-farm', 'Curved swimming pool with steps at B.R Farm House'),
  triangleCard: card('triangle', 'A-frame villa with a lit pool deck at Into The Triangle, at night'),
  triangleWide: wide('triangle', 'A-frame villa with a lit pool deck at Into The Triangle, at night'),
  seeraCard: card('seera', 'Landscaped lawn with white lion sculptures at Seera Studio Space'),
  seeraWide: wide('seera', 'Landscaped lawn with white lion sculptures at Seera Studio Space'),
  brimmiesCard: card('brimmies', 'Front of Brimmies All Day Cafe', { large: false }),
  palmGroveCard: card('palm-grove', 'Tiled-roof cottage under coconut palms', { large: false }),
  /** Client banners with the title baked into the photo. */
  cottagesBanner: wide('cottage', 'Open-air cottage pavilion in a forest, titled Real Rare Cottages'),
  carsBanner: wide('car', 'Black sedan parked by a lake, titled Rental Cars'),
  rcStudios: { src: '/images/rc-studios.webp', width: 700, height: 588, alt: 'Wedding Photography by RC Studios logo' },
} satisfies Record<string, Photo>;
