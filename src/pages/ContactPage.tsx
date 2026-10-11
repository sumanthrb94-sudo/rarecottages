import { useState, type FormEvent, type ReactNode } from 'react';
import { IconTile, InfoHead, ListRow, RevealList } from '../components/info/InfoParts';
import { DateField, SelectField, Stepper, TextArea, TextField } from '../components/ui/forms';
import {
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconMail,
  IconMapPin,
  IconPhone,
} from '../components/ui/icons';
import { FadeIn, StaggerItem } from '../components/ui/motion';
import { Button, Logo } from '../components/ui/primitives';
import { instagramHref, mailHref, site, telHref } from '../config/site';
import { categories } from '../data/categories';
import { whatsappLink } from '../lib/enquiry';
import { formatDate } from '../lib/format';
import { usePageMeta } from '../lib/hooks';
import './InfoPages.css';

const lookingFor = [...categories.map((c) => c.name), 'Rental car', 'Cake, decor or photography'];

interface Channel {
  key: string;
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function buildMessage({
  name,
  what,
  date,
  guests,
  message,
}: {
  name: string;
  what: string;
  date?: string;
  guests?: number;
  message: string;
}) {
  const lines = [`Hi ${site.name}!${name.trim() ? ` This is ${name.trim()}.` : ''}`, ''];
  lines.push(`Looking for: ${what || 'not sure yet'}`);
  lines.push(`Date: ${date ? formatDate(date) : 'flexible / to be decided'}`);
  if (guests) lines.push(`Guests: ${guests}`);
  if (message.trim()) lines.push('', message.trim());
  lines.push('', 'Please let me know what is available. Thank you!');
  return lines.join('\n');
}

export function ContactPage() {
  usePageMeta(
    'Contact',
    `WhatsApp, call or email ${site.name} to book a stay, party or event space in and around ${site.city}.`,
  );
  const [name, setName] = useState('');
  const [what, setWhat] = useState('');
  const [date, setDate] = useState<string>();
  const [guests, setGuests] = useState<number>();
  const [message, setMessage] = useState('');

  const iconProps = { size: 22, stroke: 1.75 } as const;
  const channels: Channel[] = [
    {
      key: 'whatsapp',
      icon: <IconBrandWhatsapp {...iconProps} />,
      label: 'WhatsApp',
      value: 'Send us a message',
      href: whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to plan a booking in ${site.city}.`),
      external: true,
    },
    { key: 'call', icon: <IconPhone {...iconProps} />, label: 'Call', value: site.phoneDisplay, href: telHref },
    { key: 'email', icon: <IconMail {...iconProps} />, label: 'Email', value: site.email, href: mailHref },
    ...(instagramHref
      ? [
          {
            key: 'instagram',
            icon: <IconBrandInstagram {...iconProps} />,
            label: 'Instagram',
            value: `@${site.instagram}`,
            href: instagramHref,
            external: true,
          },
        ]
      : []),
    { key: 'area', icon: <IconMapPin {...iconProps} />, label: 'Service area', value: site.serviceArea },
  ];

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.open(whatsappLink(site.whatsapp, buildMessage({ name, what, date, guests, message })), '_blank', 'noopener');
  }

  return (
    <>
      <InfoHead
        title="Contact"
        lead="Tell us what you're planning. We'll help you pick the right space and set up the extras."
      />

      <div className="container info-section-sm info-contact">
        <div className="info-contact__channels">
          <section aria-labelledby="channels-title">
            <h2 className="info-group-title" id="channels-title">
              Reach us
            </h2>
            <RevealList className="info-list" inView={false}>
              {channels.map((c) => (
                <StaggerItem as="li" key={c.key}>
                  <ListRow
                    media={<IconTile>{c.icon}</IconTile>}
                    label={c.label}
                    value={c.value}
                    href={c.href}
                    external={c.external}
                  />
                </StaggerItem>
              ))}
            </RevealList>
          </section>

          <section aria-labelledby="more-title">
            <h2 className="info-group-title" id="more-title">
              More
            </h2>
            <ul role="list" className="info-list">
              <li>
                <ListRow
                  media={
                    <IconTile className="info-tile--logo">
                      <Logo />
                    </IconTile>
                  }
                  label={`About ${site.name}`}
                  value="Our story and the four ways to book"
                  to="/about"
                />
              </li>
            </ul>
          </section>
        </div>

        <FadeIn inView={false} delay={0.1}>
          <form className="info-form" aria-labelledby="enquiry-title" onSubmit={onSubmit}>
            <div className="info-form__head">
              <h2 className="t-h3" id="enquiry-title">
                Quick enquiry
              </h2>
              <p className="t-small">A few details and we'll take it from there on WhatsApp.</p>
            </div>
            <TextField
              label="Your name"
              optional
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <SelectField label="Looking for" required value={what} onChange={(e) => setWhat(e.target.value)}>
              <option value="" disabled>
                Choose one
              </option>
              {lookingFor.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SelectField>
            <div className="info-form__pair">
              <DateField label="Date" value={date} onChange={setDate} />
              <Stepper label="Guests" value={guests} onChange={setGuests} />
            </div>
            <TextArea
              label="Message"
              optional
              rows={4}
              placeholder="Occasion, timings, anything else…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit" size="lg" block icon={<IconBrandWhatsapp size={20} stroke={1.75} />}>
              Send on WhatsApp
            </Button>
            <p className="t-caption info-form__foot">Opens WhatsApp with your message ready to send.</p>
          </form>
        </FadeIn>
      </div>
    </>
  );
}
