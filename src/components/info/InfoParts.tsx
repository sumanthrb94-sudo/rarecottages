/**
 * Small building blocks shared by the Add-ons, Rental Cars, About and Contact pages:
 * a large page title, settings-style list rows, and a list that reveals its rows one by one.
 */
import { motion, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { IconArrowUpRight, IconChevronRight } from '../ui/icons';
import { FadeIn, TextEffect } from '../ui/motion';
import '../../pages/InfoPages.css';

/** App-style large title with an optional eyebrow and intro line. */
export function InfoHead({
  title,
  eyebrow,
  lead,
  children,
}: {
  title: string;
  eyebrow?: string;
  lead?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="container info-head">
      {eyebrow && <p className="t-eyebrow">{eyebrow}</p>}
      <TextEffect as="h1" className="t-h1 info-head__title">
        {title}
      </TextEffect>
      {lead && (
        <FadeIn inView={false} delay={0.12}>
          <p className="t-lead">{lead}</p>
        </FadeIn>
      )}
      {children}
    </div>
  );
}

const listVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };

/** A <ul role="list"> whose StaggerItem children fade in one after another when scrolled into view. */
export function RevealList({
  children,
  className,
  label,
  inView = true,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
  inView?: boolean;
}) {
  const trigger = inView
    ? { whileInView: 'show' as const, viewport: { once: true, margin: '0px 0px -8% 0px' } }
    : { animate: 'show' as const };
  return (
    <motion.ul role="list" aria-label={label} className={className} initial="hidden" variants={listVariants} {...trigger}>
      {children}
    </motion.ul>
  );
}

/** Neutral rounded square that holds a line icon. */
export function IconTile({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`info-tile ${className}`.trim()} aria-hidden="true">
      {children}
    </span>
  );
}

/**
 * Settings-style row: icon tile, label, value and a chevron. Renders a router
 * Link for `to`, an <a> for `href` (external ones open a new tab), or plain
 * text when neither is given.
 */
export function ListRow({
  media,
  label,
  value,
  to,
  href,
  external,
}: {
  media: ReactNode;
  label: string;
  value?: ReactNode;
  to?: string;
  href?: string;
  external?: boolean;
}) {
  const interactive = Boolean(to || href);
  const content = (
    <>
      {media}
      <span className="info-row__text">
        <span className="info-row__label">{label}</span>
        {value && <span className="info-row__value">{value}</span>}
      </span>
      {interactive && (
        <span className="info-row__trail" aria-hidden="true">
          {external ? <IconArrowUpRight size={20} stroke={1.75} /> : <IconChevronRight size={20} stroke={1.75} />}
        </span>
      )}
      {external && <span className="visually-hidden"> (opens in a new tab)</span>}
    </>
  );
  if (to) {
    return (
      <Link to={to} className="info-row info-row--link">
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className="info-row info-row--link" {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
        {content}
      </a>
    );
  }
  return <div className="info-row">{content}</div>;
}
