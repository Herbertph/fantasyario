# Spec: Fantasyário landing page (MVP)

Branch: `feature/landing-page-mvp`
Visual reference: `docs/design/reference-layout.jpg` (layout, palette and hierarchy only; the brand name shown in the image, "Fantasias & Magia", is a placeholder and must be replaced by **Fantasyário**).

## Context

Fantasyário rents children's costumes and "mesversário" kits (monthly birthday photo sessions for babies) in Fortaleza, Brazil. Customers are mostly mothers and fathers planning a baby's monthly celebration or a themed party. Today, bookings happen on WhatsApp. The goal of this page is conversion: help a parent find the right size for their baby's age, browse costumes that exist in that size, and open a WhatsApp chat with the store already containing the costume and size.

All visible text on the page is in Brazilian Portuguese (the copy below is the product copy, quoted verbatim). Code, comments and tests are in English.

## Scope

### In scope

- A single responsive, static landing page with these sections, in order: navbar, hero, size guide, catalog, special highlights (6 months / commemorative dates), how it works, footer.
- Client-side catalog filtering by size, category and name search, using the catalog data in this spec.
- WhatsApp deep links (`https://wa.me/...`) with a prefilled message.
- Project scaffolding: stack, unit tests, end-to-end tests, CI on GitHub Actions, and `CLAUDE.md` filled in.

### Out of scope

- Prices (the reference image shows "A partir de R$", but there is no price data; do not show prices).
- Real costume photos (see Assumptions: placeholders are used until Herbert provides photos).
- Booking calendar, availability checks, cart, payment, login, admin panel or any backend.
- Analytics, cookie banners, SEO beyond basic meta tags.
- Deployment/hosting (a follow-up feature; CI only builds and tests).

## Functional requirements

### Global

- **FR-1** The page uses the brand name "Fantasyário" everywhere (navbar logo, footer, `<title>`, WhatsApp messages). The string "Fantasias & Magia" never appears.
- **FR-2** `<html lang="pt-BR">`, `<title>Fantasyário | Aluguel de Fantasias Infantis e Mesversário</title>`, and a meta description.
- **FR-3** Design system: white background (`#FFFFFF`); text `#1A1A1A`; primary CTA solid `#1E1E1E` with white text, pill shaped; WhatsApp actions green (`#25D366`), filled in cards and outlined pill in the navbar; pastel organic waves (lavender, mint, light yellow, coral details) in the hero; black line-art doodles (stars, sparkles, clouds) around the logo and hero image; rounded geometric font (recommended: Nunito or Plus Jakarta Sans, self-hosted or via `@fontsource`) with Bold/ExtraBold headings.
- **FR-4** Responsive from 360 px to 1920 px wide with no horizontal scrolling. On narrow screens the hero stacks (copy above image) and catalog cards flow into 1 column (mobile), 2 (tablet) and 3–4 (desktop).
- **FR-5** All WhatsApp links point to `https://wa.me/5585992006868` with a `text` query parameter, open in a new tab, and have `rel="noopener noreferrer"`.
- **FR-6** In-page links (`#catalogo`, `#tamanhos`, `#como-funciona`) scroll smoothly; smooth scrolling is disabled when the user prefers reduced motion.

### A. Navbar

- **FR-7** Left: logo "Fantasyário" with a magic wand / stars icon. Center: links "Catálogo" (`#catalogo`), "Tabela de Tamanhos" (`#tamanhos`), "Como Funciona" (`#como-funciona`). Right: outlined pill button "Reservar pelo WhatsApp" with the WhatsApp icon, using the general message (FR-21).
- **FR-8** Below 768 px, the center links collapse into a menu button (accessible name "Abrir menu", `aria-expanded`). Choosing a link closes the menu. The WhatsApp button stays visible (it may shrink to icon + short label, but keeps the accessible name "Reservar pelo WhatsApp").

### B. Hero

- **FR-9** Left column: H1 "Aluguel de Fantasias Infantis e Mesversário"; subtitle "Organize o mesversário do seu filho agora e fique tranquila o resto do ano!"; primary button "Ver Catálogo" that scrolls to `#catalogo`.
- **FR-10** Right column: an image composition of children in costumes surrounded by line-art doodles, with meaningful `alt` text in Portuguese. Background: pastel organic waves. The page has exactly one H1.

### C. Size guide (`#tamanhos`)

- **FR-11** Heading plus the sentence "Antes de prosseguir, identifique qual tamanho é o mais adequado para o seu baby". Six selectable options from `SIZE_GUIDE`, each showing size and age range: PP – RN, P – 1 a 3 meses, M1 – 3 a 6 meses, M2 – 6 a 9 meses, G – 9 a 12 meses, GG – 1 a 4 anos.
- **FR-12** Choosing a size in the guide sets the catalog size filter to that size and scrolls to `#catalogo`. The guide shows which size is currently selected (`aria-pressed="true"`), staying in sync with the catalog size filter. Choosing the already-selected size again keeps it selected (no toggle).

### D. Catalog (`#catalogo`)

- **FR-13** Size filter: "Todos", "PP", "P", "M1", "M2", "G", "GG" (default "Todos"). Exactly one is active (`aria-pressed`).
- **FR-14** Category filter: "Todos" (default), "Personagens & Desenhos", "Super-Heróis", "Animais & Safari", "Profissões & Clássicos", "Mesversário 6 Meses / Introdução Alimentar", "Datas Comemorativas". The label "Mesversário 6 Meses / Introdução Alimentar" maps to data category `Introdução Alimentar`; all other labels equal their data category.
- **FR-15** Search field with visible or accessible label "Buscar fantasia". Matching is a substring match on the costume name, case-insensitive and accent-insensitive ("mario" finds "Mário", "PASCOA" finds "Páscoa (Coelhinho)"), ignoring leading/trailing spaces. An empty or whitespace-only query matches everything. Results update while typing.
- **FR-16** Filters combine with AND: a costume is shown only if it has the selected size (when not "Todos"), belongs to the selected category (when not "Todos") and matches the query. Order is the order of `COSTUMES_CATALOG`.
- **FR-17** A results count is shown and announced to screen readers (`aria-live="polite"`), e.g. "54 fantasias encontradas", "1 fantasia encontrada" (singular when 1).
- **FR-18** Each card shows: image (rounded frame, placeholder allowed, `alt` = costume name), costume name as a heading, one badge per available size in the order PP, P, M1, M2, G, GG, the `notes` text when present, and a filled green button "Alugar pelo WhatsApp" whose accessible name includes the costume name (e.g. `aria-label="Alugar Batman pelo WhatsApp"`). When a size filter is active, that size's badge is visually highlighted.
- **FR-19** Card WhatsApp message: built with `buildWhatsAppUrl(costume.name, selectedSize)` where `selectedSize` is the active size filter, or `null` when "Todos".
- **FR-20** Empty state: when no costume matches, show "Nenhuma fantasia encontrada com esses filtros.", a button "Limpar filtros" (resets size and category to "Todos" and clears the search) and a WhatsApp link using the general message ("Fale com a gente no WhatsApp").

### WhatsApp messages

- **FR-21** General message (navbar, footer, empty state): `Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.`
- **FR-22** Costume message: `Olá! Gostaria de verificar a disponibilidade da fantasia *<name>* no tamanho <size> da Fantasyário.` When there is no size: `Olá! Gostaria de verificar a disponibilidade da fantasia *<name>* da Fantasyário.` The text is URL-encoded with `encodeURIComponent`.

### E. Special highlights

- **FR-23** "Especial 6 Meses — Introdução Alimentar" block highlighting the two `Introdução Alimentar` costumes (Mestre Cuca / Chef and Frutinhas) with their notes and a "Alugar pelo WhatsApp" button each (message without size).
- **FR-24** "Datas Comemorativas" block with shortcut buttons, in this order, mapped to catalog ids: Carnaval → `carnaval`, Carnaval (Bell Marques) → `carnaval-bell`, Páscoa → `pascoa`, São João / Caipira → `sao-joao-caipira`, São João / Cangaceiro → `sao-joao-cangaceiro`, Halloween → `halloween`, Natal → `natal`.
- **FR-25** Choosing a shortcut sets the catalog to: category "Datas Comemorativas", size "Todos", search = that costume's full `name`; then scrolls to `#catalogo`. (Because search is a substring match, "Carnaval" also shows "Carnaval / Bell Marques"; this is accepted.)

### F. How it works (`#como-funciona`)

- **FR-26** Four numbered steps in pastel cards, in this order:
  1. **Identifique o tamanho** do seu baby na tabela (PP ao GG).
  2. **Escolha o tema** no catálogo de fantasias.
  3. **Reserve pelo WhatsApp** confirmando a data da festa ou mesversário.
  4. **Celebre sem preocupação** — peças higienizadas e prontas para vestir.

### G. Footer

- **FR-27** Brand "Fantasyário", the sentence "Organize o mesversário do seu filho agora e fique tranquila o resto do ano!", a WhatsApp button showing "(85) 99200-6868" (general message), and an Instagram link (accessible name "Instagram da Fantasyário") pointing to `INSTAGRAM_URL`, opening in a new tab.

## Acceptance criteria

### Page and navigation

- **AC-1** Given the page loads, then the title is "Fantasyário | Aluguel de Fantasias Infantis e Mesversário", `lang` is `pt-BR`, there is exactly one H1 with "Aluguel de Fantasias Infantis e Mesversário", and the text "Fantasias & Magia" appears nowhere.
- **AC-2** Given the desktop navbar, when the user clicks "Catálogo", "Tabela de Tamanhos" or "Como Funciona", then the matching section (`#catalogo`, `#tamanhos`, `#como-funciona`) scrolls into view.
- **AC-3** Given the hero, when the user clicks "Ver Catálogo", then the catalog section is in view.
- **AC-4** Given a 360 px wide viewport, then the page has no horizontal scroll (`scrollWidth <= clientWidth`), the "Abrir menu" button is visible, and "Reservar pelo WhatsApp" is visible.
- **AC-5** Given a 360 px viewport, when the user opens the menu and picks "Como Funciona", then that section is in view and the menu is closed (`aria-expanded="false"`).

### WhatsApp

- **AC-6** Given the navbar "Reservar pelo WhatsApp" link and the footer WhatsApp link, then each href starts with `https://wa.me/5585992006868?text=`, decodes to the general message (FR-21), has `target="_blank"` and `rel` containing `noopener`.
- **AC-7** Given size filter "Todos", when the user inspects the "Alugar Batman pelo WhatsApp" link, then its decoded text is `Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* da Fantasyário.`
- **AC-8** Given size filter "M2", when the user inspects the "Alugar Batman pelo WhatsApp" link, then its decoded text is `Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* no tamanho M2 da Fantasyário.`
- **AC-9** (unit) `buildWhatsAppUrl()` with no name returns the general-message URL; with a name containing special characters (`McDonald’s`, `Mário`, `/`, `&`) returns a URL whose `text` decodes exactly to the original message; with `selectedSize` `null` or `undefined` omits the size part.

### Size guide

- **AC-10** Given the size guide, then it shows the sentence from FR-11 and the six sizes with their age ranges exactly as in `SIZE_GUIDE`.
- **AC-11** Given the size guide, when the user picks "G – 9 a 12 meses", then the catalog is in view, the catalog size filter "G" is pressed, the guide option G is pressed, and every visible card has a "G" badge (Batman visible, Super-Homem not visible).
- **AC-12** Given size "G" was chosen in the guide, when the user picks "Todos" in the catalog size filter, then no guide option is pressed and all 54 costumes are shown.

### Catalog filters

- **AC-13** Given the initial state, then "Todos" is pressed in both filters, the search is empty, 54 cards are shown and the count reads "54 fantasias encontradas".
- **AC-14** Given size "PP", then only costumes whose sizes include PP are shown (for example Anjinho and Comandante visible; Marinheiro not visible), and the count matches the number of cards.
- **AC-15** Given category "Super-Heróis", then exactly 4 cards are shown: Os Incríveis, Super-Homem, Batman, Homem de Ferro.
- **AC-16** Given category "Mesversário 6 Meses / Introdução Alimentar", then exactly 2 cards are shown: Mestre Cuca / Chef (Introdução Alimentar) and Frutinhas (Introdução Alimentar), each showing its note.
- **AC-17** Given category "Super-Heróis" and size "P", then exactly 1 card is shown (Homem de Ferro) and the count reads "1 fantasia encontrada".
- **AC-18** Given the search field, when the user types "mario", then the "Mário" card is shown; when the user types "  PASCOA  ", then "Páscoa (Coelhinho)" is shown.
- **AC-19** Given the search field, when the user types only spaces, then all cards for the current filters are shown.
- **AC-20** Given category "Super-Heróis", when the user searches "pikachu", then the empty state is shown with "Nenhuma fantasia encontrada com esses filtros.", the count reads "0 fantasias encontradas", and a general-message WhatsApp link is present.
- **AC-21** Given the empty state, when the user clicks "Limpar filtros", then both filters show "Todos", the search is empty and 54 cards are shown.
- **AC-22** (unit) `filterCostumes()` returns catalog order, applies AND across size, category and query, treats `'Todos'`/`null` as no filter, and is accent- and case-insensitive.

### Cards

- **AC-23** Given the "Leãozinho" card, then it shows the badges PP, M2, G, GG in that order, an image with alt "Leãozinho", and the button "Alugar Leãozinho pelo WhatsApp".
- **AC-24** Given size filter "M2", then the M2 badge on each visible card is visually highlighted (distinguishable by a class or `data-active` attribute, not color alone, e.g. bold/outline).

### Highlights and how it works

- **AC-25** Given the "Especial 6 Meses — Introdução Alimentar" block, then it shows Mestre Cuca / Chef and Frutinhas with their notes and a WhatsApp button each whose decoded message has the costume name and no size.
- **AC-26** Given the "Datas Comemorativas" block, then it shows the 7 shortcuts in the FR-24 order.
- **AC-27** Given any size filter is active, when the user clicks the "Natal" shortcut, then the catalog is in view with category "Datas Comemorativas", size "Todos", search "Natal (Papai Noel)", and exactly 1 card (Natal (Papai Noel)).
- **AC-28** When the user clicks the "Carnaval" shortcut, then exactly 2 cards are shown: Carnaval and Carnaval / Bell Marques.
- **AC-29** Given the "Como Funciona" section, then it shows the 4 steps in the FR-26 order.
- **AC-30** Given the footer, then it shows "Fantasyário", the footer sentence, a WhatsApp link with the text "(85) 99200-6868", and a link named "Instagram da Fantasyário" with `href` equal to `INSTAGRAM_URL` and `target="_blank"`.

### Accessibility

- **AC-31** Every filter button exposes `aria-pressed`; the search input is reachable by `getByLabel('Buscar fantasia')`; all images have `alt`; and an automated axe check (`@axe-core/playwright`) reports no serious or critical violations on desktop and mobile.
- **AC-32** Given the user prefers reduced motion, then CSS `scroll-behavior` is `auto` (no smooth scrolling) and decorative animations, if any, are disabled.

## Catalog data (source of truth)

`src/data/catalog.ts` must contain exactly the data Herbert provided. **One correction**: the brief's `buildWhatsAppUrl` had a broken base URL (markdown artifacts); the correct base is `` `https://wa.me/${WHATSAPP_NUMBER}` ``. Also add `INSTAGRAM_URL`.

```typescript
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
// TODO: confirm with Herbert (see Assumptions A-2)
export const INSTAGRAM_URL = 'https://www.instagram.com/fantasyario/';

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
```

The catalog has 54 costumes. A unit test should guard this data: 54 items, unique ids, every size valid, and the per-category counts (Profissões & Clássicos 13, Animais & Safari 8, Super-Heróis 4, Personagens & Desenhos 20, Introdução Alimentar 2, Datas Comemorativas 7).

## Assumptions (Herbert, please confirm in review)

- **A-1 Photos.** There are no real costume or hero photos yet. The MVP uses tasteful placeholders: per-category pastel illustrated tiles (SVG/CSS with the costume name or a simple icon) for cards, and an illustrated composition (shapes + doodles) for the hero. Images are loaded from `public/images/costumes/<id>.webp` when the file exists, so Herbert can drop real photos in later without code changes; missing files fall back to the placeholder. No stock photos of real children and no copyrighted character art are added.
- **A-2 Instagram.** The Instagram profile URL was not given; `INSTAGRAM_URL` is set to `https://www.instagram.com/fantasyario/` as a placeholder in one constant.
- **A-3 Navigation.** The navbar uses the brief's links (Catálogo, Tabela de Tamanhos, Como Funciona), not "Mesversário" from the reference image.
- **A-4 No prices** are shown (no data).
- **A-5 Subtitle.** The hero subtitle is the brief's copy, not the one in the reference image ("Transforme cada celebração…").
- **A-6 `featured`** is kept in the data but has no visual effect in this MVP.
- **A-7 Size filter "Todos"** means the WhatsApp card message has no size (customer confirms size in the chat).

## Technical notes

### Stack (new project)

- **Vite + React 18 + TypeScript** (the brief already defines `src/data/catalog.ts` in TypeScript, and the filter state is shared across size guide, highlights and catalog).
- **Tailwind CSS** for the design system (brief uses `rounded-full`-style tokens). Define palette tokens (`lavender`, `mint`, `butter`, `coral`, `ink`, `whatsapp`) in the Tailwind theme.
- **Font**: `@fontsource/nunito` (or Plus Jakarta Sans), self-hosted, no Google Fonts call at runtime.
- **Vitest** (+ Testing Library if useful) for unit tests; **Playwright** (Chromium, desktop 1280×800 and mobile 360×740 projects) with **@axe-core/playwright** for end-to-end. Playwright's web server must use its own port (e.g. 5180), never 4545.
- **GitHub Actions** CI: install, typecheck, lint (if configured), unit tests, build, Playwright e2e.
- Scripts: `dev`, `build`, `preview`, `test` (Vitest), `test:e2e` (Playwright), `typecheck`.

### Structure

- `src/data/catalog.ts`: data above (only change: `INSTAGRAM_URL`, fixed base URL).
- `src/lib/filterCostumes.ts`: pure `normalize(text)` (lowercase, NFD + strip diacritics, trim) and `filterCostumes(catalog, { size, category, query })`.
- `src/lib/categories.ts`: category filter options with label → data category mapping (FR-14), date shortcuts (FR-24), and `formatResultCount(n)` (FR-17).
- `src/components/`: `Navbar`, `Hero`, `SizeGuide`, `Catalog` (filters, search, grid, empty state), `CostumeCard`, `Highlights`, `HowItWorks`, `Footer`, `WhatsAppIcon`, doodle SVGs.
- `App.tsx` owns filter state `{ size, category, query }` and passes setters to `SizeGuide`, `Highlights` and `Catalog`.
- Keep all business logic in `src/lib` and `src/data`; components only render.

### Ordered task list

1. Scaffold Vite + React + TS + Tailwind; add Vitest, Playwright (own port), axe; GitHub Actions CI; fill `CLAUDE.md` (stack, commands, structure). Confirm `npm run build`, `npm test`, `npm run test:e2e` run green on an empty app.
2. Add `src/data/catalog.ts` exactly as in this spec + data-guard unit tests (counts, unique ids) and `buildWhatsAppUrl` tests (AC-9).
3. Implement `normalize`, `filterCostumes`, category mapping, shortcuts and `formatResultCount` with unit tests (AC-22, AC-17 wording).
4. Design tokens, font, layout shell: Navbar (with mobile menu) and Footer (AC-1, AC-2, AC-4, AC-5, AC-6, AC-30).
5. Hero with waves, doodles and placeholder composition (AC-3).
6. Catalog: filters, search, cards, count, empty state (AC-7, AC-8, AC-13 to AC-21, AC-23, AC-24).
7. Size guide wired to shared state (AC-10 to AC-12).
8. Highlights (6 months + date shortcuts) and How it works (AC-25 to AC-29).
9. Responsiveness, reduced motion, accessibility pass with axe (AC-4, AC-31, AC-32). Compare against `docs/design/reference-layout.jpg`.
