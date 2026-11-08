import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs/promises';
import AxeBuilder from '@axe-core/playwright';
import repos from '../../src/data/plugins.json' with { type: 'json' };

const round = process.env.SCREENSHOT_ROUND || 'round-1';
async function capture(page: Page, name: string) {
  await fs.mkdir(`.impeccable/screenshots/${round}`, { recursive: true });
  await page.screenshot({ path: `.impeccable/screenshots/${round}/${name}.png`, fullPage: true });
  await page.screenshot({ path: `.impeccable/screenshots/${round}/${name}-viewport.png` });
}
async function mockPlugins(page: Page, failures = false) {
  await page.route('https://raw.githubusercontent.com/**', async (route) => {
    const url = new URL(route.request().url());
    if (url.pathname.endsWith('.png')) return route.abort();
    if (failures && url.pathname.includes('DeepLX'))
      return route.fulfill({ status: 503, body: 'temporarily unavailable' });
    if (url.pathname.endsWith('zh-cn.json')) return route.fulfill({ status: 404, body: '' });
    const repo = url.pathname.split('/')[2];
    const provider = repo.split('.').slice(3).join('.') || '插件';
    const type = repo.split('.')[2];
    await route.fulfill({
      json: {
        Name: provider,
        Author: url.pathname.split('/')[1],
        Version: '1.0.0',
        Description: `${provider} ${type === 'Ocr' ? '文本识别服务，将图片中的文字提取出来。' : type === 'Tts' ? '语音朗读服务，在日常阅读中聆听文本。' : '翻译服务，接入熟悉的语言工具。'}`,
      },
    });
  });
}
async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
}

for (const [name, width, height, dark] of [
  ['desktop', 1440, 1050, false],
  ['mobile', 390, 844, false],
  ['dark', 1440, 1050, true],
] as const) {
  test(`homepage ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('即刻读懂');
    await expect(page.locator('.floating-product img')).toBeVisible();
    expect(
      await page
        .locator('.floating-product img')
        .evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0),
    ).toBe(true);
    await noOverflow(page);
    await capture(page, `home-${name}`);
  });
}

for (const [name, width, height] of [
  ['desktop', 1440, 1050],
  ['mobile', 390, 844],
] as const) {
  test(`documentation ${name}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/docs/getting-started/');
    await expect(page.locator('h1')).toHaveText('快速开始');
    await noOverflow(page);
    if (name === 'mobile') {
      await page.getByRole('button', { name: '文档导航', exact: true }).click();
      await expect(page.locator('#docs-sidebar')).toBeVisible();
      await page.getByRole('button', { name: '文档导航', exact: true }).click();
      await page.getByText('本页目录', { exact: true }).click();
      await expect(page.getByRole('navigation', { name: '移动本页目录' })).toBeVisible();
      await page.getByText('本页目录', { exact: true }).click();
    }
    await capture(page, `docs-${name}`);
    await page
      .getByRole('button', { name: '放大查看：STranslate 首次启动向导：语言与颜色主题设置' })
      .click();
    await expect(page.getByRole('dialog', { name: '放大查看图片' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: '放大查看图片' })).not.toBeVisible();
  });
}

for (const [name, width, height] of [
  ['desktop', 1440, 1050],
  ['mobile', 390, 844],
] as const) {
  test(`plugins ${name}`, async ({ page }) => {
    await mockPlugins(page);
    await page.setViewportSize({ width, height });
    await page.goto('/plugins/');
    await expect(page.locator('.results-count')).toContainText(`显示 ${repos.length} 个插件`);
    await expect(page.locator('.plugin-fallback').first()).toBeVisible();
    await noOverflow(page);
    await capture(page, `plugins-${name}`);
    await page.getByRole('button', { name: /^OCR/ }).click();
    await expect(page.locator('.plugin-card')).toHaveCount(7);
    await page.getByRole('searchbox', { name: '搜索插件名称、描述或作者' }).fill('没有匹配的内容');
    await expect(page.getByText('没有找到匹配的插件')).toBeVisible();
    await page.getByRole('button', { name: '清除筛选条件' }).click();
    await expect(page.locator('.plugin-card')).toHaveCount(repos.length);
  });
}

test('Chinese search, keyboard navigation and theme persistence', async ({ page }) => {
  await page.goto('/docs/');
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: '搜索使用文档' });
  await expect(search).toBeVisible();
  await page.getByRole('searchbox', { name: '搜索使用文档' }).fill('图片翻译');
  await expect(page.locator('#search-results a').first()).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('#search-results a').first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/docs\//);
  await page.getByRole('button', { name: '切换深浅主题' }).click();
  const theme = await page.locator('html').getAttribute('data-theme');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', theme!);
});

test('partial failures keep successful plugins, retry recovers', async ({ page }) => {
  await mockPlugins(page, true);
  await page.goto('/plugins/');
  await expect(page.getByRole('button', { name: '重试失败项' })).toBeEnabled();
  await expect(page.locator('.plugin-card')).toHaveCount(repos.length - 1);
  await page.unroute('https://raw.githubusercontent.com/**');
  await mockPlugins(page);
  await page.getByRole('button', { name: '重试失败项' }).click();
  await expect(page.locator('.plugin-card')).toHaveCount(repos.length);
  await expect(page.locator('.market-notice')).not.toBeVisible();
});

test('total outage is distinguishable from no search matches', async ({ page }) => {
  await page.route('https://raw.githubusercontent.com/**', (route) =>
    route.fulfill({ status: 503, body: '' }),
  );
  await page.goto('/plugins/');
  await expect(page.getByText('插件信息暂时无法加载', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '重试失败项' })).toBeEnabled();
  await expect(page.getByText('没有找到匹配的插件', { exact: true })).not.toBeVisible();
});

test('tutorial media uses controls and no automatic video loading', async ({ page }) => {
  await page.goto('/docs/translation/');
  expect(await page.locator('video').count()).toBe(3);
  for (const video of await page.locator('video').all()) {
    await expect(video).toHaveAttribute('preload', 'none');
    await expect(video).toHaveAttribute('controls', '');
    expect(await video.getAttribute('autoplay')).toBeNull();
  }
});

test('tablet layouts and dark document and plugin surfaces', async ({ page }) => {
  await mockPlugins(page);
  await page.setViewportSize({ width: 768, height: 1024 });
  for (const [route, name] of [
    ['/', 'home-tablet'],
    ['/docs/invoke/', 'docs-tablet'],
    ['/plugins/', 'plugins-tablet'],
  ]) {
    await page.goto(route);
    if (route === '/plugins/')
      await expect(page.locator('.results-count')).toContainText(`显示 ${repos.length} 个插件`);
    await noOverflow(page);
    await capture(page, name);
  }
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.emulateMedia({ colorScheme: 'dark' });
  for (const [route, name] of [
    ['/docs/invoke/', 'docs-dark'],
    ['/plugins/', 'plugins-dark'],
  ]) {
    await page.goto(route);
    if (route === '/plugins/')
      await expect(page.locator('.results-count')).toContainText(`显示 ${repos.length} 个插件`);
    await noOverflow(page);
    await capture(page, name);
  }
});

test('narrow phones preserve the whole headline and navigation', async ({ page }) => {
  await mockPlugins(page);
  await page.setViewportSize({ width: 320, height: 800 });
  for (const route of ['/', '/docs/', '/plugins/']) {
    await page.goto(route);
    await noOverflow(page);
  }
  await page.goto('/');
  await capture(page, 'home-narrow');
  for (const width of [1440, 1149, 1024, 850, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1050 });
    const figure = await page.locator('.floating-product').boundingBox();
    const browser = await page.locator('.reading-browser').boundingBox();
    expect(figure!.y + figure!.height, `Floating figure at ${width}px`).toBeLessThanOrEqual(
      browser!.y + browser!.height,
    );
    await noOverflow(page);
  }
});

test('light and dark surfaces meet automated WCAG A and AA checks', async ({ page }) => {
  await mockPlugins(page);
  const violations: unknown[] = [];
  for (const scheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    for (const route of ['/', '/docs/invoke/', '/plugins/']) {
      await page.goto(route);
      if (route === '/plugins/')
        await expect(page.locator('.results-count')).toContainText(`显示 ${repos.length} 个插件`);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      violations.push(
        ...results.violations.map((v) => ({
          route,
          scheme,
          id: v.id,
          description: v.description,
          nodes: v.nodes.map((n) => n.target),
        })),
      );
    }
  }
  expect(violations).toEqual([]);
});
