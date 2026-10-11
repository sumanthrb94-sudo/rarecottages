export type CategorySlug = 'night-stay' | 'hourly-stay' | 'party-space' | 'event-space';

/** Each service owns one colour of the logo: night = green, hourly = yellow, party = blue, event = red. */
export type Theme = 'night' | 'hourly' | 'party' | 'event';

/** How an offer is charged: per night, per hour, or a flat price for the event. */
export type PriceUnit = 'night' | 'hour' | 'event';

export interface Photo {
  src: string;
  srcSet?: string;
  /** Intrinsic width / height, used to reserve space and avoid layout shift. */
  width: number;
  height: number;
  alt: string;
}

export interface Property {
  id: string;
  name: string;
  /** One-line pitch shown on cards. */
  tagline: string;
  description: string;
  area: string;
  hasPool: boolean;
  highlights: string[];
  /** 4:3 photo for cards. */
  card: Photo;
  /** Wide (about 2:1) photo for the space page hero, when we have one. */
  wide?: Photo;
}

export interface Offer {
  id: string;
  propertyId: string;
  category: CategorySlug;
  /** Price in rupees per `unit`. */
  price: number;
  unit: PriceUnit;
  /** How long a flat-priced booking runs, e.g. 15 hours for an event. */
  durationHours?: number;
  capacity?: { min?: number; max: number };
}

export interface AddOnOption {
  id: string;
  label: string;
  price: number;
}

export interface AddOn {
  id: string;
  name: string;
  /** Short label used on chips, e.g. "Decors". */
  short: string;
  description: string;
  /** Fixed price in rupees. Omit when the price is quoted on request. */
  price?: number;
  /** Mutually exclusive size / tier choices, e.g. cake weights. */
  options?: AddOnOption[];
  includes?: string[];
  partner?: { name: string; logo: Photo };
  appliesTo: CategorySlug[];
}

export interface Package {
  id: string;
  /** First line is rendered in the script face, second in the accent colour. */
  title: [string, string];
  price: number;
  includes: string[];
  appliesTo: CategorySlug[];
}

export interface Car {
  id: string;
  name: string;
  description: string;
  goodFor: string[];
}
