import { motion } from 'motion/react';
import { unitLabel } from '../../data/categories';
import { getProperty, offersForProperty } from '../../data/listings';
import { photos } from '../../data/photos';
import type { Photo } from '../../data/types';
import { formatINR } from '../../lib/format';
import { easeOut, springSoft } from '../ui/motion';
import { ServiceIcon } from '../ui/primitives';

interface Tile {
  photo: Photo;
  shape: 'tall' | 'wide';
}

const columns: Tile[][] = [
  [
    { photo: photos.brFarmCard, shape: 'tall' },
    { photo: photos.seeraCard, shape: 'wide' },
  ],
  [
    { photo: photos.triangleCard, shape: 'wide' },
    { photo: photos.palmGroveCard, shape: 'tall' },
  ],
];

/** A small floating card with a real listing's name and starting price. */
function ListingBadge({ propertyId, className, delay }: { propertyId: string; className: string; delay: number }) {
  const property = getProperty(propertyId);
  const offer = property && offersForProperty(property.id)[0];
  if (!property || !offer) return null;
  return (
    <motion.div
      className={`home-collage__badge ${className}`}
      initial={{ opacity: 0, y: 16, scale: 0.92, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ ...springSoft, delay }}
    >
      <div className="home-collage__badge-card home-collage__float" style={{ animationDelay: `${-delay * 4}s` }}>
        <ServiceIcon slug={offer.category} size={38} tilt={-6} />
        <div className="home-collage__badge-text">
          <span className="home-collage__badge-name">{property.name}</span>
          <span className="home-collage__badge-price tabular">
            {formatINR(offer.price)} {unitLabel[offer.unit].per}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Desktop-only photo collage for the hero: four of the real spaces in rounded
 * tiles that settle in and then drift very slightly. Purely decorative (the same
 * places are listed, with descriptions, further down the page).
 */
export function HeroCollage() {
  let index = 0;
  return (
    <div className="home-collage" aria-hidden="true">
      {columns.map((col, c) => (
        <div key={c} className={`home-collage__col home-collage__col--${c + 1}`}>
          {col.map((tile) => {
            const i = index++;
            return (
              <motion.div
                key={tile.photo.src}
                initial={{ opacity: 0, y: 28, scale: 0.96, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: easeOut, delay: 0.15 + i * 0.09 }}
              >
                <div
                  className={`home-collage__tile home-collage__tile--${tile.shape} home-collage__float`}
                  style={{ animationDelay: `${-i * 2.1}s` }}
                >
                  <img
                    src={tile.photo.src}
                    srcSet={tile.photo.srcSet}
                    sizes="(min-width: 1200px) 300px, 26vw"
                    width={tile.photo.width}
                    height={tile.photo.height}
                    alt=""
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}
      <ListingBadge propertyId="br-farm-house" className="home-collage__badge--a" delay={0.75} />
      <ListingBadge propertyId="palm-grove" className="home-collage__badge--b" delay={0.9} />
    </div>
  );
}
