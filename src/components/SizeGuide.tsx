import { SIZE_GUIDE, type BabySize } from '../data/catalog';
import type { SizeFilter } from '../lib/filterCostumes';

interface Props {
  selected: SizeFilter;
  onSelect: (size: BabySize) => void;
}

export default function SizeGuide({ selected, onSelect }: Props) {
  return (
    <section id="tamanhos" aria-labelledby="tamanhos-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 id="tamanhos-title" className="text-center text-3xl font-black sm:text-4xl">
        Tabela de Tamanhos
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-lg text-ink/80">
        Antes de prosseguir, identifique qual tamanho é o mais adequado para o seu baby
      </p>
      <div role="group" aria-label="Escolha o tamanho do seu baby" className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {SIZE_GUIDE.map(({ size, ageRange }) => {
          const pressed = selected === size;
          return (
            <button
              key={size}
              type="button"
              aria-pressed={pressed}
              onClick={() => onSelect(size)}
              className={`flex flex-col items-center rounded-3xl border-2 px-3 py-5 transition-colors ${
                pressed ? 'border-ink bg-ink text-white' : 'border-transparent bg-mint/70 hover:border-ink/40'
              }`}
            >
              <span className="text-3xl font-black">{size}</span>
              <span className="sr-only"> – </span>
              <span className="mt-1 text-sm font-semibold">{ageRange}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
