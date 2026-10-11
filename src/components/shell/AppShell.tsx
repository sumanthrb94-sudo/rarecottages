import { LayoutGroup, motion } from 'motion/react';
import { Suspense, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { mailHref, site, telHref } from '../../config/site';
import { categories } from '../../data/categories';
import type { CategorySlug } from '../../data/types';
import { whatsappLink } from '../../lib/enquiry';
import { filtersToParams, parseFilters } from '../../lib/filters';
import {
  IconArrowLeft,
  IconBrandWhatsapp,
  IconCar,
  IconCarFilled,
  IconGift,
  IconGiftFilled,
  IconHome,
  IconHomeFilled,
  IconLayoutGrid,
  IconLayoutGridFilled,
  IconMapPin,
  IconMessageCircle,
  IconMessageCircleFilled,
  type Icon,
} from '../ui/icons';
import { PageTransition, spring } from '../ui/motion';
import { Button, IconButton, Logo, ServiceIcon, ThemeToggle, serviceTheme } from '../ui/primitives';
import './shell.css';

const SPACE_ROUTES = categories.map((c) => `/${c.slug}`);
const LAST_CATEGORY_KEY = 'rc-last-category';
const generalWa = whatsappLink(site.whatsapp, `Hi ${site.name}! I'd like to plan a booking in ${site.city}.`);

function isSpacesPath(pathname: string) {
  return SPACE_ROUTES.includes(pathname) || pathname.startsWith('/spaces/');
}

/** Remembers the last service the visitor browsed, for the Spaces tab. */
function lastCategory(): CategorySlug {
  try {
    const v = sessionStorage.getItem(LAST_CATEGORY_KEY);
    if (v && categories.some((c) => c.slug === v)) return v as CategorySlug;
  } catch {
    /* ignore */
  }
  return 'night-stay';
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0 });
      return;
    }
    // Wait for the page transition (which shifts content by a few px) to settle first.
    const t = window.setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 420);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);
  useEffect(() => {
    const slug = pathname.slice(1);
    if (categories.some((c) => c.slug === slug)) {
      try {
        sessionStorage.setItem(LAST_CATEGORY_KEY, slug);
      } catch {
        /* ignore */
      }
    }
  }, [pathname]);
  return null;
}

function TopBar() {
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const nested = pathname.startsWith('/spaces/');
  // Carry the visitor's filters across services, like the mobile switcher does.
  const query = SPACE_ROUTES.includes(pathname) ? filtersToParams(parseFilters(params)).toString() : '';
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        {nested ? (
          <IconButton
            label="Back"
            className="topbar__back"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))}
          >
            <IconArrowLeft size={22} stroke={1.75} />
          </IconButton>
        ) : null}
        <Link to="/" className={`topbar__brand${nested ? ' topbar__brand--nested' : ''}`} aria-label={`${site.name} home`}>
          <Logo variant="lockup" />
        </Link>

        <nav className="topbar__nav" aria-label="Services">
          <LayoutGroup id="topnav">
            {categories.map((c) => (
              <NavLink key={c.slug} to={{ pathname: `/${c.slug}`, search: query }} className="topnav__link" data-service={c.theme}>
                {({ isActive }) => (
                  <>
                    <span className="topnav__dot" aria-hidden="true" />
                    {c.name}
                    {isActive && <motion.span layoutId="topnav-active" className="topnav__active" transition={spring} />}
                  </>
                )}
              </NavLink>
            ))}
          </LayoutGroup>
        </nav>

        <div className="topbar__actions">
          <NavLink to="/add-ons" className="topnav__plain">
            Add-ons
          </NavLink>
          <NavLink to="/rental-cars" className="topnav__plain">
            Cars
          </NavLink>
          <span className="topbar__location" title={`We serve ${site.serviceArea}`}>
            <IconMapPin size={16} stroke={1.75} aria-hidden="true" />
            {site.city}
          </span>
          <ThemeToggle />
          <Button
            href={generalWa}
            external
            size="sm"
            className="topbar__cta"
            icon={<IconBrandWhatsapp size={18} stroke={1.75} />}
          >
            Enquire
          </Button>
        </div>
      </div>
    </header>
  );
}

interface Tab {
  label: string;
  to: string;
  icon: Icon;
  activeIcon: Icon;
  match: (path: string) => boolean;
}

function TabBar() {
  const { pathname } = useLocation();
  const tabs: Tab[] = [
    { label: 'Home', to: '/', icon: IconHome, activeIcon: IconHomeFilled, match: (p) => p === '/' },
    {
      label: 'Spaces',
      to: `/${lastCategory()}`,
      icon: IconLayoutGrid,
      activeIcon: IconLayoutGridFilled,
      match: isSpacesPath,
    },
    { label: 'Add-ons', to: '/add-ons', icon: IconGift, activeIcon: IconGiftFilled, match: (p) => p === '/add-ons' },
    { label: 'Cars', to: '/rental-cars', icon: IconCar, activeIcon: IconCarFilled, match: (p) => p === '/rental-cars' },
    {
      label: 'Contact',
      to: '/contact',
      icon: IconMessageCircle,
      activeIcon: IconMessageCircleFilled,
      match: (p) => p === '/contact' || p === '/about',
    },
  ];
  return (
    <nav className="tabbar" aria-label="App">
      <LayoutGroup id="tabbar">
        {tabs.map((t) => {
          const active = t.match(pathname);
          const I = active ? t.activeIcon : t.icon;
          return (
            <Link key={t.label} to={t.to} className="tabbar__tab" aria-current={active ? 'page' : undefined}>
              <span className="tabbar__icon">
                {active && <motion.span layoutId="tab-active" className="tabbar__pill" transition={spring} />}
                <motion.span
                  key={String(active)}
                  initial={active ? { scale: 0.7, y: 2 } : false}
                  animate={{ scale: 1, y: 0 }}
                  transition={spring}
                  style={{ display: 'grid', position: 'relative' }}
                >
                  <I size={24} stroke={1.6} />
                </motion.span>
              </span>
              <span className="tabbar__label">{t.label}</span>
            </Link>
          );
        })}
      </LayoutGroup>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo variant="lockup" />
          <p className="t-small">
            Farm houses, villas, party and event spaces in {site.city}, with cakes, decor and photography arranged for
            you.
          </p>
          <p className="t-eyebrow">{site.tagline}</p>
        </div>
        <nav aria-label="Spaces" className="footer__col">
          <h2 className="t-eyebrow">Spaces</h2>
          <ul role="list">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/${c.slug}`} className="footer__svc">
                  <ServiceIcon slug={c.slug} size={22} />
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="More" className="footer__col">
          <h2 className="t-eyebrow">More</h2>
          <ul role="list">
            <li>
              <Link to="/add-ons">Cake, decor &amp; photos</Link>
            </li>
            <li>
              <Link to="/rental-cars">Rental cars</Link>
            </li>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
        <div className="footer__col footer__col--contact">
          <h2 className="t-eyebrow">Get in touch</h2>
          <ul role="list">
            <li>
              <a href={generalWa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={telHref}>{site.phoneDisplay}</a>
            </li>
            <li>
              <a href={mailHref}>{site.email}</a>
            </li>
            <li className="t-small">{site.serviceArea}</li>
          </ul>
        </div>
      </div>
      <div className="container footer__bottom t-caption">
        <span>
          © {new Date().getFullYear()} {site.name}, {site.city}
        </span>
        <span>
          Powered by: <strong>{site.poweredBy}</strong>
        </span>
      </div>
    </footer>
  );
}

export function AppShell() {
  const location = useLocation();
  const nested = location.pathname.startsWith('/spaces/');
  const slug = location.pathname.slice(1);
  const service = categories.find((c) => c.slug === slug);
  return (
    <div className={`app${nested ? ' app--nested' : ''}`} data-service={service ? serviceTheme(service.slug) : undefined}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <ScrollToTop />
      <TopBar />
      <main id="main" tabIndex={-1} className="app__main">
        <Suspense fallback={<div className="app__loading" aria-hidden="true" />}>
          <PageTransition key={location.pathname}>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>
      <Footer />
      {!nested && <TabBar />}
    </div>
  );
}
