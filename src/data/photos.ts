import type { Photo } from './types';

/**
 * Photos live in /public/images, cut from the client's mockups.
 * Cards are 4:3 (480w, plus 900w when the source allows); wide shots are about 2:1 (800w / 1400w).
 */
function card(name: string, alt: string, large = true): Photo {
  return {
    src: `/images/${name}-card-480.webp`,
    srcSet: large ? `/images/${name}-card-480.webp 480w, /images/${name}-card-900.webp 900w` : undefined,
    width: 480,
    height: 360,
    alt,
  };
}

function wide(name: string, alt: string): Photo {
  return {
    src: `/images/${name}-wide-1400.webp`,
    srcSet: `/images/${name}-wide-800.webp 800w, /images/${name}-wide-1400.webp 1400w`,
    width: 1400,
    height: 682,
    alt,
  };
}

export const photos = {
  brFarmCard: card('br-farm', 'Curved swimming pool with steps at B.R Farm House'),
  brFarmWide: wide('br-farm', 'Curved swimming pool with steps at B.R Farm House'),
  triangleCard: card('triangle', 'A-frame villa with a lit pool deck at Into The Triangle, at night'),
  triangleWide: wide('triangle', 'A-frame villa with a lit pool deck at Into The Triangle, at night'),
  seeraCard: card('seera', 'Landscaped lawn with white lion sculptures at Seera Studio Space'),
  seeraWide: wide('seera', 'Landscaped lawn with white lion sculptures at Seera Studio Space'),
  brimmiesCard: card('brimmies', 'Front of Brimmies All Day Cafe', false),
  palmGroveCard: card('palm-grove', 'Tiled-roof cottage under coconut palms', false),
  /** Client banners with the title baked into the photo. */
  cottagesBanner: wide('cottage', 'Open-air cottage pavilion in a forest, titled Real Rare Cottages'),
  carsBanner: wide('car', 'Black sedan parked by a lake, titled Rental Cars'),
  carCard: card('car', 'Black sedan parked by a lake'),
  rcStudios: { src: '/images/rc-studios.webp', width: 700, height: 588, alt: 'Wedding Photography by RC Studios logo' },
} satisfies Record<string, Photo>;
