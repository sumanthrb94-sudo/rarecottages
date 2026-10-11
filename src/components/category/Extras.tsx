import { IconBalloon } from '@tabler/icons-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import { getAddOn, packagesFor } from '../../data/addons';
import type { AddOn, CategorySlug } from '../../data/types';
import { whatsappLink } from '../../lib/enquiry';
import { formatINR } from '../../lib/format';
import { PackageCard } from '../ui/cards';
import {
  IconArrowRight,
  IconArrowUpRight,
  IconBrandWhatsapp,
  IconBrush,
  IconCake,
  IconCamera,
  IconCheck,
  IconChevronRight,
  IconToolsKitchen2,
  type Icon,
} from '../ui/icons';
import { FadeIn, Stagger, StaggerItem } from '../ui/motion';
import { Button, SectionHeader } from '../ui/primitives';

const addOnIcons: Record<string, Icon> = {
  cake: IconCake,
  decor: IconBalloon,
  photographer: IconCamera,
  'wedding-photography': IconCamera,
  makeup: IconBrush,
  catering: IconToolsKitchen2,
};

const tap = { scale: 0.98 };

function pick(ids: string[]): AddOn[] {
  return ids.map((id) => getAddOn(id)).filter((a): a is AddOn => Boolean(a));
}

function priceText(addOn: AddOn) {
  if (addOn.price !== undefined) return formatINR(addOn.price);
  if (addOn.options?.length) return `From ${formatINR(Math.min(...addOn.options.map((o) => o.price)))}`;
  return 'Price on request';
}

function onRequest(addOn: AddOn) {
  return addOn.price === undefined && !addOn.options?.length;
}

function askLink(addOn: AddOn) {
  const by = addOn.partner ? ` by ${addOn.partner.name}` : '';
  return whatsappLink(site.whatsapp, `Hi ${site.name}! Please share details and pricing for ${addOn.name}${by}.`);
}

function RowIcon({ id }: { id: string }) {
  const I = addOnIcons[id] ?? IconCake;
  return (
    <span className="cat-row__icon" aria-hidden="true">
      <I size={22} stroke={1.75} />
    </span>
  );
}

/** One tappable add-on row: icon tile, name, short description, price, trailing cue. */
function AddOnRow({ addOn, to, href, meta, end }: { addOn: AddOn; to?: string; href?: string; meta: ReactNode; end: ReactNode }) {
  const inner = (
    <>
      <RowIcon id={addOn.id} />
      <span className="cat-row__text">
        <span className="cat-row__name">{addOn.name}</span>
        <span className="cat-row__desc">{addOn.description}</span>
        <span className="cat-row__meta">{meta}</span>
      </span>
      <span className="cat-row__end" aria-hidden="true">
        {end}
      </span>
    </>
  );
  return (
    <motion.div whileTap={tap} className="cat-row-wrap">
      {to ? (
        <Link to={to} className="cat-row">
          {inner}
        </Link>
      ) : (
        <a href={href} target="_blank" rel="noreferrer" className="cat-row">
          {inner}
          <span className="visually-hidden"> (opens WhatsApp)</span>
        </a>
      )}
    </motion.div>
  );
}

function AllAddOnsLink() {
  return (
    <Link to="/add-ons" className="cat-more">
      All add-ons <IconArrowRight size={16} stroke={2} aria-hidden="true" />
    </Link>
  );
}

/** Night Stay and Hourly Stay: the three celebration add-ons, linking to the add-ons page. */
function StayExtras() {
  const items = pick(['cake', 'decor', 'photographer']);
  return (
    <section className="container cat-extras" aria-labelledby="cat-extras-title">
      <FadeIn>
        <SectionHeader id="cat-extras-title" eyebrow="Add-ons" title="Make it a celebration" action={<AllAddOnsLink />} />
        <p className="t-body cat-extras__lead">
          Add a cake, decor or a photographer and reel maker to your booking.
        </p>
      </FadeIn>
      <Stagger as="ul" className="cat-list cat-list--grid" gap={0.07}>
        {items.map((a) => (
          <StaggerItem as="li" key={a.id}>
            <AddOnRow
              addOn={a}
              to={`/add-ons#${a.id}`}
              meta={<span className={onRequest(a) ? 'cat-row__muted' : 'tabular'}>{priceText(a)}</span>}
              end={<IconChevronRight size={20} stroke={1.75} />}
            />
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

/** Party Space: cake sizes and party packages. */
function PartyExtras() {
  const cake = getAddOn('cake');
  const pkgs = packagesFor('party-space');
  return (
    <div className="container cat-extras cat-extras--party">
      {cake?.options && (
        <section aria-labelledby="cat-cakes-title" className="cat-extras__col">
          <FadeIn>
            <SectionHeader id="cat-cakes-title" eyebrow="Add-on" title="Cakes" action={<AllAddOnsLink />} />
            <p className="t-body cat-extras__lead">{cake.description}</p>
          </FadeIn>
          <Stagger as="ul" className="cat-cakes" gap={0.08}>
            {cake.options.map((o) => (
              <StaggerItem as="li" key={o.id}>
                <motion.a
                  whileTap={tap}
                  className="cat-cake"
                  href={whatsappLink(
                    site.whatsapp,
                    `Hi ${site.name}! I'd like a ${o.label} cake (${formatINR(o.price)}) with my party booking.`,
                  )}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${o.label} cake, ${formatINR(o.price)}. Order on WhatsApp`}
                >
                  <span className="cat-cake__top">
                    <span className="cat-row__icon" aria-hidden="true">
                      <IconCake size={22} stroke={1.75} />
                    </span>
                    <IconArrowUpRight size={18} stroke={1.75} className="cat-cake__arrow" aria-hidden="true" />
                  </span>
                  <span className="cat-cake__size">{o.label}</span>
                  <span className="cat-cake__price tabular">{formatINR(o.price)}</span>
                  <span className="cat-cake__cta">Order on WhatsApp</span>
                </motion.a>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}
      {pkgs.length > 0 && (
        <section aria-labelledby="cat-packages-title" className="cat-extras__col">
          <FadeIn>
            <SectionHeader id="cat-packages-title" eyebrow="Packages" title="Party packages" />
          </FadeIn>
          <div className="cat-packages">
            {pkgs.map((p, i) => (
              <FadeIn key={p.id} delay={0.08 * i}>
                <PackageCard pkg={p} service="party" />
              </FadeIn>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** Event Space: RC Studios wedding photography, make-up and catering. */
function EventExtras() {
  const photo = getAddOn('wedding-photography');
  const rows = pick(['makeup', 'catering']);
  return (
    <section className="container cat-extras" aria-labelledby="cat-bigday-title">
      <FadeIn>
        <SectionHeader id="cat-bigday-title" eyebrow="Services" title="For the big day" action={<AllAddOnsLink />} />
      </FadeIn>
      <div className="cat-bigday">
        {photo && (
          <FadeIn>
            <article className="cat-rc" aria-labelledby="cat-rc-title">
              {photo.partner && (
                <div className="cat-rc__logo">
                  <img
                    src={photo.partner.logo.src}
                    width={photo.partner.logo.width}
                    height={photo.partner.logo.height}
                    alt={photo.partner.logo.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
              <div className="cat-rc__body">
                <div>
                  {photo.partner && <p className="t-eyebrow t-svc">With {photo.partner.name}</p>}
                  <h3 className="cat-rc__title" id="cat-rc-title">
                    {photo.name}
                  </h3>
                  <p className="t-small">{photo.description}</p>
                </div>
                {photo.includes && (
                  <ul role="list" className="cat-rc__includes" aria-label="Coverage includes">
                    {photo.includes.map((item) => (
                      <li key={item}>
                        <IconCheck size={16} stroke={2.25} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="cat-rc__foot">
                  <span className="cat-rc__price">{priceText(photo)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    href={askLink(photo)}
                    external
                    icon={<IconBrandWhatsapp size={18} stroke={1.75} />}
                    aria-label={`Ask about ${photo.name} on WhatsApp`}
                  >
                    Ask on WhatsApp
                  </Button>
                </div>
              </div>
            </article>
          </FadeIn>
        )}
        <Stagger as="ul" className="cat-list" gap={0.08}>
          {rows.map((a) => (
            <StaggerItem as="li" key={a.id}>
              <AddOnRow
                addOn={a}
                href={askLink(a)}
                meta={
                  <>
                    <span className={onRequest(a) ? 'cat-row__muted' : 'tabular'}>{priceText(a)}</span>
                    <span className="cat-row__ask">
                      <IconBrandWhatsapp size={15} stroke={1.75} aria-hidden="true" /> Ask on WhatsApp
                    </span>
                  </>
                }
                end={<IconArrowUpRight size={20} stroke={1.75} />}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function CategoryExtras({ slug }: { slug: CategorySlug }) {
  if (slug === 'party-space') return <PartyExtras />;
  if (slug === 'event-space') return <EventExtras />;
  return <StayExtras />;
}
