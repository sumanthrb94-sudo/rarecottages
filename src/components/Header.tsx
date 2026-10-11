import { Menu, Phone, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site, telHref } from '../config/site';
import { categories } from '../data/categories';
import { whatsappLink } from '../lib/enquiry';
import { CategoryIcon, WhatsAppIcon } from './icons';
import './Header.css';

const generalWa = whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to know more about your spaces.`);

const shortNames: Record<string, string> = {
  'night-stay': 'Night Stay',
  'hourly-stay': 'Hourly',
  'party-space': 'Party',
  'event-space': 'Events',
};

export function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link to="/" className="brand" aria-label={`${site.name} home`}>
          <img src="/images/logo-mark.png" alt="" width="44" height="44" className="brand__mark" />
          <span className="brand__name">
            Rare <span>Cottages</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Main">
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/${c.slug}`} className="site-nav__link" data-theme={c.theme}>
              {shortNames[c.slug]}
            </NavLink>
          ))}
          <NavLink to="/add-ons" className="site-nav__link">
            Add-ons
          </NavLink>
          <NavLink to="/rental-cars" className="site-nav__link">
            Cars
          </NavLink>
        </nav>

        <a className="btn btn--whatsapp btn--sm header-cta" href={generalWa} target="_blank" rel="noreferrer">
          <WhatsAppIcon />
          <span>WhatsApp us</span>
        </a>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" data-open={open} hidden={!open}>
        <nav className="container mobile-menu__inner" aria-label="Mobile">
          <p className="eyebrow">Book a space</p>
          <ul role="list" className="mobile-menu__cats">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className="mobile-menu__cat" data-theme={c.theme}>
                  <CategoryIcon slug={c.slug} size={26} strokeWidth={1.6} />
                  <span>
                    <strong>{c.name}</strong>
                    <small>{c.hint}</small>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <ul role="list" className="mobile-menu__links">
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
          <div className="mobile-menu__actions">
            <a className="btn btn--whatsapp" href={generalWa} target="_blank" rel="noreferrer">
              <WhatsAppIcon /> WhatsApp
            </a>
            <a className="btn btn--ghost" href={telHref}>
              <Phone /> Call
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
