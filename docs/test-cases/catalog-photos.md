# Test cases: catalog-photos

Spec: `docs/specs/catalog-photos.md`. Branch `feature/catalog-photos`, commit `c6df577`.

E2E cases live in `e2e/qa-catalog-photos.spec.ts` and run in both Playwright projects (desktop 1280x800, mobile 360x740) unless the test skips one project. Unit cases live in `src/data/photos.acceptance.test.ts`. Each automated test name starts with its TC ID. AC-9's regression part is covered by re-running the whole `landing-page-mvp` suite (`e2e/qa-acceptance.spec.ts`, `e2e/landing.spec.ts`).

## Traceability

| AC / FR | Test cases |
|---|---|
| AC-1 | TC-1 |
| AC-2 | TC-2 |
| AC-3 | TC-3 |
| AC-4 | TC-4 |
| AC-5 | TC-5 |
| AC-6 | TC-6 |
| AC-7 | TC-7, TC-8 |
| AC-8 | TC-10 |
| AC-9 | TC-11, plus the full `landing-page-mvp` suite |
| FR-1 (exploratory) | TC-9 |
| FR-3 (exploratory) | TC-12 |
| FR-6 (exploratory) | TC-13 |

### TC-1: All 54 card photos load from their own WebP
- **Acceptance criterion:** AC-1
- **Priority:** high
- **Type:** functional
- **Preconditions:** catalog with no filters
- **Test data:** all 54 cards
- **Steps:**
  1. Scroll through the whole page so every lazy image loads.
  2. For each card, read the image `src`, `complete` and `naturalWidth`.
- **Expected result:** 54 cards; every image `src` ends in `/images/costumes/<id>.webp`, is loaded (`naturalWidth > 0`) and is not the `data:` placeholder.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-1 (AC-1): all 54 card photos load from their own WebP file, none is a placeholder`
- **Status:** Pass

### TC-2: Batman photo is named, square, lazy and sized
- **Acceptance criterion:** AC-2
- **Priority:** high
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** card Batman
- **Steps:**
  1. Read the attributes of the Batman image.
  2. Scroll it into view, wait for it to load and measure its box.
- **Expected result:** `alt="Batman"`, `src` ends in `batman.webp`, `loading="lazy"`, `decoding="async"`, equal numeric `width`/`height` attributes, rendered box square within 1 px.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-2 (AC-2): Batman photo is named, square, lazy, async and has explicit size`
- **Status:** Pass

### TC-3: A blocked photo falls back to the placeholder; the card still works
- **Acceptance criterion:** AC-3
- **Priority:** high
- **Type:** negative
- **Preconditions:** the request for `batman.webp` is aborted by Playwright
- **Test data:** category Super-Heróis, size G
- **Steps:**
  1. Reload with the request blocked and pick Super-Heróis.
  2. Check the Batman image and badges.
  3. Pick size G and decode the Batman WhatsApp link.
  4. Check another card's image.
- **Expected result:** Batman shows the loaded `data:image/svg+xml` placeholder, badges M1, M2, G, WhatsApp message `... *Batman* no tamanho G da Fantasyário.`; Homem de Ferro still shows its photo.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-3 (AC-3): a blocked photo falls back to the placeholder and the card still works`
- **Status:** Pass

### TC-4: Desktop hero shows three loaded photos
- **Acceptance criterion:** AC-4
- **Priority:** high
- **Type:** functional
- **Preconditions:** desktop 1280x800
- **Test data:** alts "Bebê com fantasia de Astronauta NASA", "… de Leãozinho", "… de Pequeno Príncipe"
- **Steps:**
  1. Find each hero image by its alt.
  2. Check viewport, `src`, `loading`, `fetchpriority` (first one) and load state.
  3. Count hero images and H1 elements.
- **Expected result:** exactly 3 hero images, in the viewport, loaded, from the FR-5 ids, `loading="eager"`, the first with `fetchpriority="high"`; one H1.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-4 (AC-4): desktop hero shows the three loaded photos, eager, first with high priority; one H1`
- **Status:** Pass

### TC-5: Mobile hero photos below the copy, no horizontal scroll
- **Acceptance criterion:** AC-5
- **Priority:** high
- **Type:** boundary
- **Preconditions:** mobile 360x740
- **Test data:** the three hero alts
- **Steps:**
  1. Measure the H1, the "Ver Catálogo" button and each hero photo.
  2. Compare `scrollWidth` and `clientWidth`.
- **Expected result:** every photo starts below the H1 and the CTA; at least 2 photos lie fully inside the 360 px width; no horizontal scroll.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-5 (AC-5): at 360 px the photos sit below the H1 and CTA, inside the viewport, no horizontal scroll`
- **Status:** Pass

### TC-6: 6-month cards show their own photos
- **Acceptance criterion:** AC-6
- **Priority:** high
- **Type:** functional
- **Preconditions:** page loaded
- **Test data:** Mestre Cuca / Chef, Frutinhas
- **Steps:**
  1. Find each image in the "Destaques" region by the costume name.
  2. Scroll it into view.
- **Expected result:** `src` is `mestre-cuca.webp` / `frutinhas.webp`; `alt` equals the costume name; both loaded.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-6 (AC-6): 6-month cards show their own loaded photos`
- **Status:** Pass

### TC-7: One WebP per id, no orphans, each at most 120 KB
- **Acceptance criterion:** AC-7
- **Priority:** high
- **Type:** functional
- **Preconditions:** none (unit)
- **Test data:** `public/images/costumes/`
- **Steps:**
  1. List the WebP files and compare their names with the catalog ids.
  2. Check each file size.
- **Expected result:** 54 files whose names equal the 54 ids; none over 120 KB (largest: `leao.webp`, 89.6 KB).
- **Automated by:** `src/data/photos.acceptance.test.ts` › `TC-7 (AC-7): one WebP per catalog id, no orphans, each at most 120 KB`
- **Status:** Pass

### TC-8: No source images or stray files in the photo folder
- **Acceptance criterion:** AC-7 (and FR-1 "do not commit the source PNGs")
- **Priority:** medium
- **Type:** negative
- **Preconditions:** none (unit)
- **Test data:** `public/images/costumes/`
- **Steps:**
  1. List files that are not `.webp` or `.gitkeep`.
- **Expected result:** none. (Also checked by hand: `git ls-files` has no costume PNG/JPG.)
- **Automated by:** `src/data/photos.acceptance.test.ts` › `TC-8 (AC-7): no source images or other files sit next to the WebP photos`
- **Status:** Pass

### TC-9: Every photo is a real WebP, square, at most 640 px
- **Acceptance criterion:** FR-1 (exploratory)
- **Priority:** low
- **Type:** boundary
- **Preconditions:** none (unit)
- **Test data:** all 54 WebP files
- **Steps:**
  1. Read format, width and height with `sharp`.
- **Expected result:** format `webp`, width equal to height, at most 640 px.
- **Automated by:** `src/data/photos.acceptance.test.ts` › `TC-9 (FR-1): every photo is a real WebP, square, at most 640 px`
- **Status:** Fail (#3)

### TC-10: Built photo folder is at most 4 MB
- **Acceptance criterion:** AC-8
- **Priority:** high
- **Type:** boundary
- **Preconditions:** `dist/` built (the Playwright web server builds it before the run)
- **Test data:** `dist/images/costumes/`
- **Steps:**
  1. Count the WebP files and sum their sizes.
- **Expected result:** 54 files, total ≤ 4 MB (measured: about 1.8 MB).
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-10 (AC-8): the built photo folder holds 54 WebP files and weighs at most 4 MB`
- **Status:** Pass

### TC-11: No serious axe violations with every photo loaded
- **Acceptance criterion:** AC-9
- **Priority:** high
- **Type:** accessibility
- **Preconditions:** desktop and mobile
- **Test data:** none
- **Steps:**
  1. Scroll through the page so every image loads.
  2. Run axe.
  3. Run the full `landing-page-mvp` e2e suites.
- **Expected result:** no serious or critical violations; every previous acceptance test still passes.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-11 (AC-9): no serious axe violations with every photo loaded`
- **Status:** Pass

### TC-12: Photos follow their costume when filters change
- **Acceptance criterion:** FR-3 (exploratory)
- **Priority:** medium
- **Type:** functional
- **Preconditions:** initial state
- **Test data:** search "a", size GG
- **Steps:**
  1. Apply the filters.
  2. Pair each card's heading with its image `src`.
- **Expected result:** every card has a costume WebP and no two cards share an image (cards do not keep a stale image after re-filtering).
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-12 (FR-3): photos follow their costume when filters change`
- **Status:** Pass

### TC-13: Hero photos cause no horizontal scroll from 768 to 1920 px
- **Acceptance criterion:** FR-6 (exploratory)
- **Priority:** medium
- **Type:** boundary
- **Preconditions:** desktop project
- **Test data:** widths 768, 1024, 1440, 1920
- **Steps:**
  1. Resize and compare `scrollWidth` with `clientWidth`.
- **Expected result:** no horizontal scroll at any width.
- **Automated by:** `e2e/qa-catalog-photos.spec.ts` › `TC-13 (FR-6): hero photos never cause horizontal scroll from 768 to 1920 px`
- **Status:** Pass

## Not covered

- Whether each photo shows the right costume, and image rights (spec assumptions A-1, A-2, A-5): content checks for Herbert. I spot-checked several cards visually; each matched its name.
- Photo quality and cropping by eye beyond the 360, 800 and 1400 px screenshots.
- `scripts/optimize-photos.mjs` end to end: the source folder is outside the repository, so the script was reviewed, not run. TC-9 checks its output.
- Load performance on slow networks (no throttled run); the budget checks in TC-7 and TC-10 stand in for it.
