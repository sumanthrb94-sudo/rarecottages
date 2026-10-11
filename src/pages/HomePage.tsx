import { ArrowRight, MessageCircle, Search, Sparkles, Store } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ListingCard, PillImage } from '../components/Cards';
import { AddOnChips } from '../components/Extras';
import { CategoryIcon } from '../components/icons';
import { PalmDecor } from '../components/PalmDecor';
import { CategoryPicker, FilterPanel, LocationPill } from '../components/Search';
import { site } from '../config/site';
import { categories, getCategory, unitLabel } from '../data/categories';
import { getProperty, offersForCategory } from '../data/listings';
import { photos } from '../data/photos';
import type { CategorySlug } from '../data/types';
import { emptyFilters, filtersToParams, type Filters } from '../lib/filters';
import { formatINR } from '../lib/format';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './HomePage.css';

const steps = [
  { icon: Store, title: 'Pick your space', text: 'Farm houses, villas, cafes and lawns in and around Rajahmundry.' },
  { icon: Sparkles, title: 'Add the extras', text: 'Cake, decor, photographer and reels, make-up or catering.' },
  { icon: MessageCircle, title: 'Confirm on WhatsApp', text: 'Send your plan in one tap. We confirm dates and the final quote.' },
];

function fromPrice(slug: CategorySlug) {
  const offers = offersForCategory(slug);
  if (!offers.length) return null;
  const cheapest = offers.reduce((a, b) => (b.price < a.price ? b : a));
  return `From ${formatINR(cheapest.price)} ${unitLabel[cheapest.unit].per}`;
}

export function HomePage() {
  usePageMeta(undefined);
  usePageTheme('brand');
  const navigate = useNavigate();
  const [category, setCategory] = useState<CategorySlug>('night-stay');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const selected = getCategory(category)!;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = filtersToParams(filters).toString();
    navigate(`/${category}${query ? `?${query}` : ''}`);
  };

  const featured = offersForCategory('night-stay');

  return (
    <>
      <section className="hero">
        <PalmDecor className="hero__palm hero__palm--left" />
        <PalmDecor className="hero__palm hero__palm--right" />

        <div className="container hero__top">
          <div className="hero__brand">
            <h1 className="hero__title">
              <span className="visually-hidden">{site.name} — </span>
              <span aria-hidden="true">Rare Cottages</span>
            </h1>
            <p className="hero__tagline">{site.tagline}</p>
          </div>
          <LocationPill />
        </div>

        <form className="container search" onSubmit={onSubmit} role="search" aria-label="Find a space">
          <CategoryPicker value={category} onChange={setCategory} />
          <FilterPanel filters={filters} onChange={setFilters} />
          <button type="submit" className="btn search__submit" data-theme={selected.theme}>
            <Search /> Show {selected.name} spaces <ArrowRight />
          </button>
        </form>
      </section>

      <section className="container home-extras" aria-label="Add-ons">
        <AddOnChips />
      </section>

      <section className="container features" aria-label="Explore">
        <Link to="/night-stay" className="feature" aria-label="Real Rare Cottages: browse our stays">
          <div className="pill-ring">
            <PillImage photo={{ ...photos.cottagesBanner, alt: '' }} sizes="(min-width: 860px) 560px, 100vw" />
          </div>
        </Link>
        <Link to="/rental-cars" className="feature" aria-label="Rental Cars">
          <div className="pill-ring">
            <PillImage photo={{ ...photos.carsBanner, alt: '' }} sizes="(min-width: 860px) 560px, 100vw" />
          </div>
        </Link>
      </section>

      <section className="container section" aria-labelledby="occasions-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Four ways to book</p>
            <h2 className="h2" id="occasions-title">
              What's the occasion?
            </h2>
          </div>
        </div>
        <ul role="list" className="occasions">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/${c.slug}`} className="occasion" data-theme={c.theme}>
                <span className="occasion__icon">
                  <CategoryIcon slug={c.slug} strokeWidth={1.5} />
                </span>
                <span className="occasion__name">{c.name}</span>
                <span className="occasion__blurb">{c.blurb}</span>
                <span className="occasion__price">{fromPrice(c.slug)}</span>
                <ArrowRight className="occasion__arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section" aria-labelledby="featured-title">
        <div className="section-head">
          <div>
            <p className="eyebrow">Night stays</p>
            <h2 className="h2" id="featured-title">
              Real rare cottages
            </h2>
          </div>
          <Link to="/night-stay" className="link-arrow">
            See all stays <ArrowRight />
          </Link>
        </div>
        <div className="featured">
          {featured.map((o) => (
            <ListingCard key={o.id} offer={o} property={getProperty(o.propertyId)!} category="night-stay" query="" />
          ))}
        </div>
      </section>

      <section className="container section" aria-labelledby="how-title">
        <div className="how">
          <h2 className="h2" id="how-title">
            Booking is <span className="script how__script">easy</span>
          </h2>
          <ol className="how__steps">
            {steps.map((s, i) => (
              <li key={s.title} className="how__step">
                <span className="how__num">{i + 1}</span>
                <s.icon aria-hidden="true" className="how__icon" />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container home-links" aria-label="More about us">
        <Link to="/about" className="btn btn--light home-links__btn">
          About us
        </Link>
        <Link to="/contact" className="btn btn--light home-links__btn">
          Contact Us
        </Link>
      </section>
    </>
  );
}
