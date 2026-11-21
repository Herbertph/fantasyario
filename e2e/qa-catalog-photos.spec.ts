import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

// QA acceptance suite for docs/specs/catalog-photos.md.
// Test case details: docs/test-cases/catalog-photos.md

const catalog = (page: Page) => page.locator('#catalogo');
const cards = (page: Page) => catalog(page).getByRole('article');
const cardFor = (page: Page, name: string) =>
  cards(page).filter({ has: page.getByRole('heading', { name, exact: true }) });
const hero = (page: Page) => page.locator('#topo');
const highlights = (page: Page) => page.getByRole('region', { name: 'Destaques' });
const isLoaded = (img: Locator) => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
const HERO = [
  ['astronauta-nasa', 'Bebê com fantasia de Astronauta NASA'],
  ['leaozinho', 'Bebê com fantasia de Leãozinho'],
  ['pequeno-principe', 'Bebê com fantasia de Pequeno Príncipe'],
] as const;

/** Scrolls through the whole page so every lazy image starts loading. */
async function scrollThroughPage(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 500) await page.evaluate((top) => window.scrollTo(0, top), y);
}

async function hasHorizontalScroll(page: Page) {
  return page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
}

async function severeAxeViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page }).analyze();
  return violations
    .filter((v) => v.impact === 'serious' || v.impact === 'critical')
    .map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('cards', () => {
  test('TC-1 (AC-1): all 54 card photos load from their own WebP file, none is a placeholder', async ({ page }) => {
    await scrollThroughPage(page);
    await expect(cards(page)).toHaveCount(54);
    const problems = () =>
      cards(page).evaluateAll((articles) =>
        articles.flatMap((a) => {
          const img = a.querySelector('img')!;
          const ok = img.complete && img.naturalWidth > 0 && /\/images\/costumes\/[a-z0-9-]+\.webp$/.test(img.src);
          return ok ? [] : [`${a.querySelector('h3')!.textContent}: ${img.src.slice(0, 60)} width=${img.naturalWidth}`];
        }),
      );
    await expect.poll(problems, { timeout: 15_000 }).toEqual([]);
  });

  test('TC-2 (AC-2): Batman photo is named, square, lazy, async and has explicit size', async ({ page }) => {
    const img = cardFor(page, 'Batman').getByRole('img', { name: 'Batman', exact: true });
    await expect(img).toHaveAttribute('src', /\/images\/costumes\/batman\.webp$/);
    await expect(img).toHaveAttribute('loading', 'lazy');
    await expect(img).toHaveAttribute('decoding', 'async');
    await expect(img).toHaveAttribute('width', /^\d+$/);
    await expect(img).toHaveAttribute('height', await img.getAttribute('width') as string);
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => isLoaded(img)).toBe(true);
    const box = (await img.boundingBox())!;
    expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
  });

  test('TC-3 (AC-3): a blocked photo falls back to the placeholder and the card still works', async ({ page }) => {
    await page.route('**/images/costumes/batman.webp', (route) => route.abort());
    await page.reload();
    await page.getByRole('group', { name: 'Filtrar por categoria' }).getByRole('button', { name: 'Super-Heróis' }).click();
    const card = cardFor(page, 'Batman');
    const img = card.getByRole('img', { name: 'Batman', exact: true });
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute('src', /^data:image\/svg\+xml/);
    await expect.poll(() => isLoaded(img)).toBe(true);
    await expect(card.getByRole('listitem')).toHaveText(['M1', 'M2', 'G']);
    await page.getByRole('group', { name: 'Filtrar por tamanho' }).getByRole('button', { name: 'G', exact: true }).click();
    const link = card.getByRole('link', { name: 'Alugar Batman pelo WhatsApp' });
    await expect
      .poll(async () => new URL((await link.getAttribute('href'))!).searchParams.get('text'))
      .toBe('Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* no tamanho G da Fantasyário.');
    const other = cardFor(page, 'Homem de Ferro').locator('img');
    await expect(other).toHaveAttribute('src', /homem-de-ferro\.webp$/);
  });

  test('TC-12 (FR-3): photos follow their costume when filters change', async ({ page }) => {
    await page.getByLabel('Buscar fantasia').fill('a');
    await page.getByRole('group', { name: 'Filtrar por tamanho' }).getByRole('button', { name: 'GG', exact: true }).click();
    const pairs = await cards(page).evaluateAll((articles) =>
      articles.map((a) => [a.querySelector('h3')!.textContent, a.querySelector('img')!.getAttribute('src')]),
    );
    expect(pairs.length).toBeGreaterThan(5);
    for (const [name, src] of pairs) expect(src, name!).toMatch(/^\/images\/costumes\/[a-z0-9-]+\.webp$/);
    expect(new Set(pairs.map(([, src]) => src)).size).toBe(pairs.length);
  });
});

test.describe('hero', () => {
  test('TC-4 (AC-4): desktop hero shows the three loaded photos, eager, first with high priority; one H1', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop 1280x800');
    for (const [i, [id, alt]] of HERO.entries()) {
      const img = hero(page).getByRole('img', { name: alt, exact: true });
      await expect(img).toBeInViewport();
      await expect(img).toHaveAttribute('src', new RegExp(`/images/costumes/${id}\\.webp$`));
      await expect(img).toHaveAttribute('loading', 'eager');
      if (i === 0) await expect(img).toHaveAttribute('fetchpriority', 'high');
      await expect.poll(() => isLoaded(img)).toBe(true);
    }
    await expect(hero(page).getByRole('img')).toHaveCount(3);
    await expect(page.locator('h1')).toHaveCount(1);
  });

  test('TC-5 (AC-5): at 360 px the photos sit below the H1 and CTA, inside the viewport, no horizontal scroll', async ({ page, isMobile }) => {
    test.skip(!isMobile, '360x740');
    const cta = (await page.getByRole('button', { name: 'Ver Catálogo' }).boundingBox())!;
    const h1 = (await page.locator('h1').boundingBox())!;
    let inside = 0;
    for (const [, alt] of HERO) {
      const box = (await hero(page).getByRole('img', { name: alt, exact: true }).boundingBox())!;
      expect(box.y, alt).toBeGreaterThanOrEqual(cta.y + cta.height);
      expect(box.y, alt).toBeGreaterThan(h1.y + h1.height);
      if (box.x >= 0 && box.x + box.width <= 360 && box.width > 60) inside++;
    }
    expect(inside).toBeGreaterThanOrEqual(2);
    expect(await hasHorizontalScroll(page)).toBe(false);
  });

  test('TC-13 (FR-6): hero photos never cause horizontal scroll from 768 to 1920 px', async ({ page, isMobile }) => {
    test.skip(isMobile, 'resizes the desktop project');
    for (const width of [768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await hasHorizontalScroll(page), `width ${width}`).toBe(false);
    }
  });
});

test.describe('highlights', () => {
  test('TC-6 (AC-6): 6-month cards show their own loaded photos', async ({ page }) => {
    for (const [id, name] of [
      ['mestre-cuca', 'Mestre Cuca / Chef (Introdução Alimentar)'],
      ['frutinhas', 'Frutinhas (Introdução Alimentar)'],
    ]) {
      const img = highlights(page).getByRole('img', { name, exact: true });
      await expect(img).toHaveAttribute('src', new RegExp(`/images/costumes/${id}\\.webp$`));
      await img.scrollIntoViewIfNeeded();
      await expect.poll(() => isLoaded(img)).toBe(true);
    }
  });
});

test.describe('build and accessibility', () => {
  test('TC-10 (AC-8): the built photo folder holds 54 WebP files and weighs at most 4 MB', async ({ isMobile }) => {
    test.skip(isMobile, 'file check, runs once');
    const dir = path.resolve('dist/images/costumes');
    const webps = readdirSync(dir).filter((f) => f.endsWith('.webp'));
    expect(webps).toHaveLength(54);
    const total = webps.reduce((sum, f) => sum + statSync(path.join(dir, f)).size, 0);
    expect(total).toBeLessThanOrEqual(4 * 1024 * 1024);
  });

  test('TC-11 (AC-9): no serious axe violations with every photo loaded', async ({ page }) => {
    await scrollThroughPage(page);
    expect(await severeAxeViolations(page)).toEqual([]);
  });
});
