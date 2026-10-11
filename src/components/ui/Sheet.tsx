import { AnimatePresence, motion, useDragControls } from 'motion/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from './icons';
import { easeOut } from './motion';
import './ui.css';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const m = window.matchMedia(query);
    const onChange = () => setMatches(m.matches);
    onChange();
    m.addEventListener('change', onChange);
    return () => m.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Same breakpoint as the shell: below it the site behaves like a mobile app. */
export const DESKTOP_QUERY = '(min-width: 900px)';

/**
 * App-style bottom sheet on phones (drag the handle down to close) and a
 * centred dialog on desktop. Closes on Escape and backdrop tap, locks page
 * scroll, moves focus in and back out.
 */
export function Sheet({
  open,
  onClose,
  title,
  children,
  footer,
  service,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Optional data-service theme for the sheet contents. */
  service?: string;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery(DESKTOP_QUERY);
  const drag = useDragControls();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => panel.current?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="sheet-root" data-service={service}>
          <motion.div
            className="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            className={`sheet ${desktop ? 'sheet--dialog' : 'sheet--bottom'}`}
            initial={desktop ? { opacity: 0, scale: 0.96, y: 12 } : { y: '100%' }}
            animate={desktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
            exit={desktop ? { opacity: 0, scale: 0.97, y: 8 } : { y: '100%' }}
            transition={desktop ? { duration: 0.24, ease: easeOut } : { type: 'spring', stiffness: 380, damping: 38 }}
            drag={desktop ? false : 'y'}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 600) onClose();
            }}
          >
            {!desktop && (
              <div className="sheet__grab" onPointerDown={(e) => drag.start(e)} aria-hidden="true">
                <span />
              </div>
            )}
            <div className="sheet__head">
              <h2 id={titleId} className="t-h3">
                {title}
              </h2>
              <button type="button" className="icon-btn" aria-label="Close" onClick={onClose}>
                <IconX size={20} stroke={1.75} />
              </button>
            </div>
            <div className="sheet__body">{children}</div>
            {footer && <div className="sheet__foot">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
