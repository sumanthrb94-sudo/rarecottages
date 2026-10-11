import { animate, motion } from 'motion/react';
import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import type { CategorySlug } from '../../data/types';
import { spring } from '../ui/motion';

/**
 * The page remounts on every service change, so the rail's scroll position is
 * remembered here: the new page starts where the old one was and glides the
 * current tab into view instead of jumping. On a fresh load it is just centred.
 */
let lastScrollLeft: number | null = null;

/**
 * Tabs for the four services. Each tab carries its own data-service, so the dot
 * and the active underline take that service's colour. Links keep the current
 * filters, so switching service does not lose the search.
 */
export function ServiceSwitcher({ current, query }: { current: CategorySlug; query: string }) {
  const rail = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const el = rail.current;
    const tab = el?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!el || !tab) return;
    const target = Math.max(0, tab.offsetLeft - (el.clientWidth - tab.offsetWidth) / 2);
    let glide: ReturnType<typeof animate> | undefined;
    if (lastScrollLeft === null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.scrollLeft = target;
    } else {
      el.scrollLeft = lastScrollLeft;
      // the tab should sit clear of the edges, not just touch them
      const pad = (parseFloat(getComputedStyle(el).paddingLeft) || 0) + 8;
      const left = tab.offsetLeft - el.scrollLeft;
      const fits = left >= pad && left + tab.offsetWidth <= el.clientWidth - pad;
      if (!fits) {
        glide = animate(el.scrollLeft, target, {
          type: 'spring',
          stiffness: 220,
          damping: 32,
          onUpdate: (v) => {
            el.scrollLeft = v;
          },
        });
      }
    }
    lastScrollLeft = el.scrollLeft;
    const onScroll = () => {
      lastScrollLeft = el.scrollLeft;
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      glide?.stop();
      el.removeEventListener('scroll', onScroll);
    };
  }, [current]);

  return (
    <nav className="cat-switch" aria-label="Choose a service">
      <ul role="list" className="cat-switch__list" ref={rail}>
        {categories.map((c) => {
          const active = c.slug === current;
          return (
            <li key={c.slug}>
              <Link
                to={`/${c.slug}${query ? `?${query}` : ''}`}
                className="cat-switch__tab"
                data-service={c.theme}
                aria-current={active ? 'page' : undefined}
              >
                <span className="cat-switch__dot" aria-hidden="true" />
                {c.name}
                {active && (
                  <motion.span layoutId="cat-switch-indicator" className="cat-switch__bar" transition={spring} />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
