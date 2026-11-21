import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG, type CostumeItem } from '../data/catalog';
import { filterCostumes, normalize } from './filterCostumes';

const names = (items: CostumeItem[]) => items.map((c) => c.name);

describe('normalize', () => {
  it('lowercases, strips accents and trims', () => {
    expect(normalize('  PÁSCOA  ')).toBe('pascoa');
    expect(normalize('Leãozinho')).toBe('leaozinho');
  });
});

describe('filterCostumes', () => {
  it("AC-22: treats 'Todos', null and empty query as no filter", () => {
    expect(filterCostumes(COSTUMES_CATALOG, { size: 'Todos', category: 'Todos', query: '' })).toEqual(COSTUMES_CATALOG);
    expect(filterCostumes(COSTUMES_CATALOG, { size: null, category: null, query: '   ' })).toEqual(COSTUMES_CATALOG);
  });

  it('AC-22: filters by size', () => {
    const result = filterCostumes(COSTUMES_CATALOG, { size: 'PP', category: 'Todos', query: '' });
    expect(result.every((c) => c.sizes.includes('PP'))).toBe(true);
    expect(names(result)).toContain('Anjinho');
    expect(names(result)).not.toContain('Marinheiro');
  });

  it('AC-22: combines size and category with AND, in catalog order', () => {
    expect(names(filterCostumes(COSTUMES_CATALOG, { size: null, category: 'Super-Heróis', query: '' }))).toEqual([
      'Os Incríveis',
      'Super-Homem',
      'Batman',
      'Homem de Ferro',
    ]);
    expect(names(filterCostumes(COSTUMES_CATALOG, { size: 'P', category: 'Super-Heróis', query: '' }))).toEqual([
      'Homem de Ferro',
    ]);
  });

  it('AC-22: matches the query case- and accent-insensitively', () => {
    expect(names(filterCostumes(COSTUMES_CATALOG, { size: null, category: null, query: 'mario' }))).toEqual(['Mário']);
    expect(names(filterCostumes(COSTUMES_CATALOG, { size: null, category: null, query: '  PASCOA  ' }))).toEqual([
      'Páscoa (Coelhinho)',
    ]);
  });

  it('AC-22: returns nothing when the query does not match the category', () => {
    expect(filterCostumes(COSTUMES_CATALOG, { size: null, category: 'Super-Heróis', query: 'pikachu' })).toEqual([]);
  });
});
