/**
 * Business details shown across the site and used to build WhatsApp / call links.
 *
 * TODO(client): the phone, WhatsApp and email values below are placeholders.
 * Replace them with the real booking contacts before going live.
 */
export const site = {
  name: 'Rare Cottages',
  tagline: 'Stay . Relax . Celebrate',
  city: 'Rajahmundry',
  serviceArea: 'Rajahmundry & 30kms',
  serviceRadiusKm: 30,
  /** Shown on the site, any format. */
  phoneDisplay: '+91 00000 00000',
  /** Used for tel: links. */
  phoneE164: '+910000000000',
  /** Digits only, with country code and no "+", as wa.me expects. */
  whatsapp: '910000000000',
  email: 'bookings@example.com',
  /** Instagram handle without "@". Leave empty to hide the link. */
  instagram: '',
  poweredBy: 'Sumanth',
} as const;

export const telHref = `tel:${site.phoneE164}`;
export const mailHref = `mailto:${site.email}`;
export const instagramHref = site.instagram ? `https://instagram.com/${site.instagram}` : '';
