import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { emptyFilters, hasActiveFilters, type Filters } from '../../lib/filters';
import { formatDate, formatINR, plural } from '../../lib/format';
import { BudgetSlider, DateField, Stepper, Switch } from '../ui/forms';
import { IconAdjustmentsHorizontal, IconCalendar, IconCurrencyRupee, IconPool, IconUsers } from '../ui/icons';
import { SlidingNumber, easeOut } from '../ui/motion';
import { Button, Chip } from '../ui/primitives';
import { DESKTOP_QUERY, Sheet, useMediaQuery } from '../ui/Sheet';

type Field = 'date' | 'guests' | 'budget' | 'all';

/** "Sat, 17 Oct" this year, "Sat, 17 Oct 2027" otherwise. */
function shortDate(iso: string) {
  return formatDate(iso).replace(new RegExp(` ${new Date().getFullYear()}$`), '');
}

/** Filters the sheet's Clear button resets (the date is kept). */
export function activeFilterCount(filters: Filters) {
  return Number(Boolean(filters.guests)) + Number(filters.budget !== undefined) + Number(filters.pool);
}

/** Chip label that cross-fades when its text changes. */
function Label({ text }: { text: string }) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={text}
        className="cat-chip__label"
        initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
        transition={{ duration: 0.22, ease: easeOut }}
      >
        {text}
      </motion.span>
    </AnimatePresence>
  );
}

/** Keeps a toggle the sticky bar's "stuck" look when it pins under the top bar. */
function useStuck() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = sentinel.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const top = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--topbar-h')) || 60;
    const io = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < top + 2),
      { rootMargin: `-${top + 1}px 0px 0px 0px`, threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [sentinel, stuck] as const;
}

/**
 * App-style filter row: one chip per filter plus a "Filters" chip with a count.
 * Every chip except Pool opens the same sheet (a dialog on desktop). Changes
 * apply live, so the sheet's button always shows the real number of results.
 */
export function FilterBar({
  filters,
  onChange,
  count,
  service,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  count: number;
  service: string;
}) {
  const [open, setOpen] = useState<Field | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const [sentinel, stuck] = useStuck();
  const active = activeFilterCount(filters);
  const set = (patch: Partial<Filters>) => onChange({ ...filters, ...patch });
  const clear = () => onChange({ ...emptyFilters, date: filters.date });

  // On desktop, jump straight to the field whose chip was tapped. (On phones this
  // would pop the keyboard, so the sheet just opens.)
  useEffect(() => {
    if (!open || open === 'all' || !desktop) return;
    const t = window.setTimeout(() => {
      document.querySelector<HTMLElement>(`[data-cat-field="${open}"] input`)?.focus();
    }, 90);
    return () => window.clearTimeout(t);
  }, [open, desktop]);

  const sheetChip = (field: Field, label: string, icon: ReactNode, selected: boolean, a11y?: string) => (
    <Chip
      selected={selected}
      aria-pressed={undefined}
      aria-haspopup="dialog"
      aria-label={a11y}
      icon={icon}
      className="cat-chip"
      onClick={() => setOpen(field)}
    >
      <Label text={label} />
    </Chip>
  );

  return (
    <>
      <div ref={sentinel} className="cat-filterbar__sentinel" aria-hidden="true" />
      <div className={`cat-filterbar${stuck ? ' is-stuck' : ''}`}>
        <div className="cat-chips" role="group" aria-label="Filters">
          <Chip
            aria-haspopup="dialog"
            aria-label={active ? `Filters, ${active} active` : 'Filters'}
            icon={<IconAdjustmentsHorizontal size={18} stroke={1.75} />}
            className="cat-chip cat-chip--filters"
            onClick={() => setOpen('all')}
          >
            Filters
            <AnimatePresence initial={false}>
              {active > 0 && (
                <motion.span
                  key="badge"
                  className="cat-badge tabular"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 26 }}
                  aria-hidden="true"
                >
                  {active}
                </motion.span>
              )}
            </AnimatePresence>
          </Chip>
          {sheetChip(
            'date',
            filters.date ? shortDate(filters.date) : 'Any date',
            <IconCalendar size={18} stroke={1.75} />,
            Boolean(filters.date),
            filters.date ? `Date: ${formatDate(filters.date)}` : 'Date: any date',
          )}
          {sheetChip(
            'guests',
            filters.guests ? plural(filters.guests, 'guest', 'guests') : 'Guests',
            <IconUsers size={18} stroke={1.75} />,
            Boolean(filters.guests),
            filters.guests ? `Guests: ${filters.guests}` : 'Guests: any',
          )}
          {sheetChip(
            'budget',
            filters.budget !== undefined ? `Up to ${formatINR(filters.budget)}` : 'Budget',
            <IconCurrencyRupee size={18} stroke={1.75} />,
            filters.budget !== undefined,
            filters.budget !== undefined ? `Budget: up to ${formatINR(filters.budget)}` : 'Budget: any',
          )}
          <Chip
            selected={filters.pool}
            icon={<IconPool size={18} stroke={1.75} />}
            className="cat-chip"
            onClick={() => set({ pool: !filters.pool })}
          >
            Pool
          </Chip>
        </div>
      </div>

      <Sheet
        open={open !== null}
        onClose={close}
        title="Filters"
        service={service}
        footer={
          <div className="cat-sheet__foot">
            <Button variant="ghost" onClick={clear} disabled={!hasActiveFilters(filters)}>
              Clear
            </Button>
            <Button variant="primary" block onClick={close} className="cat-sheet__show">
              Show <SlidingNumber value={count} prefix="" /> {count === 1 ? 'space' : 'spaces'}
            </Button>
          </div>
        }
      >
        <div className="cat-sheet">
          <div className="cat-sheet__group" data-cat-field="date">
            <DateField label="Date" value={filters.date} onChange={(date) => set({ date })} />
            {filters.date && (
              <button type="button" className="cat-sheet__reset" onClick={() => set({ date: undefined })}>
                Any date
              </button>
            )}
            <p className="t-caption">Availability for your date is confirmed on WhatsApp.</p>
          </div>
          <hr className="divider" />
          <div className="cat-sheet__group" data-cat-field="guests">
            <Stepper label="No of people" value={filters.guests} onChange={(guests) => set({ guests })} />
          </div>
          <hr className="divider" />
          <div className="cat-sheet__group" data-cat-field="budget">
            <BudgetSlider value={filters.budget} onChange={(budget) => set({ budget })} />
          </div>
          <hr className="divider" />
          <Switch
            label="Swimming pool"
            description="Only show spaces with a pool"
            checked={filters.pool}
            onChange={(pool) => set({ pool })}
            icon={<IconPool size={20} stroke={1.75} />}
          />
        </div>
      </Sheet>
    </>
  );
}
