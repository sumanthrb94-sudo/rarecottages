import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { getCategory } from '../../data/categories';
import type { CategorySlug, Offer, Package, Property } from '../../data/types';
import { whatsappLink } from '../../lib/enquiry';
import { formatINR } from '../../lib/format';
import { IconBrandWhatsapp, IconCheck, IconPool, IconUsers } from './icons';
import { Button, MediaBadge, ServiceTag, serviceTheme } from './primitives';
import './ui.css';

export function spaceHref(property: Property, category: CategorySlug, query = '') {
  const params = new URLSearchParams(query);
  params.set('for', category);
  return `/spaces/${property.id}?${params.toString()}`;
}

export function unitShort(offer: Offer) {
  return offer.unit === 'night' ? 'night' : offer.unit === 'hour' ? 'hr' : 'event';
}

export function capacityText(offer: Offer) {
  if (!offer.capacity) return undefined;
  const { min, max } = offer.capacity;
  return min ? `${min}–${max} guests` : `Up to ${max} guests`;
}

/**
 * The one listing card used everywhere: 4:3 photo, service tag, name, facts and price.
 * `category` is the listing the card is shown in (it decides the tag and the link context).
 */
export function SpaceCard({
  offer,
  property,
  category,
  query = '',
  priority = false,
  sizes = '(min-width: 1024px) 380px, (min-width: 640px) 45vw, 80vw',
}: {
  offer: Offer;
  property: Property;
  category: CategorySlug;
  query?: string;
  priority?: boolean;
  /** Image sizes hint; override when the card is wider than a 3-column grid cell. */
  sizes?: string;
}) {
  const href = spaceHref(property, category, query);
  // Hourly-priced spaces listed under Hourly Stay wear the Hourly Stay colour, as on the space page.
  const tagSlug: CategorySlug = category === 'hourly-stay' && offer.unit === 'hour' ? 'hourly-stay' : offer.category;
  const tagCategory = getCategory(tagSlug)!;
  const capacity = capacityText(offer);
  return (
    <motion.article className="space-card" data-service={serviceTheme(tagSlug)} whileTap={{ scale: 0.985 }}>
      <Link to={href} className="space-card__link" aria-label={`${property.name}, ${formatINR(offer.price)} per ${unitShort(offer)}`}>
        <div className="space-card__media">
          <img
            src={property.card.src}
            srcSet={property.card.srcSet}
            sizes={sizes}
            width={property.card.width}
            height={property.card.height}
            alt={property.card.alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          <ServiceTag slug={tagSlug} label={tagCategory.name} className="space-card__tag" />
          <MediaBadge sample={property.sample} representative={property.card.representative} />
        </div>
        <div className="space-card__body">
          <div className="space-card__row">
            <h3 className="space-card__name">{property.name}</h3>
            <p className="space-card__price tabular">
              {formatINR(offer.price)}
              <span>/{unitShort(offer)}</span>
            </p>
          </div>
          <p className="space-card__meta">
            <span>
              {property.distanceKm !== undefined ? `${property.distanceKm} km from ${site.city}` : property.area}
            </span>
            {property.hasPool && (
              <span className="space-card__fact">
                <IconPool size={15} stroke={1.75} aria-hidden="true" /> Pool
              </span>
            )}
            {capacity && (
              <span className="space-card__fact">
                <IconUsers size={15} stroke={1.75} aria-hidden="true" /> {capacity}
              </span>
            )}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}

/** A package (e.g. Birthday Package) with what's included and a WhatsApp CTA. */
export function PackageCard({ pkg, service = 'party' }: { pkg: Package; service?: string }) {
  const name = pkg.title.join(' ');
  return (
    <article className="pkg-card" data-service={service}>
      {pkg.image && (
        <div className="pkg-card__media">
          <img src={pkg.image.src} srcSet={pkg.image.srcSet} sizes="(min-width: 900px) 480px, 90vw" width={pkg.image.width} height={pkg.image.height} alt={pkg.image.alt} loading="lazy" decoding="async" />
          <MediaBadge sample={pkg.sample} representative={pkg.image.representative} />
        </div>
      )}
      <div className="pkg-card__head">
        <div>
          <p className="t-eyebrow t-svc">Package</p>
          <h3 className="t-h2">{name}</h3>
        </div>
        <p className="pkg-card__price tabular">{formatINR(pkg.price)}</p>
      </div>
      <ul role="list" className="pkg-card__list">
        {pkg.includes.map((item) => (
          <li key={item}>
            <IconCheck size={18} stroke={2} aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>
      <Button
        variant="primary"
        block
        href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'm interested in the ${name} (${formatINR(pkg.price)}).`)}
        external
        icon={<IconBrandWhatsapp size={20} stroke={1.75} />}
      >
        Book this package
      </Button>
    </article>
  );
}
