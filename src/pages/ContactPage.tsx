import { Mail, MapPin, Phone } from 'lucide-react';
import { useId, useState } from 'react';
import { DateField, Stepper } from '../components/Controls';
import { InstagramIcon, WhatsAppIcon } from '../components/icons';
import { instagramHref, mailHref, site, telHref } from '../config/site';
import { categories } from '../data/categories';
import { whatsappLink } from '../lib/enquiry';
import { formatDate } from '../lib/format';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './InfoPages.css';

export function ContactPage() {
  usePageMeta('Contact us', `Call or WhatsApp ${site.name} to book a stay, party or event space around ${site.city}.`);
  usePageTheme('brand');
  const uid = useId();
  const [name, setName] = useState('');
  const [what, setWhat] = useState(categories[0].name);
  const [date, setDate] = useState<string>();
  const [guests, setGuests] = useState<number>();
  const [message, setMessage] = useState('');

  const text = [
    `Hi ${site.name}!${name.trim() ? ` This is ${name.trim()}.` : ''}`,
    `I'm looking for: ${what}`,
    `Date: ${date ? formatDate(date) : 'flexible'}`,
    guests ? `Guests: ${guests}` : '',
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const channels = [
    { icon: WhatsAppIcon, label: 'WhatsApp', value: 'Fastest reply', href: whatsappLink(site.whatsapp, `Hi ${site.name}!`), external: true },
    { icon: Phone, label: 'Call', value: site.phoneDisplay, href: telHref },
    { icon: Mail, label: 'Email', value: site.email, href: mailHref },
    ...(instagramHref ? [{ icon: InstagramIcon, label: 'Instagram', value: `@${site.instagram}`, href: instagramHref, external: true }] : []),
  ];

  return (
    <>
      <section className="container page-head">
        <h1 className="outline-title">Contact us</h1>
        <p className="lead">Tell us what you're planning and we'll find the right space and set up the extras.</p>
      </section>

      <section className="container section--tight contact">
        <ul role="list" className="channels">
          {channels.map((c) => (
            <li key={c.label}>
              <a className="channel" href={c.href} {...(c.external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                <c.icon aria-hidden="true" className="channel__icon" />
                <span>
                  <strong>{c.label}</strong>
                  <span>{c.value}</span>
                </span>
              </a>
            </li>
          ))}
          <li>
            <div className="channel">
              <MapPin aria-hidden="true" className="channel__icon" />
              <span>
                <strong>Where</strong>
                <span>{site.serviceArea}</span>
              </span>
            </div>
          </li>
        </ul>

        <form
          className="contact-form"
          aria-labelledby={`${uid}-title`}
          onSubmit={(e) => {
            e.preventDefault();
            window.open(whatsappLink(site.whatsapp, text), '_blank', 'noopener');
          }}
        >
          <h2 className="enquiry__title" id={`${uid}-title`}>
            Quick enquiry
          </h2>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-name`}>
              Your name
            </label>
            <input id={`${uid}-name`} className="input" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-what`}>
              Looking for
            </label>
            <select id={`${uid}-what`} className="input" value={what} onChange={(e) => setWhat(e.target.value)}>
              {categories.map((c) => (
                <option key={c.slug}>{c.name}</option>
              ))}
              <option>Rental Car</option>
              <option>Cake, Decor or Photography</option>
            </select>
          </div>
          <div className="enquiry__row">
            <DateField value={date} onChange={setDate} />
            <Stepper label="No of People" placeholder="Guests" value={guests} onChange={setGuests} icon={false} />
          </div>
          <div className="field">
            <label className="field__label" htmlFor={`${uid}-msg`}>
              Message <span className="optional">(optional)</span>
            </label>
            <textarea
              id={`${uid}-msg`}
              className="input"
              placeholder="Occasion, budget, timings…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn--whatsapp btn--block">
            <WhatsAppIcon /> Send on WhatsApp
          </button>
        </form>
      </section>
    </>
  );
}
