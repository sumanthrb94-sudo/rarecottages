import { Sparkles } from 'lucide-react';
import { CakeStrip, PackageCard, ServiceCard, addOnIcons } from '../components/Extras';
import { WhatsAppIcon } from '../components/icons';
import { site } from '../config/site';
import { addOns, packages } from '../data/addons';
import { whatsappLink } from '../lib/enquiry';
import { formatINR } from '../lib/format';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './InfoPages.css';

export function AddOnsPage() {
  usePageMeta('Cake, Decor & Photos', 'Cakes, decor, photographers, reels, make-up and catering for your booking.');
  usePageTheme('brand');
  const simple = addOns.filter((a) => !a.partner);
  const partners = addOns.filter((a) => a.partner);

  return (
    <>
      <section className="container page-head">
        <h1 className="outline-title">Add-ons</h1>
        <p className="lead">
          Cakes, decor, photographers and more, arranged with your booking. Add them while you enquire about a space,
          or ask us for them on their own.
        </p>
      </section>

      <section className="container section--tight">
        <ul role="list" className="addon-grid">
          {simple.map((a) => {
            const Icon = addOnIcons[a.id] ?? Sparkles;
            return (
              <li key={a.id} id={a.id} className="addon">
                <Icon className="addon__icon" aria-hidden="true" strokeWidth={1.5} />
                <h2 className="addon__name">{a.name}</h2>
                <p className="addon__desc">{a.description}</p>
                {a.options ? (
                  <ul role="list" className="addon__options">
                    {a.options.map((o) => (
                      <li key={o.id}>
                        <span>{o.label}</span>
                        <strong>{formatINR(o.price)}</strong>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="addon__price">{a.price ? formatINR(a.price) : 'Price on request'}</p>
                )}
                <a
                  className="btn btn--sm addon__cta"
                  href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to add ${a.name} to my booking.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon /> Ask on WhatsApp
                </a>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="band" data-theme="party" aria-labelledby="packages-title">
        <div className="container section grid-2 band__inner">
          <div className="stack">
            <p className="eyebrow">Party packages</p>
            <h2 className="h2" id="packages-title">
              Birthdays, sorted
            </h2>
            <p className="lead">
              One price for the cake, welcome drinks, snacks, decor, a reel and edited photos. Pair it with a party
              space and just turn up.
            </p>
            <CakeStrip />
          </div>
          <div>
            {packages.map((p) => (
              <PackageCard key={p.id} pkg={p} />
            ))}
          </div>
        </div>
      </section>

      {partners.length > 0 && (
        <section className="band" data-theme="event" aria-labelledby="partners-title">
          <div className="container section stack">
            <p className="eyebrow">Our partners</p>
            <h2 className="h2" id="partners-title">
              Wedding photography
            </h2>
            {partners.map((a) => (
              <ServiceCard key={a.id} addOn={a} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
