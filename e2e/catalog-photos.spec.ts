import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const cards = (page: Page) => page.locator('#catalogo').getByRole('article');
const cardFor = (page: Page, name: string) =>
  cards(page).filter({ has: page.getByRole('heading', { name, exact: true }) });
const loaded = (img: Locator) => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0);
const hero = (page: Page) => page.locator('#topo');
const HERO_ALTS = [
  'Bebê com fantasia de Astronauta NASA',
  'Bebê com fantasia de Leãozinho',
  'Bebê com fantasia de Pequeno Príncipe',
];

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('AC-1: all 54 card photos load from /images/costumes', async ({ page }) => {
  const imgs = cards(page).locator('img');
  await expect(imgs).toHaveCount(54);
  for (const img of await imgs.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute('src', /\/images\/costumes\/[a-z0-9-]+\.webp$/);
    await expect.poll(() => loaded(img)).toBe(true);
  }
});

test('AC-2: Batman photo is square, lazy and named', async ({ page }) => {
  const img = cardFor(page, 'Batman').getByRole('img', { name: 'Batman', exact: true });
  await expect(img).toHaveAttribute('loading', 'lazy');
  await img.scrollIntoViewIfNeeded();
  const box = (await img.boundingBox())!;
  expect(Math.abs(box.width - box.height)).toBeLessThanOrEqual(1);
});

test('AC-3: a missing photo shows the placeholder and the card still works', async ({ page }) => {
  await page.route('**/images/costumes/batman.webp', (route) => route.fulfill({ status: 404 }));
  await page.reload();
  const card = cardFor(page, 'Batman');
  const img = card.getByRole('img', { name: 'Batman', exact: true });
  await img.scrollIntoViewIfNeeded();
  await expect(img).toHaveAttribute('src', /^data:image\/svg\+xml/);
  await expect(card.getByRole('listitem')).toHaveText(['M1', 'M2', 'G']);
  await expect(card.getByRole('link', { name: 'Alugar Batman pelo WhatsApp' })).toHaveAttribute('href', /^https:\/\/wa\.me\//);
});

test('AC-4: hero shows three loaded photos and a single H1', async ({ page, isMobile }) => {
  test.skip(isMobile, 'desktop only');
  for (const alt of HERO_ALTS) {
    const img = hero(page).getByRole('img', { name: alt });
    await expect(img).toBeVisible();
    await expect.poll(() => loaded(img)).toBe(true);
  }
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
});

test('AC-5: on mobile the hero photos sit below the CTA without horizontal scroll', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  const ctaBottom = (await page.getByRole('button', { name: 'Ver Catálogo' }).boundingBox())!;
  let visible = 0;
  for (const alt of HERO_ALTS) {
    const img = hero(page).getByRole('img', { name: alt });
    await img.scrollIntoViewIfNeeded();
    if (await img.isVisible()) {
      visible++;
      const box = (await img.boundingBox())!;
      expect(box.y).toBeGreaterThan(ctaBottom.y);
    }
  }
  expect(visible).toBeGreaterThanOrEqual(2);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
  ).toBe(true);
});

test('AC-6: 6-month highlight cards show their photos', async ({ page }) => {
  const block = page.getByRole('region', { name: 'Destaques' });
  for (const name of ['Mestre Cuca / Chef (Introdução Alimentar)', 'Frutinhas (Introdução Alimentar)']) {
    const img = block.getByRole('img', { name, exact: true });
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => loaded(img)).toBe(true);
  }
});

test('AC-9: no serious or critical axe violations with photos', async ({ page }) => {
  const { violations } = await new AxeBuilder({ page }).analyze();
  const severe = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  expect(severe.map((v) => v.id)).toEqual([]);
});
