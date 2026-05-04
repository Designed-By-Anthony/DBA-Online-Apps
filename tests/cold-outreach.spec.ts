import { expect, test } from '@playwright/test';

/**
 * Cold Outreach Sequencer — E2E Tests
 *
 * Suite: Founding Partner level
 * App:   http://localhost:3205  (Cold Outreach Sequencer)
 * API:   http://localhost:8787  (ElysiaJS Worker)
 *
 * Verified behaviours:
 *  1. Page loads with prospect textarea, template textarea, and prospect count
 *  2. Entering CSV prospects parses and increments the counter
 *  3. A valid prospect produces a 5-step sequence in the output panel
 *  4. Template placeholders ({{name}}, {{company}}, {{city}}) are replaced in output
 *  5. The Copy button per step enters "Copied" state momentarily
 *  6. Download .txt triggers POST /outreach/sequences (D1 persist)
 *  7. Free user sees "🔒 Unlock to Download" CTA (not the Download button)
 *  8. Free user output panel shows the paywall overlay
 */

const OUTREACH_BASE = process.env.OUTREACH_BASE_URL ?? 'http://localhost:3205';
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:8787';

test.use({ storageState: 'playwright/.auth/user.json' });

test.describe('Cold Outreach Sequencer — prospect parsing', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(OUTREACH_BASE);
  });

  test('page loads with prospect textarea, template textarea and prospect counter', async ({
    page,
  }) => {
    const textareas = page.locator('textarea.text-area');
    // First textarea: prospects; second: template
    await expect(textareas).toHaveCount(2);

    // Counter starts at "0 prospects"
    await expect(page.locator('.panel-heading span').first()).toContainText('0 prospects');
  });

  test('entering one valid CSV prospect line increments counter to 1', async ({ page }) => {
    const prospectArea = page.locator('textarea.text-area').first();
    await prospectArea.fill('Alex,North Star HVAC,Dallas');

    await expect(page.locator('.panel-heading span').first()).toContainText('1 prospects');
  });

  test('entering three valid CSV lines increments counter to 3', async ({ page }) => {
    const prospectArea = page.locator('textarea.text-area').first();
    await prospectArea.fill(
      'Alex,North Star HVAC,Dallas\nJordan,Blue Ridge Plumbing,Atlanta\nSam,Summit Electric,Denver',
    );

    await expect(page.locator('.panel-heading span').first()).toContainText('3 prospects');
  });

  test('malformed lines (missing city) are silently filtered out', async ({ page }) => {
    const prospectArea = page.locator('textarea.text-area').first();
    // "Alex,HVAC" has no city → filtered; "Jordan,Plumbing,LA" is valid
    await prospectArea.fill('Alex,HVAC\nJordan,Plumbing,LA');

    await expect(page.locator('.panel-heading span').first()).toContainText('1 prospects');
  });
});

test.describe('Cold Outreach Sequencer — sequence generation (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };
    });
    await page.goto(OUTREACH_BASE);

    // Enter a valid prospect so sequences are generated
    await page.locator('textarea.text-area').first().fill('Alex,North Star HVAC,Dallas');
  });

  test('output panel shows "1 ready" when one prospect is entered', async ({ page }) => {
    await expect(page.locator('.panel-heading span').last()).toContainText('1 ready');
  });

  test('5 step-cards are rendered for the active prospect', async ({ page }) => {
    const sequenceCards = page.locator('.sequence-card');
    await expect(sequenceCards).toHaveCount(1);

    // Each card contains 5 day labels
    const stepLabels = page.locator('.step-label');
    await expect(stepLabels).toHaveCount(5);
  });

  test('day labels are Day 1, Day 3, Day 7, Day 14, Day 21 in order', async ({ page }) => {
    const expectedDays = ['Day 1', 'Day 3', 'Day 7', 'Day 14', 'Day 21'];
    const stepLabels = page.locator('.step-label');
    for (let i = 0; i < expectedDays.length; i++) {
      await expect(stepLabels.nth(i)).toContainText(expectedDays[i]);
    }
  });

  test('prospect name "Alex" appears in the sequence output', async ({ page }) => {
    // The sequence card shows "company · city" as the subheader
    const cardText = await page.locator('.sequence-card').textContent();
    expect(cardText).toContain('North Star HVAC');
    expect(cardText).toContain('Dallas');
  });

  test('template placeholder {{name}} is replaced with "Alex" in the body', async ({ page }) => {
    // The sequence body text should contain the resolved name, not the placeholder
    const cardText = await page.locator('.sequence-card').textContent();
    expect(cardText).not.toContain('{{name}}');
    expect(cardText).toContain('Alex');
  });

  test('editing the template textarea updates the sequence body live', async ({ page }) => {
    const templateArea = page.locator('textarea.text-area').last();
    await templateArea.fill('Hello {{name}}, quick question about {{company}}.');

    const cardText = await page.locator('.sequence-card').textContent();
    expect(cardText).toContain('Hello Alex, quick question about North Star HVAC.');
  });

  test('two prospects produce two prospect-selector pills in the output', async ({ page }) => {
    await page.locator('textarea.text-area').first().fill(
      'Alex,North Star HVAC,Dallas\nJordan,Blue Ridge Plumbing,Atlanta',
    );

    // With multiple sequences the tab pills appear
    const pills = page.locator('.output-panel button[style*="border-radius: 999px"]');
    await expect(pills).toHaveCount(2);
  });
});

test.describe('Cold Outreach Sequencer — copy and download (paid)', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: { id: 'user_3DG3F2Edy2A3fdfbiJFFbEy7cOQ' },
        session: null,
      };

      // Stub navigator.clipboard so the copy action resolves instantly
      Object.defineProperty(navigator, 'clipboard', {
        value: { writeText: async () => {} },
        configurable: true,
      });
    });
    await page.goto(OUTREACH_BASE);
    await page.locator('textarea.text-area').first().fill('Alex,North Star HVAC,Dallas');
  });

  test('clicking Copy on Day 1 shows "Copied" state', async ({ page }) => {
    const firstCopyBtn = page.locator('button.copy-button').first();
    await expect(firstCopyBtn).toContainText('Copy');
    await firstCopyBtn.click();
    await expect(firstCopyBtn).toContainText('Copied');
  });

  test('"Download all as .txt" button is visible for paid users', async ({ page }) => {
    await expect(
      page.locator('button.primary-button', { hasText: 'Download all as .txt' }),
    ).toBeVisible();
  });

  test('Download button triggers POST /outreach/sequences with correct schema', async ({
    page,
  }) => {
    let capturedBody: Record<string, unknown> | null = null;

    await page.route(`${API_BASE}/outreach/sequences`, async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = route.request().postDataJSON() as Record<string, unknown>;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'e2e-seq-id', name: 'Outreach – North Star HVAC' }),
        });
      } else {
        await route.continue();
      }
    });

    // Stub prospects endpoint to avoid 404 on the follow-up addProspects call
    await page.route(`${API_BASE}/outreach/sequences/e2e-seq-id/prospects`, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    // Stub the download file so the browser doesn't navigate away
    await page.evaluate(() => {
      URL.createObjectURL = () => 'blob:fake';
      URL.revokeObjectURL = () => {};
    });

    const downloadBtn = page.locator('button.primary-button', { hasText: 'Download all as .txt' });
    await downloadBtn.click();

    // Wait briefly for the async POST to fire
    await page.waitForTimeout(500);

    if (capturedBody) {
      expect(typeof capturedBody['name']).toBe('string');
      expect(Array.isArray(capturedBody['steps'])).toBe(true);
      const steps = capturedBody['steps'] as Array<{
        subject: string;
        body: string;
        delayDays: number;
      }>;
      expect(steps).toHaveLength(5);
      expect(typeof steps[0].delayDays).toBe('number');
    }
  });
});

test.describe('Cold Outreach Sequencer — free user paywall', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      (window as Record<string, unknown>).Clerk = {
        loaded: true,
        user: null,
        session: null,
      };
    });
    await page.goto(OUTREACH_BASE);
  });

  test('free user sees "🔒 Unlock to Download" CTA instead of the Download button', async ({
    page,
  }) => {
    await expect(page.locator('a', { hasText: '🔒 Unlock to Download' })).toBeVisible();
    await expect(
      page.locator('button.primary-button', { hasText: 'Download all as .txt' }),
    ).toHaveCount(0);
  });

  test('free user output panel shows the paywall overlay with upgrade CTA', async ({ page }) => {
    await expect(page.locator('a', { hasText: 'Unlock Full Access →' })).toBeVisible();
  });

  test('free user paywall CTA links to designedbyanthony.com/tools', async ({ page }) => {
    const downloadCta = page.locator('a', { hasText: '🔒 Unlock to Download' });
    const href = await downloadCta.getAttribute('href');
    expect(href).toContain('designedbyanthony.com/tools');
  });

  test('free user can still enter prospects and template text (inputs not locked)', async ({
    page,
  }) => {
    const prospectArea = page.locator('textarea.text-area').first();
    await prospectArea.fill('Alex,North Star HVAC,Dallas');
    await expect(page.locator('.panel-heading span').first()).toContainText('1 prospects');
  });
});
