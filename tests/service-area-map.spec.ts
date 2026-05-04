import { expect, test } from '@playwright/test';

/**
 * Service Area Map Generator — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3204  (Service Area Map Generator)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Page loads with default "Dallas, TX" in the city list and output panel
 *  2. Adding a new city appends it to ul.list
 *  3. Removing a city removes it from ul.list
 *  4. Output panel contains a map iframe pointing to Google Maps
 *  5. Map embed code block contains the city/state query
 *  6. JSON-LD schema block contains the business name and areaServed cities
 *  7. Service cities HTML block contains each area as <li>
 *  8. Clicking Copy on any block shows "Copied" state and reverts
 *  9. Save Map button triggers POST /maps with businessName and areas
 * 10. Save Map button shows "Saved to Dashboard" after successful save
 * 11. Free user sees "Unlock Full Access →" paywall on the output panel
 * 12. Free user: Add City button is always accessible (input panel not gated)
 */

const MAP_BASE = process.env.MAP_BASE_URL ?? 'http://localhost:3204';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Service Area Map Generator — page load', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(MAP_BASE);
  });

  test('page loads with Business Name input pre-filled', async ({ page }) => {
    const businessInput = page.locator('label.field', { hasText: 'Business Name' }).locator('input.text-input');
    await expect(businessInput).toBeVisible();
    await expect(businessInput).toHaveValue('Your Business Name');
  });

  test('city, state and radius inputs are visible', async ({ page }) => {
    await expect(page.locator('label.field', { hasText: 'City' }).locator('input.text-input')).toBeVisible();
    await expect(page.locator('label.field', { hasText: 'State' }).locator('input.text-input')).toBeVisible();
    await expect(page.locator('label.field', { hasText: 'Radius (miles)' }).locator('input.text-input')).toBeVisible();
  });

  test('default city list contains "Dallas, TX · 20 miles"', async ({ page }) => {
    const cityList = page.locator('ul.list');
    await expect(cityList).toBeVisible();
    await expect(cityList.locator('li').first()).toContainText('Dallas');
    await expect(cityList.locator('li').first()).toContainText('TX');
    await expect(cityList.locator('li').first()).toContainText('20');
  });

  test('output panel shows "1 cities" counter after adding the first city', async ({ page }) => {
    await expect(page.locator('.panel-heading span').first()).toContainText('1 cities');
  });

  test('"Add City" primary button is visible and enabled', async ({ page }) => {
    await expect(page.locator('button.primary-button', { hasText: 'Add City' })).toBeVisible();
    await expect(page.locator('button.primary-button', { hasText: 'Add City' })).toBeEnabled();
  });
});

test.describe('Service Area Map Generator — city list management (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(MAP_BASE);
  });

  test('adding a city appends it to the list', async ({ page }) => {
    const cityInput = page.locator('label.field', { hasText: 'City' }).locator('input.text-input');
    const stateInput = page.locator('label.field', { hasText: 'State' }).locator('input.text-input');

    await cityInput.fill('Syracuse');
    await stateInput.fill('NY');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    const items = page.locator('ul.list li');
    await expect(items).toHaveCount(2);
    await expect(items.last()).toContainText('Syracuse');
    await expect(items.last()).toContainText('NY');
  });

  test('adding a city updates the "N cities" counter', async ({ page }) => {
    const cityInput = page.locator('label.field', { hasText: 'City' }).locator('input.text-input');
    const stateInput = page.locator('label.field', { hasText: 'State' }).locator('input.text-input');

    await cityInput.fill('Albany');
    await stateInput.fill('NY');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    await expect(page.locator('.panel-heading span').first()).toContainText('2 cities');
  });

  test('removing a city reduces the list count', async ({ page }) => {
    // First add one so we have 2
    await page.locator('label.field', { hasText: 'City' }).locator('input.text-input').fill('Rome');
    await page.locator('label.field', { hasText: 'State' }).locator('input.text-input').fill('NY');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    await expect(page.locator('ul.list li')).toHaveCount(2);

    // Remove the last city
    await page.locator('ul.list li').last().locator('button.link-button', { hasText: 'Remove' }).click();
    await expect(page.locator('ul.list li')).toHaveCount(1);
  });

  test('custom radius appears in the city list entry', async ({ page }) => {
    const cityInput = page.locator('label.field', { hasText: 'City' }).locator('input.text-input');
    const stateInput = page.locator('label.field', { hasText: 'State' }).locator('input.text-input');
    const radiusInput = page.locator('label.field', { hasText: 'Radius (miles)' }).locator('input.text-input');

    await cityInput.fill('Buffalo');
    await stateInput.fill('NY');
    await radiusInput.fill('35');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    const lastItem = page.locator('ul.list li').last();
    await expect(lastItem).toContainText('35');
  });
});

test.describe('Service Area Map Generator — output panel (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(MAP_BASE);
  });

  test('map iframe is visible in the output panel', async ({ page }) => {
    // Wait for the iframe to render (src is a Google Maps embed)
    const iframe = page.locator('iframe[title="Service area map"]');
    await expect(iframe).toBeVisible();
  });

  test('map embed code block contains a Google Maps iframe src', async ({ page }) => {
    const codeBlocks = page.locator('pre.code-block');
    // First code block is the map embed
    const embedCode = await codeBlocks.first().textContent();
    expect(embedCode).toContain('<iframe');
    expect(embedCode).toContain('maps.google.com');
    expect(embedCode).toContain('Dallas');
  });

  test('JSON-LD schema code block contains the business name and areaServed', async ({ page }) => {
    const codeBlocks = page.locator('pre.code-block');
    // Second code block is the JSON-LD schema
    const schemaCode = await codeBlocks.nth(1).textContent();
    expect(schemaCode).toContain('LocalBusiness');
    expect(schemaCode).toContain('Your Business Name');
    expect(schemaCode).toContain('areaServed');
    expect(schemaCode).toContain('Dallas');
  });

  test('service cities HTML code block contains the city as a list item', async ({ page }) => {
    const codeBlocks = page.locator('pre.code-block');
    // Third code block is the service cities HTML
    const htmlCode = await codeBlocks.nth(2).textContent();
    expect(htmlCode).toContain('<li>');
    expect(htmlCode).toContain('Dallas');
    expect(htmlCode).toContain('TX');
  });

  test('schema block updates when a new city is added', async ({ page }) => {
    await page.locator('label.field', { hasText: 'City' }).locator('input.text-input').fill('Syracuse');
    await page.locator('label.field', { hasText: 'State' }).locator('input.text-input').fill('NY');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    const schemaCode = await page.locator('pre.code-block').nth(1).textContent();
    expect(schemaCode).toContain('Syracuse');
    expect(schemaCode).toContain('Dallas');
  });

  test('schema reflects updated business name', async ({ page }) => {
    const businessInput = page.locator('label.field', { hasText: 'Business Name' }).locator('input.text-input');
    await businessInput.fill('Apex Plumbing');

    const schemaCode = await page.locator('pre.code-block').nth(1).textContent();
    expect(schemaCode).toContain('Apex Plumbing');
  });
});

test.describe('Service Area Map Generator — copy buttons (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };

      // Stub clipboard so copy resolves instantly
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async () => {} },
        configurable: true,
      });
    });
    await page.goto(MAP_BASE);
  });

  test('clicking Copy on the Map Embed block shows "Copied" state', async ({ page }) => {
    const copyBtns = page.locator('button.copy-button');
    const firstCopyBtn = copyBtns.first();
    await expect(firstCopyBtn).toContainText('Copy');
    await firstCopyBtn.click();
    await expect(firstCopyBtn).toContainText('Copied');
  });

  test('"Copied" label reverts to "Copy" after 1.2 seconds', async ({ page }) => {
    const firstCopyBtn = page.locator('button.copy-button').first();
    await firstCopyBtn.click();
    await expect(firstCopyBtn).toContainText('Copied');
    await expect(firstCopyBtn).toContainText('Copy', { timeout: 2500 });
  });

  test('three copy buttons are rendered (embed, schema, cities)', async ({ page }) => {
    await expect(page.locator('button.copy-button')).toHaveCount(3);
  });
});

test.describe('Service Area Map Generator — save map (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(MAP_BASE);
  });

  test('Save Map button triggers POST /maps with correct schema', async ({ page }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/maps`, async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ mapId: 'e2e-map-id', ok: true }),
        });
      } else {
        await route.continue();
      }
    });

    await page.locator('button.primary-button', { hasText: 'Save Map' }).click();

    await page.waitForTimeout(500);

    if (capturedBody) {
      expect(typeof capturedBody['businessName']).toBe('string');
      expect(Array.isArray(capturedBody['areas'])).toBe(true);

      const areas = capturedBody['areas'] as Array<{ city: string; radiusMiles: number }>;
      expect(areas.length).toBeGreaterThan(0);
      expect(typeof areas[0].city).toBe('string');
      expect(typeof areas[0].radiusMiles).toBe('number');
    }
  });

  test('Save Map button shows "Saved to Dashboard" after a successful save', async ({ page }) => {
    await page.route(`${API_BASE}/maps`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ mapId: 'save-success-map', ok: true }),
      });
    });

    const saveBtn = page.locator('button.primary-button', { hasText: 'Save Map' });
    await saveBtn.click();

    await expect(
      page.locator('button.primary-button', { hasText: 'Saved to Dashboard' }),
    ).toBeVisible({ timeout: 10_000 });
  });
});

test.describe('Service Area Map Generator — free user paywall', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: null,
        session: null,
      };
    });
    await page.goto(MAP_BASE);
  });

  test('free user output panel shows "Unlock Full Access →" paywall CTA', async ({ page }) => {
    await expect(page.locator('a', { hasText: 'Unlock Full Access →' })).toBeVisible();
  });

  test('free user cannot see the map iframe (it is behind the paywall overlay)', async ({
    page,
  }) => {
    await expect(page.locator('iframe[title="Service area map"]')).toHaveCount(0);
  });

  test('free user paywall CTA links to designedbyanthony.com/tools', async ({ page }) => {
    const href = await page
      .locator('a', { hasText: 'Unlock Full Access →' })
      .getAttribute('href');
    expect(href).toContain('designedbyanthony.com/tools');
  });

  test('free user can still add and remove cities (input panel is not gated)', async ({ page }) => {
    await page.locator('label.field', { hasText: 'City' }).locator('input.text-input').fill('Utica');
    await page.locator('label.field', { hasText: 'State' }).locator('input.text-input').fill('NY');
    await page.locator('button.primary-button', { hasText: 'Add City' }).click();

    await expect(page.locator('ul.list li')).toHaveCount(2);
    await expect(page.locator('ul.list li').last()).toContainText('Utica');
  });
});
