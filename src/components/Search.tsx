import { MapPin } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../config/site';
import { categories } from '../data/categories';
import type { CategorySlug } from '../data/types';
import type { Filters } from '../lib/filters';
import { BudgetSlider, DateField, Stepper, Toggle } from './Controls';
import { CategoryIcon } from './icons';
import './Search.css';

export function LocationPill() {
  return (
    <div className="location">
      <span className="location__label">Where are you looking for</span>
      <span className="location__pill">
        <span className="location__pin" aria-hidden="true">
          <MapPin />
        </span>
        {site.serviceArea}
      </span>
    </div>
  );
}

/** The four big outlined tiles from the home mockup, as a single-choice group. */
export function CategoryPicker({
  value,
  onChange,
}: {
  value: CategorySlug;
  onChange: (slug: CategorySlug) => void;
}) {
  return (
    <fieldset className="cat-picker">
      <legend className="visually-hidden">What are you planning?</legend>
      {categories.map((c) => (
        <label key={c.slug} className="cat-tile" data-theme={c.theme}>
          <input
            type="radio"
            name="category"
            value={c.slug}
            checked={value === c.slug}
            onChange={() => onChange(c.slug)}
            className="visually-hidden"
          />
          <span className="cat-tile__box">
            <CategoryIcon slug={c.slug} strokeWidth={1.4} className="cat-tile__icon" />
          </span>
          <span className="cat-tile__name">{c.name}</span>
          <span className="cat-tile__hint">{c.hint}</span>
        </label>
      ))}
    </fieldset>
  );
}

/** Compact category tabs for listing pages; keeps the current filters in the link. */
export function CategorySwitcher({ current, query }: { current: CategorySlug; query: string }) {
  const nav = useRef<HTMLElement>(null);

  // On narrow screens the tabs scroll sideways; bring the current one into view.
  useEffect(() => {
    const el = nav.current;
    const active = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (el && active) el.scrollLeft = active.offsetLeft - el.offsetLeft - 16;
  }, [current]);

  return (
    <nav className="cat-switcher" aria-label="Categories" ref={nav}>
      {categories.map((c) => (
        <Link
          key={c.slug}
          to={{ pathname: `/${c.slug}`, search: query }}
          className="cat-switcher__item"
          data-theme={c.theme}
          aria-current={c.slug === current ? 'page' : undefined}
        >
          <CategoryIcon slug={c.slug} size={20} strokeWidth={1.8} />
          <span>{c.name}</span>
        </Link>
      ))}
    </nav>
  );
}

export function FilterPanel({
  filters,
  onChange,
  compact = false,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  compact?: boolean;
}) {
  return (
    <div className={`filters${compact ? ' filters--compact' : ''}`}>
      <DateField value={filters.date} onChange={(date) => onChange({ ...filters, date })} />
      <Stepper
        label="No of People"
        placeholder="Any"
        value={filters.guests}
        onChange={(guests) => onChange({ ...filters, guests })}
      />
      <BudgetSlider value={filters.budget} onChange={(budget) => onChange({ ...filters, budget })} />
      <div className="filters__pool">
        <Toggle label="Swimming pool" checked={filters.pool} onChange={(pool) => onChange({ ...filters, pool })} />
      </div>
    </div>
  );
}
