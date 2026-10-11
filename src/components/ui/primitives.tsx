import { AnimatePresence, motion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../../config/site';
import type { CategorySlug, Theme } from '../../data/types';
import { useTheme } from '../../lib/theme';
import { IconMoon, IconSun, serviceIcons } from './icons';
import './ui.css';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'whatsapp' | 'service';
type Size = 'sm' | 'md' | 'lg';

interface ButtonBase {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  children?: ReactNode;
  className?: string;
  'aria-label'?: string;
}

type ButtonProps = ButtonBase &
  (
    | ({ to: string; href?: never } & { onClick?: () => void })
    | ({ href: string; to?: never; external?: boolean } & { onClick?: () => void })
    | ({ to?: never; href?: never } & ButtonHTMLAttributes<HTMLButtonElement>)
  );

/**
 * Uber-style button. primary = black in light mode, white in dark mode.
 * `service` fills with the nearest data-service colour. Renders a router Link
 * for `to`, an <a> for `href` (external opens a new tab), or a <button>.
 */
export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', block, icon, iconRight, children, className = '' } = props;
  const cls = `btn btn--${variant} btn--${size}${block ? ' btn--block' : ''} ${className}`.trim();
  const inner = (
    <>
      {icon}
      {children && <span>{children}</span>}
      {iconRight}
    </>
  );
  if ('to' in props && props.to !== undefined) {
    return (
      <Link to={props.to} className={cls} aria-label={props['aria-label']} onClick={props.onClick}>
        {inner}
      </Link>
    );
  }
  if ('href' in props && props.href !== undefined) {
    const ext = 'external' in props && props.external;
    return (
      <a
        href={props.href}
        className={cls}
        aria-label={props['aria-label']}
        onClick={props.onClick}
        {...(ext ? { target: '_blank', rel: 'noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  const { variant: _v, size: _s, block: _b, icon: _i, iconRight: _r, className: _c, ...rest } = props as ButtonBase &
    ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" {...rest} className={cls}>
      {inner}
    </button>
  );
}

export function IconButton({
  label,
  children,
  className = '',
  ...rest
}: { label: string; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label={label} title={label} className={`icon-btn ${className}`} {...rest}>
      {children}
    </button>
  );
}

/** Selectable pill. Use `selected` for toggles/filters; pass `as="link"` styling via className on a Link instead. */
export function Chip({
  selected,
  icon,
  children,
  className = '',
  ...rest
}: { selected?: boolean; icon?: ReactNode; children: ReactNode } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-pressed={selected} className={`chip${selected ? ' chip--on' : ''} ${className}`} {...rest}>
      {icon}
      <span>{children}</span>
    </button>
  );
}

const themeOf: Record<CategorySlug, Theme> = {
  'night-stay': 'night',
  'hourly-stay': 'hourly',
  'party-space': 'party',
  'event-space': 'event',
};

export function serviceTheme(slug: CategorySlug): Theme {
  return themeOf[slug];
}

/**
 * The service's logo tile: a rounded square in the service colour with a white
 * line icon, slightly tilted like the tiles in the logo.
 */
export function ServiceIcon({
  slug,
  size = 44,
  tilt = 0,
  className = '',
}: {
  slug: CategorySlug;
  size?: number;
  tilt?: number;
  className?: string;
}) {
  const Icon = serviceIcons[slug];
  return (
    <span
      className={`svc-icon ${className}`}
      data-service={themeOf[slug]}
      style={{ width: size, height: size, borderRadius: size * 0.3, rotate: `${tilt}deg` }}
      aria-hidden="true"
    >
      <Icon size={size * 0.56} stroke={1.75} />
    </span>
  );
}

/** Small dot + label in the service colour. */
export function ServiceTag({ slug, label, className = '' }: { slug: CategorySlug; label: string; className?: string }) {
  return (
    <span className={`svc-tag ${className}`} data-service={themeOf[slug]}>
      <span className="svc-tag__dot" aria-hidden="true" />
      {label}
    </span>
  );
}

/** Colour logo; the full lockup switches artwork for light / dark mode. */
export function Logo({ variant = 'mark', className = '' }: { variant?: 'mark' | 'lockup' | 'full'; className?: string }) {
  const { mode } = useTheme();
  if (variant === 'full') {
    return (
      <img
        className={className}
        src={mode === 'dark' ? '/images/logo-dark.webp' : '/images/logo-light.webp'}
        alt={`${site.name} — ${site.tagline}`}
        width="480"
        height="560"
      />
    );
  }
  return (
    <span className={`logo ${className}`}>
      <img src="/images/logo-mark.webp" alt="" width="36" height="36" className="logo__mark" />
      {variant === 'lockup' && <span className="logo__word">Rare Cottages</span>}
    </span>
  );
}

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { mode, toggle } = useTheme();
  const next = mode === 'dark' ? 'light' : 'dark';
  return (
    <IconButton label={`Switch to ${next} mode`} onClick={toggle} className={`theme-toggle ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={mode}
          initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.22 }}
          style={{ display: 'grid' }}
        >
          {mode === 'dark' ? <IconSun size={20} stroke={1.75} /> : <IconMoon size={20} stroke={1.75} />}
        </motion.span>
      </AnimatePresence>
    </IconButton>
  );
}

export function SectionHeader({
  title,
  eyebrow,
  action,
  id,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
        <h2 className="t-h2" id={id}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
