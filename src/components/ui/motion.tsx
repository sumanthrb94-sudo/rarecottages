/**
 * Motion primitives, built on `motion` (formerly Framer Motion). Recipes follow
 * ibelick/motion-primitives, as used by the mint-motion skill:
 *   - FadeIn: fade-in-blur on enter / when scrolled into view
 *   - Stagger + StaggerItem: children reveal one after another
 *   - TextEffect: words reveal with fade-in-blur, like speech
 *   - SlidingNumber: digits roll to the new value (prices, totals)
 *   - Pressable: subtle press-in on tap
 * Everything respects prefers-reduced-motion via <MotionConfig reducedMotion="user"> in main.tsx.
 */
import { motion, useSpring, useTransform, type HTMLMotionProps, type Transition, type Variants } from 'motion/react';
import { useEffect, type ElementType, type ReactNode } from 'react';

export const easeOut = [0.22, 1, 0.36, 1] as const;
export const spring: Transition = { type: 'spring', stiffness: 420, damping: 34, mass: 0.8 };
export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 30 };

const fadeBlur: Variants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(8px)' },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: easeOut, delay },
  }),
};

export function FadeIn({
  children,
  delay = 0,
  inView = true,
  className,
  ...rest
}: { children: ReactNode; delay?: number; inView?: boolean; className?: string } & HTMLMotionProps<'div'>) {
  const trigger = inView
    ? { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : { animate: 'show' as const };
  return (
    <motion.div className={className} variants={fadeBlur} custom={delay} initial="hidden" {...trigger} {...rest}>
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className,
  gap = 0.06,
  delay = 0,
  as = 'div',
  inView = true,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  as?: 'div' | 'ul' | 'ol' | 'section';
  inView?: boolean;
}) {
  const M = motion[as];
  const trigger = inView ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -8% 0px' } } : { animate: 'show' };
  return (
    <M
      className={className}
      initial="hidden"
      {...trigger}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </M>
  );
}

export function StaggerItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'li' | 'article';
}) {
  const M = motion[as];
  return (
    <M className={className} variants={fadeBlur}>
      {children}
    </M>
  );
}

/** Word-by-word fade-in-blur, for headlines. */
export function TextEffect({
  children,
  as: Tag = 'h1',
  className,
  delay = 0,
  per = 0.05,
}: {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  per?: number;
}) {
  const words = children.split(' ');
  return (
    <Tag className={className} aria-label={children}>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: per, delayChildren: delay } } }}
        style={{ display: 'inline' }}
      >
        {words.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            variants={{
              hidden: { opacity: 0, y: '0.3em', filter: 'blur(10px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: easeOut } },
            }}
            style={{ display: 'inline-block', whiteSpace: 'pre' }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  );
}

function Digit({ value, place }: { value: number; place: number }) {
  const digit = Math.floor(value / place) % 10;
  const s = useSpring(digit, { stiffness: 280, damping: 30 });
  useEffect(() => s.set(digit), [digit, s]);
  const y = useTransform(s, (v) => `${-v * 10}%`);
  return (
    <span style={{ display: 'inline-block', height: '1em', overflow: 'hidden', lineHeight: 1 }}>
      <motion.span style={{ display: 'flex', flexDirection: 'column', y }}>
        {Array.from({ length: 10 }, (_, n) => (
          <span key={n} style={{ height: '1em', lineHeight: 1 }}>
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/**
 * Rolling-digit number in Indian grouping, e.g. ₹1,23,456.
 * Screen readers get the final formatted value.
 */
export function SlidingNumber({ value, prefix = '₹', className }: { value: number; prefix?: string; className?: string }) {
  const formatted = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.max(0, Math.round(value)));
  const digits = formatted.replace(/\D/g, '').length;
  let seen = 0;
  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'baseline', fontVariantNumeric: 'tabular-nums' }}>
      <span className="visually-hidden">
        {prefix}
        {formatted}
      </span>
      <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'baseline' }}>
        {prefix}
        {formatted.split('').map((ch, i) => {
          if (!/\d/.test(ch)) return <span key={`s${i}`}>{ch}</span>;
          const place = 10 ** (digits - 1 - seen++);
          return <Digit key={`d${digits - seen}`} value={Math.round(value)} place={place} />;
        })}
      </span>
    </span>
  );
}

/** Page enter: quick fade-in-blur, keyed by route in the app shell. */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
