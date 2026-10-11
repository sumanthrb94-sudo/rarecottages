import { motion } from 'motion/react';
import { useId, type CSSProperties, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP } from '../../lib/filters';
import { formatINR, todayISO } from '../../lib/format';
import { IconCalendar, IconChevronDown, IconMinus, IconPlus } from './icons';
import { spring } from './motion';
import './ui.css';

function Label({ htmlFor, children, optional }: { htmlFor: string; children: ReactNode; optional?: boolean }) {
  return (
    <label className="field__label" htmlFor={htmlFor}>
      {children}
      {optional && <span className="field__optional"> (optional)</span>}
    </label>
  );
}

export function TextField({
  label,
  optional,
  ...rest
}: { label: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <input id={id} className="input" {...rest} />
    </div>
  );
}

export function TextArea({
  label,
  optional,
  ...rest
}: { label: string; optional?: boolean } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id} optional={optional}>
        {label}
      </Label>
      <textarea id={id} className="input input--area" {...rest} />
    </div>
  );
}

export function SelectField({
  label,
  children,
  ...rest
}: { label: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <div className="input-wrap">
        <select id={id} className="input input--select" {...rest}>
          {children}
        </select>
        <IconChevronDown size={18} className="input-wrap__icon" aria-hidden="true" />
      </div>
    </div>
  );
}

export function DateField({
  label = 'Date',
  value,
  onChange,
}: {
  label?: string;
  value?: string;
  onChange: (value: string | undefined) => void;
}) {
  const id = useId();
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <div className="input-wrap">
        <input
          id={id}
          type="date"
          className="input input--date"
          min={todayISO()}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        <IconCalendar size={18} className="input-wrap__icon" aria-hidden="true" />
      </div>
    </div>
  );
}

export function Stepper({
  label,
  value,
  onChange,
  min = 1,
  max = 500,
  placeholder = 'Any',
  suffix,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  suffix?: string;
}) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="field">
      <Label htmlFor={id}>{label}</Label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value === undefined || value <= min}
          onClick={() => value !== undefined && onChange(value - 1 < min ? undefined : value - 1)}
        >
          <IconMinus size={18} stroke={2} />
        </button>
        <span className="stepper__value">
          <input
            id={id}
            className="stepper__input"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            placeholder={placeholder}
            value={value ?? ''}
            onChange={(e) => {
              const n = Number.parseInt(e.target.value, 10);
              onChange(Number.isFinite(n) && n > 0 ? clamp(n) : undefined);
            }}
          />
          {suffix && value !== undefined && <span className="stepper__suffix">{suffix}</span>}
        </span>
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value !== undefined && value >= max}
          onClick={() => onChange(clamp((value ?? min - 1) + 1))}
        >
          <IconPlus size={18} stroke={2} />
        </button>
      </div>
    </div>
  );
}

/** iOS / Uber style on-off switch. Uses the service colour when inside data-service. */
export function Switch({
  label,
  description,
  checked,
  onChange,
  icon,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: ReactNode;
}) {
  return (
    <button type="button" role="switch" aria-checked={checked} className="switch" onClick={() => onChange(!checked)}>
      {icon && <span className="switch__icon">{icon}</span>}
      <span className="switch__text">
        <span className="switch__label">{label}</span>
        {description && <span className="switch__desc">{description}</span>}
      </span>
      <span className="switch__track" aria-hidden="true">
        <motion.span className="switch__knob" layout transition={spring} />
      </span>
    </button>
  );
}

export function BudgetSlider({ value, onChange }: { value?: number; onChange: (value: number | undefined) => void }) {
  const id = useId();
  const current = value ?? BUDGET_MAX;
  const pct = ((current - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const label = current >= BUDGET_MAX ? 'Any budget' : `Up to ${formatINR(current)}`;
  return (
    <div className="field">
      <div className="budget__head">
        <label className="field__label" htmlFor={id}>
          Budget
        </label>
        <output htmlFor={id} className="budget__value tabular">
          {label}
        </output>
      </div>
      <input
        id={id}
        type="range"
        className="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={current}
        aria-valuetext={label}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(n >= BUDGET_MAX ? undefined : n);
        }}
      />
      <div className="budget__scale t-caption tabular" aria-hidden="true">
        <span>{formatINR(BUDGET_MIN)}</span>
        <span>{formatINR(BUDGET_MAX)}+</span>
      </div>
    </div>
  );
}
