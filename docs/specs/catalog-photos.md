# Spec: Real catalog photos

Branch: `feature/catalog-photos`
Builds on: `docs/specs/landing-page-mvp.md` (assumption A-1 promised that real photos could replace the placeholders).

## Context

Herbert shared the store's real catalog ("catalogo menino", a 16-page PDF on Google Drive) and asked to use its images on the landing page. Parents decide by seeing the costume on a baby, so real photos are the most important conversion improvement after the MVP.

The analyst already extracted the photos from the PDF, matched each one to a catalog `id`, and cropped it to the area the PDF shows (the PDF frames photos in circles; many originals are Instagram screenshots with app UI around them):

- **Source folder (outside the repo, same machine):** `C:\Users\herbe\.agent-studio\attachments\fantasyario\catalog-pdf\cropped\` with 54 files named `<id>.png` (one per catalog item, about 26 MB total, roughly 450–1020 px square).
- **Mapping used:** `...\catalog-pdf\mapping.csv` (`id,xref,page`), for traceability.

Every one of the 54 catalog ids has exactly one photo. Two pairs share the same original: `cangaceiro` and `sao-joao-cangaceiro` (the PDF reuses the same photo).

## Scope

### In scope

- Optimized WebP versions of the 54 photos in `public/images/costumes/<id>.webp`.
- Costume cards show the real photo, in a square frame.
- Hero composition uses real photos instead of the SVG illustration.
- "Especial 6 Meses" highlight cards show their photos.
- A guard test so a missing or misnamed photo is caught in CI.

### Out of scope

- The store logo (only a low-resolution copy exists in the PDF; see Questions).
- Second/alternative photos per costume, galleries, zoom or lightbox.
- Image CDN, responsive `srcset` with several widths (one size is enough at this weight).
- Changing catalog data, filters or WhatsApp behavior.

## Functional requirements

- **FR-1** Each source PNG is converted to `public/images/costumes/<id>.webp`, resized to at most 640×640 px (keep square, do not upscale), WebP quality around 80. Each file must be ≤ 120 KB and the whole folder ≤ 4 MB. Do not commit the source PNGs.
- **FR-2** The conversion is reproducible: a small script (e.g. `scripts/optimize-photos.mjs` using `sharp` as a devDependency) takes a source folder argument and writes the WebP files. The source folder path is not hard-coded in the repo.
- **FR-3** Costume cards show the photo in a **square** frame (`aspect-square`, rounded corners as today, `object-cover`, centered), `alt` = costume name (unchanged), `loading="lazy"`, `decoding="async"`, and explicit `width`/`height` so the layout does not shift while images load.
- **FR-4** The placeholder fallback stays: if a photo fails to load, the card shows the pastel placeholder (existing behavior, TC-43).
- **FR-5** Hero: replace the SVG illustration with a composition of 3 real photos — `astronauta-nasa`, `leaozinho` and `pequeno-principe` — in circular/rounded frames that overlap slightly, surrounded by the existing line-art doodles (stars, clouds), over the pastel waves. Hero images load eagerly (`loading="eager"`, the first one with `fetchpriority="high"`). The group has an accessible description, e.g. each image `alt`: "Bebê com fantasia de Astronauta NASA", "Bebê com fantasia de Leãozinho", "Bebê com fantasia de Pequeno Príncipe".
- **FR-6** On screens below 768 px the hero composition stays below the copy, never wider than the viewport, and shows at least 2 of the 3 photos.
- **FR-7** "Especial 6 Meses — Introdução Alimentar" cards (Mestre Cuca / Chef and Frutinhas) show their photos (`mestre-cuca.webp`, `frutinhas.webp`) with the same `alt` rule as cards.
- **FR-8** A unit test checks that every `COSTUMES_CATALOG` id has a file `public/images/costumes/<id>.webp`, that there are no extra `.webp` files without a catalog id, and that each file is ≤ 120 KB.

## Acceptance criteria

- **AC-1** Given the catalog with no filters, when all cards have scrolled into view, then each of the 54 card images has loaded (`naturalWidth > 0`) with a `src` ending in `/images/costumes/<id>.webp`, and none shows the placeholder.
- **AC-2** Given the "Batman" card, then its image has `alt="Batman"`, its rendered box is square (width equals height within 1 px), and `loading="lazy"`.
- **AC-3** Given the photo for a costume is missing (simulated by blocking its request in Playwright), then that card shows the placeholder and the rest of the card (name, badges, WhatsApp button) still works.
- **AC-4** Given the page loads at 1280×800, then the hero shows 3 photos with the alt texts in FR-5, all loaded, and the H1 is still the only H1.
- **AC-5** Given a 360 px viewport, then the hero photos are below the H1/CTA, at least 2 are visible, and the page has no horizontal scroll.
- **AC-6** Given the "Especial 6 Meses" block, then Mestre Cuca / Chef and Frutinhas each show their loaded photo.
- **AC-7** (unit) Every catalog id has exactly one WebP file, there are no orphan WebP files, and every file is ≤ 120 KB.
- **AC-8** Given the built site (`dist/`), then the total size of `images/costumes/` is ≤ 4 MB.
- **AC-9** Given the page at 1280×800 and 360×740, then the axe check still reports no serious or critical violations, and all previous acceptance tests from `landing-page-mvp` still pass.

## Assumptions (Herbert, please confirm in review)

- **A-1 Image rights.** The photos show real children and were published by the store (several are Instagram screenshots). We assume the store has the parents' permission to use them on the website, as it already uses them in its catalog.
- **A-2 Photo choice.** Where the PDF had two photos for one costume (Woody, Pequeno Príncipe, Mestre Cuca), the analyst picked one: Woody and Pequeno Príncipe from the main catalog pages, Mestre Cuca from the round "chef in the pot" photo. Easy to swap later.
- **A-3 Hero photos.** Astronauta NASA, Leãozinho and Pequeno Príncipe were chosen because they are featured items with bright, clear photos.
- **A-4 Square frames** replace the current 8:5 frames, because all photos are square crops (the PDF shows them in circles).
- **A-5 Watermarks.** A few photos carry a photographer's watermark ("The Story Infantil" on Chaves and Kiko). They are kept as they are.

## Questions for later (not blocking)

- The PDF's last page contains the round Fantasyário logo, but only about 130 px wide. If Herbert sends the logo file, a follow-up can put it in the navbar and footer.

## Technical notes

- Current behavior: `src/components/CostumeCard.tsx` already requests `/images/costumes/<id>.webp` and falls back to `placeholderFor(category)` on error; it uses `aspect-[8/5]` with `width={320} height={200}`. Change to square (e.g. `width={320} height={320}`, `aspect-square`).
- `src/components/Hero.tsx` has `HeroIllustration` (SVG). Replace it with a photo composition and keep the doodles from `Icons`.
- `src/components/Highlights.tsx` renders the 6-month cards without images; add them.
- E2E tests that assert the placeholder (`e2e/qa-acceptance.spec.ts`, TC-43) must now force a missing image (e.g. `page.route` returning 404 for one photo) instead of relying on files being absent.
- Mind the bundle: images live in `public/` (copied as-is), not imported into JS.

### Ordered task list

1. Add `sharp` as a devDependency and `scripts/optimize-photos.mjs <sourceDir>`; generate the 54 WebP files from the source folder above; check sizes (FR-1, FR-2).
2. Add the unit guard test (AC-7) and a build-size check (AC-8).
3. Square card frame + lazy/decoding attributes (FR-3); update TC-43 to block a request (AC-3).
4. Hero photo composition with doodles, desktop and mobile (FR-5, FR-6, AC-4, AC-5).
5. Photos in the 6-month highlight cards (FR-7, AC-6).
6. Run the full suite plus axe on both viewports (AC-9); compare visually against `docs/design/reference-layout.jpg`.
