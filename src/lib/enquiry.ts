import { unitLabel } from '../data/categories';
import type { AddOn, Offer, Package, Property } from '../data/types';
import { formatDate, formatINR, plural } from './format';

export interface SelectedAddOn {
  addOn: AddOn;
  /** Chosen option id for add-ons with options (e.g. cake size). */
  optionId?: string;
}

export interface Enquiry {
  property: Property;
  offer: Offer;
  categoryName: string;
  date?: string;
  guests?: number;
  /** Nights or hours, depending on the offer's unit. Ignored for flat event pricing. */
  quantity: number;
  addOns: SelectedAddOn[];
  pkg?: Package;
  name?: string;
  notes?: string;
}

export interface LineItem {
  label: string;
  /** Undefined when the price is quoted on request. */
  amount?: number;
}

export function addOnLine({ addOn, optionId }: SelectedAddOn): LineItem {
  const option = addOn.options?.find((o) => o.id === optionId) ?? addOn.options?.[0];
  if (option) return { label: `${addOn.name} (${option.label})`, amount: option.price };
  return { label: addOn.name, amount: addOn.price };
}

export function lineItems(enquiry: Enquiry): LineItem[] {
  const { offer, quantity, property } = enquiry;
  const qty = offer.unit === 'event' ? 1 : Math.max(1, quantity);
  const units = unitLabel[offer.unit];
  const label =
    offer.unit === 'event'
      ? property.name
      : `${property.name} × ${plural(qty, units.qty, units.qtyPlural)}`;
  const items: LineItem[] = [{ label, amount: offer.price * qty }];
  if (enquiry.pkg) items.push({ label: `${enquiry.pkg.title.join(' ')}`, amount: enquiry.pkg.price });
  for (const selected of enquiry.addOns) items.push(addOnLine(selected));
  return items;
}

export function estimate(enquiry: Enquiry): { total: number; hasOnRequest: boolean } {
  const items = lineItems(enquiry);
  return {
    total: items.reduce((sum, item) => sum + (item.amount ?? 0), 0),
    hasOnRequest: items.some((item) => item.amount === undefined),
  };
}

export function buildEnquiryMessage(enquiry: Enquiry): string {
  const { offer, property } = enquiry;
  const units = unitLabel[offer.unit];
  const lines: string[] = [];
  lines.push(`Hi Rare Cottages! I'd like to book ${property.name} (${enquiry.categoryName}).`);
  lines.push('');
  if (enquiry.name) lines.push(`Name: ${enquiry.name}`);
  lines.push(`Date: ${enquiry.date ? formatDate(enquiry.date) : 'flexible / to be decided'}`);
  if (enquiry.guests) lines.push(`Guests: ${enquiry.guests}`);
  if (offer.unit === 'event') {
    lines.push(`Booking: full event${offer.durationHours ? ` (${offer.durationHours} hrs)` : ''} @ ${formatINR(offer.price)}`);
  } else {
    const qty = Math.max(1, enquiry.quantity);
    lines.push(`Booking: ${plural(qty, units.qty, units.qtyPlural)} @ ${formatINR(offer.price)} ${units.per}`);
  }
  if (enquiry.pkg) lines.push(`Package: ${enquiry.pkg.title.join(' ')} (${formatINR(enquiry.pkg.price)})`);
  if (enquiry.addOns.length) {
    lines.push('Add-ons:');
    for (const selected of enquiry.addOns) {
      const item = addOnLine(selected);
      lines.push(`- ${item.label}${item.amount === undefined ? ' (please quote)' : ` (${formatINR(item.amount)})`}`);
    }
  }
  const { total, hasOnRequest } = estimate(enquiry);
  lines.push('');
  lines.push(`Estimated total: ${formatINR(total)}${hasOnRequest ? ' + items to be quoted' : ''}`);
  if (enquiry.notes?.trim()) {
    lines.push('');
    lines.push(`Notes: ${enquiry.notes.trim()}`);
  }
  lines.push('');
  lines.push('Please confirm availability. Thank you!');
  return lines.join('\n');
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
