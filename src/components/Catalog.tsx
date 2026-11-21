import { COSTUMES_CATALOG, SIZE_GUIDE, buildWhatsAppUrl } from '../data/catalog';
import { CATEGORY_OPTIONS, formatResultCount } from '../lib/categories';
import { filterCostumes, type CostumeFilters } from '../lib/filterCostumes';
import CostumeCard from './CostumeCard';
import { WhatsAppIcon } from './Icons';

const SIZE_OPTIONS = ['Todos', ...SIZE_GUIDE.map((s) => s.size)] as const;

interface Props {
  filters: CostumeFilters;
  onChange: (patch: Partial<CostumeFilters>) => void;
}

function chipClass(active: boolean) {
  return `rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-colors ${
    active ? 'border-ink bg-ink text-white' : 'border-ink/15 bg-white hover:border-ink/50'
  }`;
}

export default function Catalog({ filters, onChange }: Props) {
  const results = filterCostumes(COSTUMES_CATALOG, filters);
  const activeSize = filters.size && filters.size !== 'Todos' ? filters.size : null;

  return (
    <section id="catalogo" aria-labelledby="catalogo-title" className="bg-lavender/30 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="catalogo-title" className="text-center text-3xl font-black sm:text-4xl">
          Catálogo de Fantasias
        </h2>

        <div className="mt-8 space-y-4">
          <div role="group" aria-label="Filtrar por tamanho" className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="mr-1 font-bold">Tamanho:</span>
            {SIZE_OPTIONS.map((s) => (
              <button key={s} type="button" aria-pressed={(filters.size ?? 'Todos') === s} onClick={() => onChange({ size: s })} className={chipClass((filters.size ?? 'Todos') === s)}>
                {s}
              </button>
            ))}
          </div>
          <div role="group" aria-label="Filtrar por categoria" className="flex flex-wrap items-center gap-2">
            <span aria-hidden="true" className="mr-1 font-bold">Categoria:</span>
            {CATEGORY_OPTIONS.map((o) => (
              <button key={o.label} type="button" aria-pressed={(filters.category ?? 'Todos') === o.value} onClick={() => onChange({ category: o.value })} className={chipClass((filters.category ?? 'Todos') === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <label className="flex w-full max-w-sm flex-col gap-1 font-bold">
              Buscar fantasia
              <input
                type="search"
                value={filters.query}
                onChange={(e) => onChange({ query: e.target.value })}
                placeholder="Ex.: Batman, Leãozinho…"
                className="rounded-full border-2 border-ink/20 bg-white px-5 py-2.5 font-normal outline-none focus:border-ink"
              />
            </label>
            <p aria-live="polite" className="font-semibold text-ink/80">
              {formatResultCount(results.length)}
            </p>
          </div>
        </div>

        {results.length > 0 ? (
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((c) => (
              <li key={c.id} className="flex">
                <div className="w-full">
                  <CostumeCard costume={c} selectedSize={activeSize} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl bg-white p-10 text-center">
            <p className="text-lg font-bold">Nenhuma fantasia encontrada com esses filtros.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => onChange({ size: 'Todos', category: 'Todos', query: '' })} className="rounded-full bg-cta px-6 py-2.5 font-bold text-white">
                Limpar filtros
              </button>
              <a href={buildWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-6 py-2.5 font-bold text-ink">
                <WhatsAppIcon />
                Fale com a gente no WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
