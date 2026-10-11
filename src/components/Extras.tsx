import {
  Cake,
  Camera,
  Check,
  Flower2,
  PartyPopper,
  Sparkles,
  UtensilsCrossed,
  WandSparkles,
  type LucideProps,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { addOns, getAddOn } from '../data/addons';
import type { AddOn, Package } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { formatINR } from '../lib/format';
import { WhatsAppIcon } from './icons';
import './Extras.css';

export const addOnIcons: Record<string, ComponentType<LucideProps>> = {
  cake: Cake,
  decor: Flower2,
  photographer: Camera,
  'wedding-photography': Camera,
  makeup: WandSparkles,
  catering: UtensilsCrossed,
};

/** The three slanted add-on chips from the home mockup. */
export function AddOnChips({ ids = ['cake', 'decor', 'photographer'] }: { ids?: string[] }) {
  const items = ids.map((id) => getAddOn(id)).filter((a): a is AddOn => Boolean(a));
  return (
    <ul role="list" className="chips">
      {items.map((a) => (
        <li key={a.id}>
          <Link to={`/add-ons#${a.id}`} className="slant chip">
            {a.short}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Cake icon with the "899/- 1KG" and "499/- 1/2KG" tags from the party mockup. */
export function CakeStrip() {
  const cake = getAddOn('cake');
  if (!cake?.options) return null;
  return (
    <div className="cake-strip">
      <Cake className="cake-strip__icon" aria-hidden="true" strokeWidth={1.4} />
      <ul role="list" className="cake-strip__list" aria-label="Cake prices">
        {cake.options.map((o) => (
          <li key={o.id} className="cake-tag">
            <span className="cake-tag__price">{formatINR(o.price)}/-</span>
            <span className="cake-tag__size">{o.label.toUpperCase()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PackageCard({ pkg }: { pkg: Package }) {
  const message = `Hi ${site.name}! I'm interested in the ${pkg.title.join(' ')} (${formatINR(pkg.price)}).`;
  return (
    <article className="pkg">
      <div className="pkg__head">
        <h3 className="pkg__title">
          <span className="pkg__title-1">{pkg.title[0]}</span>
          <span className="pkg__title-2">{pkg.title[1]}</span>
        </h3>
        <p className="pkg__price">{formatINR(pkg.price)}/-</p>
        <PartyPopper className="pkg__icon" aria-hidden="true" strokeWidth={1.5} />
      </div>
      <ul className="pkg__list">
        {pkg.includes.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <a className="btn btn--sm pkg__cta" href={whatsappLink(site.whatsapp, message)} target="_blank" rel="noreferrer">
        <WhatsAppIcon /> Book this package
      </a>
    </article>
  );
}

/** White service card; partner services (RC Studios) show the partner's logo. */
export function ServiceCard({ addOn }: { addOn: AddOn }) {
  const Icon = addOnIcons[addOn.id] ?? Sparkles;
  const message = `Hi ${site.name}! Please share details and pricing for ${addOn.name}.`;
  return (
    <article className="service" id={`service-${addOn.id}`}>
      <div className="service__brand">
        {addOn.partner ? (
          <img
            src={addOn.partner.logo.src}
            width={addOn.partner.logo.width}
            height={addOn.partner.logo.height}
            alt={addOn.partner.logo.alt}
            loading="lazy"
          />
        ) : (
          <>
            <Icon className="service__icon" aria-hidden />
            <h3 className="service__name">{addOn.name}</h3>
          </>
        )}
      </div>
      <div className="service__body">
        {addOn.partner && <h3 className="visually-hidden">{addOn.name}</h3>}
        {addOn.includes ? (
          <ul className="service__list">
            {addOn.includes.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        ) : (
          <p>{addOn.description}</p>
        )}
        <p className="service__price">
          {addOn.price ? formatINR(addOn.price) : addOn.options ? `From ${formatINR(Math.min(...addOn.options.map((o) => o.price)))}` : 'Price on request'}
        </p>
        <a className="service__link" href={whatsappLink(site.whatsapp, message)} target="_blank" rel="noreferrer">
          Ask on WhatsApp
        </a>
      </div>
    </article>
  );
}

/** Pink arrow tags from the event mockup that jump to a service in the carousel. */
export function ServiceTags({ ids }: { ids: string[] }) {
  const items = ids.map((id) => addOns.find((a) => a.id === id)).filter((a): a is AddOn => Boolean(a));
  return (
    <ul role="list" className="arrow-tags">
      {items.map((a, i) => (
        <li key={a.id}>
          <a
            href={`#service-${a.id}`}
            className={`arrow-tag ${i % 2 === 0 ? 'arrow-tag--left' : 'arrow-tag--right'}`}
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById(`service-${a.id}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
            }}
          >
            {a.short}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function IncludedList({ items }: { items: string[] }) {
  return (
    <ul role="list" className="included">
      {items.map((i) => (
        <li key={i}>
          <Check aria-hidden="true" /> {i}
        </li>
      ))}
    </ul>
  );
}
