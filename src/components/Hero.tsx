import { scrollToSection } from '../lib/scroll';
import { CloudDoodle, Sparkle } from './Icons';

const HERO_PHOTOS = [
  { id: 'astronauta-nasa', name: 'Astronauta NASA', className: 'left-1/2 top-0 w-[58%] -translate-x-1/2 z-10' },
  { id: 'leaozinho', name: 'Leãozinho', className: 'left-0 bottom-0 w-[44%] -rotate-3' },
  { id: 'pequeno-principe', name: 'Pequeno Príncipe', className: 'right-0 bottom-[6%] w-[44%] rotate-3' },
];

function HeroPhotos() {
  return (
    <div className="relative aspect-[10/9] w-full max-w-md">
      {HERO_PHOTOS.map((p, i) => (
        <img
          key={p.id}
          src={`/images/costumes/${p.id}.webp`}
          alt={`Bebê com fantasia de ${p.name}`}
          width={320}
          height={320}
          loading="eager"
          {...(i === 0 && { fetchpriority: 'high' })}
          className={`absolute aspect-square rounded-full border-4 border-white object-cover shadow-xl shadow-black/15 ${p.className}`}
        />
      ))}
    </div>
  );
}

export default function Hero() {
  return (
    <section id="topo" className="relative isolate overflow-hidden">
      <svg aria-hidden="true" viewBox="0 0 1440 640" preserveAspectRatio="none" className="absolute inset-0 -z-10 h-full w-full">
        <rect width="1440" height="640" fill="#cdeee0" />
        <path d="M0 0h1440v360c-260 60-420-40-700 30S180 520 0 470z" fill="#e4dcfb" />
        <path d="M0 0h620c-120 60-300 40-420 110C120 150 60 120 0 160z" fill="#d6c8f7" />
        <path d="M900 640c80-120 260-170 540-150v150z" fill="#fbe3a0" />
        <path d="M1140 330c120-30 220 0 300-30v190c-110-20-220 10-300-40z" fill="#f9a58c" />
        <path d="M0 600c240-50 480 10 760-10s480-40 680-10v60H0z" fill="#fff" />
      </svg>

      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 md:grid-cols-2 md:pt-20 md:pb-28">
        <div>
          <h1 className="text-4xl leading-[1.05] font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Aluguel de Fantasias Infantis e Mesversário
          </h1>
          <p className="mt-5 max-w-md text-lg text-ink/85 sm:text-xl">
            Organize o mesversário do seu filho agora e fique tranquila o resto do ano!
          </p>
          <button
            type="button"
            onClick={() => scrollToSection('catalogo')}
            className="mt-8 rounded-full bg-cta px-8 py-3.5 text-lg font-bold text-white shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5"
          >
            Ver Catálogo
          </button>
        </div>

        <div className="relative flex justify-center px-6">
          <Sparkle className="absolute top-0 left-4 h-8 w-8" />
          <Sparkle className="absolute top-1/3 left-0 h-5 w-5" />
          <Sparkle className="absolute top-2 right-6 h-10 w-10" />
          <Sparkle className="absolute right-0 bottom-1/3 h-6 w-6" />
          <CloudDoodle className="absolute right-2 -bottom-2 w-20" />
          <CloudDoodle className="absolute top-1/2 -left-2 w-16" />
          <HeroPhotos />
        </div>
      </div>
    </section>
  );
}
