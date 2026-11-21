# Test report: landing-page-mvp

- **Mode:** full test run
- **Branch / commit:** `feature/landing-page-mvp` @ `114a2cd`
- **Spec:** `docs/specs/landing-page-mvp.md`
- **Test cases:** `docs/test-cases/landing-page-mvp.md`
- **Date:** 2026-11-21

## Verdict: FAIL

Every acceptance criterion (AC-1 to AC-32) has at least one passing test case and no critical or major issue is open, but the full e2e suite does not pass: TC-39 fails on the minor navbar defect #1, so CI would be red. Fixing #1 is the only thing needed for PASS.

## Counts

| Suite | Result |
|---|---|
| Typecheck (`tsc -b`) | pass |
| Build (`npm run build`) | pass |
| Unit (`npm test`) | 25 passed (19 existing + 6 QA) |
| E2E (`npx playwright test`, desktop + mobile) | 121 passed, 1 failed (TC-39, #1), 8 skipped (project-specific tests) |
| `npm audit --omit=dev` | 0 vulnerabilities |

Test cases: 47 designed, 46 pass, 1 fail. TC-39 failed 3 out of 3 runs, so it is a real defect, not a flaky test.

## Traceability

| AC | Test cases | Result |
|---|---|---|
| AC-1 | TC-1 | Pass |
| AC-2 | TC-2 | Pass |
| AC-3 | TC-3 | Pass |
| AC-4 | TC-4 | Pass |
| AC-5 | TC-5 | Pass |
| AC-6 | TC-6 | Pass |
| AC-7 | TC-7 | Pass |
| AC-8 | TC-8 | Pass |
| AC-9 | TC-9, TC-10, TC-11 | Pass |
| AC-10 | TC-12 | Pass |
| AC-11 | TC-13 | Pass |
| AC-12 | TC-14 | Pass |
| AC-13 | TC-15 | Pass |
| AC-14 | TC-16 | Pass |
| AC-15 | TC-17 | Pass |
| AC-16 | TC-18 | Pass |
| AC-17 | TC-19, TC-32 | Pass |
| AC-18 | TC-20 | Pass |
| AC-19 | TC-21 | Pass |
| AC-20 | TC-22 | Pass |
| AC-21 | TC-23 | Pass |
| AC-22 | TC-30, TC-31 | Pass |
| AC-23 | TC-24 | Pass |
| AC-24 | TC-25 | Pass |
| AC-25 | TC-26 | Pass |
| AC-26 | TC-27 | Pass |
| AC-27 | TC-28 | Pass |
| AC-28 | TC-29 | Pass |
| AC-29 | TC-33 | Pass |
| AC-30 | TC-34 | Pass |
| AC-31 | TC-35, TC-36, TC-42 | Pass |
| AC-32 | TC-37 | Pass |
| Exploratory (FR-4, FR-5, FR-7, FR-12, FR-15, FR-17, FR-18, FR-24/25) | TC-38, TC-39, TC-40, TC-41, TC-43, TC-44, TC-46, TC-47, TC-48 | Pass, except TC-39: Fail (#1) |

## Issues opened

- #1 (minor): Navbar links wrap to two lines and overflow the header between 768 and ~950 px

## Flaky tests

None.

## Spec issues

None. All acceptance criteria were testable as written.

## Visual review (360 / 800 / 1400 px vs `docs/design/reference-layout.jpg`)

- 1400 px: layout, palette, pastel waves with the white wave at the bottom of the hero, doodles, black pill CTA and outlined WhatsApp pill match the reference hierarchy. Hero art is the illustrated placeholder (assumption A-1).
- 360 px: hero stacks copy above the image; navbar shows logo, "Reservar" pill and menu button with no horizontal scroll; cards are one column with the CTA on one line.
- 800 px: cards in two columns and fine; navbar links wrap and overflow the bar (#1).

## Code review (`git diff main...HEAD`)

No correctness or security defects beyond #1. Mutation check: inverting the category predicate in `filterCostumes` made 3 unit tests fail, so the logic is guarded. User input (search) is only rendered as a controlled input value and used for matching; external links use `noopener noreferrer`; no secrets.

Suggestions (not filed as issues):
- **Consider:** the mobile menu `<ul id="mobile-menu">` is rendered outside the `<nav aria-label="Principal">` landmark, and `aria-controls="mobile-menu"` points to an element that does not exist while the menu is closed. Moving the list inside `<nav>` and keeping it in the DOM with `hidden` fixes both.
- **Consider:** every card requests `/images/costumes/<id>.webp` even though no photos exist, which gives 54 failed requests when scrolling the full catalog (mitigated by `loading="lazy"`). A small list of available photo ids would avoid that once photos arrive.
- **Nit:** `filters.size ?? 'Todos'` and `filters.category ?? 'Todos'` are repeated in `Catalog.tsx`; the app never sets `null`, so the `null` members of `SizeFilter`/`CategoryFilter` could be dropped or normalized once.
- **Nit:** `Highlights.tsx` uses a non-null assertion on `COSTUMES_CATALOG.find(...)`; the existing unit test that checks shortcut ids covers it, so this is acceptable.
