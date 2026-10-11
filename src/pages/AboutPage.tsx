import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { RevealList } from '../components/info/InfoParts';
import { IconArrowRight, IconBrandWhatsapp } from '../components/ui/icons';
import { FadeIn, StaggerItem, TextEffect, spring } from '../components/ui/motion';
import { Button, Logo, ServiceIcon } from '../components/ui/primitives';
import { site } from '../config/site';
import { categories } from '../data/categories';
import { offersForCategory, properties } from '../data/listings';
import type { Theme } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { plural } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import './InfoPages.css';

const MotionLink = motion.create(Link);

/** Each service owns one tile of the logo; tilts follow the artwork. */
const tile: Record<Theme, { colour: string; tilt: number }> = {
  night: { colour: 'Green', tilt: -6 },
  hourly: { colour: 'Yellow', tilt: 7 },
  party: { colour: 'Blue', tilt: -8 },
  event: { colour: 'Red', tilt: 6 },
};

export function AboutPage() {
  usePageMeta(
    'About us',
    `${site.name} books farm houses, villas, party spaces and event venues in and around ${site.city}, with the extras arranged.`,
  );

  const stats = [
    { value: String(properties.length), label: 'Spaces to book' },
    { value: `${site.serviceRadiusKm} km`, label: `Around ${site.city}` },
    { value: String(categories.length), label: 'Ways to book' },
  ];

  return (
    <>
      <section className="container info-about" aria-labelledby="about-title">
        <FadeIn inView={false} className="info-about__logo">
          <Logo variant="full" />
        </FadeIn>
        <div className="info-about__text">
          <p className="t-eyebrow">About {site.name}</p>
          <TextEffect as="h1" className="t-display info-about__title" delay={0.05}>
            Stay. Relax. Celebrate.
          </TextEffect>
          <FadeIn inView={false} delay={0.2} className="info-about__story">
            <p className="t-lead">
              {site.name} books farm houses, villas, cafes and lawns in and around {site.city}: for a night away, a few
              hours with friends, a birthday or a wedding.
            </p>
            <p className="t-body">
              Tell us what you're planning and we'll arrange the extras too: cakes, decor, photographers and reels,
              make-up, catering and rental cars.
            </p>
          </FadeIn>
          <FadeIn inView={false} delay={0.3}>
            <dl className="info-stats">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.label}</dt>
                  <dd className="tabular">{s.value}</dd>
                </div>
              ))}
            </dl>
          </FadeIn>
        </div>
      </section>

      <section className="container info-section" aria-labelledby="tiles-title">
        <FadeIn className="info-section-head">
          <h2 className="t-h2" id="tiles-title">
            Four tiles, four ways to book
          </h2>
          <p className="t-body">
            Each colour in our logo stands for one way to book. You'll see it on every space, so you always know what
            you're looking at.
          </p>
        </FadeIn>
        <RevealList className="info-svcs">
          {categories.map((c) => {
            const count = offersForCategory(c.slug).length;
            return (
              <StaggerItem as="li" key={c.slug}>
                <MotionLink
                  to={`/${c.slug}`}
                  className="info-svc"
                  data-service={c.theme}
                  whileTap={{ scale: 0.97 }}
                  transition={spring}
                >
                  <ServiceIcon slug={c.slug} size={52} tilt={tile[c.theme].tilt} className="info-svc__icon" />
                  <span className="info-svc__colour t-svc">{tile[c.theme].colour}</span>
                  <span className="info-svc__name">{c.name}</span>
                  <span className="info-svc__hint">{c.hint}</span>
                  <span className="info-svc__foot">
                    <span className="tabular">{count ? plural(count, 'space', 'spaces') : 'Ask us'}</span>
                    <IconArrowRight size={18} stroke={2} aria-hidden="true" />
                  </span>
                </MotionLink>
              </StaggerItem>
            );
          })}
        </RevealList>
      </section>

      <section className="container info-section-sm" aria-labelledby="about-cta-title">
        <FadeIn className="info-cta">
          <div>
            <h2 className="t-h2" id="about-cta-title">
              Planning something?
            </h2>
            <p className="t-body">Tell us the date, the guests and the occasion. We'll find the space and set up the rest.</p>
          </div>
          <div className="info-cta__actions">
            <Button to="/contact" size="lg">
              Contact us
            </Button>
            <Button
              variant="secondary"
              size="lg"
              href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to plan a booking in ${site.city}.`)}
              external
              icon={<IconBrandWhatsapp size={20} stroke={1.75} />}
            >
              WhatsApp
            </Button>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
