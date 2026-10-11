import { useId, useState, type CSSProperties } from 'react';
import { PillImage } from '../components/Cards';
import { DateField } from '../components/Controls';
import { WhatsAppIcon } from '../components/icons';
import { site } from '../config/site';
import { cars } from '../data/cars';
import { photos } from '../data/photos';
import { whatsappLink } from '../lib/enquiry';
import { formatDate } from '../lib/format';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './InfoPages.css';

function CarEnquiry({ carName }: { carName: string }) {
  const uid = useId();
  const [date, setDate] = useState<string>();
  const [pickup, setPickup] = useState('');
  const [notes, setNotes] = useState('');
  const message = [
    `Hi ${site.name}! I'd like to rent the ${carName}.`,
    `Date: ${date ? formatDate(date) : 'to be decided'}`,
    pickup.trim() && `Pick-up: ${pickup.trim()}`,
    notes.trim() && `Notes: ${notes.trim()}`,
    'Please share availability and rates.',
  ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="car-enquiry">
      <DateField value={date} onChange={setDate} />
      <div className="field">
        <label className="field__label" htmlFor={`${uid}-pickup`}>
          Pick-up location
        </label>
        <input
          id={`${uid}-pickup`}
          className="input"
          placeholder="Home, hotel or venue"
          value={pickup}
          onChange={(e) => setPickup(e.target.value)}
        />
      </div>
      <div className="field car-enquiry__notes">
        <label className="field__label" htmlFor={`${uid}-notes`}>
          Trip details <span className="optional">(optional)</span>
        </label>
        <input
          id={`${uid}-notes`}
          className="input"
          placeholder="Occasion, hours, with driver…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <a className="btn btn--whatsapp car-enquiry__cta" href={whatsappLink(site.whatsapp, message)} target="_blank" rel="noreferrer">
        <WhatsAppIcon /> Check availability
      </a>
    </div>
  );
}

export function CarsPage() {
  usePageMeta('Rental Cars', 'Rent a premium car for weddings, receptions and special occasions in Rajahmundry.');
  usePageTheme('brand');
  return (
    <>
      <section className="container page-head">
        <h1 className="visually-hidden">Rental Cars</h1>
        <div className="pill-ring">
          <PillImage photo={photos.carsBanner} priority />
        </div>
        <p className="lead">Arrive in style. Book a car for the wedding, the reception or any special day.</p>
      </section>

      <section className="container section--tight stack" style={{ '--stack': '48px' } as CSSProperties}>
        {cars.map((car) => (
          <article key={car.id} className="car">
            <div className="car__body">
              <div className="stack">
                <h2 className="car__name">{car.name}</h2>
                <p className="lead">{car.description}</p>
                <ul role="list" className="tags">
                  {car.goodFor.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <p className="muted">Rates depend on the date, hours and distance. Ask us for a quote.</p>
              </div>
              <CarEnquiry carName={car.name} />
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
