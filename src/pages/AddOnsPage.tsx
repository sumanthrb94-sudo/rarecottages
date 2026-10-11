import { IconBalloon, IconCameraHeart } from '@tabler/icons-react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { InfoHead, RevealList } from '../components/info/InfoParts';
import { PackageCard } from '../components/ui/cards';
import {
  IconBrandWhatsapp,
  IconBrush,
  IconCake,
  IconCamera,
  IconCheck,
  IconChevronRight,
  IconGift,
  IconPlus,
  IconSparkles,
  IconToolsKitchen2,
  type Icon,
} from '../components/ui/icons';
import { FadeIn, StaggerItem, spring } from '../components/ui/motion';
import { Button, ServiceIcon, serviceTheme } from '../components/ui/primitives';
import { site } from '../config/site';
import { addOns, packages } from '../data/addons';
import { categories, getCategory } from '../data/categories';
import type { AddOn, CategorySlug } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { formatINR } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import './InfoPages.css';

const addOnIcons: Record<string, Icon> = {
  cake: IconCake,
  decor: IconBalloon,
  photographer: IconCamera,
  'wedding-photography': IconCameraHeart,
  makeup: IconBrush,
  catering: IconToolsKitchen2,
};

function priceText(addOn: AddOn): string | undefined {
  if (addOn.options?.length) return addOn.options.map((o) => `${o.label} ${formatINR(o.price)}`).join(' · ');
  if (addOn.price !== undefined) return formatINR(addOn.price);
  return undefined;
}

function askLink(addOn: AddOn) {
  return whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to add ${addOn.name} to my booking.`);
}

/** "Party Space and Event Space", or nothing when the add-on goes with every booking. */
function AppliesTo({ slugs }: { slugs: CategorySlug[] }) {
  if (slugs.length >= categories.length) return null;
  const ordered = categories.map((c) => c.slug).filter((s) => slugs.includes(s));
  const names = ordered.map((s) => getCategory(s)?.name ?? s);
  const text = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0];
  return (
    <p className="info-applies">
      <span className="info-applies__dots" aria-hidden="true">
        {ordered.map((s) => (
          <span key={s} data-service={serviceTheme(s)} />
        ))}
      </span>
      With {text} bookings
    </p>
  );
}

function AddOnCard({ addOn, targeted }: { addOn: AddOn; targeted: boolean }) {
  const Icon = addOnIcons[addOn.id] ?? IconSparkles;
  const price = priceText(addOn);
  return (
    <motion.article
      id={addOn.id}
      className={`info-addon${targeted ? ' is-target' : ''}`}
      aria-labelledby={`${addOn.id}-name`}
      whileTap={{ scale: 0.985 }}
      transition={spring}
    >
      <div className="info-addon__top">
        <span className="info-tile info-tile--lg" aria-hidden="true">
          <Icon size={26} stroke={1.6} />
        </span>
        <div className="info-addon__title">
          <h3 className="t-h3" id={`${addOn.id}-name`}>
            {addOn.name}
          </h3>
          <p className={`info-addon__price tabular${price ? '' : ' info-addon__price--ask'}`}>
            {price ?? 'Price on request'}
          </p>
        </div>
      </div>
      <p className="t-small info-addon__desc">{addOn.description}</p>
      <AppliesTo slugs={addOn.appliesTo} />
      <Button
        variant="secondary"
        size="sm"
        className="info-addon__cta"
        href={askLink(addOn)}
        external
        aria-label={`Ask on WhatsApp about ${addOn.name}`}
        icon={<IconBrandWhatsapp size={18} stroke={1.75} />}
      >
        Ask on WhatsApp
      </Button>
    </motion.article>
  );
}

export function AddOnsPage() {
  usePageMeta(
    'Add-ons',
    `Cakes, decor, photographers and reels, make-up, catering and wedding photography, arranged with your booking in ${site.city}.`,
  );
  const location = useLocation();
  const target = location.hash.slice(1);
  const extras = addOns.filter((a) => !a.partner);
  const partners = addOns.filter((a) => a.partner);

  const jumps = [
    ...extras.map((a) => ({ id: a.id, label: a.short, icon: addOnIcons[a.id] ?? IconSparkles })),
    ...(packages.length ? [{ id: 'packages', label: 'Packages', icon: IconGift }] : []),
    ...partners.map((a) => ({ id: a.id, label: a.short, icon: addOnIcons[a.id] ?? IconSparkles })),
  ];

  return (
    <>
      <InfoHead
        title="Add-ons"
        lead="Cakes, decor, photographers and more, arranged with your booking. Add them when you enquire about a space, or ask for them on their own."
      >
        <FadeIn inView={false} delay={0.2}>
          <nav aria-label="On this page" className="info-jump">
            {jumps.map(({ id, label, icon: I }) => (
              <Link
                key={id}
                to={`#${id}`}
                replace
                preventScrollReset
                className={`chip info-jump__chip${target === id ? ' chip--on' : ''}`}
                onClick={() => {
                  if (location.hash === `#${id}`) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <I size={18} stroke={1.75} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </FadeIn>
      </InfoHead>

      <section className="container info-section-sm" aria-labelledby="extras-title">
        <h2 className="visually-hidden" id="extras-title">
          Extras
        </h2>
        <RevealList className="info-addons">
          {extras.map((a) => (
            <StaggerItem as="li" key={a.id}>
              <AddOnCard addOn={a} targeted={target === a.id} />
            </StaggerItem>
          ))}
          <StaggerItem as="li">
            <motion.article
              className="info-addon info-addon--more"
              aria-labelledby="something-else-name"
              whileTap={{ scale: 0.985 }}
              transition={spring}
            >
              <div className="info-addon__top">
                <span className="info-tile info-tile--lg" aria-hidden="true">
                  <IconPlus size={26} stroke={1.6} />
                </span>
                <div className="info-addon__title">
                  <h3 className="t-h3" id="something-else-name">
                    Something else?
                  </h3>
                  <p className="info-addon__price info-addon__price--ask">Just ask</p>
                </div>
              </div>
              <p className="t-small info-addon__desc">
                Tell us what you have in mind for your booking and we'll let you know if we can arrange it.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="info-addon__cta"
                href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to ask about an extra for my booking.`)}
                external
                aria-label="Ask on WhatsApp about something else"
                icon={<IconBrandWhatsapp size={18} stroke={1.75} />}
              >
                Ask on WhatsApp
              </Button>
            </motion.article>
          </StaggerItem>
        </RevealList>
      </section>

      {packages.length > 0 && (
        <section id="packages" className="container info-section" aria-labelledby="packages-title" data-service="party">
          <div className={`info-split${target === 'packages' ? ' is-target' : ''}`}>
            <FadeIn className="info-split__text">
              <p className="t-eyebrow t-svc">Packages</p>
              <h2 className="t-h2" id="packages-title">
                Birthdays, sorted
              </h2>
              <p className="t-lead">
                One price for the cake, welcome drink, snacks, decor, a short reel and edited photos. Pair it with a party
                space and just turn up.
              </p>
              <Link to="/party-space" className="info-inline-link">
                <ServiceIcon slug="party-space" size={28} tilt={-6} />
                <span>See party spaces</span>
                <IconChevronRight size={18} stroke={2} aria-hidden="true" />
              </Link>
            </FadeIn>
            <FadeIn delay={0.08} className="info-split__card">
              {packages.map((p) => (
                <PackageCard key={p.id} pkg={p} service="party" />
              ))}
            </FadeIn>
          </div>
        </section>
      )}

      {partners.map((a) => (
        <section key={a.id} id={a.id} className="container info-section-sm" aria-labelledby={`${a.id}-title`}>
          <FadeIn className={`info-partner${target === a.id ? ' is-target' : ''}`}>
            {a.partner && (
              <div className="info-partner__logo">
                <img
                  src={a.partner.logo.src}
                  width={a.partner.logo.width}
                  height={a.partner.logo.height}
                  alt={a.partner.logo.alt}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="info-partner__body">
              <p className="t-eyebrow">Our partner{a.partner ? `, ${a.partner.name}` : ''}</p>
              <h2 className="t-h2" id={`${a.id}-title`}>
                {a.name}
              </h2>
              <p className="t-lead">{a.description}</p>
              {a.includes && (
                <>
                  <h3 className="info-label">What's covered</h3>
                  <ul role="list" className="info-checks">
                    {a.includes.map((item) => (
                      <li key={item}>
                        <IconCheck size={18} stroke={2} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              <AppliesTo slugs={a.appliesTo} />
              <div>
                <Button
                  href={askLink(a)}
                  external
                  aria-label={`Ask on WhatsApp about ${a.name}`}
                  icon={<IconBrandWhatsapp size={20} stroke={1.75} />}
                >
                  Ask on WhatsApp
                </Button>
              </div>
            </div>
          </FadeIn>
        </section>
      ))}
    </>
  );
}
