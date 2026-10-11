import { ArrowRight, Clock3, Users, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';
import { unitLabel } from '../data/categories';
import type { CategorySlug, Offer, Photo, Property } from '../data/types';
import { formatINR } from '../lib/format';
import './Cards.css';

/** Stadium-shaped photo, the signature shape of the mockups. */
export function PillImage({
  photo,
  sizes = '(min-width: 1200px) 1180px, 100vw',
  priority = false,
  className = '',
}: {
  photo: Photo;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`pill-img ${className}`}>
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={photo.srcSet ? sizes : undefined}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : undefined}
      />
    </div>
  );
}

export function PriceTag({ offer, className = '' }: { offer: Offer; className?: string }) {
  return (
    <p className={`slant price-tag ${className}`}>
      <span className="price-tag__amount">{formatINR(offer.price)}</span>
      <span className="price-tag__unit">{offer.unit === 'event' ? '/event' : offer.unit === 'hour' ? '/hr' : '/night'}</span>
    </p>
  );
}

export function spaceHref(property: Property, category: CategorySlug, query = '') {
  const params = new URLSearchParams(query);
  params.set('for', category);
  return `/spaces/${property.id}?${params.toString()}`;
}

function capacityText(offer: Offer) {
  if (!offer.capacity) return undefined;
  const { min, max } = offer.capacity;
  return min ? `${min} – ${max} people` : `Up to ${max} people`;
}

/** Night / Hourly Stay card: pill photo, outlined name box and slanted price tag. */
export function ListingCard({
  offer,
  property,
  category,
  query,
}: {
  offer: Offer;
  property: Property;
  category: CategorySlug;
  query: string;
}) {
  const href = spaceHref(property, category, query);
  const photo = property.photo ?? property.thumb;
  const capacity = capacityText(offer);
  return (
    <article className="lcard">
      <Link to={href} className="lcard__media" tabIndex={-1} aria-hidden="true">
        {photo && <PillImage photo={photo} sizes="(min-width: 860px) 580px, 100vw" />}
      </Link>
      <div className="lcard__meta">
        <h3 className="lcard__name">
          <Link to={href}>{property.name}</Link>
        </h3>
        <PriceTag offer={offer} />
      </div>
      <p className="lcard__tagline">{property.tagline}</p>
      <ul role="list" className="facts">
        {property.hasPool && (
          <li>
            <Waves aria-hidden="true" /> Swimming pool
          </li>
        )}
        {capacity && (
          <li>
            <Users aria-hidden="true" /> {capacity}
          </li>
        )}
        <li>
          <Clock3 aria-hidden="true" /> {unitLabel[offer.unit].per}
        </li>
      </ul>
    </article>
  );
}

/** Party / Event venue card: framed square photo, big price, capacity and name. */
export function VenueCard({
  offer,
  property,
  category,
  query,
}: {
  offer: Offer;
  property: Property;
  category: CategorySlug;
  query: string;
}) {
  const href = spaceHref(property, category, query);
  const photo = property.thumb ?? property.photo;
  const capacity = capacityText(offer);
  return (
    <article className="vcard">
      <div className="vcard__frame">
        {photo && (
          <img
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt}
            loading="lazy"
            decoding="async"
          />
        )}
      </div>
      <div className="vcard__info">
        <p className="vcard__price">
          {offer.unit === 'hour' && (
            <span className="vcard__per">
              <sup>*</sup>1hr
            </span>
          )}
          <span>{formatINR(offer.price)}</span>
        </p>
        {capacity && <p className="vcard__cap">Suitable for {capacity}</p>}
        {offer.durationHours && <p className="vcard__dur">{offer.durationHours}hrs</p>}
      </div>
      <h3 className="vcard__name">
        <Link to={href}>{property.name}</Link>
      </h3>
      <Link to={href} className="btn btn--sm vcard__cta" aria-label={`View and enquire: ${property.name}`}>
        View &amp; enquire <ArrowRight />
      </Link>
    </article>
  );
}
