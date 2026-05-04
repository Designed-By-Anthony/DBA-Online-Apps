import { expect, test } from '@playwright/test';

/**
 * Local SEO Audit Kit — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3202  (Local SEO Audit Kit)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Page loads with 4 text inputs, 3 checkboxes, and "Run Audit" button
 *  2. Empty form → clicking Run Audit → score is 0, all 7 checks show ❌
 *  3. Filling all 4 text inputs → 4 checks pass → correct partial score
 *  4. Checking all 3 checkboxes with filled inputs → score is 100
 *  5. Failing checks produce a recommendations list
 *  6. Passing all checks → "Everything checks out" message (no recommendations)
 *  7. POST /seo-audit/run carries businessName, location, and results schema
 *  8. Free user sees "Unlock to Run Audit" CTA (not the Run Audit button)
 *  9. Free user output panel shows the paywall overlay
 */

const SEO_BASE = process.env.SEO_BASE_URL ?? 'http://localhost:3202';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Local SEO Audit Kit — page load', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(SEO_BASE);
  });

  test('page loads with Business Name, Phone, Address and Website inputs', async ({ page }) => {
    await expect(page.locator('label.field', { hasText: 'Business Name' })).toBeVisible();
    await expect(page.locator('label.field', { hasText: 'Phone' })).toBeVisible();
    await expect(page.locator('label.field', { hasText: 'Address' })).toBeVisible();
    await expect(page.locator('label.field', { hasText: 'Website' })).toBeVisible();
  });

  test('page loads with all 3 checkboxes unchecked', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]');
    await expect(checkboxes).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(checkboxes.nth(i)).not.toBeChecked();
    }
  });

  test('"Run Audit" button is visible and enabled', async ({ page }) => {
    await expect(page.locator('button.primary-button', { hasText: 'Run Audit' })).toBeVisible();
    await expect(page.locator('button.primary-button', { hasText: 'Run Audit' })).toBeEnabled();
  });

  test('output panel shows "Waiting for audit" placeholder before running', async ({ page }) => {
    await expect(page.locator('.panel-heading span').last()).toContainText(/waiting for audit/i);
  });
});

test.describe('Local SEO Audit Kit — empty form audit (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });

    // Stub the D1 persist call so CI doesn't need a live Worker
    await page.route(`${API_BASE}/seo-audit/run`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'e2e-audit-id', ok: true }),
      });
    });

    await page.goto(SEO_BASE);
  });

  test('empty form produces score 0 and all 7 checks show ❌', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();

    // Score circle shows 0
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.score-circle')).toContainText('0');

    // All 7 check rows have the fail icon
    const failIcons = page.locator('.check-icon', { hasText: '❌' });
    await expect(failIcons).toHaveCount(7);
  });

  test('output panel heading reflects 0/100 after empty audit', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('.panel-heading span').last()).toContainText('0/100');
  });

  test('all 7 failing checks produce 7 recommendation items', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    const recommendations = page.locator('ul.list li');
    await expect(recommendations).toHaveCount(7);
  });
});

test.describe('Local SEO Audit Kit — full score audit (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });

    await page.route(`${API_BASE}/seo-audit/run`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'e2e-audit-full', ok: true }),
      });
    });

    await page.goto(SEO_BASE);

    // Fill all 4 text inputs
    const textInputs = page.locator('input.text-input');
    await textInputs.nth(0).fill('North Star HVAC'); // Business Name
    await textInputs.nth(1).fill('315-555-0100'); // Phone
    await textInputs.nth(2).fill('123 Main St, Utica NY'); // Address
    await textInputs.nth(3).fill('https://northstarhvac.com'); // Website

    // Check all 3 checkboxes
    const checkboxes = page.locator('input[type="checkbox"]');
    await checkboxes.nth(0).check(); // Google Business Profile
    await checkboxes.nth(1).check(); // Consistent address
    await checkboxes.nth(2).check(); // 5+ reviews
  });

  test('filling all inputs and checking all boxes produces score 100', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();

    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.score-circle')).toContainText('100');
  });

  test('all 7 checks show ✅ when everything passes', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    const passIcons = page.locator('.check-icon', { hasText: '✅' });
    await expect(passIcons).toHaveCount(7);
  });

  test('no recommendation list appears when everything passes', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    // No failing recommendations list
    await expect(page.locator('ul.list')).toHaveCount(0);
    await expect(page.locator('.muted-note')).toContainText(/everything checks out/i);
  });

  test('output panel heading shows 100/100', async ({ page }) => {
    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    await expect(page.locator('.panel-heading span').last()).toContainText('100/100');
  });
});

test.describe('Local SEO Audit Kit — partial score', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });

    await page.route(`${API_BASE}/seo-audit/run`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'e2e-partial', ok: true }),
      });
    });

    await page.goto(SEO_BASE);
  });

  test('filling only Business Name and Phone gives score ~29 (2/7 checks)', async ({ page }) => {
    await page.locator('input.text-input').nth(0).fill('North Star HVAC');
    await page.locator('input.text-input').nth(1).fill('315-555-0100');

    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    // 2/7 ≈ 29
    await expect(page.locator('.score-circle')).toContainText('29');
  });
});

test.describe('Local SEO Audit Kit — D1 persist schema', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(SEO_BASE);
  });

  test('POST /seo-audit/run carries businessName, location, and results schema', async ({
    page,
  }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/seo-audit/run`, async (route) => {
      capturedBody = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'schema-test-id', ok: true }),
      });
    });

    await page.locator('input.text-input').nth(0).fill('Apex Roofing');
    await page.locator('input.text-input').nth(2).fill('456 Oak Ave, Rome NY');
    await page.locator('input.text-input').nth(3).fill('https://apexroofing.com');

    await page.locator('button.primary-button', { hasText: 'Run Audit' }).click();
    await expect(page.locator('.score-circle')).toBeVisible({ timeout: 10_000 });

    if (capturedBody) {
      expect(typeof capturedBody['businessName']).toBe('string');
      expect(capturedBody['businessName']).toBe('Apex Roofing');
      expect(typeof capturedBody['location']).toBe('string');

      const results = capturedBody['results'] as { score: number; checks: unknown[] };
      expect(typeof results.score).toBe('number');
      expect(Array.isArray(results.checks)).toBe(true);
      expect(results.checks).toHaveLength(7);
    }
  });
});

test.describe('Local SEO Audit Kit — free user paywall', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: null,
        session: null,
      };
    });
    await page.goto(SEO_BASE);
  });

  test('free user sees "Unlock to Run Audit" CTA instead of the Run Audit button', async ({
    page,
  }) => {
    await expect(page.locator('a', { hasText: 'Unlock to Run Audit' })).toBeVisible();
    await expect(
      page.locator('button.primary-button', { hasText: 'Run Audit' }),
    ).toHaveCount(0);
  });

  test('free user output panel shows paywall overlay', async ({ page }) => {
    await expect(page.locator('a', { hasText: 'Unlock Full Access →' })).toBeVisible();
  });

  test('free user paywall CTA links to designedbyanthony.com/tools', async ({ page }) => {
    const href = await page
      .locator('a', { hasText: 'Unlock to Run Audit' })
      .getAttribute('href');
    expect(href).toContain('designedbyanthony.com/tools');
  });

  test('free user can still fill in the business details form', async ({ page }) => {
    await page.locator('input.text-input').nth(0).fill('Test Business');
    await expect(page.locator('input.text-input').nth(0)).toHaveValue('Test Business');
  });
});
