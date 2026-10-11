import {
  IconArmchair,
  IconBuildingCottage,
  IconCoffee,
  IconCreditCardOff,
  IconHomeHeart,
  IconPlant2,
  IconStairsUp,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { EnquiryBuilder, EnquiryFooter, OfferPicker } from '../components/space/EnquiryBuilder';
import { offerService, pickOffer, useEnquiryState, type EnquiryState } from '../components/space/useEnquiryState';
import { SpaceCard, unitShort } from '../components/ui/cards';
import {
  IconCalendarEvent,
  IconCamera,
  IconCheck,
  IconChevronRight,
  IconClockHour4,
  IconGift,
  IconInfoCircle,
  IconMapPin,
  IconPool,
  IconTrees,
  IconUsers,
  IconUsersGroup,
  type Icon,
} from '../components/ui/icons';
import { FadeIn, SlidingNumber, Stagger, StaggerItem, TextEffect, easeOut } from '../components/ui/motion';
import { Button, MediaBadge, SectionHeader, ServiceIcon, ServiceTag, serviceTheme } from '../components/ui/primitives';
import { DESKTOP_QUERY, Sheet, useMediaQuery } from '../components/ui/Sheet';
import { site } from '../config/site';
import { getCategory, unitLabel } from '../data/categories';
import { getProperty, offersForProperty, properties } from '../data/listings';
import type { CategorySlug, Offer, Property } from '../data/types';
import { filtersToParams, parseFilters } from '../lib/filters';
import { formatINR } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import { NotFoundPage } from './NotFoundPage';
import './SpacePage.css';

export function SpacePage() {
  const { id } = useParams();
  const property = id ? getProperty(id) : undefined;
  if (!property || offersForProperty(property.id).length === 0) return <NotFoundPage />;
  // Keyed so the booking resets when moving between spaces.
  return <Space key={property.id} property={property} />;
}

/* ------------------------------------------------------------------ facts */

/** An icon for each highlight, matched on the words the data uses. */
function highlightIcon(text: string): Icon {
  const t = text.toLowerCase();
  if (/villa|cottage|house|frame/.test(t)) return IconBuildingCottage;
  if (/roof/.test(t)) return IconStairsUp;
  if (/deck|seating|lounge/.test(t)) return IconArmchair;
  if (/pool|swim/.test(t)) return IconPool;
  if (/lawn|garden/.test(t)) return IconPlant2;
  if (/grove|tree|palm/.test(t)) return IconTrees;
  if (/sculpt|photo/.test(t)) return IconCamera;
  if (/gathering|guest|crowd/.test(t)) return IconUsersGroup;
  if (/cafe|coffee/.test(t)) return IconCoffee;
  if (/hour/.test(t)) return IconClockHour4;
  if (/private/.test(t)) return IconHomeHeart;
  return IconCheck;
}

function factsFor(property: Property, offer: Offer): { icon: Icon; text: string }[] {
  const facts = property.highlights.map((text) => ({ icon: highlightIcon(text), text }));
  if (property.hasPool && !property.highlights.some((h) => /pool/i.test(h))) {
    facts.unshift({ icon: IconPool, text: 'Swimming pool' });
  }
  if (offer.capacity) {
    const { min, max } = offer.capacity;
    facts.push({ icon: IconUsers, text: min ? `Suits ${min} to ${max} guests` : `Suits up to ${max} guests` });
  }
  if (offer.durationHours) facts.push({ icon: IconClockHour4, text: `${offer.durationHours} hours of venue time` });
  return facts;
}

function locationLine(property: Property) {
  if (property.distanceKm !== undefined) {
    const km = `${property.distanceKm} km from ${site.city}`;
    return property.area === site.city ? km : `${property.area} · ${km}`;
  }
  return property.area === site.city
    ? `${site.city} · within ${site.serviceRadiusKm} km`
    : `${property.area}, within ${site.serviceRadiusKm} km of ${site.city}`;
}

/** Other spaces, the ones offering the service being browsed first. */
function relatedSpaces(property: Property, service: CategorySlug) {
  return properties
    .filter((p) => p.id !== property.id && offersForProperty(p.id).length > 0)
    .map((p) => {
      const offer = pickOffer(offersForProperty(p.id), service);
      const category = offerService(offer, service);
      return { property: p, offer, category, match: category === service };
    })
    .sort((a, b) => Number(b.match) - Number(a.match))
    .slice(0, 4);
}

/* ------------------------------------------------------------------ page */

function Space({ property }: { property: Property }) {
  const [params] = useSearchParams();
  const requested = params.get('for');
  const filters = parseFilters(params);
  const query = filtersToParams(filters).toString();
  const offers = useMemo(() => offersForProperty(property.id), [property.id]);
  const state = useEnquiryState({
    property,
    offers,
    requested,
    initialDate: filters.date,
    initialGuests: filters.guests,
  });
  const theme = serviceTheme(state.service);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [sheetOpen, setSheetOpen] = useState(false);
  // Stable, so the sheet doesn't re-run its focus handling on every keystroke.
  const openSheet = useCallback(() => setSheetOpen(true), []);
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  useEffect(() => {
    if (desktop) setSheetOpen(false);
  }, [desktop]);

  usePageMeta(property.name, property.tagline);

  const facts = factsFor(property, state.offer);
  const related = relatedSpaces(property, state.service);
  const services = [...new Set(offers.map((o) => offerService(o, requested)))];

  return (
    <div className="sp" data-service={theme}>
      <nav className="container sp-crumbs" aria-label="Breadcrumb">
        <ol role="list">
          <li>
            <Link to={{ pathname: `/${state.service}`, search: query }}>{state.serviceName}</Link>
          </li>
          <li aria-current="page">{property.name}</li>
        </ol>
      </nav>

      <Hero property={property} />

      <div className="container sp-layout">
        <div className="sp-main">
          <header className="sp-title">
            <FadeIn inView={false} className="sp-title__tags">
              {services.map((slug) => (
                <ServiceTag key={slug} slug={slug} label={getCategory(slug)!.name} className="sp-tag" />
              ))}
              {property.sample && <span className="sp-sample">Sample listing</span>}
            </FadeIn>
            <TextEffect as="h1" className="t-h1 sp-title__name" delay={0.05}>
              {property.name}
            </TextEffect>
            <FadeIn inView={false} delay={0.15}>
              <p className="t-lead sp-title__tagline">{property.tagline}</p>
            </FadeIn>
            <FadeIn inView={false} delay={0.2}>
              <p className="sp-title__loc">
                <IconMapPin size={18} stroke={1.75} aria-hidden="true" />
                {locationLine(property)}
              </p>
            </FadeIn>
          </header>

          <FadeIn inView={false} delay={0.25} className="sp-offers-wrap">
            {offers.length > 1 ? (
              <OfferPicker state={state} group="page-offers" />
            ) : (
              <SingleOffer state={state} />
            )}
          </FadeIn>

          {!desktop && <PlanTeaser onOpen={openSheet} />}

          <FadeIn className="sp-sec">
            <section aria-labelledby="sp-about-title">
              <h2 id="sp-about-title" className="sp-sec__title">
                About this space
              </h2>
              <p className="sp-about">{property.description}</p>
            </section>
          </FadeIn>

          <section className="sp-sec" aria-labelledby="sp-high-title">
            <FadeIn>
              <h2 id="sp-high-title" className="sp-sec__title">
                Highlights
              </h2>
            </FadeIn>
            <Stagger as="ul" className="sp-facts" gap={0.05}>
              {facts.map((f) => (
                <StaggerItem as="li" key={f.text} className="sp-fact">
                  <span className="sp-fact__icon" aria-hidden="true">
                    <f.icon size={22} stroke={1.6} />
                  </span>
                  <span>{f.text}</span>
                </StaggerItem>
              ))}
            </Stagger>
          </section>

          <section className="sp-sec" aria-labelledby="sp-know-title">
            <FadeIn>
              <h2 id="sp-know-title" className="sp-sec__title">
                Good to know
              </h2>
            </FadeIn>
            <Stagger as="ul" className="sp-know" gap={0.06}>
              <StaggerItem as="li" className="sp-know__item">
                <IconInfoCircle size={22} stroke={1.6} aria-hidden="true" />
                <span>Prices are indicative. Your final quote is confirmed with you before you book.</span>
              </StaggerItem>
              <StaggerItem as="li" className="sp-know__item">
                <IconCreditCardOff size={22} stroke={1.6} aria-hidden="true" />
                <span>No payment is taken on the website. We confirm availability on WhatsApp or by phone.</span>
              </StaggerItem>
              <StaggerItem as="li" className="sp-know__item">
                <IconGift size={22} stroke={1.6} aria-hidden="true" />
                <span>
                  Cakes, decor, photography and more can be added to any booking.{' '}
                  <Link to="/add-ons" className="sp-link">
                    See add-ons
                  </Link>
                </span>
              </StaggerItem>
            </Stagger>
          </section>
        </div>

        {desktop && (
          <aside className="sp-aside" aria-labelledby="sp-plan-title">
            <motion.div
              className="sp-card"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: easeOut, delay: 0.15 }}
            >
              <div className="sp-card__head">
                <h2 id="sp-plan-title" className="sp-card__title">
                  Plan your booking
                </h2>
                <p className="sp-card__offer">
                  <span className="sp-dot" aria-hidden="true" />
                  {state.serviceName}
                  <span className="sp-card__sep" aria-hidden="true">
                    ·
                  </span>
                  <SlidingNumber value={state.offer.price} className="sp-card__price" />
                  <span className="sp-card__unit">{unitLabel[state.offer.unit].per}</span>
                </p>
              </div>
              <div className="sp-card__body">
                <EnquiryBuilder state={state} />
              </div>
              <div className="sp-card__foot">
                <EnquiryFooter state={state} />
              </div>
            </motion.div>
          </aside>
        )}
      </div>

      {related.length > 0 && (
        <section className="container sp-more" aria-labelledby="sp-more-title">
          <FadeIn>
            <SectionHeader title="You may also like" id="sp-more-title" />
          </FadeIn>
          <Stagger className="rail sp-more__list" gap={0.07}>
            {related.map((r) => (
              <StaggerItem key={r.property.id}>
                <SpaceCard offer={r.offer} property={r.property} category={r.category} query={query} />
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {!desktop && (
        <>
          <BottomBar state={state} theme={theme} onOpen={openSheet} open={sheetOpen} />
          <Sheet
            open={sheetOpen}
            onClose={closeSheet}
            title="Plan your booking"
            service={theme}
            footer={<EnquiryFooter state={state} />}
          >
            <SheetIntro state={state} />
            <EnquiryBuilder state={state} showOffers />
          </Sheet>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ pieces */

function Hero({ property }: { property: Property }) {
  const photo = property.wide ?? property.card;
  const shape = property.wide ? 'wide' : 'card';
  return (
    <div className="sp-hero" data-shape={shape}>
      <motion.div
        className="sp-hero__frame"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeOut }}
      >
        {shape === 'card' && <img className="sp-hero__backdrop" src={photo.src} alt="" aria-hidden="true" />}
        <motion.img
          className="sp-hero__img"
          src={photo.src}
          srcSet={photo.srcSet}
          sizes={shape === 'wide' ? '(min-width: 900px) min(1200px, 92vw), 100vw' : '(min-width: 900px) 640px, 100vw'}
          width={photo.width}
          height={photo.height}
          alt={photo.alt}
          fetchPriority="high"
          decoding="async"
          initial={{ scale: 1.04 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.1, ease: easeOut }}
        />
        <MediaBadge sample={property.sample} representative={photo.representative} className="sp-hero__badge" />
      </motion.div>
    </div>
  );
}

function SingleOffer({ state }: { state: EnquiryState }) {
  const { offer } = state;
  const facts = [
    offer.capacity
      ? offer.capacity.min
        ? `${offer.capacity.min}–${offer.capacity.max} guests`
        : `Up to ${offer.capacity.max} guests`
      : undefined,
    offer.durationHours ? `${offer.durationHours} hrs` : undefined,
  ].filter(Boolean);
  return (
    <div className="sp-single">
      <ServiceIcon slug={state.service} size={44} tilt={-6} />
      <div className="sp-single__text">
        <p className="sp-single__name">{state.serviceName}</p>
        <p className="sp-single__price tabular">
          {formatINR(offer.price)}
          <span> {unitLabel[offer.unit].per}</span>
        </p>
      </div>
      {facts.length > 0 && <p className="sp-single__facts">{facts.join(' · ')}</p>}
    </div>
  );
}

/** Mobile only: an inline way into the booking sheet, besides the bottom bar. */
function PlanTeaser({ onOpen }: { onOpen: () => void }) {
  return (
    <FadeIn inView={false} delay={0.3}>
      <motion.button
        type="button"
        className="sp-plan"
        onClick={onOpen}
        aria-haspopup="dialog"
        whileTap={{ scale: 0.98 }}
      >
        <span className="sp-plan__icon" aria-hidden="true">
          <IconCalendarEvent size={24} stroke={1.6} />
        </span>
        <span className="sp-plan__text">
          <span className="sp-plan__title">Plan your booking</span>
          <span className="sp-plan__desc">Pick a date and guests, add a cake, decor or photos, and see your estimate.</span>
        </span>
        <IconChevronRight size={20} stroke={2} className="sp-plan__chev" aria-hidden="true" />
      </motion.button>
    </FadeIn>
  );
}

function SheetIntro({ state }: { state: EnquiryState }) {
  const { property, offer } = state;
  return (
    <div className="sp-intro">
      <img src={property.card.src} width={property.card.width} height={property.card.height} alt="" className="sp-intro__img" />
      <div className="sp-intro__text">
        <p className="sp-intro__name">{property.name}</p>
        <p className="sp-intro__meta">
          <span className="sp-dot" aria-hidden="true" />
          {state.serviceName} · {formatINR(offer.price)}/{unitShort(offer)}
        </p>
      </div>
    </div>
  );
}

/**
 * Mobile app-style action bar. Portalled to <body> because the page transition
 * leaves a filter on the route wrapper, which would trap position: fixed.
 */
function BottomBar({
  state,
  theme,
  onOpen,
  open,
}: {
  state: EnquiryState;
  theme: string;
  onOpen: () => void;
  open: boolean;
}) {
  const amount = state.customised ? state.total : state.offer.price;
  return createPortal(
    <motion.div
      className="sp-bar"
      data-service={theme}
      role="region"
      aria-label="Booking"
      initial={{ y: '110%' }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34, delay: 0.3 }}
    >
      <div className="container sp-bar__inner">
        <div className="sp-bar__info">
          <p className="sp-bar__price">
            <SlidingNumber value={amount} />
            {state.customised ? (
              state.hasOnRequest && <span className="sp-bar__unit">+ quotes</span>
            ) : (
              <span className="sp-bar__unit">/{unitShort(state.offer)}</span>
            )}
          </p>
          <p className="sp-bar__caption">
            <span className="sp-dot" aria-hidden="true" />
            {state.customised ? 'Estimated total' : state.serviceName}
          </p>
        </div>
        <Button size="lg" onClick={onOpen} aria-haspopup="dialog" aria-expanded={open} className="sp-bar__cta">
          Enquire
        </Button>
      </div>
    </motion.div>,
    document.body,
  );
}
