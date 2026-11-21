import { useState } from 'react';
import { SIZE_GUIDE, buildWhatsAppUrl, type BabySize, type CostumeItem } from '../data/catalog';
import { WhatsAppIcon } from './Icons';

const TILE_COLORS: Record<CostumeItem['category'], string> = {
  'Personagens & Desenhos': '#e4dcfb',
  'Super-Heróis': '#cfe0fb',
  'Animais & Safari': '#fbe3a0',
  'Profissões & Clássicos': '#cdeee0',
  'Introdução Alimentar': '#fdd5c7',
  'Datas Comemorativas': '#fbd3e3',
};

/** Pastel tile with doodle stars, used until a real photo exists in public/images/costumes (spec A-1). */
function placeholderFor(category: CostumeItem['category']): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 200"><rect width="320" height="200" fill="${TILE_COLORS[category]}"/><g fill="none" stroke="#1a1a1a" stroke-width="2.5" stroke-linejoin="round"><path d="M160 60c2 18 10 26 28 28-18 2-26 10-28 28-2-18-10-26-28-28 18-2 26-10 28-28z"/><path d="M90 40c1 9 5 13 14 14-9 1-13 5-14 14-1-9-5-13-14-14 9-1 13-5 14-14zM236 120c1 9 5 13 14 14-9 1-13 5-14 14-1-9-5-13-14-14 9-1 13-5 14-14z"/></g></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface Props {
  costume: CostumeItem;
  selectedSize: BabySize | null;
}

export default function CostumeCard({ costume, selectedSize }: Props) {
  const [src, setSrc] = useState(`/images/costumes/${costume.id}.webp`);
  const sizes = SIZE_GUIDE.map((s) => s.size).filter((s) => costume.sizes.includes(s));

  return (
    <article className="flex flex-col rounded-3xl bg-white p-3 shadow-[0_6px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
      <img
        src={src}
        alt={costume.name}
        loading="lazy"
        decoding="async"
        width={320}
        height={320}
        onError={() => setSrc(placeholderFor(costume.category))}
        style={{ backgroundColor: TILE_COLORS[costume.category] }}
        className="aspect-square w-full rounded-2xl object-cover object-center"
      />
      <div className="flex flex-1 flex-col items-center px-2 pt-4 pb-2 text-center">
        <h3 className="text-xl leading-tight font-extrabold">{costume.name}</h3>
        <ul aria-label="Tamanhos disponíveis" className="mt-3 flex flex-wrap justify-center gap-1.5">
          {sizes.map((s) => {
            const active = s === selectedSize;
            return (
              <li
                key={s}
                data-active={active ? 'true' : undefined}
                className={`rounded-full px-2.5 py-0.5 text-sm ${
                  active ? 'bg-ink font-extrabold text-white ring-2 ring-ink ring-offset-2' : 'bg-lavender/70 font-semibold'
                }`}
              >
                {s}
              </li>
            );
          })}
        </ul>
        {costume.notes && <p className="mt-3 text-sm text-ink/75">{costume.notes}</p>}
        <div className="flex-1" />
        <a
          href={buildWhatsAppUrl(costume.name, selectedSize)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-3 py-2.5 text-[0.95rem] font-bold whitespace-nowrap text-ink transition-colors hover:bg-[#1fbe5b]"
        >
          <WhatsAppIcon />
          <span>
            Alugar <span className="sr-only">{costume.name} </span>pelo WhatsApp
          </span>
        </a>
      </div>
    </article>
  );
}
