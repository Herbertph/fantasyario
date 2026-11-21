import { describe, expect, it } from 'vitest';
import { COSTUMES_CATALOG } from '../data/catalog';
import { CATEGORY_OPTIONS, DATE_SHORTCUTS, formatResultCount } from './categories';

describe('formatResultCount', () => {
  it('AC-17: uses singular for 1 and plural otherwise', () => {
    expect(formatResultCount(1)).toBe('1 fantasia encontrada');
    expect(formatResultCount(0)).toBe('0 fantasias encontradas');
    expect(formatResultCount(54)).toBe('54 fantasias encontradas');
  });
});

describe('CATEGORY_OPTIONS', () => {
  it('maps the 6-month label to the Introdução Alimentar category', () => {
    expect(CATEGORY_OPTIONS.map((o) => o.label)).toEqual([
      'Todos',
      'Personagens & Desenhos',
      'Super-Heróis',
      'Animais & Safari',
      'Profissões & Clássicos',
      'Mesversário 6 Meses / Introdução Alimentar',
      'Datas Comemorativas',
    ]);
    expect(CATEGORY_OPTIONS.find((o) => o.label.startsWith('Mesversário'))?.value).toBe('Introdução Alimentar');
  });
});

describe('DATE_SHORTCUTS', () => {
  it('lists the 7 shortcuts in order, each pointing at a catalog id', () => {
    expect(DATE_SHORTCUTS.map((s) => s.label)).toEqual([
      'Carnaval',
      'Carnaval (Bell Marques)',
      'Páscoa',
      'São João / Caipira',
      'São João / Cangaceiro',
      'Halloween',
      'Natal',
    ]);
    const ids = new Set(COSTUMES_CATALOG.map((c) => c.id));
    for (const s of DATE_SHORTCUTS) expect(ids.has(s.id)).toBe(true);
  });
});
