import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { CategoryExtras } from '../components/category/Extras';
import { FilterBar } from '../components/category/FilterBar';
import { ServiceSwitcher } from '../components/category/ServiceSwitcher';
import { SpaceCard } from '../components/ui/cards';
import { IconBrandWhatsapp, IconSearch } from '../components/ui/icons';
import { SlidingNumber, TextEffect, easeOut, springSoft } from '../components/ui/motion';
import { Button, ServiceIcon } from '../components/ui/primitives';
import { DESKTOP_QUERY, useMediaQuery } from '../components/ui/Sheet';
import { site } from '../config/site';
import { getCategory } from '../data/categories';
import { getProperty, offersForCategory } from '../data/listings';
import type { CategorySlug } from '../data/types';
import { whatsappLink } from '../lib/enquiry';
import { emptyFilters, filtersToParams, hasActiveFilters, matchesFilters, type Filters } from '../lib/filters';
import { formatDate, formatINR } from '../lib/format';
import { useFilterParams, usePageMeta } from '../lib/hooks';
import './CategoryPage.css';

/** Each tile in the logo leans a little; the page icon leans the same way. */
const tilt: Record<CategorySlug, number> = {
  'night-stay': 5,
  'hourly-stay': 6,
  'party-space': -6,
  'event-space': 5,
};

function helpMessage(name: string, filters: Filters) {
  const parts = [`Hi ${site.name}! I'm looking for a ${name.toLowerCase()}`];
  if (filters.date) parts.push(` on ${formatDate(filters.date)}`);
  if (filters.guests) parts.push(` for ${filters.guests} people`);
  if (filters.budget !== undefined) parts.push(`, budget up to ${formatINR(filters.budget)}`);
  if (filters.maxKm) parts.push(`, within ${filters.maxKm} km of ${site.city}`);
  if (filters.pool) parts.push(', with a swimming pool');
  return `${parts.join('')}. Can you help?`;
}

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  const category = getCategory(slug)!;
  usePageMeta(category.name, category.blurb);
  const [filters, setFilters] = useFilterParams();
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const query = filtersToParams(filters).toString();
  const active = hasActiveFilters(filters);

  const results = useMemo(
    () =>
      offersForCategory(slug)
        .map((offer) => ({ offer, property: getProperty(offer.propertyId)! }))
        .filter(({ offer, property }) => property && matchesFilters(offer, property, filters)),
    [slug, filters],
  );

  const clear = useCallback(() => setFilters({ ...emptyFilters, date: filters.date }), [filters.date, setFilters]);

  // Cards stagger in on first paint only; later filter changes animate by layout.
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
  }, []);
  const first = !mounted.current;

  const hourly = slug === 'party-space' || slug === 'hourly-stay';

  return (
    <div className="cat" data-service={category.theme}>
      <ServiceSwitcher current={slug} query={query} />

      <header className="container cat-head">
        <div className="cat-head__row">
          <motion.span
            className="cat-head__icon"
            initial={{ scale: 0.6, rotate: 0, opacity: 0 }}
            animate={{ scale: 1, rotate: tilt[slug], opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18, delay: 0.05 }}
          >
            <ServiceIcon slug={slug} size={desktop ? 68 : 52} />
          </motion.span>
          <TextEffect as="h1" className="cat-head__title" delay={0.08}>
            {category.name}
          </TextEffect>
        </div>
        <motion.p
          className="t-lead cat-head__blurb"
          initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: easeOut, delay: 0.18 }}
        >
          {category.blurb}
        </motion.p>
        {category.image && (
          <motion.div
            className="cat-head__media"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: easeOut, delay: 0.22 }}
          >
            <img src={category.image.src} srcSet={category.image.srcSet} sizes="(min-width: 1200px) 1200px, 100vw" width={category.image.width} height={category.image.height} alt={category.image.alt} fetchPriority="high" decoding="async" />
          </motion.div>
        )}
      </header>

      <LayoutGroup id="cat-results">
        <div className="cat-browse">
          <FilterBar filters={filters} onChange={setFilters} count={results.length} service={category.theme} />

          <section className="container cat-results" aria-labelledby="cat-results-title">
            <div className="cat-results__bar">
              <h2 className="cat-results__count" id="cat-results-title" aria-live="polite" aria-atomic="true">
                <span className="cat-results__num">
                  <SlidingNumber value={results.length} prefix="" /> {results.length === 1 ? 'space' : 'spaces'}
                </span>{' '}
                <span className="cat-results__where">
                  {active ? (results.length === 1 ? 'matches your filters' : 'match your filters') : `around ${site.city}`}
                </span>
              </h2>
              <AnimatePresence initial={false}>
                {active && results.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button variant="ghost" size="sm" onClick={clear} className="cat-results__clear">
                      Clear filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ul role="list" className="cat-grid">
              <AnimatePresence mode="popLayout" initial>
                {results.map(({ offer, property }, i) => (
                  <motion.li
                    key={offer.id}
                    layout
                    className="cat-grid__item"
                    initial={{ opacity: 0, y: 18, scale: 0.98, filter: 'blur(8px)' }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      filter: 'blur(0px)',
                      transition: { duration: 0.5, ease: easeOut, delay: first ? 0.12 + i * 0.07 : 0.05 },
                    }}
                    exit={{ opacity: 0, scale: 0.94, filter: 'blur(6px)', transition: { duration: 0.2, ease: easeOut } }}
                    transition={springSoft}
                  >
                    <SpaceCard offer={offer} property={property} category={slug} query={query} priority={i < 2} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <AnimatePresence initial={false}>
              {results.length === 0 && (
                <motion.div
                  key="empty"
                  className="cat-empty"
                  initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: easeOut, delay: 0.1 } }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  <span className="cat-empty__icon" aria-hidden="true">
                    <IconSearch size={26} stroke={1.75} />
                  </span>
                  <h3 className="t-h3">No spaces match these filters</h3>
                  <p className="t-small cat-empty__text">
                    Try a bigger budget or fewer filters, or tell us what you need and we'll find a place for you.
                  </p>
                  <div className="cat-empty__actions">
                    <Button variant="secondary" onClick={clear}>
                      Clear filters
                    </Button>
                    <Button
                      variant="whatsapp"
                      href={whatsappLink(site.whatsapp, helpMessage(category.name, filters))}
                      external
                      icon={<IconBrandWhatsapp size={20} stroke={1.75} />}
                    >
                      Ask us on WhatsApp
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.p layout="position" className="t-caption cat-footnote">
              {hourly && (
                <>
                  * Hourly rate.
                  <br />
                </>
              )}
              Prices are indicative; your final quote is confirmed on WhatsApp.
            </motion.p>
          </section>
        </div>

        <motion.div layout="position" className="cat-after">
          <CategoryExtras slug={slug} />
        </motion.div>
      </LayoutGroup>
    </div>
  );
}
