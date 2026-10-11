/** Business details shown across the site and used to build WhatsApp / call links. */
export const site = {
  name: 'Rare Cottages',
  tagline: 'Stay . Relax . Celebrate',
  city: 'Rajahmundry',
  serviceArea: 'Rajahmundry & 30kms',
  serviceRadiusKm: 30,
  /** Where the business is based (the footer line); the spaces themselves are around `city`. */
  hq: 'Hyderabad',
  /** Shown on the site, any format. */
  phoneDisplay: '+91 90329 90099',
  /** Used for tel: links. */
  phoneE164: '+919032990099',
  /** Digits only, with country code and no "+", as wa.me expects. */
  whatsapp: '919032990099',
  email: 'info@rarecottages.in',
  /** Instagram handle without "@". Leave empty to hide the link. */
  instagram: '',
  /** Website credit in the footer. */
  builtBy: { name: 'Brand Mint', url: 'https://brandmintstudios.in' },
} as const;

export const telHref = `tel:${site.phoneE164}`;
export const mailHref = `mailto:${site.email}`;
export const instagramHref = site.instagram ? `https://instagram.com/${site.instagram}` : '';
