import { Route, Routes } from 'react-router-dom';
import { AppShell } from './components/shell/AppShell';
import { categories } from './data/categories';
import { AboutPage } from './pages/AboutPage';
import { AddOnsPage } from './pages/AddOnsPage';
import { CarsPage } from './pages/CarsPage';
import { CategoryPage } from './pages/CategoryPage';
import { ContactPage } from './pages/ContactPage';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SpacePage } from './pages/SpacePage';

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
