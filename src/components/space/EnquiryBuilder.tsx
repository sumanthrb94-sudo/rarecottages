import { IconAlertTriangle } from '@tabler/icons-react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useId, type ReactNode } from 'react';
import { site, telHref } from '../../config/site';
import { getCategory, unitLabel } from '../../data/categories';
import type { AddOn, Offer } from '../../data/types';
import { buildEnquiryMessage, whatsappLink } from '../../lib/enquiry';
import { formatINR } from '../../lib/format';
import { capacityText, unitShort } from '../ui/cards';
import { DateField, Stepper, TextArea, TextField } from '../ui/forms';
import {
  IconBrandWhatsapp,
  IconCake,
  IconCalendarEvent,
  IconCamera,
  IconCheck,
  IconCircleCheckFilled,
  IconConfetti,
  IconPhone,
  IconPhoto,
  IconSparkles,
  IconToolsKitchen2,
  IconUsers,
  IconWand,
  type Icon,
} from '../ui/icons';
import { SlidingNumber, spring } from '../ui/motion';
import { Button, ServiceIcon, serviceTheme } from '../ui/primitives';
import { offerService, type EnquiryState } from './useEnquiryState';
import './EnquiryBuilder.css';

const addOnIcons: Record<string, Icon> = {
  cake: IconCake,
  decor: IconSparkles,
  photographer: IconCamera,
  'wedding-photography': IconPhoto,
  makeup: IconWand,
  catering: IconToolsKitchen2,
};

function guestRange(offer: Offer) {
  if (!offer.capacity) return undefined;
  const { min, max } = offer.capacity;
  return min ? `${min}–${max} guests` : `up to ${max} guests`;
}

/* ------------------------------------------------------------------ offer picker */

/**
 * "Book it as": one card per offer, each in its own service colour, with a
 * shared ring that springs to the selected card. A native radio group, so
 * arrow keys move between offers.
 */
export function OfferPicker({
  state,
  group,
  legend = 'Book it as',
}: {
  state: EnquiryState;
  /** Namespaces the sliding ring, so two pickers on screen animate independently. */
  group: string;
  legend?: string;
}) {
  const name = useId();
  return (
    <fieldset className="sp-offers">
      <legend className="sp-label">{legend}</legend>
      <LayoutGroup id={group}>
        <div className="sp-offers__grid">
          {state.offers.map((o) => {
            const slug = offerService(o, state.requested);
            const checked = o.id === state.offer.id;
            const facts = [capacityText(o), o.durationHours ? `${o.durationHours} hrs` : undefined].filter(
              (f): f is string => Boolean(f),
            );
            return (
              <motion.label
                key={o.id}
                className={`sp-offer${checked ? ' is-on' : ''}`}
                data-service={serviceTheme(slug)}
                whileTap={{ scale: 0.97 }}
                transition={spring}
              >
                <input
                  type="radio"
                  className="visually-hidden"
                  name={name}
                  checked={checked}
                  onChange={() => state.setOffer(o)}
                />
                {checked && (
                  <motion.span layoutId="ring" className="sp-offer__ring" transition={spring} aria-hidden="true" />
                )}
                <span className="sp-offer__top">
                  <ServiceIcon slug={slug} size={34} tilt={checked ? -6 : 0} className="sp-offer__icon" />
                  <span className="sp-offer__check" aria-hidden="true">
                    {checked ? <IconCircleCheckFilled size={24} /> : <span className="sp-offer__dot" />}
                  </span>
                </span>
                <span className="sp-offer__name">{getCategory(slug)!.name}</span>
                <span className="sp-offer__price tabular">
                  {formatINR(o.price)}
                  <span> /{unitShort(o)}</span>
                </span>
                {facts.length > 0 && (
                  <span className="sp-offer__facts">
                    {facts.map((f) => (
                      <span key={f}>{f}</span>
                    ))}
                  </span>
                )}
              </motion.label>
            );
          })}
        </div>
      </LayoutGroup>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ option rows */

function OptionRow({
  checked,
  onChange,
  icon: I,
  name,
  description,
  price,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  icon: Icon;
  name: string;
  description: string;
  price: string;
  children?: ReactNode;
}) {
  return (
    <div className={`sp-opt${checked ? ' is-on' : ''}`}>
      <motion.label className="sp-opt__main" whileTap={{ scale: 0.985 }} transition={spring}>
        <input type="checkbox" className="sp-opt__input visually-hidden" checked={checked} onChange={onChange} />
        <span className="sp-opt__icon" aria-hidden="true">
          <I size={22} stroke={1.6} />
        </span>
        <span className="sp-opt__text">
          <span className="sp-opt__head">
            <span className="sp-opt__name">{name}</span>
            <span className="sp-opt__price tabular">{price}</span>
          </span>
          <span className="sp-opt__desc">{description}</span>
        </span>
        <span className="sp-opt__box" aria-hidden="true">
          <AnimatePresence initial={false}>
            {checked && (
              <motion.span
                className="sp-opt__tick"
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0 }}
                transition={spring}
              >
                <IconCheck size={16} stroke={3} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.label>
      <AnimatePresence initial={false}>
        {checked && children && (
          <motion.div
            className="sp-opt__extra"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="sp-opt__extra-inner">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** iOS-style segmented control for add-on sizes (e.g. cake 1 kg / ½ kg). */
function SizePicker({ addOn, value, onChange }: { addOn: AddOn; value: string; onChange: (id: string) => void }) {
  const name = useId();
  if (!addOn.options) return null;
  return (
    <fieldset className="sp-seg">
      <legend className="visually-hidden">{addOn.name} size</legend>
      <LayoutGroup id={name}>
        <div className="sp-seg__track">
          {addOn.options.map((o) => {
            const on = value === o.id;
            return (
              <label key={o.id} className={`sp-seg__opt${on ? ' is-on' : ''}`}>
                <input type="radio" className="visually-hidden" name={name} checked={on} onChange={() => onChange(o.id)} />
                {on && <motion.span layoutId="thumb" className="sp-seg__thumb" transition={spring} aria-hidden="true" />}
                <span className="sp-seg__text">
                  {o.label} <span className="tabular">· {formatINR(o.price)}</span>
                </span>
              </label>
            );
          })}
        </div>
      </LayoutGroup>
    </fieldset>
  );
}

function addOnPrice(addOn: AddOn, selected: string | true | undefined) {
  if (addOn.options?.length) {
    const chosen = addOn.options.find((o) => o.id === selected);
    if (chosen) return formatINR(chosen.price);
    return `from ${formatINR(Math.min(...addOn.options.map((o) => o.price)))}`;
  }
  return addOn.price !== undefined ? formatINR(addOn.price) : 'On request';
}

/* ------------------------------------------------------------------ builder */

/**
 * The booking form: date, guests, nights/hours, packages, add-ons, contact and
 * a running summary. State lives in useEnquiryState so the same booking shows
 * in the desktop card, the mobile sheet and the bottom bar.
 */
export function EnquiryBuilder({ state, showOffers = false }: { state: EnquiryState; showOffers?: boolean }) {
  const uid = useId();
  const { offer } = state;
  const units = unitLabel[offer.unit];
  const range = guestRange(offer);

  return (
    <div className="sp-eb">
      {showOffers && state.offers.length > 1 && <OfferPicker state={state} group={`${uid}-offers`} />}

      <section className="sp-eb__group" aria-labelledby={`${uid}-when`}>
        <h3 id={`${uid}-when`} className="sp-eb__title">
          Date &amp; guests
        </h3>
        <div className="sp-eb__fields">
          <DateField label="Date" value={state.date} onChange={state.setDate} />
          <div className="sp-eb__pair">
            <Stepper label="Guests" placeholder="Add" value={state.guests} onChange={state.setGuests} max={1000} />
            {offer.unit === 'event' ? (
              <div className="field">
                <span className="field__label">Booking</span>
                <p className="sp-eb__static">
                  <IconCalendarEvent size={18} stroke={1.75} aria-hidden="true" />
                  <span className="sp-eb__static-text">
                    Full event
                    {offer.durationHours ? <span className="sp-eb__static-sub">{offer.durationHours} hours</span> : null}
                  </span>
                </p>
              </div>
            ) : (
              <Stepper
                label={units.qtyPlural.charAt(0).toUpperCase() + units.qtyPlural.slice(1)}
                value={state.quantity}
                min={1}
                max={offer.unit === 'hour' ? 24 : 30}
                onChange={(n) => state.setQuantity(n ?? 1)}
              />
            )}
          </div>
        </div>
        <div aria-live="polite">
          <AnimatePresence initial={false} mode="wait">
            {state.overCapacity && offer.capacity ? (
              <motion.p
                key="warn"
                className="sp-eb__note sp-eb__note--warn"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <IconAlertTriangle size={18} stroke={1.75} aria-hidden="true" />
                <span>
                  {state.property.name} suits up to {offer.capacity.max} guests. Send the enquiry anyway and we&rsquo;ll
                  suggest the best fit.
                </span>
              </motion.p>
            ) : range ? (
              <motion.p key="hint" className="sp-eb__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <IconUsers size={18} stroke={1.75} aria-hidden="true" />
                <span>Suits {range}.</span>
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </section>

      {state.packages.length > 0 && (
        <fieldset className="sp-eb__group">
          <legend className="sp-eb__legend">
            <h3 className="sp-eb__title">Packages</h3>
          </legend>
          <div className="sp-eb__list">
            {state.packages.map((p) => (
              <OptionRow
                key={p.id}
                checked={state.pkgId === p.id}
                onChange={() => state.togglePackage(p.id)}
                icon={IconConfetti}
                name={p.title.join(' ')}
                description={p.includes.join(' · ')}
                price={formatINR(p.price)}
              />
            ))}
          </div>
        </fieldset>
      )}

      {state.addOns.length > 0 && (
        <fieldset className="sp-eb__group">
          <legend className="sp-eb__legend">
            <h3 className="sp-eb__title">Add-ons</h3>
            <span className="sp-eb__sub">Items without a price are quoted on WhatsApp.</span>
          </legend>
          <div className="sp-eb__list">
            {state.addOns.map((a) => {
              const value = state.selected[a.id];
              return (
                <OptionRow
                  key={a.id}
                  checked={Boolean(value)}
                  onChange={() => state.toggleAddOn(a)}
                  icon={addOnIcons[a.id] ?? IconSparkles}
                  name={a.name}
                  description={a.description}
                  price={addOnPrice(a, value)}
                >
                  {a.options?.length ? (
                    <SizePicker
                      addOn={a}
                      value={typeof value === 'string' ? value : a.options[0].id}
                      onChange={(id) => state.setAddOnOption(a.id, id)}
                    />
                  ) : null}
                </OptionRow>
              );
            })}
          </div>
        </fieldset>
      )}

      <section className="sp-eb__group" aria-labelledby={`${uid}-you`}>
        <h3 id={`${uid}-you`} className="sp-eb__title">
          Your details
        </h3>
        <div className="sp-eb__fields">
          <TextField
            label="Your name"
            optional
            autoComplete="name"
            value={state.name}
            onChange={(e) => state.setName(e.target.value)}
          />
          <TextArea
            label="Anything else?"
            optional
            rows={3}
            placeholder="Occasion, timings, theme…"
            value={state.notes}
            onChange={(e) => state.setNotes(e.target.value)}
          />
        </div>
      </section>

      <section className="sp-eb__group" aria-labelledby={`${uid}-sum`}>
        <h3 id={`${uid}-sum`} className="sp-eb__title">
          Summary
        </h3>
        <ul role="list" className="sp-sum">
          <AnimatePresence initial={false}>
            {state.items.map((item) => (
              <motion.li
                key={item.key}
                className="sp-sum__item"
                layout="position"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="sp-sum__row">
                  <span>{item.label}</span>
                  <span className="sp-sum__amount tabular">
                    {item.amount === undefined ? 'On request' : formatINR(item.amount)}
                  </span>
                </span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ footer */

/** Estimated total (rolling digits, announced politely) and the WhatsApp / Call actions. */
export function EnquiryFooter({ state }: { state: EnquiryState }) {
  const href = whatsappLink(site.whatsapp, buildEnquiryMessage(state.enquiry));
  return (
    <div className="sp-foot">
      <div className="sp-foot__total" aria-live="polite" aria-atomic="true">
        <span className="sp-foot__label">
          Estimated total
          {state.hasOnRequest && <span className="sp-foot__plus"> + quoted items</span>}
        </span>
        <SlidingNumber value={state.total} className="sp-foot__amount" />
      </div>
      <div className="sp-foot__actions">
        <Button
          variant="whatsapp"
          size="lg"
          block
          href={href}
          external
          className="sp-foot__wa"
          icon={<IconBrandWhatsapp size={22} stroke={1.75} />}
        >
          Enquire on WhatsApp
        </Button>
        <Button
          variant="secondary"
          size="lg"
          href={telHref}
          className="sp-foot__call"
          aria-label={`Call ${site.name}`}
          icon={<IconPhone size={20} stroke={1.75} />}
        >
          Call
        </Button>
      </div>
      <p className="sp-foot__fine">No payment now. We confirm availability and your final quote on WhatsApp.</p>
    </div>
  );
}
