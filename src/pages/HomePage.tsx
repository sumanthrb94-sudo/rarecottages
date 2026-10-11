import { IconBalloon } from '@tabler/icons-react';
import { motion } from 'motion/react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { HeroCollage } from '../components/home/HeroCollage';
import { HomeSearch } from '../components/home/HomeSearch';
import { SpaceCard } from '../components/ui/cards';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconCake,
  IconCamera,
  IconChevronRight,
  IconInfoCircle,
  IconMapPin,
  IconMessageCircle,
  type Icon,
} from '../components/ui/icons';
import { FadeIn, Stagger, StaggerItem, TextEffect, spring } from '../components/ui/motion';
import { Button, SectionHeader, ServiceIcon, ServiceTag } from '../components/ui/primitives';
import { DESKTOP_QUERY, useMediaQuery } from '../components/ui/Sheet';
import { site } from '../config/site';
import { categories, unitLabel } from '../data/categories';
import { getAddOn } from '../data/addons';
import { offersForCategory, offersForProperty, properties } from '../data/listings';
import { photos } from '../data/photos';
import type { CategorySlug } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { formatINR } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import './HomePage.css';

/** Cheapest offer listed under a service, e.g. { price: 15000, per: 'per night' }. */
function fromPrice(slug: CategorySlug) {
  const offers = offersForCategory(slug);
  if (!offers.length) return undefined;
  const cheapest = offers.reduce((a, b) => (b.price < a.price ? b : a));
  return { price: formatINR(cheapest.price), per: unitLabel[cheapest.unit].per };
}

/** Lowest price of an add-on, across its options; undefined when quoted on request. */
function addOnFrom(id: string) {
  const addOn = getAddOn(id);
  if (!addOn) return undefined;
  const prices = addOn.options?.map((o) => o.price) ?? (addOn.price !== undefined ? [addOn.price] : []);
  return prices.length ? Math.min(...prices) : undefined;
}

const extras: { id: string; label: string; icon: Icon }[] = [
  { id: 'cake', label: 'Cake', icon: IconCake },
  { id: 'decor', label: 'Decor', icon: IconBalloon },
  { id: 'photographer', label: 'Photographer & reels', icon: IconCamera },
];

const steps = [
  { title: 'Pick a space', text: 'Farm houses, villas, a cafe and lawns in and around Rajahmundry.' },
  { title: 'Add the extras', text: 'Cake, decor, a photographer and reels, make-up or catering.' },
  { title: 'Confirm on WhatsApp', text: 'Send your plan in one tap. We confirm the date and the final quote.' },
];

/** One card per property, showing its first offer; capped so the grid stays tidy as listings grow. */
const POPULAR_LIMIT = 8;
const popular = properties
  .flatMap((property) => {
    const offer = offersForProperty(property.id)[0];
    return offer ? [{ property, offer }] : [];
  })
  .slice(0, POPULAR_LIMIT);

const tilts = [-8, 7, -6, 8];

const askWa = whatsappLink(
  site.whatsapp,
  `Hi ${site.name}! Can you help me pick a space in ${site.city}? My date and guest count: `,
);
const planWa = whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to plan a booking in ${site.city}.`);

function Hero() {
  const desktop = useMediaQuery(DESKTOP_QUERY);
  return (
    <section className="home-hero">
      <div className="container home-hero__grid">
        <div className="home-hero__main">
          <FadeIn inView={false} className="home-hero__where">
            <IconMapPin size={16} stroke={1.75} aria-hidden="true" />
            {site.serviceArea}
          </FadeIn>
          <FadeIn inView={false}>
            <p className="home-hero__caption">{site.tagline}</p>
          </FadeIn>
          <TextEffect as="h1" className="home-hero__title" delay={0.05}>
            What are you looking for today?
          </TextEffect>
          <FadeIn inView={false} delay={0.35} className="home-hero__search">
            <HomeSearch />
          </FadeIn>
        </div>
        {desktop && (
          <div className="home-hero__art">
            <HeroCollage />
          </div>
        )}
      </div>
    </section>
  );
}

function Occasions() {
  return (
    <section className="container home-section" aria-labelledby="home-occasions">
      <SectionHeader id="home-occasions" title="Book by occasion" />
      <Stagger as="ul" className="home-occasions" gap={0.07}>
        {categories.map((c, i) => {
          const from = fromPrice(c.slug);
          return (
            <StaggerItem as="li" key={c.slug}>
              <motion.div whileTap={{ scale: 0.97 }} transition={spring} className="home-occasion__press">
                <Link
                  to={`/${c.slug}`}
                  className="home-occasion"
                  data-service={c.theme}
                  style={{ '--home-tilt': `${tilts[i % tilts.length]}deg` } as CSSProperties}
                >
                  <div className="home-occasion__top">
                    <span className="home-occasion__icon">
                      <ServiceIcon slug={c.slug} size={48} />
                    </span>
                    <IconArrowUpRight size={20} stroke={1.75} className="home-occasion__arrow" aria-hidden="true" />
                  </div>
                  <div className="home-occasion__text">
                    <h3 className="home-occasion__name">{c.name}</h3>
                    <span className="home-occasion__hint">{c.hint}</span>
                    {from && (
                      <span className="home-occasion__price tabular">
                        From {from.price} <span>{from.per}</span>
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function Popular() {
  return (
    <section className="container home-section" aria-labelledby="home-popular">
      <SectionHeader id="home-popular" title={`Popular in ${site.city}`} />
      <Stagger as="ul" className="rail home-popular" gap={0.06}>
        {popular.map(({ property, offer }, i) => (
          <StaggerItem as="li" key={property.id} className="home-popular__item">
            <SpaceCard offer={offer} property={property} category={offer.category} priority={i < 2} />
          </StaggerItem>
        ))}
        <StaggerItem as="li" className="home-popular__item">
          <a href={askWa} target="_blank" rel="noreferrer" className="home-ask">
            <span className="home-ask__icon" aria-hidden="true">
              <IconBrandWhatsapp size={24} stroke={1.75} />
            </span>
            <span className="home-ask__title">Can’t decide?</span>
            <span className="home-ask__text">Send us your date and guest count on WhatsApp.</span>
            <span className="home-ask__cta">
              Chat with us <IconArrowUpRight size={18} stroke={2} aria-hidden="true" />
              <span className="visually-hidden">(opens WhatsApp)</span>
            </span>
          </a>
        </StaggerItem>
      </Stagger>
    </section>
  );
}

function Extras() {
  return (
    <section className="container home-section" aria-labelledby="home-extras">
      <SectionHeader
        id="home-extras"
        title="Add the extras"
        action={
          <Link to="/add-ons" className="home-more">
            All add-ons <IconArrowRight size={18} stroke={1.75} aria-hidden="true" />
          </Link>
        }
      />
      <Stagger as="ul" className="home-extras" gap={0.06}>
        {extras.map((x) => {
          const from = addOnFrom(x.id);
          return (
            <StaggerItem as="li" key={x.id}>
              <Link to={`/add-ons#${x.id}`} className="home-extra">
                <span className="home-extra__icon" aria-hidden="true">
                  <x.icon size={24} stroke={1.6} />
                </span>
                <span className="home-extra__text">
                  <span className="home-extra__name">{x.label}</span>
                  <span className="home-extra__price tabular">
                    {from !== undefined ? `From ${formatINR(from)}` : 'Price on request'}
                  </span>
                </span>
                <IconChevronRight size={20} stroke={1.75} className="home-extra__chev" aria-hidden="true" />
              </Link>
            </StaggerItem>
          );
        })}
      </Stagger>
    </section>
  );
}

function Promos() {
  return (
    <section className="container home-section" aria-label="Stays and rental cars">
      <div className="home-promos">
        <FadeIn>
          <Link to="/night-stay" className="home-promo" aria-label="Real Rare Cottages: browse night stays">
            <span className="home-promo__media">
              <img
                src={photos.cottagesBanner.src}
                srcSet={photos.cottagesBanner.srcSet}
                sizes="(min-width: 900px) 590px, 100vw"
                width={photos.cottagesBanner.width}
                height={photos.cottagesBanner.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="home-promo__caption">
              <ServiceTag slug="night-stay" label="Farm houses & villas" className="home-promo__tag" />
              <span className="home-promo__cta">
                Browse stays <IconArrowRight size={18} stroke={1.75} aria-hidden="true" />
              </span>
            </span>
          </Link>
        </FadeIn>
        <FadeIn delay={0.08}>
          <Link to="/rental-cars" className="home-promo" aria-label="Rental Cars: see the cars">
            <span className="home-promo__media">
              <img
                src={photos.carsBanner.src}
                srcSet={photos.carsBanner.srcSet}
                sizes="(min-width: 900px) 590px, 100vw"
                width={photos.carsBanner.width}
                height={photos.carsBanner.height}
                alt=""
                loading="lazy"
                decoding="async"
              />
            </span>
            <span className="home-promo__caption">
              <span className="home-promo__label">Cars for weddings & occasions</span>
              <span className="home-promo__cta">
                See cars <IconArrowRight size={18} stroke={1.75} aria-hidden="true" />
              </span>
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="container home-section" aria-labelledby="home-how">
      <div className="home-how">
        <div className="home-how__head">
          <h2 className="t-h2" id="home-how">
            How booking works
          </h2>
          <p className="t-body">Three steps, and your plan reaches us as a ready-to-send WhatsApp message.</p>
        </div>
        <Stagger as="ol" className="home-steps" gap={0.1}>
          {steps.map((s, i) => (
            <StaggerItem as="li" key={s.title} className="home-step">
              <span className="home-step__num tabular" aria-hidden="true">
                {i + 1}
              </span>
              <div className="home-step__text">
                <h3 className="t-h3">{s.title}</h3>
                <p className="t-small">{s.text}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <div className="home-how__cta">
          <Button href={planWa} external icon={<IconBrandWhatsapp size={20} stroke={1.75} />}>
            Plan on WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
}

function MoreLinks() {
  const links = [
    { to: '/about', title: 'About Rare Cottages', text: `Who we are and the places we book around ${site.city}`, icon: IconInfoCircle },
    { to: '/contact', title: 'Contact us', text: 'WhatsApp, call or email', icon: IconMessageCircle },
  ];
  return (
    <nav className="container home-section home-section--quiet" aria-label="About and contact">
      <ul role="list" className="home-links">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to} className="home-link">
              <l.icon size={22} stroke={1.6} aria-hidden="true" className="home-link__icon" />
              <span className="home-link__text">
                <span className="home-link__title">{l.title}</span>
                <span className="home-link__sub">{l.text}</span>
              </span>
              <IconChevronRight size={20} stroke={1.75} aria-hidden="true" className="home-link__chev" />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function HomePage() {
  usePageMeta(undefined);
  return (
    <div className="home">
      <Hero />
      <Popular />
      <Occasions />
      <Extras />
      <Promos />
      <HowItWorks />
      <MoreLinks />
    </div>
  );
}
