import { IconArrowLeft } from '../components/ui/icons';
import { FadeIn } from '../components/ui/motion';
import { Button } from '../components/ui/primitives';
import { usePageMeta } from '../lib/hooks';
import './InfoPages.css';

export function NotFoundPage() {
  usePageMeta('Page not found');
  return (
    <section className="container info-404">
      <FadeIn inView={false} className="info-404__inner">
        <h1 className="info-404__code tabular">
          404<span className="visually-hidden">, page not found</span>
        </h1>
        <p className="t-lead">This page doesn't exist or has moved.</p>
        <Button to="/" size="lg" icon={<IconArrowLeft size={20} stroke={1.75} />}>
          Back to home
        </Button>
      </FadeIn>
    </section>
  );
}
