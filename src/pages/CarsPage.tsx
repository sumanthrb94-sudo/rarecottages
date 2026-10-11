import { useState } from 'react';
import { IconTile, ListRow } from '../components/info/InfoParts';
import { TextField, DateField, SelectField } from '../components/ui/forms';
import { IconBrandWhatsapp, IconGift, IconInfoCircle } from '../components/ui/icons';
import { FadeIn } from '../components/ui/motion';
import { Button, ServiceIcon } from '../components/ui/primitives';
import { site } from '../config/site';
import { cars } from '../data/cars';
import { getCategory } from '../data/categories';
import { photos } from '../data/photos';
import { whatsappLink } from '../lib/enquiry';
import { formatDate } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import './InfoPages.css';

function carMessage({
  carName,
  date,
  pickup,
  trip,
}: {
  carName: string;
  date?: string;
  pickup: string;
  trip: string;
}) {
  const lines = [`Hi ${site.name}! I'd like to rent the ${carName}.`, ''];
  lines.push(`Date: ${date ? formatDate(date) : 'to be decided'}`);
  if (pickup.trim()) lines.push(`Pick-up: ${pickup.trim()}`);
  if (trip.trim()) lines.push(`Trip: ${trip.trim()}`);
  lines.push('', 'Please share availability and the rate. Thank you!');
  return lines.join('\n');
}

export function CarsPage() {
  usePageMeta(
    'Rental Cars',
    `Rent a premium car for weddings, receptions and special occasions in and around ${site.city}. Rates on request.`,
  );
  const [carId, setCarId] = useState(cars[0]?.id ?? '');
  const [date, setDate] = useState<string>();
  const [pickup, setPickup] = useState('');
  const [trip, setTrip] = useState('');
  const car = cars.find((c) => c.id === carId) ?? cars[0];
  const eventSpace = getCategory('event-space');

  return (
    <>
      <section className="container info-cars-hero" aria-labelledby="cars-title">
        <h1 className="visually-hidden" id="cars-title">
          Rental Cars
        </h1>
        <FadeIn inView={false} className="info-banner">
          <img
            src={photos.carsBanner.src}
            srcSet={photos.carsBanner.srcSet}
            sizes="(min-width: 1240px) 1200px, 100vw"
            width={photos.carsBanner.width}
            height={photos.carsBanner.height}
            alt={photos.carsBanner.alt}
            fetchPriority="high"
          />
        </FadeIn>
        <FadeIn inView={false} delay={0.1}>
          <p className="t-lead info-cars-hero__lead">
            Book a car for the wedding, the reception or any special day in and around {site.city}.
          </p>
        </FadeIn>
      </section>

      <div className="container info-section-sm info-cars">
        <div className="info-cars__details">
          {cars.map((c) => (
            <FadeIn key={c.id}>
              <article className="info-car" aria-labelledby={`car-${c.id}`}>
                <h2 className="t-h2" id={`car-${c.id}`}>
                  {c.name}
                </h2>
                <p className="t-body">{c.description}</p>
                <div className="info-car__good">
                  <h3 className="info-label">Good for</h3>
                  <ul role="list" className="info-tags">
                    {c.goodFor.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
                <p className="info-note">
                  <IconInfoCircle size={20} stroke={1.75} aria-hidden="true" />
                  <span>
                    <strong>Rates on request.</strong> Send us the date, pick-up point and trip and we'll quote.
                  </span>
                </p>
              </article>
            </FadeIn>
          ))}
        </div>

        {car && (
          <FadeIn delay={0.08} className="info-cars__form">
            <section className="info-form" aria-labelledby="car-enquiry-title">
              <div className="info-form__head">
                <h2 className="t-h3" id="car-enquiry-title">
                  Check availability
                </h2>
                <p className="t-small">Send it on WhatsApp and we'll confirm availability and the rate.</p>
              </div>
              {cars.length > 1 && (
                <SelectField label="Car" value={carId} onChange={(e) => setCarId(e.target.value)}>
                  {cars.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </SelectField>
              )}
              <DateField label="Date" value={date} onChange={setDate} />
              <TextField
                label="Pick-up location"
                placeholder="Home, hotel or venue"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
              <TextField
                label="Trip details"
                optional
                placeholder="Occasion, hours, drop-off…"
                value={trip}
                onChange={(e) => setTrip(e.target.value)}
              />
              <Button
                size="lg"
                block
                href={whatsappLink(site.whatsapp, carMessage({ carName: car.name, date, pickup, trip }))}
                external
                icon={<IconBrandWhatsapp size={20} stroke={1.75} />}
              >
                Check availability
              </Button>
              <p className="t-caption info-form__foot">Opens WhatsApp with your request ready to send.</p>
            </section>
          </FadeIn>
        )}

        <section className="info-cars__more" aria-labelledby="cars-more-title">
          <h2 className="info-group-title" id="cars-more-title">
            Planning the day
          </h2>
          <ul role="list" className="info-list">
            {eventSpace && (
              <li>
                <ListRow
                  media={<ServiceIcon slug="event-space" size={40} tilt={4} />}
                  label={eventSpace.name}
                  value={eventSpace.hint}
                  to={`/${eventSpace.slug}`}
                />
              </li>
            )}
            <li>
              <ListRow
                media={
                  <IconTile>
                    <IconGift size={22} stroke={1.75} />
                  </IconTile>
                }
                label="Add-ons"
                value="Cake, decor, photography and more"
                to="/add-ons"
              />
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
