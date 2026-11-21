import { INSTAGRAM_URL, WHATSAPP_DISPLAY, buildWhatsAppUrl } from '../data/catalog';
import { InstagramIcon, WhatsAppIcon } from './Icons';
import { Logo } from './Navbar';

export default function Footer() {
  return (
    <footer className="bg-cta text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 md:flex-row md:justify-between md:text-left">
        <div>
          <Logo />
          <p className="mt-2 max-w-sm text-white/85">Organize o mesversário do seu filho agora e fique tranquila o resto do ano!</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-2.5 font-bold text-ink"
          >
            <WhatsAppIcon />
            {WHATSAPP_DISPLAY}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram da Fantasyário"
            className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/70 hover:bg-white/10"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>
    </footer>
  );
}
