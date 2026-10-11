import { describe, expect, it } from 'vitest';
import { getAddOn, packages } from '../data/addons';
import { getOffer, getProperty } from '../data/listings';
import { buildEnquiryMessage, estimate, whatsappLink, type Enquiry } from './enquiry';

function enquiry(offerId: string, extra: Partial<Enquiry> = {}): Enquiry {
  const offer = getOffer(offerId)!;
  return {
    offer,
    property: getProperty(offer.propertyId)!,
    categoryName: 'Party Space',
    quantity: 1,
    addOns: [],
    ...extra,
  };
}

describe('estimate', () => {
  it('multiplies hourly rates by the number of hours', () => {
    expect(estimate(enquiry('brimmies-party', { quantity: 3 }))).toEqual({ total: 6000, hasOnRequest: false });
  });

  it('charges flat event prices once, whatever the quantity', () => {
    expect(estimate(enquiry('seera-event', { quantity: 4 })).total).toBe(30000);
  });

  it('adds priced add-ons and flags items quoted on request', () => {
    const result = estimate(
      enquiry('brimmies-party', {
        quantity: 2,
        pkg: packages[0],
        addOns: [
          { addOn: getAddOn('cake')!, optionId: 'cake-half' },
          { addOn: getAddOn('decor')! },
        ],
      }),
    );
    expect(result).toEqual({ total: 4000 + 12000 + 499, hasOnRequest: true });
  });
});

describe('buildEnquiryMessage', () => {
  it('includes the booking details a host needs to confirm', () => {
    const message = buildEnquiryMessage(
      enquiry('brimmies-party', {
        date: '2026-10-24',
        guests: 18,
        quantity: 3,
        name: 'Anu',
        addOns: [{ addOn: getAddOn('cake')!, optionId: 'cake-1kg' }],
      }),
    );
    expect(message).toContain('Brimmies All Day Cafe (Party Space)');
    expect(message).toContain('Name: Anu');
    expect(message).toContain('Date: Sat, 24 Oct 2026');
    expect(message).toContain('Guests: 18');
    expect(message).toContain('Booking: 3 hours @ ₹2,000 per hour');
    expect(message).toContain('- Celebration Cake (1 kg) (₹899)');
    expect(message).toContain('Estimated total: ₹6,899');
  });

  it('says the date is flexible when none is picked', () => {
    expect(buildEnquiryMessage(enquiry('seera-event'))).toContain('Date: flexible / to be decided');
  });
});

describe('whatsappLink', () => {
  it('URL-encodes the message', () => {
    expect(whatsappLink('919999999999', 'Hi & bye\nok')).toBe('https://wa.me/919999999999?text=Hi%20%26%20bye%0Aok');
  });
});
