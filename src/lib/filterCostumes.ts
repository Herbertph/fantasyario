import type { BabySize, CostumeItem } from '../data/catalog';

export type SizeFilter = BabySize | 'Todos' | null;
export type CategoryFilter = CostumeItem['category'] | 'Todos' | null;

export interface CostumeFilters {
  size: SizeFilter;
  category: CategoryFilter;
  query: string;
}

export function normalize(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

export function filterCostumes(catalog: CostumeItem[], { size, category, query }: CostumeFilters): CostumeItem[] {
  const q = normalize(query);
  return catalog.filter(
    (c) =>
      (!size || size === 'Todos' || c.sizes.includes(size)) &&
      (!category || category === 'Todos' || c.category === category) &&
      normalize(c.name).includes(q),
  );
}
