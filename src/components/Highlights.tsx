import { COSTUMES_CATALOG, buildWhatsAppUrl } from '../data/catalog';
import { DATE_SHORTCUTS } from '../lib/categories';
import { Sparkle, WhatsAppIcon } from './Icons';

const SIX_MONTHS = COSTUMES_CATALOG.filter((c) => c.category === 'Introdução Alimentar');

interface Props {
  onShortcut: (costumeName: string) => void;
}

export default function Highlights({ onShortcut }: Props) {
  return (
    <section aria-label="Destaques" className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
      <div className="relative rounded-[2rem] bg-[#fde6dc] p-6 sm:p-8">
        <Sparkle className="absolute top-5 right-6 h-7 w-7" />
        <h2 className="pr-8 text-2xl font-black sm:text-3xl">Especial 6 Meses — Introdução Alimentar</h2>
        <ul className="mt-6 space-y-4">
          {SIX_MONTHS.map((c) => (
            <li key={c.id} className="flex flex-col gap-4 rounded-2xl bg-white p-5 sm:flex-row sm:items-center">
              <img
                src={`/images/costumes/${c.id}.webp`}
                alt={c.name}
                loading="lazy"
                decoding="async"
                width={128}
                height={128}
                className="aspect-square w-32 shrink-0 rounded-2xl object-cover"
              />
              <div>
              <h3 className="text-lg font-extrabold">{c.name}</h3>
              <p className="mt-1 text-ink/75">{c.notes}</p>
              <a
                href={buildWhatsAppUrl(c.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2 font-bold text-ink hover:bg-[#1fbe5b]"
              >
                <WhatsAppIcon />
                <span>
                  Alugar <span className="sr-only">{c.name} </span>pelo WhatsApp
                </span>
              </a>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative rounded-[2rem] bg-butter/70 p-6 sm:p-8">
        <Sparkle className="absolute top-5 right-6 h-7 w-7" />
        <h2 className="pr-8 text-2xl font-black sm:text-3xl">Datas Comemorativas</h2>
        <p className="mt-2 text-ink/80">Escolha a data e veja a fantasia no catálogo.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {DATE_SHORTCUTS.map((s) => {
            const costume = COSTUMES_CATALOG.find((c) => c.id === s.id)!;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onShortcut(costume.name)}
                className="rounded-full border-2 border-ink bg-white px-5 py-2 font-bold hover:bg-ink hover:text-white"
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
