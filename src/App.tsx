import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { categories } from './data/categories';
import { HomePage } from './pages/HomePage';

// Home ships with the first load; every other page is fetched when it's visited.
const CategoryPage = lazy(() => import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })));
const SpacePage = lazy(() => import('./pages/SpacePage').then((m) => ({ default: m.SpacePage })));
const AddOnsPage = lazy(() => import('./pages/AddOnsPage').then((m) => ({ default: m.AddOnsPage })));
const CarsPage = lazy(() => import('./pages/CarsPage').then((m) => ({ default: m.CarsPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        {categories.map((c) => (
          <Route key={c.slug} path={c.slug} element={<CategoryPage key={c.slug} slug={c.slug} />} />
        ))}
        <Route path="spaces/:id" element={<SpacePage />} />
        <Route path="add-ons" element={<AddOnsPage />} />
        <Route path="rental-cars" element={<CarsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
