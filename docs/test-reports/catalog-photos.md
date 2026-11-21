# Test report: catalog-photos

- **Mode:** full test run
- **Branch / commit:** `feature/catalog-photos` @ `c6df577`
- **Spec:** `docs/specs/catalog-photos.md`
- **Test cases:** `docs/test-cases/catalog-photos.md`
- **Date:** 2026-11-21

## Verdict: FAIL

Every acceptance criterion (AC-1 to AC-9) has a passing test case and no critical or major issue is open. But the unit suite does not pass: TC-9 fails on the minor defect #3 (20 photos are 1–3 px off square, against FR-1). Fixing #3 is the only thing needed for PASS.

## Counts

| Suite | Result |
|---|---|
| Typecheck (`tsc -b`) | pass |
| Build (`npm run build`) | pass |
| Unit (`npm test`) | 30 passed, 1 failed (TC-9, #3) |
| E2E (`npx playwright test`, desktop + mobile, all suites) | 150 passed, 14 skipped (project-specific tests) |
| `npm audit` | 0 vulnerabilities |

Test cases: 13 designed, 12 pass, 1 fail. TC-9 checks files on disk and fails every time, so it is not flaky.

## Traceability

| AC | Test cases | Result |
|---|---|---|
| AC-1 | TC-1 | Pass |
| AC-2 | TC-2 | Pass |
| AC-3 | TC-3 | Pass |
| AC-4 | TC-4 | Pass |
| AC-5 | TC-5 | Pass |
| AC-6 | TC-6 | Pass |
| AC-7 | TC-7, TC-8 | Pass |
| AC-8 | TC-10 | Pass |
| AC-9 | TC-11 + all `landing-page-mvp` e2e tests | Pass |
| FR-1 (exploratory) | TC-9 | Fail (#3) |
| FR-3, FR-6 (exploratory) | TC-12, TC-13 | Pass |

## Issues opened

- #3 (minor): 20 costume photos are not square (1-3 px off) after optimization

## Flaky tests

None. During development of the QA suite, TC-1 failed once because the test asserted before lazy images finished loading; that was a test bug, fixed by polling, not a product defect.

## Spec issues

None.

## Visual review (360 / 800 / 1400 px vs `docs/design/reference-layout.jpg`)

- 1400 px: hero shows three overlapping round photos with white borders, surrounded by the existing doodles over the pastel waves, in the reference's hierarchy (photo group to the right of the copy).
- 360 px: photos stack below the CTA, all three inside the viewport, no horizontal scroll.
- 800 px: cards in two columns with square photos; photos matched their costume names in the cards checked.
- 6-month highlight: photos show at the side (desktop) or above the text (mobile). At 360 px the "Alugar pelo WhatsApp" button text wraps to two lines; this already happened before this change and is not part of this feature.
- No console errors or failed requests at any width.

## Code review (`git diff main...HEAD`)

No correctness or security defects beyond #3. Photos are static files in `public/`, not imported into the JS bundle. Metadata check: none of the 54 WebP files carries EXIF or XMP (sharp drops metadata by default), so no camera or location data from the original photos is published. `sharp` is a devDependency only; `npm audit` is clean.

Privacy: the photos show real children (spec assumption A-1). The spec already asks Herbert to confirm the store has the parents' permission; this should be confirmed before merge.

Suggestions (not filed as issues):
- **Consider:** hero photos have no `onError` fallback, unlike cards. If one were ever missing, the hero would show a broken image with its alt text. The unit guard (AC-7) makes this unlikely, so this is low priority.
- **Consider:** `scripts/optimize-photos.mjs` writes a file at quality 50 even when it is still over 120 KB, and only the unit test catches it. Printing a warning, or exiting non-zero, would surface it at generation time.
- **Nit:** in `Highlights.tsx` the children of the new wrapping `<div>` were not re-indented.
- **Nit:** `{...(i === 0 && { fetchpriority: 'high' })}` in `Hero.tsx` works with React 18 (lowercase attribute passes through, verified in the DOM) but reads awkwardly; a `fetchpriority={i === 0 ? 'high' : undefined}` prop would be clearer (it may need a type cast).
