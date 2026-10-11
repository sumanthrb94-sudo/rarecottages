import { CalendarDays, Minus, Plus, User } from 'lucide-react';
import { useId, type CSSProperties } from 'react';
import { BUDGET_MAX, BUDGET_MIN, BUDGET_STEP } from '../lib/filters';
import { formatINR, todayISO } from '../lib/format';
import './Controls.css';

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="toggle"
      onClick={() => onChange(!checked)}
    >
      <span className="toggle__label">{label}</span>
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__text">{checked ? 'ON' : 'OFF'}</span>
        <span className="toggle__knob" />
      </span>
    </button>
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
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="input-icon">
        <input
          id={id}
          type="date"
          className="input"
          min={todayISO()}
          value={value ?? ''}
          onChange={(e) => onChange(e.target.value || undefined)}
        />
        <CalendarDays aria-hidden="true" />
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
  placeholder,
  icon = true,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  icon?: boolean;
}) {
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="field">
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      <div className="stepper">
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Decrease ${label.toLowerCase()}`}
          disabled={value === undefined || value <= min}
          onClick={() => value !== undefined && onChange(value - 1 < min ? undefined : value - 1)}
        >
          <Minus />
        </button>
        <input
          id={id}
          className="input stepper__input"
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
        {icon && <User className="stepper__icon" aria-hidden="true" />}
        <button
          type="button"
          className="stepper__btn"
          aria-label={`Increase ${label.toLowerCase()}`}
          disabled={value !== undefined && value >= max}
          onClick={() => onChange(clamp((value ?? min - 1) + 1))}
        >
          <Plus />
        </button>
      </div>
    </div>
  );
}

export function BudgetSlider({
  value,
  onChange,
}: {
  value?: number;
  onChange: (value: number | undefined) => void;
}) {
  const id = useId();
  const current = value ?? BUDGET_MAX;
  const pct = ((current - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;
  const isAny = current >= BUDGET_MAX;
  return (
    <div className="field budget">
      <label className="field__label budget__label" htmlFor={id}>
        <span>Budget</span>
        <output htmlFor={id} className="budget__value">
          {isAny ? 'Any budget' : `Up to ${formatINR(current)}`}
        </output>
      </label>
      <input
        id={id}
        type="range"
        className="range"
        min={BUDGET_MIN}
        max={BUDGET_MAX}
        step={BUDGET_STEP}
        value={current}
        style={{ '--pct': `${pct}%` } as CSSProperties}
        aria-valuetext={isAny ? 'Any budget' : `Up to ${formatINR(current)}`}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(n >= BUDGET_MAX ? undefined : n);
        }}
      />
      <div className="budget__scale" aria-hidden="true">
        <span>{formatINR(BUDGET_MIN)}/-</span>
        <span>{formatINR(BUDGET_MAX)}+</span>
      </div>
    </div>
  );
}
