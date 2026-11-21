import type { CostumeItem } from '../data/catalog';
import type { CategoryFilter } from './filterCostumes';

export const CATEGORY_OPTIONS: { label: string; value: CategoryFilter }[] = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Personagens & Desenhos', value: 'Personagens & Desenhos' },
  { label: 'Super-Heróis', value: 'Super-Heróis' },
  { label: 'Animais & Safari', value: 'Animais & Safari' },
  { label: 'Profissões & Clássicos', value: 'Profissões & Clássicos' },
  { label: 'Mesversário 6 Meses / Introdução Alimentar', value: 'Introdução Alimentar' },
  { label: 'Datas Comemorativas', value: 'Datas Comemorativas' },
];

export const DATE_SHORTCUTS: { label: string; id: CostumeItem['id'] }[] = [
  { label: 'Carnaval', id: 'carnaval' },
  { label: 'Carnaval (Bell Marques)', id: 'carnaval-bell' },
  { label: 'Páscoa', id: 'pascoa' },
  { label: 'São João / Caipira', id: 'sao-joao-caipira' },
  { label: 'São João / Cangaceiro', id: 'sao-joao-cangaceiro' },
  { label: 'Halloween', id: 'halloween' },
  { label: 'Natal', id: 'natal' },
];

export function formatResultCount(n: number): string {
  return n === 1 ? '1 fantasia encontrada' : `${n} fantasias encontradas`;
}
