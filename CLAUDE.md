# fantasyario

Brief na primeira msg

Built with a multi-agent pipeline: requirements analyst → developer → tester → pull request. A human reviews and merges every PR.

## Stack

- Vite + React 18 + TypeScript, Tailwind CSS v4 (theme tokens in `src/index.css`), Nunito via `@fontsource/nunito`
- Vitest for unit tests; Playwright (Chromium, `desktop` 1280x800 and `mobile` 360x740 projects) with `@axe-core/playwright` for end-to-end
- GitHub Actions CI (`.github/workflows/ci.yml`): typecheck, unit tests, build, e2e

## Commands

- `npm install` / `npx playwright install chromium`
- `npm run dev`: dev server
- `npm run build`: typecheck + production build to `dist/`
- `npm run typecheck`
- `npm test`: unit tests (Vitest)
- `npm run test:e2e`: builds and serves the app on port 5180, then runs Playwright (never use port 4545)

## Structure

- `src/data/catalog.ts`: catalog data, size guide, WhatsApp/Instagram constants, `buildWhatsAppUrl`
- `src/lib/`: pure logic (`filterCostumes`, category options, date shortcuts, result count) with `*.test.ts` next to it
- `src/components/`: page sections; `src/App.tsx` owns the shared filter state
- `public/images/costumes/<id>.webp`: optional real photos; cards fall back to a pastel placeholder when missing
- `e2e/`: Playwright end-to-end tests

- `docs/specs/`: feature specs written by the requirements analyst
- `docs/test-cases/`: test cases (TC-n, with steps and expected results) written by the tester
- `docs/test-reports/`: test reports written by the tester
- Bugs found in testing are filed as GitHub issues labeled `bug` and `severity: *`. Fix commits reference the issue (`fix: ... (#12)`), and PRs close them with `Fixes #12`.

## Conventions

- Everything in the repository is written in English: code, comments, docs, commit messages, PR descriptions.
- Keep business logic in pure, testable functions, separate from UI code.
- Never render user input as HTML.
- Prefer accessible markup (labels, roles, `aria-*`). End-to-end tests locate elements with `getByRole`, `getByLabel` and `getByText` where possible.
- Name tests after behavior. Acceptance tests start with their criterion ID, for example `AC-2: rejects a blank title`.
- Commits follow Conventional Commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`.
- Feature branches are named `feature/<slug>`, or keep the branch Claude Code created for a worktree session. Never commit to `main`.

## Definition of done

- Every acceptance criterion in the spec is covered by at least one test.
- Build, unit tests and end-to-end tests all pass.
- No unrelated changes in the diff.
