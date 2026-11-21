export type BabySize = 'PP' | 'P' | 'M1' | 'M2' | 'G' | 'GG';

export interface SizeGuide {
  size: BabySize;
  ageRange: string;
}

export interface CostumeItem {
  id: string;
  name: string;
  category:
    | 'Personagens & Desenhos'
    | 'Super-Heróis'
    | 'Animais & Safari'
    | 'Profissões & Clássicos'
    | 'Introdução Alimentar'
    | 'Datas Comemorativas';
  sizes: BabySize[];
  featured?: boolean;
  notes?: string;
}

export const WHATSAPP_NUMBER = '5585992006868';
export const WHATSAPP_DISPLAY = '(85) 99200-6868';
export const INSTAGRAM_URL = 'https://www.instagram.com/fantasyarioo/';

export const SIZE_GUIDE: SizeGuide[] = [
  { size: 'PP', ageRange: 'RN' },
  { size: 'P', ageRange: '1 a 3 meses' },
  { size: 'M1', ageRange: '3 a 6 meses' },
  { size: 'M2', ageRange: '6 a 9 meses' },
  { size: 'G', ageRange: '9 a 12 meses' },
  { size: 'GG', ageRange: '1 a 4 anos' },
];

export const COSTUMES_CATALOG: CostumeItem[] = [
  // Profissões & Clássicos
  { id: 'anjinho', name: 'Anjinho', category: 'Profissões & Clássicos', sizes: ['PP'] },
  { id: 'cangaceiro', name: 'Cangaceiro', category: 'Profissões & Clássicos', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'astronauta-nasa', name: 'Astronauta NASA', category: 'Profissões & Clássicos', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'], featured: true },
  { id: 'pequeno-principe', name: 'Pequeno Príncipe', category: 'Profissões & Clássicos', sizes: ['P', 'M1', 'M2', 'G', 'GG'], featured: true },
  { id: 'marinheiro', name: 'Marinheiro', category: 'Profissões & Clássicos', sizes: ['P', 'M1', 'M2'] },
  { id: 'fabrica-brinquedos', name: 'Fábrica de Brinquedos', category: 'Profissões & Clássicos', sizes: ['P', 'M1'] },
  { id: 'futebol-americano', name: 'Futebol Americano', category: 'Profissões & Clássicos', sizes: ['M2', 'G', 'GG'] },
  { id: 'padeiro', name: 'Padeiro', category: 'Profissões & Clássicos', sizes: ['PP', 'P', 'M1', 'M2'] },
  { id: 'raio-de-sol', name: 'Raio de Sol', category: 'Profissões & Clássicos', sizes: ['PP', 'P', 'M1', 'M2'] },
  { id: 'comandante', name: 'Comandante', category: 'Profissões & Clássicos', sizes: ['PP'] },
  { id: 'realeza-principe', name: 'Realeza / Príncipe', category: 'Profissões & Clássicos', sizes: ['G', 'GG'] },
  { id: 'magico-circo', name: 'Mágico / Circo', category: 'Profissões & Clássicos', sizes: ['G', 'GG'] },
  { id: 'fazendinha', name: 'Fazendinha', category: 'Profissões & Clássicos', sizes: ['PP', 'P', 'M1', 'M2', 'G'] },

  // Animais & Safari
  { id: 'leaozinho', name: 'Leãozinho', category: 'Animais & Safari', sizes: ['PP', 'M2', 'G', 'GG'], featured: true },
  { id: 'leao', name: 'Leão', category: 'Animais & Safari', sizes: ['PP', 'G', 'GG'] },
  { id: 'guia-safari', name: 'Guia Safari', category: 'Animais & Safari', sizes: ['P', 'M1', 'M2', 'G', 'GG'], featured: true },
  { id: 'safari', name: 'Safari', category: 'Animais & Safari', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'dino-baby', name: 'Dino Baby', category: 'Animais & Safari', sizes: ['P', 'M1', 'M2', 'G'] },
  { id: 'bezerrinho', name: 'Bezerrinho', category: 'Animais & Safari', sizes: ['M1', 'M2', 'G'] },
  { id: 'raposa', name: 'Raposa', category: 'Animais & Safari', sizes: ['M1', 'M2'] },
  { id: 'urso-aviador', name: 'Urso Aviador', category: 'Animais & Safari', sizes: ['PP', 'G'] },

  // Super-Heróis
  { id: 'os-incriveis', name: 'Os Incríveis', category: 'Super-Heróis', sizes: ['M1', 'M2'] },
  { id: 'super-homem', name: 'Super-Homem', category: 'Super-Heróis', sizes: ['M1', 'M2'], featured: true },
  { id: 'batman', name: 'Batman', category: 'Super-Heróis', sizes: ['M1', 'M2', 'G'], featured: true },
  { id: 'homem-de-ferro', name: 'Homem de Ferro', category: 'Super-Heróis', sizes: ['P', 'M1', 'M2', 'G', 'GG'] },

  // Personagens & Desenhos
  { id: 'pikachu', name: 'Pikachu', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },
  { id: 'nemo', name: 'Nemo', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2'] },
  { id: 'stitch', name: 'Stitch', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2', 'G'], featured: true },
  { id: 'monstros-sa', name: 'Monstros S.A.', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2'] },
  { id: 'ursinho-pooh', name: 'Ursinho Pooh', category: 'Personagens & Desenhos', sizes: ['M1', 'M2'] },
  { id: 'harry-potter', name: 'Harry Potter', category: 'Personagens & Desenhos', sizes: ['M1', 'M2'] },
  { id: 'buzz-lightyear', name: 'Buzz Lightyear', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },
  { id: 'pato-donald', name: 'Pato Donald', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },
  { id: 'mickey', name: 'Mickey', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2', 'G'] },
  { id: 'mario', name: 'Mário', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2'] },
  { id: 'chaves', name: 'Chaves', category: 'Personagens & Desenhos', sizes: ['P', 'M1', 'M2'] },
  { id: 'kiko', name: 'Kiko', category: 'Personagens & Desenhos', sizes: ['M1', 'M2'] },
  { id: 'beatles', name: 'Beatles', category: 'Personagens & Desenhos', sizes: ['M1', 'M2'] },
  { id: 'mcdonalds', name: 'McDonald’s', category: 'Personagens & Desenhos', sizes: ['M1', 'M2'] },
  { id: 'woody', name: 'Woody (Toy Story)', category: 'Personagens & Desenhos', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'fera', name: 'Fera', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },
  { id: 'poderoso-chefinho', name: 'Poderoso Chefinho', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G', 'GG'] },
  { id: 'minions', name: 'Minions', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },
  { id: 'aladdin', name: 'Aladdin', category: 'Personagens & Desenhos', sizes: ['G', 'GG'] },
  { id: 'yoda-starwars', name: 'Yoda / Star Wars', category: 'Personagens & Desenhos', sizes: ['M1', 'M2', 'G'] },

  // Introdução Alimentar (6 Meses)
  { id: 'mestre-cuca', name: 'Mestre Cuca / Chef (Introdução Alimentar)', category: 'Introdução Alimentar', sizes: ['M1', 'M2'], notes: 'Tema mais pedido para comemoração dos 6 meses' },
  { id: 'frutinhas', name: 'Frutinhas (Introdução Alimentar)', category: 'Introdução Alimentar', sizes: ['M1', 'M2'], notes: 'Ideal para mesversário de 6 meses' },

  // Datas Comemorativas
  { id: 'carnaval', name: 'Carnaval', category: 'Datas Comemorativas', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'carnaval-bell', name: 'Carnaval / Bell Marques', category: 'Datas Comemorativas', sizes: ['P', 'M1', 'M2', 'G'] },
  { id: 'pascoa', name: 'Páscoa (Coelhinho)', category: 'Datas Comemorativas', sizes: ['PP', 'P', 'M1', 'M2', 'G'] },
  { id: 'sao-joao-caipira', name: 'São João / Caipira', category: 'Datas Comemorativas', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'sao-joao-cangaceiro', name: 'São João / Cangaceiro', category: 'Datas Comemorativas', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'halloween', name: 'Halloween (Abóbora)', category: 'Datas Comemorativas', sizes: ['P', 'M1', 'M2', 'G', 'GG'] },
  { id: 'natal', name: 'Natal (Papai Noel)', category: 'Datas Comemorativas', sizes: ['PP', 'P', 'M1', 'M2', 'G', 'GG'] },
];

export function buildWhatsAppUrl(costumeName?: string, selectedSize?: BabySize | null): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!costumeName) {
    return `${base}?text=${encodeURIComponent('Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.')}`;
  }
  const sizeText = selectedSize ? ` no tamanho ${selectedSize}` : '';
  const message = `Olá! Gostaria de verificar a disponibilidade da fantasia *${costumeName}*${sizeText} da Fantasyário.`;
  return `${base}?text=${encodeURIComponent(message)}`;
}
