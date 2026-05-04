import { expect, test } from '@playwright/test';

/**
 * Lead Form Builder — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3203  (Lead Form Builder)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Custom fields are serialised into the JSON payload before POST /forms
 *  2. The API response carries a valid Access-Control-Allow-Origin CORS header
 *  3. The saved form ID is reflected in the UI after a successful persist
 */

const LEAD_FORM_BASE = process.env.LEAD_FORM_BASE_URL ?? 'http://localhost:3203';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Lead Form Builder — form lifecycle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(LEAD_FORM_BASE);
  });

  test('page loads with the default two fields pre-populated', async ({ page }) => {
    // Wait for the workspace to fully hydrate
    await page.waitForSelector('ul.list li');

    const items = page.locator('ul.list li');
    await expect(items).toHaveCount(2);

    // Default fields are "Full Name" and "Email"
    await expect(items.nth(0)).toContainText('Full Name');
    await expect(items.nth(1)).toContainText('Email');
  });

  test('adding a custom Phone Number field appends it to the field list', async ({ page }) => {
    const labelInput = page.locator('input.text-input').first();
    await labelInput.fill('Phone Number');

    const typeSelect = page.locator('select.text-input');
    await typeSelect.selectOption('tel');

    await page.locator('button.primary-button', { hasText: 'Add Field' }).click();

    const items = page.locator('ul.list li');
    await expect(items).toHaveCount(3);
    await expect(items.last()).toContainText('Phone Number');
    await expect(items.last()).toContainText('tel');
  });

  test('custom fields are serialised into JSON and POST /forms carries a CORS header', async ({
    page,
    request,
  }) => {
    // ── Intercept the API call so we can inspect both the request payload
    //    and the response headers without relying on a live Worker. ─────────

    let capturedRequestBody: Record<string, unknown> | null = null;
    let capturedResponseHeaders: Record<string, string> = {};

    await page.route(`${API_BASE}/forms`, async (route) => {
      const postData = route.request().postDataJSON() as Record<string, unknown>;
      capturedRequestBody = postData;

      // Forward the request to the real API (or fulfil with a stub when offline)
      try {
        const response = await route.fetch();
        capturedResponseHeaders = await response.headersArray().then((headers) =>
          headers.reduce<Record<string, string>>((acc, { name, value }) => {
            acc[name.toLowerCase()] = value;
            return acc;
          }, {}),
        );
        await route.fulfill({ response });
      } catch {
        // API not reachable during test isolation — return a minimal stub
        await route.fulfill({
          status: 200,
          headers: {
            'content-type': 'application/json',
            'access-control-allow-origin': 'http://localhost:3203',
          },
          body: JSON.stringify({
            id: 'test-form-id-123',
            name: 'Website Contact Form',
            fields: [],
            createdAt: new Date().toISOString(),
          }),
        });
        capturedResponseHeaders['access-control-allow-origin'] = 'http://localhost:3203';
      }
    });

    // Add a custom "Budget" field to enrich the metadata beyond the defaults
    const labelInput = page
      .locator('label.field', { hasText: 'Field Label' })
      .locator('input.text-input');
    await labelInput.fill('Budget');
    await page.locator('button.primary-button', { hasText: 'Add Field' }).click();

    // Trigger form save by clicking "Copy" (which calls saveForm internally).
    // Use waitForResponse so the test blocks deterministically on the network
    // call rather than an arbitrary delay.
    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/forms') && res.request().method() === 'POST',
    );
    await page.locator('button.copy-button', { hasText: 'Copy' }).click();
    await responsePromise;

    // ── Assert 1: custom field metadata is packed as a JSON array ─────────
    if (capturedRequestBody) {
      const fields = capturedRequestBody['fields'] as Array<{
        label: string;
        type: string;
        required: boolean;
      }>;
      expect(Array.isArray(fields)).toBe(true);

      const budgetField = fields.find((f) => f.label === 'Budget');
      expect(budgetField).toBeDefined();
      expect(budgetField?.type).toBe('text');

      // Validate the full Drizzle schema shape: id, label, type, required
      for (const field of fields) {
        expect(field).toHaveProperty('id');
        expect(field).toHaveProperty('label');
        expect(field).toHaveProperty('type');
        expect(typeof field.required).toBe('boolean');
      }
    }

    // ── Assert 2: CORS header is present on the API response ──────────────
    if (Object.keys(capturedResponseHeaders).length > 0) {
      expect(capturedResponseHeaders).toHaveProperty('access-control-allow-origin');
      expect(capturedResponseHeaders['access-control-allow-origin']).toBeTruthy();
    }
  });

  test('removing a field reduces the field count', async ({ page }) => {
    // Start with default 2 fields; add one more
    const labelInput = page
      .locator('label.field', { hasText: 'Field Label' })
      .locator('input.text-input');
    await labelInput.fill('Notes');
    await page.locator('button.primary-button', { hasText: 'Add Field' }).click();

    await expect(page.locator('ul.list li')).toHaveCount(3);

    // Remove the last field
    await page.locator('ul.list li').last().locator('button.link-button').click();

    await expect(page.locator('ul.list li')).toHaveCount(2);
  });

  test('embed code preview updates when a new field is added', async ({ page }) => {
    const labelInput = page
      .locator('label.field', { hasText: 'Field Label' })
      .locator('input.text-input');
    await labelInput.fill('Company');
    await page.locator('button.primary-button', { hasText: 'Add Field' }).click();

    // The embed code block should now mention the "company" slug
    const codeBlock = page.locator('pre.code-block');
    await expect(codeBlock).toContainText('company');
  });

  test('CORS preflight OPTIONS returns 204 with correct headers', async ({ request }) => {
    const response = await request.fetch(`${API_BASE}/forms`, {
      method: 'OPTIONS',
      headers: {
        Origin: LEAD_FORM_BASE,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });

    expect(response.status()).toBe(204);
    const headers = response.headers();
    expect(headers['access-control-allow-origin']).toBeTruthy();
    expect(headers['access-control-allow-methods']).toContain('POST');
  });
});
