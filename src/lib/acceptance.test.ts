import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG, SIZE_GUIDE, buildWhatsAppUrl, type BabySize, type CostumeItem } from '../data/catalog';
import { formatResultCount } from './categories';
import { filterCostumes, normalize, type CostumeFilters } from './filterCostumes';

const GENERAL =
  'Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.';
const text = (url: string) => new URL(url).searchParams.get('text');

describe('buildWhatsAppUrl (QA)', () => {
  it('TC-9 (AC-9): no name returns the general-message URL', () => {
    for (const url of [buildWhatsAppUrl(), buildWhatsAppUrl(''), buildWhatsAppUrl(undefined, 'G')]) {
      expect(url.startsWith('https://wa.me/5585992006868?text=')).toBe(true);
      expect(text(url)).toBe(GENERAL);
    }
  });

  it('TC-10 (AC-9): special characters round-trip exactly and stay encoded', () => {
    const name = 'McDonald’s Mário / Pão & Cia #1 ?x=1';
    const url = buildWhatsAppUrl(name, 'GG');
    expect(url.split('?text=')[1]).not.toMatch(/[ &#/?’]/);
    expect(text(url)).toBe(
      `Olá! Gostaria de verificar a disponibilidade da fantasia *${name}* no tamanho GG da Fantasyário.`,
    );
  });

  it('TC-11 (AC-9): null or undefined size omits the size part', () => {
    for (const size of [null, undefined]) {
      expect(text(buildWhatsAppUrl('Mário', size))).toBe(
        'Olá! Gostaria de verificar a disponibilidade da fantasia *Mário* da Fantasyário.',
      );
    }
  });
});

describe('filterCostumes (QA)', () => {
  const sizes: (BabySize | 'Todos' | null)[] = ['Todos', null, ...SIZE_GUIDE.map((s) => s.size)];
  const categories: CostumeFilters['category'][] = ['Todos', null, ...new Set(COSTUMES_CATALOG.map((c) => c.category))];
  const queries = ['', '  ', 'a', 'MARIO', 'são', 'sao', ' natal ', 'xyz'];

  it('TC-30 (AC-22): every size x category x query combination is an ordered AND of the three predicates', () => {
    for (const size of sizes)
      for (const category of categories)
        for (const query of queries) {
          const expected = COSTUMES_CATALOG.filter(
            (c: CostumeItem) =>
              (!size || size === 'Todos' || c.sizes.includes(size)) &&
              (!category || category === 'Todos' || c.category === category) &&
              normalize(c.name).includes(normalize(query)),
          );
          expect(filterCostumes(COSTUMES_CATALOG, { size, category, query })).toEqual(expected);
        }
  });

  it('TC-31 (AC-22): accent- and case-insensitive in both directions', () => {
    const names = (q: string) => filterCostumes(COSTUMES_CATALOG, { size: null, category: null, query: q }).map((c) => c.name);
    expect(names('LEÃOZINHO')).toEqual(['Leãozinho']);
    expect(names('leaozinho')).toEqual(['Leãozinho']);
    expect(names('Mário')).toEqual(['Mário']);
    expect(names('INCRIVEIS')).toEqual(['Os Incríveis']);
  });

  it('TC-32 (AC-17): result count wording', () => {
    expect(formatResultCount(0)).toBe('0 fantasias encontradas');
    expect(formatResultCount(1)).toBe('1 fantasia encontrada');
    expect(formatResultCount(2)).toBe('2 fantasias encontradas');
  });
});
