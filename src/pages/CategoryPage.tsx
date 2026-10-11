// Placeholder — being rebuilt.
import type { CategorySlug } from '../data/types';

export function CategoryPage({ slug }: { slug: CategorySlug }) {
  return (
    <section className="container section">
      <h1 className="t-h1">{slug}</h1>
    </section>
  );
}
