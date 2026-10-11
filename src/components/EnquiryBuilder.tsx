import { Info, Phone } from 'lucide-react';
import { useId, useMemo, useState } from 'react';
import { site, telHref } from '../config/site';
import { addOnsFor, packagesFor } from '../data/addons';
import { getCategory, unitLabel } from '../data/categories';
import type { Offer, Property } from '../data/types';
import { buildEnquiryMessage, estimate, lineItems, whatsappLink, type Enquiry } from '../lib/enquiry';
import { formatINR } from '../lib/format';
import { DateField, Stepper } from './Controls';
import { addOnIcons } from './Extras';
import { WhatsAppIcon } from './icons';
import './EnquiryBuilder.css';

interface Props {
  property: Property;
  offers: Offer[];
  offer: Offer;
  onOfferChange: (offer: Offer) => void;
  initialDate?: string;
  initialGuests?: number;
}

export function EnquiryBuilder({ property, offers, offer, onOfferChange, initialDate, initialGuests }: Props) {
  const uid = useId();
  const [date, setDate] = useState(initialDate);
  const [guests, setGuests] = useState(initialGuests);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, string | true>>({});
  const [pkgId, setPkgId] = useState<string>();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const category = getCategory(offer.category)!;
  const available = addOnsFor(offer.category);
  const pkgs = packagesFor(offer.category);
  const units = unitLabel[offer.unit];

  const enquiry: Enquiry = useMemo(
    () => ({
      property,
      offer,
      categoryName: category.name,
      date,
      guests,
      quantity,
      pkg: pkgs.find((p) => p.id === pkgId),
      addOns: available
        .filter((a) => selected[a.id])
        .map((a) => ({ addOn: a, optionId: typeof selected[a.id] === 'string' ? (selected[a.id] as string) : undefined })),
      name: name.trim() || undefined,
      notes,
    }),
    [property, offer, category.name, date, guests, quantity, pkgs, pkgId, available, selected, name, notes],
  );

  const items = lineItems(enquiry);
  const { total, hasOnRequest } = estimate(enquiry);
  const overCapacity = guests && offer.capacity && guests > offer.capacity.max;

  const toggleAddOn = (id: string, defaultOption?: string) =>
    setSelected((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = defaultOption ?? true;
      return next;
    });

  return (
    <section className="enquiry" id="enquire" aria-labelledby={`${uid}-title`}>
      <h2 className="enquiry__title" id={`${uid}-title`}>
        Plan your booking
      </h2>

      {offers.length > 1 && (
        <fieldset className="enquiry__group">
          <legend className="field__label">Book it as</legend>
          <div className="offer-options">
            {offers.map((o) => {
              const c = getCategory(o.category)!;
              return (
                <label key={o.id} className="offer-option" data-theme={c.theme}>
                  <input
                    type="radio"
                    name={`${uid}-offer`}
                    checked={o.id === offer.id}
                    onChange={() => {
                      onOfferChange(o);
                      setQuantity(1);
                      setPkgId(undefined);
                      setSelected({});
                    }}
                  />
                  <span>
                    <strong>{c.name}</strong>
                    <small>
                      {formatINR(o.price)} {unitLabel[o.unit].per}
                    </small>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="enquiry__row">
        <DateField value={date} onChange={setDate} />
        <Stepper label="No of People" placeholder="Guests" value={guests} onChange={setGuests} icon={false} />
      </div>
      {overCapacity && (
        <p className="enquiry__note" role="status">
          <Info aria-hidden="true" /> This space suits up to {offer.capacity!.max} people. Send the enquiry anyway and
          we'll suggest the best fit.
        </p>
      )}

      {offer.unit !== 'event' && (
        <Stepper
          label={`Number of ${units.qtyPlural}`}
          value={quantity}
          min={1}
          max={offer.unit === 'hour' ? 24 : 30}
          icon={false}
          onChange={(n) => setQuantity(n ?? 1)}
        />
      )}

      {pkgs.length > 0 && (
        <fieldset className="enquiry__group">
          <legend className="field__label">Packages</legend>
          {pkgs.map((p) => (
            <label key={p.id} className="check">
              <input
                type="checkbox"
                checked={pkgId === p.id}
                onChange={() => setPkgId((cur) => (cur === p.id ? undefined : p.id))}
              />
              <span className="check__body">
                <span className="check__name">{p.title.join(' ')}</span>
                <span className="check__desc">{p.includes.join(' · ')}</span>
              </span>
              <span className="check__price">{formatINR(p.price)}</span>
            </label>
          ))}
        </fieldset>
      )}

      {available.length > 0 && (
        <fieldset className="enquiry__group">
          <legend className="field__label">Add-ons</legend>
          {available.map((a) => {
            const Icon = addOnIcons[a.id];
            const value = selected[a.id];
            return (
              <div key={a.id} className="check-wrap">
                <label className="check">
                  <input type="checkbox" checked={Boolean(value)} onChange={() => toggleAddOn(a.id, a.options?.[0]?.id)} />
                  <span className="check__body">
                    <span className="check__name">
                      {Icon && <Icon aria-hidden="true" />} {a.name}
                    </span>
                    <span className="check__desc">{a.description}</span>
                  </span>
                  <span className="check__price">
                    {a.options ? `from ${formatINR(Math.min(...a.options.map((o) => o.price)))}` : a.price ? formatINR(a.price) : 'on request'}
                  </span>
                </label>
                {a.options && value && (
                  <div className="sizes" role="radiogroup" aria-label={`${a.name} size`}>
                    {a.options.map((o) => (
                      <label key={o.id} className="size">
                        <input
                          type="radio"
                          name={`${uid}-${a.id}`}
                          checked={value === o.id}
                          onChange={() => setSelected((prev) => ({ ...prev, [a.id]: o.id }))}
                        />
                        <span>
                          {o.label} · {formatINR(o.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </fieldset>
      )}

      <div className="enquiry__row">
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-name`}>
            Your name <span className="optional">(optional)</span>
          </label>
          <input
            id={`${uid}-name`}
            className="input"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label className="field__label" htmlFor={`${uid}-notes`}>
            Anything else? <span className="optional">(optional)</span>
          </label>
          <input
            id={`${uid}-notes`}
            className="input"
            placeholder="Occasion, timings, theme…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="summary" aria-live="polite">
        <ul role="list" className="summary__items">
          {items.map((item) => (
            <li key={item.label}>
              <span>{item.label}</span>
              <span>{item.amount === undefined ? 'on request' : formatINR(item.amount)}</span>
            </li>
          ))}
        </ul>
        <p className="summary__total">
          <span>Estimated total</span>
          <strong>
            {formatINR(total)}
            {hasOnRequest && <small> + quoted items</small>}
          </strong>
        </p>
      </div>

      <div className="enquiry__actions">
        <a
          className="btn btn--whatsapp btn--block"
          href={whatsappLink(site.whatsapp, buildEnquiryMessage(enquiry))}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon /> Enquire on WhatsApp
        </a>
        <a className="btn btn--ghost" href={telHref} aria-label={`Call ${site.name}`}>
          <Phone /> Call
        </a>
      </div>
      <p className="enquiry__fineprint">
        No payment now. We'll confirm availability and your final quote on WhatsApp.
      </p>
    </section>
  );
}
