import { useState } from 'react';
import Catalog from './components/Catalog';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import HowItWorks from './components/HowItWorks';
import Navbar from './components/Navbar';
import SizeGuide from './components/SizeGuide';
import type { CostumeFilters } from './lib/filterCostumes';
import { scrollToSection } from './lib/scroll';

const INITIAL_FILTERS: CostumeFilters = { size: 'Todos', category: 'Todos', query: '' };

export default function App() {
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const update = (patch: Partial<CostumeFilters>) => setFilters((f) => ({ ...f, ...patch }));

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SizeGuide
          selected={filters.size}
          onSelect={(size) => {
            update({ size });
            scrollToSection('catalogo');
          }}
        />
        <Catalog filters={filters} onChange={update} />
        <Highlights
          onShortcut={(name) => {
            setFilters({ size: 'Todos', category: 'Datas Comemorativas', query: name });
            scrollToSection('catalogo');
          }}
        />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
