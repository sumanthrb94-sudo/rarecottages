import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { site } from '../config/site';
import { whatsappLink } from '../lib/enquiry';
import { Footer } from './Footer';
import { Header } from './Header';
import { WhatsAppIcon } from './icons';
import './Layout.css';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const { pathname } = useLocation();
  // Space pages have their own sticky enquiry bar on mobile.
  const showFab = !pathname.startsWith('/spaces/');
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {showFab && (
        <a
          className="wa-fab"
          href={whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to make a booking.`)}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with us on WhatsApp"
        >
          <WhatsAppIcon />
        </a>
      )}
    </>
  );
}
