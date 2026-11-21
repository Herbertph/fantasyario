import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG, SIZE_GUIDE, WHATSAPP_NUMBER, buildWhatsAppUrl } from './catalog';

const GENERAL =
  'Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.';

function decodedText(url: string): string {
  return new URL(url).searchParams.get('text') ?? '';
}

describe('catalog data', () => {
  it('has 54 costumes with unique ids', () => {
    expect(COSTUMES_CATALOG).toHaveLength(54);
    expect(new Set(COSTUMES_CATALOG.map((c) => c.id)).size).toBe(54);
  });

  it('uses only sizes from the size guide', () => {
    const valid = new Set(SIZE_GUIDE.map((s) => s.size));
    for (const c of COSTUMES_CATALOG) {
      expect(c.sizes.length).toBeGreaterThan(0);
      for (const s of c.sizes) expect(valid.has(s)).toBe(true);
    }
  });

  it('has the expected count per category', () => {
    const counts: Record<string, number> = {};
    for (const c of COSTUMES_CATALOG) counts[c.category] = (counts[c.category] ?? 0) + 1;
    expect(counts).toEqual({
      'Profissões & Clássicos': 13,
      'Animais & Safari': 8,
      'Super-Heróis': 4,
      'Personagens & Desenhos': 20,
      'Introdução Alimentar': 2,
      'Datas Comemorativas': 7,
    });
  });
});

describe('buildWhatsAppUrl', () => {
  it('AC-9: returns the general message when no name is given', () => {
    const url = buildWhatsAppUrl();
    expect(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`)).toBe(true);
    expect(decodedText(url)).toBe(GENERAL);
  });

  it.each(['McDonald’s', 'Mário', 'Yoda / Star Wars', 'Fantasias & Cia'])(
    'AC-9: round-trips special characters in %s',
    (name) => {
      expect(decodedText(buildWhatsAppUrl(name, 'M2'))).toBe(
        `Olá! Gostaria de verificar a disponibilidade da fantasia *${name}* no tamanho M2 da Fantasyário.`,
      );
    },
  );

  it.each([null, undefined])('AC-9: omits the size part when size is %s', (size) => {
    expect(decodedText(buildWhatsAppUrl('Batman', size))).toBe(
      'Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* da Fantasyário.',
    );
  });
});
