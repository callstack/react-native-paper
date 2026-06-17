import fs from 'fs';
import os from 'os';
import path from 'path';
import type { Page } from 'playwright/test';
import { expect, test } from 'playwright/test';

const pages = [
  {
    name: 'home-5x',
    path: '.',
    beforeScreenshot: async (page: Page) => {
      await expect(page.getByRole('button', { name: 'Loading' })).toBeVisible();
      await expect(page.getByText('Display Large')).toBeVisible();
    },
  },
  {
    name: 'home-version-menu-5x',
    path: '.',
    beforeScreenshot: async (page: Page) => {
      const trigger = page
        .locator('.rp-nav__others .rp-nav-menu__item')
        .first();
      await trigger.hover();
      await expect(
        page.locator('.rp-nav__others .rp-hover-group__item__link')
      ).toHaveText(['5.x', '6.x', '4.x', '3.x', '2.x', '1.x']);
    },
  },
  { name: 'guide-getting-started-5x', path: 'docs/guides/getting-started' },
  {
    name: 'guide-getting-started-6x',
    path: '6.x/docs/guides/getting-started',
    beforeScreenshot: async (page: Page) => {
      await expect(
        page.getByText('This is unreleased documentation')
      ).toBeVisible();
      await expect(
        page.getByText(
          'For up-to-date documentation, see the latest version (5.x).'
        )
      ).toBeVisible();
    },
  },
  {
    name: 'component-activity-indicator-5x',
    path: 'docs/components/ActivityIndicator',
  },
  {
    name: 'component-activity-indicator-6x',
    path: '6.x/docs/components/ActivityIndicator',
  },
  { name: 'showcase-6x', path: '6.x/docs/showcase' },
];

const captureDir = path.join(
  os.tmpdir(),
  'react-native-paper-docs-visual',
  'current'
);

test.describe('local docs visual captures', () => {
  test.beforeAll(() => {
    fs.mkdirSync(captureDir, { recursive: true });
  });

  for (const entry of pages) {
    test(entry.name, async ({ page, baseURL }) => {
      const url = new URL(entry.path, baseURL).toString();

      await page.goto(url, { waitUntil: 'networkidle' });
      await expect(page).toHaveURL(url);
      await entry.beforeScreenshot?.(page);

      const outputPath = path.join(captureDir, `${entry.name}.png`);
      await page.screenshot({
        fullPage: true,
        path: outputPath,
      });
    });
  }
});
