import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import './Carousel.css';

/**
 * Horizontal, swipeable row with the double-chevron arrows from the mockups.
 * Uses native scroll-snap, so touch, trackpad and keyboard scrolling just work.
 */
export function Carousel({ label, children }: { label: string; children: ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const step = first ? first.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <div className="carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div className="carousel__track" ref={track} tabIndex={0}>
        {children}
      </div>
      {scrollable && (
        <div className="carousel__nav">
          <button type="button" className="chev" onClick={() => scrollBy(-1)} disabled={edges.start} aria-label="Previous">
            <ChevronsLeft />
          </button>
          <button type="button" className="chev" onClick={() => scrollBy(1)} disabled={edges.end} aria-label="Next">
            <ChevronsRight />
          </button>
        </div>
      )}
    </div>
  );
}
