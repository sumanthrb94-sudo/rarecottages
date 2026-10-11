import { ArrowRight, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ListingCard, VenueCard } from '../components/Cards';
import { Carousel } from '../components/Carousel';
import { AddOnChips, CakeStrip, PackageCard, ServiceCard, ServiceTags } from '../components/Extras';
import { WhatsAppIcon } from '../components/icons';
import { CategorySwitcher, FilterPanel } from '../components/Search';
import { site } from '../config/site';
import { getAddOn, packagesFor } from '../data/addons';
import { getCategory } from '../data/categories';
import { getProperty, offersForCategory } from '../data/listings';
import type { AddOn, CategorySlug } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { emptyFilters, filtersToParams, hasActiveFilters, matchesFilters } from '../lib/filters';
import { plural } from '../lib/format';
import { useFilterParams, usePageMeta, usePageTheme } from '../lib/hooks';
import './CategoryPage.css';

function PartyExtras() {
  const pkgs = packagesFor('party-space');
  return (
    <section className="container section extras" aria-labelledby="party-extras">
      <h2 className="h2" id="party-extras">
        Cakes &amp; packages
      </h2>
      <CakeStrip />
      {pkgs.length > 0 && (
        <Carousel label="Party packages">
          {pkgs.map((p) => (
            <PackageCard key={p.id} pkg={p} />
          ))}
        </Carousel>
      )}
    </section>
  );
}

function EventExtras() {
  const services = ['wedding-photography', 'makeup', 'catering']
    .map((id) => getAddOn(id))
    .filter((a): a is AddOn => Boolean(a));
  return (
    <section className="container section extras" aria-labelledby="event-extras">
      <h2 className="h2" id="event-extras">
        Everything for the big day
      </h2>
      <ServiceTags ids={['makeup', 'catering']} />
      <Carousel label="Event services">
        {services.map((a) => (
          <ServiceCard key={a.id} addOn={a} />
        ))}
      </Carousel>
    </section>
  );
}

function StayExtras() {
  return (
    <section className="container section extras extras--center" aria-labelledby="stay-extras">
      <h2 className="h2" id="stay-extras">
        Make it a celebration
      </h2>
      <p className="lead">Add a cake, decor or a photographer to your booking. We'll set it all up before you arrive.</p>
      <AddOnChips />
      <Link to="/add-ons" className="link-arrow">
        See all add-ons <ArrowRight />
      </Link>
    </section>
  );
}

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug)!;
  usePageMeta(category.name, category.blurb);
  usePageTheme(category.theme);
  const [filters, setFilters] = useFilterParams();
  const query = filtersToParams(filters).toString();

  const all = offersForCategory(slug);
  const results = all.filter((o) => matchesFilters(o, getProperty(o.propertyId)!, filters));
  const isVenue = slug === 'party-space' || slug === 'event-space';
  const active = hasActiveFilters(filters);

  return (
    <div className="cat-page">
      <section className="container cat-hero">
        <CategorySwitcher current={slug} query={query} />
        <div className="cat-hero__head">
          <h1 className="outline-title">{category.name}</h1>
          <p className="lead">{category.blurb}</p>
        </div>
        <div className="cat-hero__filters">
          <FilterPanel compact filters={filters} onChange={setFilters} />
        </div>
      </section>

      <section className="container results" aria-labelledby="results-title">
        <div className="results__bar">
          <h2 className="results__count" id="results-title" aria-live="polite">
            {plural(results.length, 'space', 'spaces')}
            {active ? ' match your filters' : ' available'}
          </h2>
          {active && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => setFilters({ ...emptyFilters, date: filters.date })}>
              Clear filters
            </button>
          )}
        </div>

        {results.length > 0 ? (
          <div className={isVenue ? 'venue-list' : 'listing-grid'}>
            {results.map((o) => {
              const property = getProperty(o.propertyId)!;
              return isVenue ? (
                <VenueCard key={o.id} offer={o} property={property} category={slug} query={query} />
              ) : (
                <ListingCard key={o.id} offer={o} property={property} category={slug} query={query} />
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <SearchX aria-hidden="true" />
            <p>
              <strong>No spaces match these filters.</strong> Try a bigger budget or fewer filters, or tell us what
              you need and we'll find one for you.
            </p>
            <div className="empty__actions">
              <button type="button" className="btn" onClick={() => setFilters({ ...emptyFilters, date: filters.date })}>
                Clear filters
              </button>
              <a
                className="btn btn--whatsapp"
                href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'm looking for a ${category.name.toLowerCase()}. Can you help?`)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon /> Ask us
              </a>
            </div>
          </div>
        )}

        <p className="footnote">
          {slug === 'party-space' || slug === 'hourly-stay' ? '* Hourly rate. ' : ''}
          Prices are indicative; your final quote is confirmed on WhatsApp.
        </p>
      </section>

      {slug === 'party-space' && <PartyExtras />}
      {slug === 'event-space' && <EventExtras />}
      {(slug === 'night-stay' || slug === 'hourly-stay') && <StayExtras />}
    </div>
  );
}
