import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import { useCallback, useId, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { site } from '../../config/site';
import { categories, getCategory, unitLabel } from '../../data/categories';
import { offersForCategory, startingPrice } from '../../data/listings';
import type { CategorySlug } from '../../data/types';
import { emptyFilters, filtersToParams, type Filters } from '../../lib/filters';
import { formatINR } from '../../lib/format';
import { BudgetSlider, DateField, DistanceField, Stepper, Switch } from '../ui/forms';
import { IconAdjustmentsHorizontal, IconPool, IconSearch } from '../ui/icons';
import { spring } from '../ui/motion';
import { Button, Chip, ServiceIcon } from '../ui/primitives';
import { Sheet } from '../ui/Sheet';

/** Short, human summary of the filters kept in the sheet, e.g. "Pool · Up to ₹20,000 · Within 10 km". */
function extrasSummary(filters: Filters): string[] {
  const parts: string[] = [];
  if (filters.pool) parts.push('Pool');
  if (filters.budget !== undefined) parts.push(`Up to ${formatINR(filters.budget)}`);
  if (filters.maxKm) parts.push(`Within ${filters.maxKm} km`);
  return parts;
}

/**
 * The home search: pick a service (each tile shows its starting price), a date and a guest count, with pool, budget
 * and distance tucked into a "More filters" sheet. Submitting opens the service page
 * with the filters in the URL.
 */
export function HomeSearch() {
  const navigate = useNavigate();
  const groupName = useId();
  const [slug, setSlug] = useState<CategorySlug>('night-stay');
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const selected = getCategory(slug)!;
  const extras = extrasSummary(filters);
  const units = [...new Set(offersForCategory(slug).map((o) => o.unit))];
  const budgetUnit = units.length === 1 ? unitLabel[units[0]].per : undefined;

  // Stable, so the sheet does not re-run its focus handling on every change.
  const closeSheet = useCallback(() => setSheetOpen(false), []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const query = filtersToParams(filters).toString();
    navigate(`/${slug}${query ? `?${query}` : ''}`);
  };

  return (
    <form className="home-search" role="search" aria-label="Find a space" onSubmit={onSubmit}>
      <fieldset className="home-picker">
        {/* The page heading above asks the question; the legend names the group for screen readers. */}
        <legend className="visually-hidden">Choose a service</legend>
        <LayoutGroup id="home-picker">
          <div className="home-picker__grid">
            {categories.map((c) => {
              const on = c.slug === slug;
              const from = startingPrice(c.slug);
              return (
                <label key={c.slug} className={`home-picker__opt${on ? ' home-picker__opt--on' : ''}`} data-service={c.theme}>
                  <input
                    type="radio"
                    className="visually-hidden"
                    name={groupName}
                    value={c.slug}
                    checked={on}
                    onChange={() => setSlug(c.slug)}
                  />
                  {on && <motion.span layoutId="home-picker-ring" className="home-picker__ring" transition={spring} />}
                  <motion.span
                    className="home-picker__icon"
                    animate={{ rotate: on ? -8 : 0, scale: on ? 1.08 : 1 }}
                    transition={spring}
                  >
                    <ServiceIcon slug={c.slug} size={40} />
                  </motion.span>
                  <span className="home-picker__name">{c.name}</span>
                  {from && (
                    <span className="home-picker__price tabular">
                      <span className="home-picker__aside">From</span>
                      <strong>{formatINR(from.price)}</strong>
                      <span className="home-picker__aside">{unitLabel[from.unit].per}</span>
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </LayoutGroup>
      </fieldset>

      <div className="home-search__fields">
        <DateField label="Date" value={filters.date} onChange={(date) => setFilters((f) => ({ ...f, date }))} />
        <Stepper label="Guests" value={filters.guests} onChange={(guests) => setFilters((f) => ({ ...f, guests }))} />
      </div>

      <div className="home-search__actions">
        <div className="home-search__extras">
          <Chip
            selected={extras.length > 0}
            className="home-search__more"
            aria-pressed={undefined}
            aria-haspopup="dialog"
            aria-label={extras.length ? `More filters, ${extras.length} applied` : 'More filters'}
            icon={<IconAdjustmentsHorizontal size={18} stroke={1.75} />}
            onClick={() => setSheetOpen(true)}
          >
            More filters
            <AnimatePresence initial={false}>
              {extras.length > 0 && (
                <motion.span
                  key="count"
                  className="home-search__count tabular"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={spring}
                  aria-hidden="true"
                >
                  {extras.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Chip>
          {extras.length > 0 && <span className="home-search__summary">{extras.join(' · ')}</span>}
        </div>
        <Button type="submit" size="lg" className="home-search__submit" icon={<IconSearch size={20} stroke={2} />}>
          Search {selected.name}
        </Button>
      </div>

      <Sheet
        open={sheetOpen}
        onClose={closeSheet}
        title="More filters"
        service={selected.theme}
        footer={
          <div className="home-sheet__foot">
            <Button
              variant="ghost"
              onClick={() => setFilters((f) => ({ ...f, pool: false, budget: undefined, maxKm: undefined }))}
              disabled={extras.length === 0}
            >
              Clear
            </Button>
            <Button onClick={closeSheet} className="home-sheet__done">
              Done
            </Button>
          </div>
        }
      >
        <div className="home-sheet__body">
          <Switch
            label="Swimming pool"
            description="Only show spaces with a pool"
            checked={filters.pool}
            onChange={(pool) => setFilters((f) => ({ ...f, pool }))}
            icon={<IconPool size={20} stroke={1.75} />}
          />
          <hr className="divider" />
          <BudgetSlider value={filters.budget} onChange={(budget) => setFilters((f) => ({ ...f, budget }))} />
          {budgetUnit && <p className="t-caption">Budget is compared with the price {budgetUnit}.</p>}
          <hr className="divider" />
          <DistanceField
            city={site.city}
            value={filters.maxKm}
            onChange={(maxKm) => setFilters((f) => ({ ...f, maxKm }))}
          />
        </div>
      </Sheet>
    </form>
  );
}
