import { scrollToSection } from '../lib/scroll';
import { CloudDoodle, Sparkle } from './Icons';

/** Illustrated placeholder until real photos exist (spec assumption A-1). */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 420 360"
      role="img"
      aria-label="Ilustração de crianças fantasiadas de super-herói, princesa e leãozinho, cercadas de estrelas"
      className="h-auto w-full max-w-md"
    >
      {/* hero kid with cape */}
      <path d="M70 330c-10-70 10-120 55-135l40 10c40 20 50 70 40 125z" fill="#e74c3c" stroke="#1a1a1a" strokeWidth="3" />
      <rect x="100" y="200" width="80" height="120" rx="30" fill="#3b6fd8" stroke="#1a1a1a" strokeWidth="3" />
      <path d="m140 230 7 15 16 2-12 11 3 16-14-8-14 8 3-16-12-11 16-2z" fill="#fbd25a" stroke="#1a1a1a" strokeWidth="2" />
      <circle cx="140" cy="160" r="42" fill="#f6c9a8" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M103 150h74v18h-74z" fill="#3b6fd8" stroke="#1a1a1a" strokeWidth="3" rx="8" />
      <circle cx="125" cy="159" r="5" fill="#1a1a1a" />
      <circle cx="155" cy="159" r="5" fill="#1a1a1a" />
      <path d="M126 180q14 12 28 0" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      {/* princess */}
      <path d="M210 330l25-110h50l25 110z" fill="#f7b6cf" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M200 205c-35-30-30-70 0-60M320 205c35-30 30-70 0-60" fill="#fde2ec" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="260" cy="170" r="40" fill="#e8b48f" stroke="#1a1a1a" strokeWidth="3" />
      <path d="M235 128l10-22 15 16 15-16 10 22z" fill="#fbd25a" stroke="#1a1a1a" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="246" cy="170" r="5" fill="#1a1a1a" />
      <circle cx="274" cy="170" r="5" fill="#1a1a1a" />
      <path d="M248 188q12 10 24 0" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      {/* lion baby */}
      <circle cx="360" cy="260" r="48" fill="#f3a93b" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="360" cy="262" r="30" fill="#fbd9a8" stroke="#1a1a1a" strokeWidth="3" />
      <circle cx="350" cy="256" r="4" fill="#1a1a1a" />
      <circle cx="370" cy="256" r="4" fill="#1a1a1a" />
      <path d="M352 272q8 7 16 0" fill="none" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round" />
      <rect x="325" y="300" width="70" height="40" rx="20" fill="#f3a93b" stroke="#1a1a1a" strokeWidth="3" />
    </svg>
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
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
