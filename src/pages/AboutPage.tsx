import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CategoryIcon } from '../components/icons';
import { site } from '../config/site';
import { categories } from '../data/categories';
import { offers, properties } from '../data/listings';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './InfoPages.css';

export function AboutPage() {
  usePageMeta('About us', `${site.name}: ${site.tagline}. Spaces to stay and celebrate around ${site.city}.`);
  usePageTheme('brand');
  const stats = [
    { value: String(properties.length), label: 'handpicked spaces' },
    { value: `${site.serviceRadiusKm} km`, label: `around ${site.city}` },
    { value: String(new Set(offers.map((o) => o.category)).size + 1), label: 'ways to book' },
  ];

  return (
    <>
      <section className="container section about">
        <div className="about__logo">
          <img src="/images/logo-light.png" alt={`${site.name} logo`} width="480" height="560" />
        </div>
        <div className="stack about__text">
          <p className="eyebrow">About us</p>
          <h1 className="h2">
            Stay. Relax. <span className="script about__script">Celebrate.</span>
          </h1>
          <p className="lead">
            {site.name} brings together the most memorable farm houses, villas, cafes and lawns in and around{' '}
            {site.city}, so planning a getaway or a celebration takes minutes, not days.
          </p>
          <p>
            Whether it's a quiet night by the pool, a few hours with friends, a birthday at a cafe or a full wedding
            with haldi, sangeeth and reception, we help you find the right place and take care of the extras: cakes,
            decor, photographers and reels, make-up and catering.
          </p>
          <ul role="list" className="stats">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container section--tight" aria-labelledby="tiles-title">
        <h2 className="h2" id="tiles-title">
          Four tiles, four ways to book
        </h2>
        <p className="lead" style={{ marginTop: 10 }}>
          Each colour in our logo stands for one way to book a space.
        </p>
        <ul role="list" className="tiles">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to={`/${c.slug}`} className="tile" data-theme={c.theme}>
                <CategoryIcon slug={c.slug} strokeWidth={1.5} />
                <strong>{c.name}</strong>
                <span>{c.hint}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="container section--tight about__cta">
        <Link to="/contact" className="btn btn--light">
          Contact us <ArrowRight />
        </Link>
      </section>
    </>
  );
}
