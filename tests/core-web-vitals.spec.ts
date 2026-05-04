import { expect, test } from '@playwright/test';

/**
 * Core Web Vitals Monitor — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3206  (Core Web Vitals Monitor)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Page loads with a URL input and "Run Test" button
 *  2. Clicking Run Test shows "Running Test..." loading state (button disabled)
 *  3. On success: score circle, LCP/CLS/INP metric badges render
 *  4. Metric badge colour classes match good/ok/poor thresholds
 *  5. "Save Snapshot" appends a row to the .audit-table
 *  6. The POST /external/pagespeed request body contains url, strategy, categories
 *  7. Free user sees "Unlock to Run Test" CTA (not the Run Test button)
 *  8. Free user output panel shows the paywall overlay
 */

const CWV_BASE = process.env.CWV_BASE_URL ?? 'http://localhost:3206';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

const GOOD_PSI_RESPONSE = {
  lighthouseResult: {
    categories: {
      performance: { score: 0.95 },
      accessibility: { score: 0.98 },
      'best-practices': { score: 0.92 },
      seo: { score: 0.99 },
    },
    audits: {
      'largest-contentful-paint': { numericValue: 1900 },
      'cumulative-layout-shift': { numericValue: 0.042 },
      'interaction-to-next-paint': { numericValue: 165 },
    },
  },
};

const POOR_PSI_RESPONSE = {
  lighthouseResult: {
    categories: {
      performance: { score: 0.38 },
      accessibility: { score: 0.45 },
      'best-practices': { score: 0.41 },
      seo: { score: 0.5 },
    },
    audits: {
      'largest-contentful-paint': { numericValue: 6500 },
      'cumulative-layout-shift': { numericValue: 0.35 },
      'interaction-to-next-paint': { numericValue: 650 },
    },
  },
};

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Core Web Vitals Monitor — page load', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CWV_BASE);
  });

  test('page loads with URL text input pre-filled and Run Test button visible', async ({ page }) => {
    const urlInput = page.locator('input.text-input');
    await expect(urlInput).toBeVisible();
    await expect(urlInput).toHaveValue('https://example.com');

    const runBtn = page.locator('button.primary-button', { hasText: 'Run Test' });
    await expect(runBtn).toBeVisible();
    await expect(runBtn).toBeEnabled();
  });

  test('output panel initially shows "Waiting for test" placeholder text', async ({ page }) => {
    await expect(page.locator('.muted-note')).toContainText(/run a test/i);
  });
});

test.describe('Core Web Vitals Monitor — run test lifecycle (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CWV_BASE);
  });

  test('clicking Run Test shows "Running Test..." and button is disabled', async ({ page }) => {
    // Delay the PSI response to observe loading state
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await new Promise((r) => setTimeout(r, 800));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();

    const runBtn = page.locator('button.primary-button');
    await expect(runBtn).toHaveText('Running Test...');
    await expect(runBtn).toBeDisabled();
  });

  test('run test completes and score circle appears', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();

    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });
    // Score is 95 (0.95 * 100)
    await expect(page.locator('.score-circle')).toContainText('95');
  });

  test('good scores render .score-badge--good badges for LCP, CLS, INP', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });

    // LCP 1.9s < 2500ms → good; CLS 0.042 < 0.1 → good; INP 165ms < 200ms → good
    const goodBadges = page.locator('.score-badge--good');
    await expect(goodBadges).toHaveCount(3);
  });

  test('poor scores render .score-badge--poor badges for LCP, CLS, INP', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(POOR_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });

    // LCP 6.5s > 4000ms → poor; CLS 0.35 > 0.25 → poor; INP 650ms > 500ms → poor
    const poorBadges = page.locator('.score-badge--poor');
    await expect(poorBadges).toHaveCount(3);
  });

  test('result shows Accessibility, Best Practices and SEO scores', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });

    const outputText = await page.locator('.output-panel').textContent();
    expect(outputText).toMatch(/accessibility/i);
    expect(outputText).toMatch(/best practices/i);
    expect(outputText).toMatch(/seo/i);
  });

  test('POST /external/pagespeed body contains url, strategy and categories', async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      capturedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });

    expect(capturedBody).not.toBeNull();
    if (capturedBody) {
      expect(typeof capturedBody['url']).toBe('string');
      expect(capturedBody['strategy']).toBe('mobile');
      expect(Array.isArray(capturedBody['categories'])).toBe(true);
      const cats = capturedBody['categories'] as string[];
      expect(cats).toContain('performance');
      expect(cats).toContain('accessibility');
    }
  });

  test('Run Test button is enabled again after test completes', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });
    await expect(page.locator('button.primary-button', { hasText: 'Run Test' })).toBeEnabled();
  });
});

test.describe('Core Web Vitals Monitor — Save Snapshot (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CWV_BASE);

    // Run a test first so Save Snapshot button appears
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(GOOD_PSI_RESPONSE),
      });
    });
    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });
  });

  test('"Save Snapshot" button appears after a successful test', async ({ page }) => {
    await expect(
      page.locator('button.primary-button', { hasText: 'Save Snapshot' }),
    ).toBeVisible();
  });

  test('clicking Save Snapshot appends a row to the snapshot table', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Save Snapshot' }).click();

    // The audit-table should now have one data row
    await expect(page.locator('table.audit-table tbody tr')).toHaveCount(1);
  });

  test('snapshot table row contains the URL and a performance score', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Save Snapshot' }).click();

    const rowText = await page.locator('table.audit-table tbody tr').first().textContent();
    expect(rowText).toContain('example.com');
    expect(rowText).toContain('95'); // performance score
  });

  test('saving a second snapshot adds a second table row', async ({ page }) => {
    // Run another test
    await page.locator('button.primary-button', { hasText: 'Save Snapshot' }).click();

    await page.locator('button.primary-button', { hasText: 'Run Test' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 15_000 });
    await page.locator('button.primary-button', { hasText: 'Save Snapshot' }).click();

    await expect(page.locator('table.audit-table tbody tr')).toHaveCount(2);
  });
});

test.describe('Core Web Vitals Monitor — free user paywall', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: null,
        session: null,
      };
    });
    await page.goto(CWV_BASE);
  });

  test('free user sees "Unlock to Run Test" CTA instead of the Run Test button', async ({
    page,
  }) => {
    await expect(page.locator('a', { hasText: 'Unlock to Run Test' })).toBeVisible();
    await expect(
      page.locator('button.primary-button', { hasText: 'Run Test' }),
    ).toHaveCount(0);
  });

  test('free user output panel shows the paywall overlay', async ({ page }) => {
    await expect(page.locator('a', { hasText: 'Unlock Full Access →' })).toBeVisible();
  });

  test('free user paywall CTA links to designedbyanthony.com/tools', async ({ page }) => {
    const href = await page.locator('a', { hasText: 'Unlock to Run Test' }).getAttribute('href');
    expect(href).toContain('designedbyanthony.com/tools');
  });

  test('free user can still edit the URL input', async ({ page }) => {
    const urlInput = page.locator('input.text-input');
    await urlInput.fill('https://mysite.com');
    await expect(urlInput).toHaveValue('https://mysite.com');
  });
});
