import { useState } from 'react';
import { buildWhatsAppUrl } from '../data/catalog';
import { WandIcon, WhatsAppIcon } from './Icons';

const LINKS = [
  { href: '#catalogo', label: 'Catálogo' },
  { href: '#tamanhos', label: 'Tabela de Tamanhos' },
  { href: '#como-funciona', label: 'Como Funciona' },
];

export function Logo() {
  return (
    <span className="flex items-center gap-1.5 text-xl font-black tracking-tight sm:text-2xl">
      <WandIcon className="h-8 w-8 sm:h-9 sm:w-9" />
      Fantasyário
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/95 backdrop-blur">
      <nav aria-label="Principal" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:h-20 sm:px-6">
        <a href="#topo" className="rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4">
          <Logo />
        </a>

        <ul className="hidden items-center gap-5 text-base font-semibold whitespace-nowrap md:flex lg:gap-8 lg:text-lg">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="rounded hover:underline hover:underline-offset-8">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Reservar pelo WhatsApp"
            className="flex items-center gap-2 rounded-full border-2 border-ink py-1 pr-1 pl-3 text-sm font-bold whitespace-nowrap transition-colors hover:bg-ink/5 sm:pl-5 sm:text-base"
          >
            <span className="lg:hidden">Reservar</span>
            <span className="hidden lg:inline">Reservar pelo WhatsApp</span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-whatsapp text-white sm:h-9 sm:w-9">
              <WhatsAppIcon />
            </span>
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid h-11 w-11 place-items-center rounded-full hover:bg-ink/5 md:hidden"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-black/5 bg-white px-4 py-2 text-lg font-semibold md:hidden">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-2 py-3 hover:bg-lavender/60">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
