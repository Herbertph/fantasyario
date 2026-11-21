import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

// QA acceptance suite for docs/specs/landing-page-mvp.md.
// Test case details: docs/test-cases/landing-page-mvp.md

const GENERAL =
  'Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.';
const costumeMessage = (name: string, size?: string) =>
  `Olá! Gostaria de verificar a disponibilidade da fantasia *${name}*${size ? ` no tamanho ${size}` : ''} da Fantasyário.`;

const catalog = (page: Page) => page.locator('#catalogo');
const cards = (page: Page) => catalog(page).getByRole('article');
const titles = (page: Page) => cards(page).getByRole('heading').allTextContents();
const search = (page: Page) => page.getByLabel('Buscar fantasia');
const sizeFilter = (page: Page, name: string) =>
  page.getByRole('group', { name: 'Filtrar por tamanho' }).getByRole('button', { name, exact: true });
const categoryFilter = (page: Page, name: string) =>
  page.getByRole('group', { name: 'Filtrar por categoria' }).getByRole('button', { name, exact: true });
const guideOption = (page: Page, name: string) =>
  page.locator('#tamanhos').getByRole('button', { name, exact: true });
const highlights = (page: Page) => page.getByRole('region', { name: 'Destaques' });
const shortcut = (page: Page, name: string) => highlights(page).getByRole('button', { name, exact: true });

async function decoded(link: Locator) {
  return new URL((await link.getAttribute('href'))!).searchParams.get('text');
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

test.describe('page and navigation', () => {
  test('TC-1 (AC-1): title, lang, single H1, meta description and brand name', async ({ page }) => {
    await expect(page).toHaveTitle('Fantasyário | Aluguel de Fantasias Infantis e Mesversário');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Aluguel de Fantasias Infantis e Mesversário');
    const html = await page.content();
    expect(html).not.toMatch(/Fantasias (&amp;|&) Magia/);
    await expect(page.getByRole('banner')).toContainText('Fantasyário');
  });

  test('TC-2 (AC-2): desktop navbar links bring each section into view', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop navbar');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    for (const [name, id] of [
      ['Como Funciona', '#como-funciona'],
      ['Catálogo', '#catalogo'],
      ['Tabela de Tamanhos', '#tamanhos'],
    ]) {
      await nav.getByRole('link', { name, exact: true }).click();
      await expect(page.locator(id)).toBeInViewport();
    }
  });

  test('TC-3 (AC-3): "Ver Catálogo" brings the catalog into view', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Catálogo' }).click();
    await expect(catalog(page)).toBeInViewport();
  });

  test('TC-4 (AC-4): 360 px has no horizontal scroll and shows menu and WhatsApp buttons', async ({ page, isMobile }) => {
    test.skip(!isMobile, '360 px project');
    expect(await hasHorizontalScroll(page)).toBe(false);
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reservar pelo WhatsApp' })).toBeVisible();
  });

  test('TC-5 (AC-5): mobile menu link scrolls and closes the menu', async ({ page, isMobile }) => {
    test.skip(!isMobile, '360 px project');
    const menu = page.getByRole('button', { name: 'Abrir menu' });
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: 'Como Funciona', exact: true }).click();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(page.locator('#como-funciona')).toBeInViewport();
    await expect(page.getByRole('link', { name: 'Como Funciona', exact: true })).toBeHidden();
  });
});

test.describe('WhatsApp', () => {
  test('TC-6 (AC-6): navbar and footer links use the general message in a new tab', async ({ page }) => {
    for (const link of [
      page.getByRole('banner').getByRole('link', { name: 'Reservar pelo WhatsApp' }),
      page.getByRole('contentinfo').getByRole('link', { name: '(85) 99200-6868' }),
    ]) {
      expect(await link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5585992006868\?text=/);
      expect(await decoded(link)).toBe(GENERAL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('TC-7 (AC-7): Batman card message has no size when size is "Todos"', async ({ page }) => {
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    expect(await decoded(page.getByRole('link', { name: 'Alugar Batman pelo WhatsApp' }))).toBe(
      costumeMessage('Batman'),
    );
  });

  test('TC-8 (AC-8): Batman card message has the size when size is "M2"', async ({ page }) => {
    await sizeFilter(page, 'M2').click();
    const link = page.getByRole('link', { name: 'Alugar Batman pelo WhatsApp' });
    await expect.poll(() => decoded(link)).toBe(costumeMessage('Batman', 'M2'));
  });

  test('TC-46 (FR-5): every WhatsApp link targets the store number in a new tab with noopener noreferrer', async ({ page }) => {
    const links = page.locator('a[href*="wa.me"]');
    expect(await links.count()).toBeGreaterThanOrEqual(54 + 2 + 2);
    for (const link of await links.all()) {
      expect(await link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5585992006868\?text=/);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /(?=.*noopener)(?=.*noreferrer)/);
    }
  });
});

test.describe('size guide', () => {
  test('TC-12 (AC-10): shows the sentence and the six sizes with age ranges', async ({ page }) => {
    const guide = page.locator('#tamanhos');
    await expect(
      guide.getByText('Antes de prosseguir, identifique qual tamanho é o mais adequado para o seu baby'),
    ).toBeVisible();
    await expect(guide.getByRole('button')).toHaveCount(6);
    for (const name of ['PP – RN', 'P – 1 a 3 meses', 'M1 – 3 a 6 meses', 'M2 – 6 a 9 meses', 'G – 9 a 12 meses', 'GG – 1 a 4 anos']) {
      await expect(guideOption(page, name)).toBeVisible();
    }
  });

  test('TC-13 (AC-11): picking G in the guide filters the catalog to G', async ({ page }) => {
    const g = guideOption(page, 'G – 9 a 12 meses');
    await g.click();
    await expect(catalog(page)).toBeInViewport();
    await expect(sizeFilter(page, 'G')).toHaveAttribute('aria-pressed', 'true');
    await expect(g).toHaveAttribute('aria-pressed', 'true');
    const list = await titles(page);
    expect(list).toContain('Batman');
    expect(list).not.toContain('Super-Homem');
    for (const card of await cards(page).all()) {
      await expect(card.getByRole('listitem').filter({ hasText: /^G$/ })).toHaveCount(1);
    }
    await g.click();
    await expect(g).toHaveAttribute('aria-pressed', 'true');
  });

  test('TC-14 (AC-12): picking "Todos" in the catalog clears the guide selection', async ({ page }) => {
    await guideOption(page, 'G – 9 a 12 meses').click();
    await sizeFilter(page, 'Todos').click();
    await expect(page.locator('#tamanhos [aria-pressed="true"]')).toHaveCount(0);
    await expect(cards(page)).toHaveCount(54);
  });

  test('TC-47 (FR-12): the guide follows a size picked in the catalog filter', async ({ page }) => {
    await sizeFilter(page, 'M1').click();
    await expect(guideOption(page, 'M1 – 3 a 6 meses')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#tamanhos [aria-pressed="true"]')).toHaveCount(1);
  });
});

test.describe('catalog filters', () => {
  test('TC-15 (AC-13): initial state shows all 54 costumes', async ({ page }) => {
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#catalogo [aria-pressed="true"]')).toHaveCount(2);
    await expect(search(page)).toHaveValue('');
    await expect(cards(page)).toHaveCount(54);
    await expect(catalog(page).getByText('54 fantasias encontradas')).toBeVisible();
  });

  test('TC-16 (AC-14): size PP shows only costumes available in PP', async ({ page }) => {
    await sizeFilter(page, 'PP').click();
    await expect(page.getByRole('group', { name: 'Filtrar por tamanho' }).locator('[aria-pressed="true"]')).toHaveText('PP');
    const list = await titles(page);
    expect(list).toEqual(expect.arrayContaining(['Anjinho', 'Comandante']));
    expect(list).not.toContain('Marinheiro');
    for (const card of await cards(page).all()) {
      await expect(card.getByRole('listitem').filter({ hasText: /^PP$/ })).toHaveCount(1);
    }
    await expect(catalog(page).getByText(`${list.length} fantasias encontradas`)).toBeVisible();
  });

  test('TC-17 (AC-15): category Super-Heróis shows exactly 4 heroes', async ({ page }) => {
    await categoryFilter(page, 'Super-Heróis').click();
    await expect(cards(page)).toHaveCount(4);
    expect(await titles(page)).toEqual(['Os Incríveis', 'Super-Homem', 'Batman', 'Homem de Ferro']);
  });

  test('TC-18 (AC-16): 6-month category shows the two costumes with notes', async ({ page }) => {
    await categoryFilter(page, 'Mesversário 6 Meses / Introdução Alimentar').click();
    await expect(cards(page)).toHaveCount(2);
    expect(await titles(page)).toEqual(['Mestre Cuca / Chef (Introdução Alimentar)', 'Frutinhas (Introdução Alimentar)']);
    await expect(cards(page).nth(0)).toContainText('Tema mais pedido para comemoração dos 6 meses');
    await expect(cards(page).nth(1)).toContainText('Ideal para mesversário de 6 meses');
  });

  test('TC-19 (AC-17): Super-Heróis and size P combine to 1 result', async ({ page }) => {
    await sizeFilter(page, 'P').click();
    await categoryFilter(page, 'Super-Heróis').click();
    await expect(cards(page)).toHaveCount(1);
    expect(await titles(page)).toEqual(['Homem de Ferro']);
    await expect(catalog(page).locator('[aria-live="polite"]')).toHaveText('1 fantasia encontrada');
  });

  test('TC-20 (AC-18): search ignores accents, case and surrounding spaces', async ({ page }) => {
    await search(page).pressSequentially('mario');
    expect(await titles(page)).toEqual(['Mário']);
    await search(page).fill('  PASCOA  ');
    expect(await titles(page)).toEqual(['Páscoa (Coelhinho)']);
  });

  test('TC-21 (AC-19): whitespace-only search keeps all cards for the current filters', async ({ page }) => {
    await categoryFilter(page, 'Animais & Safari').click();
    await search(page).fill('     ');
    await expect(cards(page)).toHaveCount(8);
    await categoryFilter(page, 'Todos').click();
    await expect(cards(page)).toHaveCount(54);
  });

  test('TC-22 (AC-20): no match shows the empty state with a general WhatsApp link', async ({ page }) => {
    await categoryFilter(page, 'Super-Heróis').click();
    await search(page).fill('pikachu');
    await expect(cards(page)).toHaveCount(0);
    await expect(catalog(page).getByText('Nenhuma fantasia encontrada com esses filtros.')).toBeVisible();
    await expect(catalog(page).locator('[aria-live="polite"]')).toHaveText('0 fantasias encontradas');
    const link = catalog(page).getByRole('link', { name: 'Fale com a gente no WhatsApp' });
    expect(await decoded(link)).toBe(GENERAL);
  });

  test('TC-23 (AC-21): "Limpar filtros" resets every filter', async ({ page }) => {
    await sizeFilter(page, 'GG').click();
    await categoryFilter(page, 'Super-Heróis').click();
    await search(page).fill('zzz');
    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(search(page)).toHaveValue('');
    await expect(cards(page)).toHaveCount(54);
  });
});

test.describe('cards', () => {
  test('TC-24 (AC-23): Leãozinho card shows ordered badges, alt text and WhatsApp button', async ({ page }) => {
    const card = cards(page).filter({ has: page.getByRole('heading', { name: 'Leãozinho', exact: true }) });
    await expect(card.getByRole('listitem')).toHaveText(['PP', 'M2', 'G', 'GG']);
    await expect(card.locator('img')).toHaveAttribute('alt', 'Leãozinho');
    await expect(card.getByRole('link', { name: 'Alugar Leãozinho pelo WhatsApp' })).toBeVisible();
  });

  test('TC-25 (AC-24): active size badge is marked and differs by more than color', async ({ page }) => {
    await sizeFilter(page, 'M2').click();
    const n = await cards(page).count();
    const active = catalog(page).locator('li[data-active="true"]');
    await expect(active).toHaveCount(n);
    await expect(active).toHaveText(Array(n).fill('M2'));
    const card = cards(page).filter({ has: page.getByRole('heading', { name: 'Batman', exact: true }) });
    const weight = (text: string) =>
      card.getByRole('listitem').filter({ hasText: new RegExp(`^${text}$`) }).evaluate((el) => Number(getComputedStyle(el).fontWeight));
    expect(await weight('M2')).toBeGreaterThan(await weight('M1'));
  });

  test('TC-43 (FR-18): card image falls back to a visible placeholder when the photo fails to load', async ({ page }) => {
    await page.route('**/images/costumes/batman.webp', (route) => route.fulfill({ status: 404 }));
    await page.reload();
    const card = cards(page).filter({ has: page.getByRole('heading', { name: 'Batman', exact: true }) });
    const img = card.getByRole('img', { name: 'Batman' });
    await img.scrollIntoViewIfNeeded();
    await expect(img).toHaveAttribute('src', /^data:image\/svg\+xml/);
    await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  });
});

test.describe('highlights and how it works', () => {
  test('TC-26 (AC-25): 6-month block lists both costumes with notes and size-less messages', async ({ page }) => {
    await expect(highlights(page).getByText('Especial 6 Meses — Introdução Alimentar')).toBeVisible();
    for (const [name, note] of [
      ['Mestre Cuca / Chef (Introdução Alimentar)', 'Tema mais pedido para comemoração dos 6 meses'],
      ['Frutinhas (Introdução Alimentar)', 'Ideal para mesversário de 6 meses'],
    ]) {
      await expect(highlights(page).getByText(note)).toBeVisible();
      expect(await decoded(highlights(page).getByRole('link', { name: `Alugar ${name} pelo WhatsApp` }))).toBe(
        costumeMessage(name),
      );
    }
  });

  test('TC-27 (AC-26): seven date shortcuts in spec order', async ({ page }) => {
    await expect(highlights(page).getByRole('button')).toHaveText([
      'Carnaval',
      'Carnaval (Bell Marques)',
      'Páscoa',
      'São João / Caipira',
      'São João / Cangaceiro',
      'Halloween',
      'Natal',
    ]);
  });

  test('TC-28 (AC-27): Natal shortcut resets size and shows only Natal', async ({ page }) => {
    await sizeFilter(page, 'P').click();
    await search(page).fill('batman');
    await shortcut(page, 'Natal').click();
    await expect(catalog(page)).toBeInViewport();
    await expect(categoryFilter(page, 'Datas Comemorativas')).toHaveAttribute('aria-pressed', 'true');
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(search(page)).toHaveValue('Natal (Papai Noel)');
    expect(await titles(page)).toEqual(['Natal (Papai Noel)']);
  });

  test('TC-29 (AC-28): Carnaval shortcut shows Carnaval and Carnaval / Bell Marques', async ({ page }) => {
    await shortcut(page, 'Carnaval').click();
    await expect(cards(page)).toHaveCount(2);
    expect(await titles(page)).toEqual(['Carnaval', 'Carnaval / Bell Marques']);
  });

  test('TC-48 (FR-24/FR-25): every shortcut finds its own costume', async ({ page }) => {
    const expected: Record<string, string> = {
      'Carnaval (Bell Marques)': 'Carnaval / Bell Marques',
      Páscoa: 'Páscoa (Coelhinho)',
      'São João / Caipira': 'São João / Caipira',
      'São João / Cangaceiro': 'São João / Cangaceiro',
      Halloween: 'Halloween (Abóbora)',
    };
    for (const [label, name] of Object.entries(expected)) {
      await shortcut(page, label).click();
      await expect(search(page)).toHaveValue(name);
      expect(await titles(page)).toEqual([name]);
    }
  });

  test('TC-33 (AC-29): four steps in spec order', async ({ page }) => {
    await expect(page.locator('#como-funciona ol > li')).toHaveText([
      /Identifique o tamanho\s+do seu baby na tabela \(PP ao GG\)\./,
      /Escolha o tema\s+no catálogo de fantasias\./,
      /Reserve pelo WhatsApp\s+confirmando a data da festa ou mesversário\./,
      /Celebre sem preocupação\s+— peças higienizadas e prontas para vestir\./,
    ]);
  });

  test('TC-34 (AC-30): footer shows brand, sentence, WhatsApp and Instagram', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer).toContainText('Fantasyário');
    await expect(footer.getByText('Organize o mesversário do seu filho agora e fique tranquila o resto do ano!')).toBeVisible();
    await expect(footer.getByRole('link', { name: '(85) 99200-6868' })).toBeVisible();
    const ig = footer.getByRole('link', { name: 'Instagram da Fantasyário' });
    await expect(ig).toHaveAttribute('href', 'https://www.instagram.com/fantasyarioo/');
    await expect(ig).toHaveAttribute('target', '_blank');
  });
});

test.describe('accessibility', () => {
  test('TC-35 (AC-31): aria-pressed on filters, labelled search, alt on images, no serious axe violations', async ({ page }) => {
    const filterButtons = page.locator('#catalogo [role="group"] button');
    expect(await filterButtons.count()).toBe(7 + 7);
    for (const b of await filterButtons.all()) await expect(b).toHaveAttribute('aria-pressed', /^(true|false)$/);
    await expect(search(page)).toBeEditable();
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    expect(await severeAxeViolations(page)).toEqual([]);
  });

  test('TC-36 (AC-31): no serious axe violations in the empty state or with the mobile menu open', async ({ page, isMobile }) => {
    await search(page).fill('nada-encontrado');
    await expect(catalog(page).getByText('Nenhuma fantasia encontrada com esses filtros.')).toBeVisible();
    if (isMobile) await page.getByRole('button', { name: 'Abrir menu' }).click();
    expect(await severeAxeViolations(page)).toEqual([]);
  });

  test('TC-37 (AC-32): reduced motion turns off smooth scrolling and animations', async ({ page }) => {
    const style = () =>
      page.evaluate(() => {
        const btn = document.querySelector('#catalogo button')!;
        return [getComputedStyle(document.documentElement).scrollBehavior, getComputedStyle(btn).transitionDuration];
      });
    expect((await style())[0]).toBe('smooth');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const [scroll, transition] = await style();
    expect(scroll).toBe('auto');
    expect(transition).toBe('0s');
  });

  test('TC-42 (exploratory): size filter works with the keyboard only', async ({ page }) => {
    const pp = sizeFilter(page, 'PP');
    await pp.focus();
    await page.keyboard.press('Space');
    await expect(pp).toHaveAttribute('aria-pressed', 'true');
    await page.keyboard.press('Shift+Tab');
    await page.keyboard.press('Enter');
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(cards(page)).toHaveCount(54);
  });

  test('TC-44 (FR-17): result count lives in a polite live region and updates', async ({ page }) => {
    const live = catalog(page).locator('[aria-live="polite"]');
    await expect(live).toHaveCount(1);
    await expect(live).toHaveText('54 fantasias encontradas');
    await search(page).fill('batman');
    await expect(live).toHaveText('1 fantasia encontrada');
  });
});

test.describe('exploratory', () => {
  test('TC-38 (FR-4): no horizontal scroll from tablet to wide desktop', async ({ page, isMobile }) => {
    test.skip(isMobile, 'resizes the desktop project');
    for (const width of [768, 800, 1024, 1400, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      expect(await hasHorizontalScroll(page), `width ${width}`).toBe(false);
    }
  });

  test('TC-39 (FR-4/FR-7): desktop navbar links stay on one line from 768 px up', async ({ page, isMobile }) => {
    test.skip(isMobile, 'resizes the desktop project');
    const nav = page.getByRole('navigation', { name: 'Principal' });
    const wrapped: string[] = [];
    for (const width of [768, 800, 900, 1024, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      for (const name of ['Catálogo', 'Tabela de Tamanhos', 'Como Funciona']) {
        const lines = await nav.getByRole('link', { name, exact: true }).evaluate((el) => el.getClientRects().length);
        if (lines > 1) wrapped.push(`${width}px: ${name} (${lines} lines)`);
      }
    }
    expect(wrapped).toEqual([]);
  });

  test('TC-40 (FR-15): markup typed in the search is treated as text', async ({ page }) => {
    let dialog = false;
    page.on('dialog', async (d) => {
      dialog = true;
      await d.dismiss();
    });
    const imgsBefore = await page.locator('img').count();
    await search(page).fill('<img src=x onerror=alert(1)><b>Batman</b>');
    await expect(catalog(page).getByText('Nenhuma fantasia encontrada com esses filtros.')).toBeVisible();
    await expect(catalog(page).locator('b')).toHaveCount(0);
    expect(await page.locator('img').count()).toBeLessThan(imgsBefore);
    expect(dialog).toBe(false);
  });

  test('TC-41 (FR-15): a very long query shows the empty state without breaking the layout', async ({ page }) => {
    await search(page).fill('fantasia '.repeat(300));
    await expect(catalog(page).getByText('Nenhuma fantasia encontrada com esses filtros.')).toBeVisible();
    expect(await hasHorizontalScroll(page)).toBe(false);
    await search(page).fill('');
    await expect(cards(page)).toHaveCount(54);
  });
});
