import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { instagramHref, mailHref, site, telHref } from '../config/site';
import { categories } from '../data/categories';
import { whatsappLink } from '../lib/enquiry';
import { InstagramIcon, WhatsAppIcon } from './icons';
import './Footer.css';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <img src="/images/logo-dark.png" alt={`${site.name} — ${site.tagline}`} width="160" height="187" loading="lazy" />
          <p className="muted">
            Farm houses, villas, party and event spaces in and around {site.city}, with cakes, decor and photography
            arranged for you.
          </p>
        </div>

        <nav aria-label="Spaces">
          <h2 className="site-footer__title">Spaces</h2>
          <ul role="list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="More">
          <h2 className="site-footer__title">More</h2>
          <ul role="list">
            <li>
              <Link to="/add-ons">Cake, Decor &amp; Photos</Link>
            </li>
            <li>
              <Link to="/rental-cars">Rental Cars</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/contact">Contact us</Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="site-footer__title">Get in touch</h2>
          <ul role="list" className="site-footer__contact">
            <li>
              <a href={whatsappLink(site.whatsapp, `Hi ${site.name}!`)} target="_blank" rel="noreferrer">
                <WhatsAppIcon /> WhatsApp
              </a>
            </li>
            <li>
              <a href={telHref}>
                <Phone /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={mailHref}>
                <Mail /> {site.email}
              </a>
            </li>
            {instagramHref && (
              <li>
                <a href={instagramHref} target="_blank" rel="noreferrer">
                  <InstagramIcon /> @{site.instagram}
                </a>
              </li>
            )}
            <li>
              <span>
                <MapPin /> {site.serviceArea}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {year} {site.name}. {site.tagline}
        </p>
        <p>
          Powered by: <strong>{site.poweredBy}</strong>
        </p>
      </div>
    </footer>
  );
}
