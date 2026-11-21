# Test cases: landing-page-mvp

Spec: `docs/specs/landing-page-mvp.md`. Branch `feature/landing-page-mvp`, commit `114a2cd`; retested at `3bd819d`.

E2E cases live in `e2e/qa-acceptance.spec.ts` and run in both Playwright projects (desktop 1280x800, mobile 360x740) unless the test skips one project. Unit cases live in `src/lib/acceptance.test.ts`. Each automated test name starts with its TC ID. TC-45 is unused.

## Traceability

| AC / FR | Test cases |
|---|---|
| AC-1 | TC-1 |
| AC-2 | TC-2 |
| AC-3 | TC-3 |
| AC-4 | TC-4 |
| AC-5 | TC-5 |
| AC-6 | TC-6 |
| AC-7 | TC-7 |
| AC-8 | TC-8 |
| AC-9 | TC-9, TC-10, TC-11 |
| AC-10 | TC-12 |
| AC-11 | TC-13 |
| AC-12 | TC-14 |
| AC-13 | TC-15 |
| AC-14 | TC-16 |
| AC-15 | TC-17 |
| AC-16 | TC-18 |
| AC-17 | TC-19, TC-32 |
| AC-18 | TC-20 |
| AC-19 | TC-21 |
| AC-20 | TC-22 |
| AC-21 | TC-23 |
| AC-22 | TC-30, TC-31 |
| AC-23 | TC-24 |
| AC-24 | TC-25 |
| AC-25 | TC-26 |
| AC-26 | TC-27 |
| AC-27 | TC-28 |
| AC-28 | TC-29 |
| AC-29 | TC-33 |
| AC-30 | TC-34 |
| AC-31 | TC-35, TC-36, TC-42 |
| AC-32 | TC-37 |
| FR-4, FR-7 (exploratory) | TC-38, TC-39 |
| FR-5, FR-12, FR-15, FR-17, FR-18, FR-24/25 (exploratory) | TC-46, TC-47, TC-40, TC-41, TC-44, TC-43, TC-48 |

## Page and navigation

### TC-1: Title, lang, single H1 and brand name
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded at `/`
- **Test data:** none
- **Steps:**
  1. Read `<title>`, `html[lang]` and the meta description.
  2. Count H1 elements and read the text.
  3. Search the page HTML for "Fantasias & Magia".
- **Expected result:** title "Fantasyário | Aluguel de Fantasias Infantis e Mesversário", lang `pt-BR`, non-empty meta description, exactly one H1 "Aluguel de Fantasias Infantis e Mesversário", "Fantasias & Magia" absent.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-1 (AC-1): title, lang, single H1, meta description and brand name`
- **Status:** Pass

### TC-2: Desktop navbar links scroll to their sections
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** functional
- **Preconditions:** desktop 1280x800
- **Test data:** links "Como Funciona", "Catálogo", "Tabela de Tamanhos" (out of page order on purpose)
- **Steps:**
  1. Click each navbar link in turn.
  2. After each click, check the matching section.
- **Expected result:** `#como-funciona`, `#catalogo`, `#tamanhos` each in the viewport after its click.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-2 (AC-2): desktop navbar links bring each section into view`
- **Status:** Pass

### TC-3: "Ver Catálogo" scrolls to the catalog
- **Acceptance criterion:** AC-3
- **Priority:** high
- **Type:** functional
- **Preconditions:** page at the top
- **Test data:** none
- **Steps:**
  1. Click "Ver Catálogo".
- **Expected result:** `#catalogo` is in the viewport.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-3 (AC-3): "Ver Catálogo" brings the catalog into view`
- **Status:** Pass

### TC-4: 360 px layout has no horizontal scroll
- **Acceptance criterion:** AC-4
- **Priority:** high
- **Type:** boundary
- **Preconditions:** mobile 360x740
- **Test data:** none
- **Steps:**
  1. Compare `scrollWidth` with `clientWidth`.
  2. Look for "Abrir menu" and "Reservar pelo WhatsApp".
- **Expected result:** `scrollWidth <= clientWidth`; both buttons visible.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-4 (AC-4): 360 px has no horizontal scroll and shows menu and WhatsApp buttons`
- **Status:** Pass

### TC-5: Mobile menu link scrolls and closes the menu
- **Acceptance criterion:** AC-5
- **Priority:** high
- **Type:** functional
- **Preconditions:** mobile 360x740, menu closed
- **Test data:** link "Como Funciona"
- **Steps:**
  1. Click "Abrir menu".
  2. Click "Como Funciona".
- **Expected result:** `aria-expanded` goes false → true → false, `#como-funciona` in the viewport, menu links hidden.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-5 (AC-5): mobile menu link scrolls and closes the menu`
- **Status:** Pass

## WhatsApp

### TC-6: Navbar and footer links use the general message
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** navbar "Reservar pelo WhatsApp", footer "(85) 99200-6868"
- **Steps:**
  1. Read href, target and rel of both links; decode `text`.
- **Expected result:** href starts with `https://wa.me/5585992006868?text=`, decodes to the FR-21 message, `target="_blank"`, rel contains `noopener`.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-6 (AC-6): navbar and footer links use the general message in a new tab`
- **Status:** Pass

### TC-7: Card message without size when size is "Todos"
- **Acceptance criterion:** AC-7
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** card Batman
- **Steps:**
  1. Decode the href of "Alugar Batman pelo WhatsApp".
- **Expected result:** `Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* da Fantasyário.`
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-7 (AC-7): Batman card message has no size when size is "Todos"`
- **Status:** Pass

### TC-8: Card message with size when size is "M2"
- **Acceptance criterion:** AC-8
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** size M2, card Batman
- **Steps:**
  1. Click size "M2".
  2. Decode the Batman link.
- **Expected result:** `Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* no tamanho M2 da Fantasyário.`
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-8 (AC-8): Batman card message has the size when size is "M2"`
- **Status:** Pass

### TC-9: buildWhatsAppUrl without a name returns the general message
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** functional
- **Preconditions:** none (unit)
- **Test data:** `()`, `('')`, `(undefined, 'G')`
- **Steps:**
  1. Call `buildWhatsAppUrl` and decode `text`.
- **Expected result:** the general-message URL each time.
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-9 (AC-9): no name returns the general-message URL`
- **Status:** Pass

### TC-10: Special characters round-trip exactly
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** boundary
- **Preconditions:** none (unit)
- **Test data:** name `McDonald’s Mário / Pão & Cia #1 ?x=1`, size GG
- **Steps:**
  1. Build the URL.
  2. Check the raw query has no unencoded space, `&`, `#`, `/`, `?` or `’`.
  3. Decode it.
- **Expected result:** decoded text equals the original message exactly.
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-10 (AC-9): special characters round-trip exactly and stay encoded`
- **Status:** Pass

### TC-11: null or undefined size omits the size part
- **Acceptance criterion:** AC-9
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** none (unit)
- **Test data:** `('Mário', null)`, `('Mário', undefined)`
- **Steps:**
  1. Build and decode.
- **Expected result:** message without "no tamanho".
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-11 (AC-9): null or undefined size omits the size part`
- **Status:** Pass

### TC-46: Every WhatsApp link is safe and targets the store
- **Acceptance criterion:** FR-5 (exploratory)
- **Priority:** high
- **Type:** security
- **Preconditions:** initial state
- **Test data:** all `a[href*="wa.me"]`
- **Steps:**
  1. Inspect each WhatsApp link on the page.
- **Expected result:** at least 58 links; all start with `https://wa.me/5585992006868?text=`, open in `_blank`, rel has `noopener` and `noreferrer`.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-46 (FR-5): every WhatsApp link targets the store number in a new tab with noopener noreferrer`
- **Status:** Pass

## Size guide

### TC-12: Size guide shows the sentence and six sizes
- **Acceptance criterion:** AC-10
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Read `#tamanhos`.
- **Expected result:** the FR-11 sentence and exactly six options: PP – RN, P – 1 a 3 meses, M1 – 3 a 6 meses, M2 – 6 a 9 meses, G – 9 a 12 meses, GG – 1 a 4 anos.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-12 (AC-10): shows the sentence and the six sizes with age ranges`
- **Status:** Pass

### TC-13: Guide size G filters the catalog
- **Acceptance criterion:** AC-11
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** "G – 9 a 12 meses"
- **Steps:**
  1. Click the guide option.
  2. Inspect the catalog.
  3. Click the option again.
- **Expected result:** catalog in view; catalog G and guide G pressed; every card has a G badge; Batman shown, Super-Homem hidden; the second click keeps G pressed.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-13 (AC-11): picking G in the guide filters the catalog to G`
- **Status:** Pass

### TC-14: Catalog "Todos" clears the guide selection
- **Acceptance criterion:** AC-12
- **Priority:** high
- **Type:** functional
- **Preconditions:** guide G chosen
- **Test data:** none
- **Steps:**
  1. Click size "Todos" in the catalog.
- **Expected result:** no guide option pressed; 54 cards.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-14 (AC-12): picking "Todos" in the catalog clears the guide selection`
- **Status:** Pass

### TC-47: Guide follows a size picked in the catalog
- **Acceptance criterion:** FR-12 (exploratory)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** size M1
- **Steps:**
  1. Click catalog size "M1".
- **Expected result:** guide M1 is the only pressed option.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-47 (FR-12): the guide follows a size picked in the catalog filter`
- **Status:** Pass

## Catalog filters

### TC-15: Initial catalog state
- **Acceptance criterion:** AC-13
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Inspect filters, search, cards and count.
- **Expected result:** only "Todos" pressed in each group, empty search, 54 cards, "54 fantasias encontradas".
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-15 (AC-13): initial state shows all 54 costumes`
- **Status:** Pass

### TC-16: Size PP shows only PP costumes
- **Acceptance criterion:** AC-14
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** size PP
- **Steps:**
  1. Click "PP".
- **Expected result:** only PP pressed; Anjinho and Comandante shown, Marinheiro hidden; every card has a PP badge; the count equals the number of cards.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-16 (AC-14): size PP shows only costumes available in PP`
- **Status:** Pass

### TC-17: Category Super-Heróis
- **Acceptance criterion:** AC-15
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** category Super-Heróis
- **Steps:**
  1. Click the category.
- **Expected result:** exactly Os Incríveis, Super-Homem, Batman, Homem de Ferro.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-17 (AC-15): category Super-Heróis shows exactly 4 heroes`
- **Status:** Pass

### TC-18: 6-month category shows both costumes with notes
- **Acceptance criterion:** AC-16
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** category "Mesversário 6 Meses / Introdução Alimentar"
- **Steps:**
  1. Click the category.
- **Expected result:** Mestre Cuca / Chef and Frutinhas cards, each with its own note.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-18 (AC-16): 6-month category shows the two costumes with notes`
- **Status:** Pass

### TC-19: Size and category combine; singular count
- **Acceptance criterion:** AC-17
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** size P, then category Super-Heróis
- **Steps:**
  1. Click "P".
  2. Click "Super-Heróis".
- **Expected result:** only Homem de Ferro; live region reads "1 fantasia encontrada".
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-19 (AC-17): Super-Heróis and size P combine to 1 result`
- **Status:** Pass

### TC-20: Search ignores accents, case and spaces
- **Acceptance criterion:** AC-18
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** `mario` (typed key by key), `  PASCOA  `
- **Steps:**
  1. Type "mario".
  2. Replace with "  PASCOA  ".
- **Expected result:** Mário shown; then Páscoa (Coelhinho) shown.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-20 (AC-18): search ignores accents, case and surrounding spaces`
- **Status:** Pass

### TC-21: Whitespace-only search keeps current results
- **Acceptance criterion:** AC-19
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** category Animais & Safari
- **Test data:** five spaces
- **Steps:**
  1. Fill the search with spaces.
  2. Switch category to "Todos".
- **Expected result:** 8 cards, then 54.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-21 (AC-19): whitespace-only search keeps all cards for the current filters`
- **Status:** Pass

### TC-22: Empty state on no match
- **Acceptance criterion:** AC-20
- **Priority:** high
- **Type:** negative
- **Preconditions:** category Super-Heróis
- **Test data:** `pikachu`
- **Steps:**
  1. Search "pikachu".
- **Expected result:** 0 cards, "Nenhuma fantasia encontrada com esses filtros.", "0 fantasias encontradas", a general-message WhatsApp link.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-22 (AC-20): no match shows the empty state with a general WhatsApp link`
- **Status:** Pass

### TC-23: "Limpar filtros" resets every filter
- **Acceptance criterion:** AC-21
- **Priority:** high
- **Type:** functional
- **Preconditions:** size GG, category Super-Heróis, search "zzz"
- **Test data:** none
- **Steps:**
  1. Click "Limpar filtros".
- **Expected result:** both filters "Todos", empty search, 54 cards.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-23 (AC-21): "Limpar filtros" resets every filter`
- **Status:** Pass

### TC-30: filterCostumes is an ordered AND of size, category and query
- **Acceptance criterion:** AC-22
- **Priority:** high
- **Type:** functional
- **Preconditions:** none (unit)
- **Test data:** every size (incl. "Todos" and `null`) x every category (incl. "Todos" and `null`) x 8 queries
- **Steps:**
  1. Compare `filterCostumes` with an independent oracle for every combination.
- **Expected result:** identical arrays, in catalog order.
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-30 (AC-22): every size x category x query combination is an ordered AND of the three predicates`
- **Status:** Pass

### TC-31: Accent- and case-insensitive in both directions
- **Acceptance criterion:** AC-22
- **Priority:** medium
- **Type:** functional
- **Preconditions:** none (unit)
- **Test data:** `LEÃOZINHO`, `leaozinho`, `Mário`, `INCRIVEIS`
- **Steps:**
  1. Filter by each query.
- **Expected result:** Leãozinho, Leãozinho, Mário, Os Incríveis.
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-31 (AC-22): accent- and case-insensitive in both directions`
- **Status:** Pass

### TC-32: Count wording for 0, 1 and 2
- **Acceptance criterion:** AC-17
- **Priority:** low
- **Type:** boundary
- **Preconditions:** none (unit)
- **Test data:** 0, 1, 2
- **Steps:**
  1. Call `formatResultCount`.
- **Expected result:** "0 fantasias encontradas", "1 fantasia encontrada", "2 fantasias encontradas".
- **Automated by:** `src/lib/acceptance.test.ts` › `TC-32 (AC-17): result count wording`
- **Status:** Pass

### TC-40: Markup typed in the search is text only
- **Acceptance criterion:** FR-15 (exploratory)
- **Priority:** high
- **Type:** security
- **Preconditions:** initial state
- **Test data:** `<img src=x onerror=alert(1)><b>Batman</b>`
- **Steps:**
  1. Fill the search.
- **Expected result:** empty state; no injected `<b>` or `<img>`; no dialog opens.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-40 (FR-15): markup typed in the search is treated as text`
- **Status:** Pass

### TC-41: Very long query
- **Acceptance criterion:** FR-15 (exploratory)
- **Priority:** low
- **Type:** boundary
- **Preconditions:** initial state
- **Test data:** "fantasia " repeated 300 times
- **Steps:**
  1. Fill the search.
  2. Clear it.
- **Expected result:** empty state with no horizontal scroll; clearing restores 54 cards.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-41 (FR-15): a very long query shows the empty state without breaking the layout`
- **Status:** Pass

### TC-44: Result count is a polite live region that updates
- **Acceptance criterion:** FR-17 (exploratory)
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** initial state
- **Test data:** `batman`
- **Steps:**
  1. Read the live region.
  2. Search "batman".
- **Expected result:** one `aria-live="polite"` region: "54 fantasias encontradas" → "1 fantasia encontrada".
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-44 (FR-17): result count lives in a polite live region and updates`
- **Status:** Pass

## Cards

### TC-24: Leãozinho card content
- **Acceptance criterion:** AC-23
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** card Leãozinho
- **Steps:**
  1. Inspect the card.
- **Expected result:** badges PP, M2, G, GG in that order; image alt "Leãozinho"; button "Alugar Leãozinho pelo WhatsApp".
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-24 (AC-23): Leãozinho card shows ordered badges, alt text and WhatsApp button`
- **Status:** Pass

### TC-25: Active size badge is marked, not by color alone
- **Acceptance criterion:** AC-24
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** size M2
- **Test data:** card Batman
- **Steps:**
  1. Count `data-active` badges.
  2. Compare the font weight of Batman's M2 and M1 badges.
- **Expected result:** one active "M2" badge per card; the active badge is bolder.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-25 (AC-24): active size badge is marked and differs by more than color`
- **Status:** Pass

### TC-43: Card image falls back to the placeholder
- **Acceptance criterion:** FR-18 (exploratory)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** no photos in `public/images/costumes/`
- **Test data:** first card
- **Steps:**
  1. Scroll the first card image into view.
- **Expected result:** the image completes with `naturalWidth > 0` (placeholder shown, no broken image).
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-43 (FR-18): card image falls back to a visible placeholder when no photo exists`
- **Status:** Pass

## Highlights, how it works and footer

### TC-26: 6-month highlight block
- **Acceptance criterion:** AC-25
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** region "Destaques"
- **Steps:**
  1. Inspect the block.
- **Expected result:** both costumes with notes; each WhatsApp message has the costume name and no size.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-26 (AC-25): 6-month block lists both costumes with notes and size-less messages`
- **Status:** Pass

### TC-27: Seven date shortcuts in order
- **Acceptance criterion:** AC-26
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Read the shortcut buttons.
- **Expected result:** Carnaval, Carnaval (Bell Marques), Páscoa, São João / Caipira, São João / Cangaceiro, Halloween, Natal.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-27 (AC-26): seven date shortcuts in spec order`
- **Status:** Pass

### TC-28: Natal shortcut resets the filters
- **Acceptance criterion:** AC-27
- **Priority:** high
- **Type:** functional
- **Preconditions:** size P, search "batman"
- **Test data:** shortcut Natal
- **Steps:**
  1. Click "Natal".
- **Expected result:** catalog in view; Datas Comemorativas and size "Todos" pressed; search "Natal (Papai Noel)"; exactly one card, Natal (Papai Noel).
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-28 (AC-27): Natal shortcut resets size and shows only Natal`
- **Status:** Pass

### TC-29: Carnaval shortcut shows two cards
- **Acceptance criterion:** AC-28
- **Priority:** medium
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** shortcut Carnaval
- **Steps:**
  1. Click "Carnaval".
- **Expected result:** Carnaval and Carnaval / Bell Marques.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-29 (AC-28): Carnaval shortcut shows Carnaval and Carnaval / Bell Marques`
- **Status:** Pass

### TC-48: Each date shortcut finds its own costume
- **Acceptance criterion:** FR-24, FR-25 (exploratory)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** the five shortcuts not covered by TC-28 and TC-29
- **Steps:**
  1. Click each shortcut.
- **Expected result:** the search equals the costume's full name and exactly that card is shown.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-48 (FR-24/FR-25): every shortcut finds its own costume`
- **Status:** Pass

### TC-33: Four steps in order
- **Acceptance criterion:** AC-29
- **Priority:** medium
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Read the `#como-funciona` list items.
- **Expected result:** the four FR-26 steps in order.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-33 (AC-29): four steps in spec order`
- **Status:** Pass

### TC-34: Footer content
- **Acceptance criterion:** AC-30
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Inspect the footer.
- **Expected result:** "Fantasyário" brand, the footer sentence, a "(85) 99200-6868" WhatsApp link, and "Instagram da Fantasyário" with `href` = `INSTAGRAM_URL` and `target="_blank"`.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-34 (AC-30): footer shows brand, sentence, WhatsApp and Instagram`
- **Status:** Pass

## Accessibility and responsiveness

### TC-35: aria-pressed, labelled search, alt text and axe on the initial page
- **Acceptance criterion:** AC-31
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** desktop and mobile
- **Test data:** none
- **Steps:**
  1. Check the 14 filter buttons expose `aria-pressed`.
  2. Check `getByLabel('Buscar fantasia')` and that no `img` lacks `alt`.
  3. Run axe.
- **Expected result:** all checks pass; no serious or critical axe violations.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-35 (AC-31): aria-pressed on filters, labelled search, alt on images, no serious axe violations`
- **Status:** Pass

### TC-36: axe on the empty state and with the mobile menu open
- **Acceptance criterion:** AC-31
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** desktop and mobile
- **Test data:** `nada-encontrado`
- **Steps:**
  1. Search for a term with no match.
  2. On mobile, open the menu.
  3. Run axe.
- **Expected result:** no serious or critical violations.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-36 (AC-31): no serious axe violations in the empty state or with the mobile menu open`
- **Status:** Pass

### TC-42: Size filter usable with the keyboard only
- **Acceptance criterion:** AC-31 (exploratory)
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** initial state
- **Test data:** none
- **Steps:**
  1. Focus "PP" and press Space.
  2. Press Shift+Tab, then Enter.
- **Expected result:** PP pressed; then "Todos" pressed and 54 cards.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-42 (exploratory): size filter works with the keyboard only`
- **Status:** Pass

### TC-37: Reduced motion disables smooth scroll and transitions
- **Acceptance criterion:** AC-32
- **Priority:** medium
- **Type:** accessibility
- **Preconditions:** page loaded
- **Test data:** none
- **Steps:**
  1. Read `scroll-behavior`.
  2. Emulate `prefers-reduced-motion: reduce`.
  3. Read `scroll-behavior` and a filter button's transition duration.
- **Expected result:** `smooth` → `auto`; transition duration `0s`.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-37 (AC-32): reduced motion turns off smooth scrolling and animations`
- **Status:** Pass

### TC-38: No horizontal scroll from 768 to 1920 px
- **Acceptance criterion:** FR-4 (exploratory)
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** desktop project
- **Test data:** widths 768, 800, 1024, 1400, 1920
- **Steps:**
  1. Resize and compare `scrollWidth` with `clientWidth`.
- **Expected result:** no horizontal scroll at any width.
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-38 (FR-4): no horizontal scroll from tablet to wide desktop`
- **Status:** Pass

### TC-39: Navbar links stay on one line from 768 px
- **Acceptance criterion:** FR-4, FR-7 (exploratory)
- **Priority:** low
- **Type:** boundary
- **Preconditions:** desktop project
- **Test data:** widths 768, 800, 900, 1024, 1280
- **Steps:**
  1. Resize.
  2. Count the line boxes of each navbar link.
- **Expected result:** every link renders on one line, inside the header bar (FR-7 layout, reference image).
- **Automated by:** `e2e/qa-acceptance.spec.ts` › `TC-39 (FR-4/FR-7): desktop navbar links stay on one line from 768 px up`
- **Status:** Pass (#1 verified fixed in 3bd819d)

## Not covered

- Visual fidelity to `docs/design/reference-layout.jpg` (palette, waves, doodles, font): checked by eye at 360, 800 and 1400 px, not automated (the project has no visual-regression tooling).
- FR-6 smooth-scroll animation itself: only the CSS `scroll-behavior` value is asserted (TC-37).
- Real photos in `public/images/costumes/`: none exist yet (assumption A-1), so only the placeholder fallback is tested.
- Browsers other than Chromium: the project only configures Chromium.
- Opening WhatsApp and Instagram: external services; only the URLs are verified.
