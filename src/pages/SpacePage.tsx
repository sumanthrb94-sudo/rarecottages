import { ArrowLeft, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ListingCard, PillImage, PriceTag } from '../components/Cards';
import { EnquiryBuilder } from '../components/EnquiryBuilder';
import { IncludedList } from '../components/Extras';
import { site } from '../config/site';
import { getCategory, unitLabel } from '../data/categories';
import { getProperty, offersForProperty, properties } from '../data/listings';
import type { CategorySlug, Offer, Property } from '../data/types';
import { filtersToParams, parseFilters } from '../lib/filters';
import { formatINR } from '../lib/format';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import { NotFoundPage } from './NotFoundPage';
import './SpacePage.css';

function pickOffer(offers: Offer[], requested: string | null): Offer {
  if (requested === 'hourly-stay') return offers.find((o) => o.unit === 'hour') ?? offers[0];
  return offers.find((o) => o.category === requested) ?? offers[0];
}

export function SpacePage() {
  const { id } = useParams();
  const property = id ? getProperty(id) : undefined;
  if (!property) return <NotFoundPage />;
  // keyed so state resets when moving between spaces
  return <Space key={property.id} property={property} />;
}

function Space({ property }: { property: Property }) {
  const [params] = useSearchParams();
  const requested = params.get('for');
  const offers = offersForProperty(property.id);
  const [offer, setOffer] = useState(() => pickOffer(offers, requested));
  const filters = parseFilters(params);
  const query = filtersToParams(filters).toString();

  // Keep the colours of the listing the visitor came from (e.g. Hourly Stay).
  const contextSlug: CategorySlug =
    requested === 'hourly-stay' && offer.unit === 'hour' ? 'hourly-stay' : offer.category;
  const context = getCategory(contextSlug)!;

  usePageMeta(property.name, property.tagline);
  usePageTheme(context.theme);

  const facts = [
    ...property.highlights,
    ...(offer.capacity
      ? [`Suitable for ${offer.capacity.min ? `${offer.capacity.min} – ` : 'up to '}${offer.capacity.max} people`]
      : []),
    ...(offer.durationHours ? [`${offer.durationHours} hours of venue time`] : []),
  ];

  const others = properties.filter((p) => p.id !== property.id && p.photo).slice(0, 2);

  return (
    <>
      <article className="container space">
        <Link to={{ pathname: `/${contextSlug}`, search: query }} className="link-arrow space__back">
          <ArrowLeft /> Back to {context.name}
        </Link>

        {property.photo ? (
          <PillImage photo={property.photo} priority className="space__hero" />
        ) : property.thumb ? (
          <div className="space__frame">
            <img
              src={property.thumb.src}
              width={property.thumb.width}
              height={property.thumb.height}
              alt={property.thumb.alt}
              fetchPriority="high"
            />
          </div>
        ) : null}

        <div className="space__layout">
          <div className="space__main">
            <p className="eyebrow space__eyebrow">
              <MapPin aria-hidden="true" /> {property.area} · within {site.serviceRadiusKm} km
            </p>
            <h1 className="space__name">{property.name}</h1>
            <p className="lead">{property.tagline}</p>

            <ul role="list" className="space__offers" aria-label="Prices">
              {offers.map((o) => {
                const c = getCategory(o.category)!;
                return (
                  <li key={o.id} data-theme={c.theme} className="space__offer">
                    <span className="space__offer-cat">{c.name}</span>
                    <PriceTag offer={o} />
                  </li>
                );
              })}
            </ul>

            <p className="space__desc">{property.description}</p>

            <h2 className="space__h2">Highlights</h2>
            <IncludedList items={facts} />

            <h2 className="space__h2">Good to know</h2>
            <ul className="space__notes">
              <li>Prices are indicative. Your final quote is confirmed with you before you book.</li>
              <li>No payment is taken on the website. We confirm availability on WhatsApp or by phone.</li>
              <li>Cakes, decor, photography and more can be added to any booking.</li>
            </ul>
          </div>

          <aside className="space__aside">
            <EnquiryBuilder
              property={property}
              offers={offers}
              offer={offer}
              onOfferChange={setOffer}
              initialDate={filters.date}
              initialGuests={filters.guests}
            />
          </aside>
        </div>
      </article>

      {others.length > 0 && (
        <section className="container section" aria-labelledby="more-title">
          <h2 className="h2" id="more-title">
            You may also like
          </h2>
          <div className="space__more">
            {others.map((p) => {
              const o = offersForProperty(p.id)[0];
              return <ListingCard key={p.id} offer={o} property={p} category={o.category} query={query} />;
            })}
          </div>
        </section>
      )}

      <div className="sticky-enquire">
        <div className="container sticky-enquire__inner">
          <p>
            <strong>{formatINR(offer.price)}</strong> <span>{unitLabel[offer.unit].per}</span>
          </p>
          <a href="#enquire" className="btn">
            Enquire now
          </a>
        </div>
      </div>
    </>
  );
}

