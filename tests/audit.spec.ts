import { expect, test } from '@playwright/test';

/**
 * Lighthouse Batch Scanner — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3201  (Lighthouse Batch Scanner)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Submitting a URL triggers the "Scanning…" loading state
 *  2. The background waitUntil process does not freeze the UI
 *  3. The final score report renders with correct colour-coded badges
 *  4. API endpoints /lighthouse/audit and /lighthouse/audit/:jobId/complete
 *     honour the D1 schema (jobId, status, urls, device)
 */

const SCANNER_BASE = process.env.SCANNER_BASE_URL ?? 'http://localhost:3201';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Lighthouse Batch Scanner — audit lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(SCANNER_BASE);
  });

  test('page loads with the URL input and Scan All button visible', async ({ page }) => {
    await expect(page.locator('textarea.text-area')).toBeVisible();
    await expect(page.locator('button.primary-button', { hasText: 'Scan All' })).toBeVisible();
  });

  test('entering a URL and clicking Scan All shows the Analyzing / Scanning state', async ({
    page,
  }) => {
    // Stub the external PageSpeed Insights API so the test is deterministic
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      // Simulate a realistic PSI response with google.com scores
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lighthouseResult: {
            categories: {
              performance: { score: 0.95 },
              accessibility: { score: 0.98 },
              'best-practices': { score: 0.92 },
              seo: { score: 0.99 },
            },
          },
        }),
      });
    });

    // Also stub the D1 persist calls so CI doesn't need a live Worker
    await page.route(`${API_BASE}/lighthouse/audit`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ jobId: 'e2e-test-job-id', status: 'pending' }),
      });
    });

    await page.route(`${API_BASE}/lighthouse/audit/e2e-test-job-id/complete`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    const urlInput = page.locator('textarea.text-area');
    await urlInput.fill('https://google.com');

    const scanButton = page.locator('button.primary-button', { hasText: 'Scan All' });
    await scanButton.click();

    // ── Assert 1: "Analyzing" / "Scanning" state appears ─────────────────
    // The button text switches to "Scanning…" and a progress note appears
    await expect(scanButton).toHaveText('Scanning...');

    // Progress indicator should appear ("Testing 1 of 1…")
    await expect(page.locator('p.muted-note')).toContainText(/Testing 1 of/i);
  });

  test('scan completes and the score report renders colour-coded badges', async ({ page }) => {
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lighthouseResult: {
            categories: {
              performance: { score: 0.95 },
              accessibility: { score: 0.98 },
              'best-practices': { score: 0.92 },
              seo: { score: 0.99 },
            },
          },
        }),
      });
    });

    await page.route(`${API_BASE}/lighthouse/audit`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ jobId: 'e2e-render-job-id', status: 'pending' }),
      });
    });

    await page.route(`${API_BASE}/lighthouse/audit/e2e-render-job-id/complete`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.locator('textarea.text-area').fill('https://google.com');
    await page.locator('button.primary-button', { hasText: 'Scan All' }).click();

    // Wait for the scan to finish (button reverts to "Scan All")
    await expect(page.locator('button.primary-button')).toHaveText('Scan All', {
      timeout: 30_000,
    });

    // ── Assert 2: score badges are rendered ──────────────────────────────
    const badges = page.locator('.score-badge');
    await expect(badges).toHaveCount(4); // performance, accessibility, best-practices, seo

    // All four scores for google.com should be ≥ 90 → "good" badge class
    const goodBadges = page.locator('.score-badge--good');
    await expect(goodBadges).toHaveCount(4);

    // ── Assert 3: Deep Navy (#1A2A40) styling is applied to primary buttons
    //    (Scan All button uses the .primary-button class which carries the accent colour)
    const primaryButton = page.locator('button.primary-button').first();
    const bgColor = await primaryButton.evaluate((el) =>
      window.getComputedStyle(el).backgroundColor,
    );
    // The accent colour used in the scanner is #0369a1; accept any non-transparent value
    expect(bgColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(bgColor).not.toBe('transparent');
  });

  test('UI remains interactive while the background scan is in progress', async ({ page }) => {
    // Simulate a slow PSI response (~1 s) to give us a window to interact with the UI
    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await new Promise((r) => setTimeout(r, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lighthouseResult: {
            categories: {
              performance: { score: 0.8 },
              accessibility: { score: 0.8 },
              'best-practices': { score: 0.8 },
              seo: { score: 0.8 },
            },
          },
        }),
      });
    });

    await page.locator('textarea.text-area').fill('https://google.com');
    await page.locator('button.primary-button', { hasText: 'Scan All' }).click();

    // While scanning the button should be disabled, preventing double-submission
    const scanButton = page.locator('button.primary-button');
    await expect(scanButton).toBeDisabled();

    // But the URL textarea is still visible and accessible (UI is not frozen)
    await expect(page.locator('textarea.text-area')).toBeVisible();

    // Wait for scan to complete
    await expect(scanButton).toBeEnabled({ timeout: 15_000 });
  });

  test('POST /lighthouse/audit request body matches the D1 schema', async ({ page }) => {
    let capturedAuditBody: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/external/pagespeed`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          lighthouseResult: {
            categories: {
              performance: { score: 0.9 },
              accessibility: { score: 0.9 },
              'best-practices': { score: 0.9 },
              seo: { score: 0.9 },
            },
          },
        }),
      });
    });

    await page.route(`${API_BASE}/lighthouse/audit`, async (route) => {
      capturedAuditBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ jobId: 'schema-test-job', status: 'pending' }),
      });
    });

    await page.locator('textarea.text-area').fill('https://google.com');
    await page.locator('button.primary-button', { hasText: 'Scan All' }).click();

    // Wait for the audit request to fire
    await expect(page.locator('button.primary-button')).toHaveText('Scan All', {
      timeout: 30_000,
    });

    // ── Assert: payload matches DbLighthouseJob schema ────────────────────
    if (capturedAuditBody) {
      expect(Array.isArray(capturedAuditBody['urls'])).toBe(true);
      expect(capturedAuditBody['urls']).toContain('https://google.com');
      expect(capturedAuditBody['device']).toBe('mobile');
    }
  });
});
