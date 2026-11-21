import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Locator, type Page } from '@playwright/test';

const GENERAL =
  'Olá! Vi o catálogo da Fantasyário e gostaria de consultar disponibilidade de fantasias para mesversário/festa.';

const catalog = (page: Page) => page.locator('#catalogo');
const cards = (page: Page) => catalog(page).getByRole('article');
const sizeFilter = (page: Page, name: string) =>
  page.getByRole('group', { name: 'Filtrar por tamanho' }).getByRole('button', { name, exact: true });
const categoryFilter = (page: Page, name: string) =>
  page.getByRole('group', { name: 'Filtrar por categoria' }).getByRole('button', { name, exact: true });
const cardTitles = (page: Page) => cards(page).getByRole('heading').allTextContents();

async function decodedText(link: Locator) {
  const href = (await link.getAttribute('href'))!;
  return new URL(href).searchParams.get('text');
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('page and navigation', () => {
  test('AC-1: title, lang, single H1, brand name', async ({ page }) => {
    await expect(page).toHaveTitle('Fantasyário | Aluguel de Fantasias Infantis e Mesversário');
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Aluguel de Fantasias Infantis e Mesversário');
    expect(await page.content()).not.toContain('Fantasias &amp; Magia');
    expect(await page.locator('body').innerText()).not.toContain('Fantasias & Magia');
  });

  test('AC-3: "Ver Catálogo" scrolls to the catalog', async ({ page }) => {
    await page.getByRole('button', { name: 'Ver Catálogo' }).click();
    await expect(catalog(page)).toBeInViewport();
  });
});

test.describe('desktop', () => {
  test.skip(({ isMobile }) => isMobile, 'desktop only');

  test('AC-2: navbar links scroll to their sections', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Principal' });
    const links: [string, string][] = [
      ['Catálogo', '#catalogo'],
      ['Tabela de Tamanhos', '#tamanhos'],
      ['Como Funciona', '#como-funciona'],
    ];
    for (const [name, id] of links) {
      await nav.getByRole('link', { name, exact: true }).click();
      await expect(page.locator(id)).toBeInViewport();
    }
  });
});

test.describe('mobile', () => {
  test.skip(({ isMobile }) => !isMobile, 'mobile only');

  test('AC-4: no horizontal scroll; menu and WhatsApp buttons visible', async ({ page }) => {
    const fits = await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    );
    expect(fits).toBe(true);
    await expect(page.getByRole('button', { name: 'Abrir menu' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Reservar pelo WhatsApp' })).toBeVisible();
  });

  test('AC-5: menu link scrolls and closes the menu', async ({ page }) => {
    const menu = page.getByRole('button', { name: 'Abrir menu' });
    await menu.click();
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await page.getByRole('link', { name: 'Como Funciona' }).click();
    await expect(page.locator('#como-funciona')).toBeInViewport();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
  });
});

test.describe('WhatsApp', () => {
  test('AC-6: navbar and footer links use the general message', async ({ page }) => {
    for (const link of [
      page.getByRole('link', { name: 'Reservar pelo WhatsApp' }),
      page.getByRole('contentinfo').getByRole('link', { name: '(85) 99200-6868' }),
    ]) {
      expect(await link.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/5585992006868\?text=/);
      expect(await decodedText(link)).toBe(GENERAL);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });

  test('AC-7/AC-8: card message includes the size only when filtered', async ({ page }) => {
    const batman = catalog(page).getByRole('link', { name: 'Alugar Batman pelo WhatsApp' });
    expect(await decodedText(batman)).toBe(
      'Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* da Fantasyário.',
    );
    await sizeFilter(page, 'M2').click();
    await expect
      .poll(() => decodedText(batman))
      .toBe('Olá! Gostaria de verificar a disponibilidade da fantasia *Batman* no tamanho M2 da Fantasyário.');
  });
});

test.describe('size guide', () => {
  test('AC-10: shows the sentence and six sizes', async ({ page }) => {
    const guide = page.locator('#tamanhos');
    await expect(
      guide.getByText('Antes de prosseguir, identifique qual tamanho é o mais adequado para o seu baby'),
    ).toBeVisible();
    for (const name of [
      'PP – RN',
      'P – 1 a 3 meses',
      'M1 – 3 a 6 meses',
      'M2 – 6 a 9 meses',
      'G – 9 a 12 meses',
      'GG – 1 a 4 anos',
    ]) {
      await expect(guide.getByRole('button', { name, exact: true })).toBeVisible();
    }
  });

  test('AC-11/AC-12: guide drives the catalog size filter and stays in sync', async ({ page }) => {
    const guideG = page.getByRole('button', { name: 'G – 9 a 12 meses' });
    await guideG.click();
    await expect(catalog(page)).toBeInViewport();
    await expect(sizeFilter(page, 'G')).toHaveAttribute('aria-pressed', 'true');
    await expect(guideG).toHaveAttribute('aria-pressed', 'true');
    const titles = await cardTitles(page);
    expect(titles).toContain('Batman');
    expect(titles).not.toContain('Super-Homem');
    await guideG.click();
    await expect(guideG).toHaveAttribute('aria-pressed', 'true');

    await sizeFilter(page, 'Todos').click();
    await expect(page.locator('#tamanhos [aria-pressed="true"]')).toHaveCount(0);
    await expect(cards(page)).toHaveCount(54);
  });
});

test.describe('catalog filters', () => {
  test('AC-13: initial state shows all 54', async ({ page }) => {
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Buscar fantasia')).toHaveValue('');
    await expect(cards(page)).toHaveCount(54);
    await expect(page.getByText('54 fantasias encontradas')).toBeVisible();
  });

  test('AC-14: size PP', async ({ page }) => {
    await sizeFilter(page, 'PP').click();
    await expect(sizeFilter(page, 'PP')).toHaveAttribute('aria-pressed', 'true');
    const titles = await cardTitles(page);
    expect(titles).toEqual(expect.arrayContaining(['Anjinho', 'Comandante']));
    expect(titles).not.toContain('Marinheiro');
    await expect(page.getByText(`${titles.length} fantasias encontradas`)).toBeVisible();
  });

  test('AC-15/AC-17: category and size combine', async ({ page }) => {
    await categoryFilter(page, 'Super-Heróis').click();
    await expect(cards(page)).toHaveCount(4);
    expect(await cardTitles(page)).toEqual(['Os Incríveis', 'Super-Homem', 'Batman', 'Homem de Ferro']);
    await sizeFilter(page, 'P').click();
    await expect(cards(page)).toHaveCount(1);
    expect(await cardTitles(page)).toEqual(['Homem de Ferro']);
    await expect(page.getByText('1 fantasia encontrada')).toBeVisible();
  });

  test('AC-16: 6-month category shows both costumes with notes', async ({ page }) => {
    await categoryFilter(page, 'Mesversário 6 Meses / Introdução Alimentar').click();
    await expect(cards(page)).toHaveCount(2);
    expect(await cardTitles(page)).toEqual([
      'Mestre Cuca / Chef (Introdução Alimentar)',
      'Frutinhas (Introdução Alimentar)',
    ]);
    await expect(catalog(page).getByText('Tema mais pedido para comemoração dos 6 meses')).toBeVisible();
    await expect(catalog(page).getByText('Ideal para mesversário de 6 meses')).toBeVisible();
  });

  test('AC-18/AC-19: search is accent- and case-insensitive; spaces match all', async ({ page }) => {
    const search = page.getByLabel('Buscar fantasia');
    await search.fill('mario');
    await expect(cards(page)).toHaveCount(1);
    expect(await cardTitles(page)).toEqual(['Mário']);
    await search.fill('  PASCOA  ');
    await expect(cards(page)).toHaveCount(1);
    expect(await cardTitles(page)).toEqual(['Páscoa (Coelhinho)']);
    await search.fill('   ');
    await expect(cards(page)).toHaveCount(54);
  });

  test('AC-20/AC-21: empty state and clearing filters', async ({ page }) => {
    await categoryFilter(page, 'Super-Heróis').click();
    await page.getByLabel('Buscar fantasia').fill('pikachu');
    await expect(page.getByText('Nenhuma fantasia encontrada com esses filtros.')).toBeVisible();
    await expect(page.getByText('0 fantasias encontradas')).toBeVisible();
    expect(await decodedText(page.getByRole('link', { name: 'Fale com a gente no WhatsApp' }))).toBe(GENERAL);

    await page.getByRole('button', { name: 'Limpar filtros' }).click();
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(categoryFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Buscar fantasia')).toHaveValue('');
    await expect(cards(page)).toHaveCount(54);
  });
});

test.describe('cards', () => {
  test('AC-23: Leãozinho card', async ({ page }) => {
    const card = cards(page).filter({ has: page.getByRole('heading', { name: 'Leãozinho', exact: true }) });
    await expect(card.getByRole('listitem')).toHaveText(['PP', 'M2', 'G', 'GG']);
    await expect(card.getByRole('img', { name: 'Leãozinho' })).toBeAttached();
    await expect(card.getByRole('link', { name: 'Alugar Leãozinho pelo WhatsApp' })).toBeAttached();
  });

  test('AC-24: active size badge is marked', async ({ page }) => {
    await sizeFilter(page, 'M2').click();
    const active = catalog(page).locator('li[data-active="true"]');
    await expect(active).toHaveCount(await cards(page).count());
    await expect(active.first()).toHaveText('M2');
  });
});

test.describe('highlights and how it works', () => {
  test('AC-25: 6-month highlight', async ({ page }) => {
    const block = page.getByRole('region', { name: 'Destaques' });
    for (const name of ['Mestre Cuca / Chef (Introdução Alimentar)', 'Frutinhas (Introdução Alimentar)']) {
      const text = await decodedText(block.getByRole('link', { name: `Alugar ${name} pelo WhatsApp` }));
      expect(text).toBe(`Olá! Gostaria de verificar a disponibilidade da fantasia *${name}* da Fantasyário.`);
    }
    await expect(block.getByText('Tema mais pedido para comemoração dos 6 meses')).toBeVisible();
    await expect(block.getByText('Ideal para mesversário de 6 meses')).toBeVisible();
  });

  test('AC-26: date shortcuts in order', async ({ page }) => {
    await expect(page.getByRole('region', { name: 'Destaques' }).getByRole('button')).toHaveText([
      'Carnaval',
      'Carnaval (Bell Marques)',
      'Páscoa',
      'São João / Caipira',
      'São João / Cangaceiro',
      'Halloween',
      'Natal',
    ]);
  });

  test('AC-27/AC-28: shortcuts set the catalog filters', async ({ page }) => {
    await sizeFilter(page, 'GG').click();
    await page.getByRole('button', { name: 'Natal', exact: true }).click();
    await expect(catalog(page)).toBeInViewport();
    await expect(categoryFilter(page, 'Datas Comemorativas')).toHaveAttribute('aria-pressed', 'true');
    await expect(sizeFilter(page, 'Todos')).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByLabel('Buscar fantasia')).toHaveValue('Natal (Papai Noel)');
    await expect(cards(page)).toHaveCount(1);
    expect(await cardTitles(page)).toEqual(['Natal (Papai Noel)']);

    await page.getByRole('button', { name: 'Carnaval', exact: true }).click();
    await expect(cards(page)).toHaveCount(2);
    expect(await cardTitles(page)).toEqual(['Carnaval', 'Carnaval / Bell Marques']);
  });

  test('AC-29: four steps in order', async ({ page }) => {
    await expect(page.locator('#como-funciona li')).toHaveText([
      /Identifique o tamanho do seu baby na tabela \(PP ao GG\)\./,
      /Escolha o tema no catálogo de fantasias\./,
      /Reserve pelo WhatsApp confirmando a data da festa ou mesversário\./,
      /Celebre sem preocupação — peças higienizadas e prontas para vestir\./,
    ]);
  });

  test('AC-30: footer', async ({ page }) => {
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByText('Fantasyário', { exact: true })).toBeVisible();
    await expect(
      footer.getByText('Organize o mesversário do seu filho agora e fique tranquila o resto do ano!'),
    ).toBeVisible();
    await expect(footer.getByRole('link', { name: '(85) 99200-6868' })).toBeVisible();
    const ig = footer.getByRole('link', { name: 'Instagram da Fantasyário' });
    await expect(ig).toHaveAttribute('href', 'https://www.instagram.com/fantasyarioo/');
    await expect(ig).toHaveAttribute('target', '_blank');
  });
});

test.describe('accessibility', () => {
  test('AC-31: aria-pressed, labelled search, alt text, no serious axe violations', async ({ page }) => {
    for (const group of ['Filtrar por tamanho', 'Filtrar por categoria']) {
      for (const b of await page.getByRole('group', { name: group }).getByRole('button').all()) {
        await expect(b).toHaveAttribute('aria-pressed', /^(true|false)$/);
      }
    }
    await expect(page.getByLabel('Buscar fantasia')).toBeVisible();
    await expect(page.locator('img:not([alt])')).toHaveCount(0);
    const { violations } = await new AxeBuilder({ page }).analyze();
    const severe = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(severe.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });

  test('AC-32: reduced motion disables smooth scrolling', async ({ page }) => {
    const scrollBehavior = () => page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect(await scrollBehavior()).toBe('auto');
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    expect(await scrollBehavior()).toBe('smooth');
  });
});
