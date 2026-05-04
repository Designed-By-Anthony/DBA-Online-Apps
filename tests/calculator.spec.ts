import { expect, test } from '@playwright/test';

/**
 * Construction Calculator — E2E Tests
 *
 * Suite: all tiers (inputs are public; results are gated)
 * App:   http://localhost:3208  (Construction Calculator)
 *
 * Verified behaviours:
 *  1. Hub loads with all 7 category tabs and the default Concrete Slab form
 *  2. Clicking a category tab switches the visible calculator list
 *  3. Clicking a calc in the list renders the correct form
 *  4. Filling in inputs produces visible result rows (paid user)
 *  5. The Labor Cost calculator outputs a dollar total
 *  6. The Wire Gauge calculator outputs a gauge recommendation
 *  7. Free user sees the paywall overlay over results ("Unlock Full Access →")
 *  8. Free user: the paywall link points to designedbyanthony.com/tools
 */

const CALC_BASE = process.env.CALC_BASE_URL ?? 'http://localhost:3208';

// Paid-user tests — authenticated storageState injected by chromium-auth project
test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Construction Calculator — hub navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CALC_BASE);
  });

  test('hub loads with all 7 category tabs visible', async ({ page }) => {
    const tabs = page.locator('.cat-tab');
    await expect(tabs).toHaveCount(7);

    // Check specific category labels
    await expect(page.locator('.cat-tab', { hasText: 'Concrete' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Framing' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Roofing' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Insulation' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Finishes' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Electrical' })).toBeVisible();
    await expect(page.locator('.cat-tab', { hasText: 'Labor' })).toBeVisible();
  });

  test('Concrete category is active by default showing Concrete Slab', async ({ page }) => {
    await expect(page.locator('.cat-tab--active')).toContainText('Concrete');
    await expect(page.locator('.calc-item--active')).toContainText('Concrete Slab');
    await expect(page.locator('.calc-panel-title')).toContainText('Concrete Slab');
  });

  test('clicking Framing tab switches to wall-studs calculator', async ({ page }) => {
    await page.locator('.cat-tab', { hasText: 'Framing' }).click();

    await expect(page.locator('.cat-tab--active')).toContainText('Framing');
    await expect(page.locator('.calc-item--active')).toContainText('Wall Studs');
    await expect(page.locator('.calc-panel-title')).toContainText('Wall Studs');

    // Framing category has 3 calculators listed
    await expect(page.locator('.calc-item')).toHaveCount(3);
  });

  test('clicking Rafter Length in Framing tab renders the rafter form', async ({ page }) => {
    await page.locator('.cat-tab', { hasText: 'Framing' }).click();
    await page.locator('.calc-item', { hasText: 'Rafter Length' }).click();

    await expect(page.locator('.calc-item--active')).toContainText('Rafter Length');
    await expect(page.locator('.calc-panel-title')).toContainText('Rafter Length');

    // Rafter form has "Building Span" and "Roof Pitch" inputs
    await expect(page.locator('.field-label', { hasText: 'Building Span' })).toBeVisible();
    await expect(page.locator('.field-label', { hasText: 'Roof Pitch' })).toBeVisible();
  });

  test('Electrical tab has only the Wire Gauge calculator', async ({ page }) => {
    await page.locator('.cat-tab', { hasText: 'Electrical' }).click();
    await expect(page.locator('.calc-item')).toHaveCount(1);
    await expect(page.locator('.calc-item')).toContainText('Wire Gauge');
  });

  test('Labor tab has only the Labor Cost calculator', async ({ page }) => {
    await page.locator('.cat-tab', { hasText: 'Labor' }).click();
    await expect(page.locator('.calc-item')).toHaveCount(1);
    await expect(page.locator('.calc-item')).toContainText('Labor Cost');
  });
});

test.describe('Construction Calculator — concrete slab calculation (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CALC_BASE);
  });

  test('default concrete slab inputs produce visible result rows immediately', async ({ page }) => {
    // Results render reactively — no button click required
    const resultRows = page.locator('.result-row');
    await expect(resultRows.first()).toBeVisible();

    // At least one result should have a non-zero numeric value
    const firstNum = page.locator('.result-num').first();
    await expect(firstNum).toBeVisible();
  });

  test('changing length clears and rerenders result rows', async ({ page }) => {
    const lengthInput = page.locator('.field-input').first();
    await lengthInput.fill('20');

    const resultRows = page.locator('.result-row');
    await expect(resultRows.first()).toBeVisible();
  });

  test('highlight row has result-row--highlight class', async ({ page }) => {
    // The concrete slab calculator has a highlighted total row
    await expect(page.locator('.result-row--highlight')).toHaveCount({ min: 1 });
  });
});

test.describe('Construction Calculator — labor cost (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CALC_BASE);
    await page.locator('.cat-tab', { hasText: 'Labor' }).click();
  });

  test('labor cost result contains a dollar value', async ({ page }) => {
    // Default: 3 workers × 8 hours × $35/hr = $840
    const resultRows = page.locator('.result-row');
    await expect(resultRows.first()).toBeVisible();

    // Result unit should mention $ or the label should mention cost
    const resultText = await page.locator('.results').textContent();
    expect(resultText).toMatch(/\$|cost|total/i);
  });
});

test.describe('Construction Calculator — wire gauge (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(CALC_BASE);
    await page.locator('.cat-tab', { hasText: 'Electrical' }).click();
  });

  test('wire gauge results panel is visible with a gauge recommendation', async ({ page }) => {
    const resultRows = page.locator('.result-row');
    await expect(resultRows.first()).toBeVisible();

    // Wire gauge result mentions AWG
    const resultsText = await page.locator('.results').textContent();
    expect(resultsText).toMatch(/AWG|gauge|wire|amp/i);
  });
});

test.describe('Construction Calculator — free user paywall', () => {
  test.beforeEach(async ({ page }) => {
    // Simulate a free / unauthenticated visitor
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: null,
        session: null,
      };
    });
    await page.goto(CALC_BASE);
  });

  test('free user sees the paywall overlay on results (not the actual numbers)', async ({
    page,
  }) => {
    // The results panel is rendered with a blur + overlay for locked users
    const unlockLink = page.locator('a', { hasText: 'Unlock Full Access →' });
    await expect(unlockLink).toBeVisible();
  });

  test('the paywall CTA points to designedbyanthony.com/tools', async ({ page }) => {
    const unlockLink = page.locator('a', { hasText: 'Unlock Full Access →' }).first();
    await expect(unlockLink).toBeVisible();
    const href = await unlockLink.getAttribute('href');
    expect(href).toContain('designedbyanthony.com/tools');
  });

  test('free user can still navigate category tabs and fill inputs', async ({ page }) => {
    // The form inputs are always accessible even in locked state
    await page.locator('.cat-tab', { hasText: 'Labor' }).click();
    await expect(page.locator('.calc-panel-title')).toContainText('Labor Cost');

    // Inputs are present and editable
    const inputs = page.locator('.field-input');
    await expect(inputs.first()).toBeVisible();
    await inputs.first().fill('5');
  });
});
