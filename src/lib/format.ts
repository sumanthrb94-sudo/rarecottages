const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** 15000 -> "₹15,000" */
export function formatINR(amount: number): string {
  return `₹${inr.format(amount)}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * "2026-10-11" -> "Sun, 11 Oct 2026". Formatted by hand so the WhatsApp message
 * reads the same in every browser. Returns the input unchanged if it is not a date.
 */
export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  const date = new Date(Date.UTC(y, m - 1, d));
  if (Number.isNaN(date.getTime()) || date.getUTCDate() !== d) return isoDate;
  return `${WEEKDAYS[date.getUTCDay()]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

/** Today's date as YYYY-MM-DD in the visitor's local time, for <input type="date" min>. */
export function todayISO(now = new Date()): string {
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
