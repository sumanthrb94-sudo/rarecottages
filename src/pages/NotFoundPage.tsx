import { Link } from 'react-router-dom';
import { usePageMeta, usePageTheme } from '../lib/hooks';
import './InfoPages.css';

export function NotFoundPage() {
  usePageMeta('Page not found');
  usePageTheme('brand');
  return (
    <section className="container section not-found">
      <p className="outline-title">404</p>
      <h1 className="h2">This page took a night off</h1>
      <p className="lead">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn btn--light">
        Back to home
      </Link>
    </section>
  );
}
