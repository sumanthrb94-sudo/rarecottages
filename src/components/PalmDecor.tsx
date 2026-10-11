/**
 * A palm frond drawn from a curve, used as a faint background flourish
 * (the mockups sit on photographic palm-leaf backdrops).
 */
function frondPath(): string {
  const p0 = [20, 390];
  const c = [90, 90];
  const p1 = [390, 40];
  const at = (t: number) => [
    (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p1[0],
    (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p1[1],
  ];
  const tangent = (t: number) => {
    const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
    const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
    const len = Math.hypot(dx, dy);
    return [dx / len, dy / len];
  };
  const f = (n: number) => n.toFixed(1);
  let d = `M${f(p0[0])} ${f(p0[1])}Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
  for (let t = 0.12; t < 0.97; t += 0.036) {
    const [x, y] = at(t);
    const [tx, ty] = tangent(t);
    const len = 150 * Math.sin(Math.PI * Math.min(1, t * 1.15)) ** 0.8 + 12;
    for (const side of [1, -1]) {
      const nx = -ty * side;
      const ny = tx * side;
      const dx = tx * 0.55 + nx;
      const dy = ty * 0.55 + ny;
      const dl = Math.hypot(dx, dy);
      const ux = dx / dl;
      const uy = dy / dl;
      const droop = len * 0.22;
      const tipX = x + ux * len + nx * droop * 0.3 + tx * droop * 0.4;
      const tipY = y + uy * len + ny * droop * 0.3 + ty * droop * 0.4 + droop * 0.5;
      const w = 5 + len * 0.03;
      const midX = x + ux * len * 0.5;
      const midY = y + uy * len * 0.5;
      d += `M${f(x)} ${f(y)}Q${f(midX - uy * w)} ${f(midY + ux * w)} ${f(tipX)} ${f(tipY)}Q${f(midX + uy * w)} ${f(midY - ux * w)} ${f(x)} ${f(y)}Z`;
    }
  }
  return d;
}

const FROND = frondPath();

export function PalmDecor({ className = '' }: { className?: string }) {
  return (
    <svg className={`palm ${className}`} viewBox="0 0 420 420" aria-hidden="true" focusable="false">
      <path d={FROND} fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}
