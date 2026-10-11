import { useCallback, useMemo, useState } from 'react';
import { addOnsFor, packagesFor } from '../../data/addons';
import { getCategory } from '../../data/categories';
import type { AddOn, CategorySlug, Offer, Package, Property } from '../../data/types';
import { estimate, lineItems, type Enquiry, type LineItem } from '../../lib/enquiry';

/** `?for=hourly-stay` picks the hourly-priced offer; any other service picks its own offer; else the first. */
export function pickOffer(offers: Offer[], requested: string | null | undefined): Offer {
  if (requested === 'hourly-stay') return offers.find((o) => o.unit === 'hour') ?? offers[0];
  return offers.find((o) => o.category === requested) ?? offers[0];
}

/**
 * The service an offer is presented as. A space priced by the hour that the
 * visitor reached from Hourly Stay keeps the Hourly Stay name and colour.
 */
export function offerService(offer: Offer, requested: string | null | undefined): CategorySlug {
  return requested === 'hourly-stay' && offer.unit === 'hour' ? 'hourly-stay' : offer.category;
}

export interface KeyedLineItem extends LineItem {
  key: string;
}

/**
 * Everything the enquiry builder edits, lifted out of the builder so the page's
 * bottom bar, the mobile sheet and the desktop card all share one booking.
 */
export function useEnquiryState({
  property,
  offers,
  requested,
  initialDate,
  initialGuests,
}: {
  property: Property;
  offers: Offer[];
  requested: string | null;
  initialDate?: string;
  initialGuests?: number;
}) {
  const [offer, setOfferState] = useState(() => pickOffer(offers, requested));
  const [date, setDate] = useState(initialDate);
  const [guests, setGuests] = useState(initialGuests);
  const [quantity, setQuantity] = useState(1);
  /** add-on id -> chosen option id (or true when the add-on has no options) */
  const [selected, setSelected] = useState<Record<string, string | true>>({});
  const [pkgId, setPkgId] = useState<string>();
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const service = offerService(offer, requested);
  const serviceName = getCategory(service)!.name;
  const addOns: AddOn[] = useMemo(() => addOnsFor(offer.category), [offer.category]);
  const packages: Package[] = useMemo(() => packagesFor(offer.category), [offer.category]);

  /** Switching how the space is booked starts the extras afresh (prices and add-ons differ). */
  const setOffer = (next: Offer) => {
    if (next.id === offer.id) return;
    setOfferState(next);
    setQuantity(1);
    setSelected({});
    setPkgId(undefined);
  };

  const toggleAddOn = useCallback((addOn: AddOn) => {
    setSelected((prev) => {
      const next = { ...prev };
      if (next[addOn.id]) delete next[addOn.id];
      else next[addOn.id] = addOn.options?.[0]?.id ?? true;
      return next;
    });
  }, []);

  const setAddOnOption = useCallback((addOnId: string, optionId: string) => {
    setSelected((prev) => ({ ...prev, [addOnId]: optionId }));
  }, []);

  const togglePackage = useCallback((id: string) => setPkgId((cur) => (cur === id ? undefined : id)), []);

  const pkg = packages.find((p) => p.id === pkgId);

  const enquiry: Enquiry = useMemo(
    () => ({
      property,
      offer,
      categoryName: serviceName,
      date,
      guests,
      quantity,
      pkg,
      addOns: addOns
        .filter((a) => selected[a.id])
        .map((a) => ({
          addOn: a,
          optionId: typeof selected[a.id] === 'string' ? (selected[a.id] as string) : undefined,
        })),
      name: name.trim() || undefined,
      notes,
    }),
    [property, offer, serviceName, date, guests, quantity, pkg, addOns, selected, name, notes],
  );

  const items: KeyedLineItem[] = useMemo(() => {
    const raw = lineItems(enquiry);
    const keys = ['base', ...(enquiry.pkg ? ['pkg'] : []), ...enquiry.addOns.map((s) => s.addOn.id)];
    return raw.map((item, i) => ({ ...item, key: keys[i] ?? `item-${i}` }));
  }, [enquiry]);

  const { total, hasOnRequest } = estimate(enquiry);
  const customised = quantity > 1 || Boolean(pkg) || enquiry.addOns.length > 0;
  const overCapacity = Boolean(guests && offer.capacity && guests > offer.capacity.max);

  return {
    property,
    offers,
    requested,
    offer,
    setOffer,
    service,
    serviceName,
    date,
    setDate,
    guests,
    setGuests,
    quantity,
    setQuantity,
    addOns,
    packages,
    selected,
    toggleAddOn,
    setAddOnOption,
    pkgId,
    togglePackage,
    name,
    setName,
    notes,
    setNotes,
    enquiry,
    items,
    total,
    hasOnRequest,
    customised,
    overCapacity,
  };
}

export type EnquiryState = ReturnType<typeof useEnquiryState>;
