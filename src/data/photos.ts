import type { Photo } from './types';

/**
 * Photos live in /public/images. Wide shots are exported at 800w and 1600w;
 * pass the base name here and both sizes are wired into srcSet.
 */
function wide(name: string, alt: string): Photo {
  return {
    src: `/images/${name}-1600.webp`,
    srcSet: `/images/${name}-800.webp 800w, /images/${name}-1600.webp 1600w`,
    width: 1600,
    height: 526,
    alt,
  };
}

function single(file: string, width: number, height: number, alt: string): Photo {
  return { src: `/images/${file}`, width, height, alt };
}

export const photos = {
  brFarm: wide('br-farm', 'Curved swimming pool with steps at B.R Farm House'),
  triangle: wide('triangle', 'A-frame villa with a lit pool deck at Into The Triangle, at night'),
  seeraWide: wide('seera-wide', 'Landscaped lawn with white lion sculptures at Seera Studio Space'),
  seeraSquare: single('seera-square.webp', 561, 558, 'Garden entrance with a lion sculpture at Seera Studio Space'),
  brimmies: single('brimmies-square.webp', 561, 558, 'Front of Brimmies All Day Cafe'),
  palmGrove: single('palm-grove.webp', 561, 345, 'Tiled-roof cottage under coconut palms'),
  cottagesBanner: wide('cottage', 'Open-air cottage pavilion in a forest, labelled Real Rare Cottages'),
  carsBanner: wide('car', 'Black sedan parked by a lake, labelled Rental Cars'),
  rcStudios: single('rc-studios.webp', 700, 588, 'Wedding Photography by RC Studios logo'),
} satisfies Record<string, Photo>;
