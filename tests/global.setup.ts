import { test as setup } from '@playwright/test';
import path from 'node:path';

/**
 * Global auth setup — executed once before any authenticated test suite.
 *
 * Strategy: bypass the Clerk UI by acquiring a session token from the
 * Clerk Backend API and writing the resulting cookies + localStorage into
 * the shared storageState file.  During CI the token is supplied via the
 * CLERK_TEST_USER_TOKEN environment variable (a long-lived Clerk testing
 * token minted in the Clerk dashboard).
 *
 * When the env var is absent (local dev) the setup is skipped so that
 * developers can still run individual unauthenticated specs without needing
 * a Clerk account configured.
 */

const AUTH_FILE = path.join(import.meta.dirname, '../playwright/.auth/user.json');

setup('authenticate as a paid Founding Partner', async ({ page }) => {
  const token = process.env.CLERK_TEST_USER_TOKEN;

  if (!token) {
    // Persist an empty state so authenticated suites still load (they will
    // simply be gated / redirect to sign-in, which the tests assert on).
    await page.context().storageState({ path: AUTH_FILE });
    return;
  }

  const storeBase = process.env.STORE_BASE_URL ?? 'http://localhost:3207';

  // Navigate to the root so Clerk scripts are loaded into the page context
  await page.goto(storeBase);

  // Inject the Clerk session token via the __clerk_db_jwt cookie.
  // This mirrors what Clerk's own testing helpers do internally.
  await page.context().addCookies([
    {
      name: '__clerk_db_jwt',
      value: token,
      domain: new URL(storeBase).hostname,
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
    },
  ]);

  // Also expose the raw JWT in localStorage so Clerk's React SDK picks it up
  // on the first page load without a full sign-in flow.
  await page.evaluate((t: string) => {
    window.localStorage.setItem('__clerk_client_jwt', t);
  }, token);

  // Reload so Clerk hydrates the session from the cookie/storage we just set
  await page.reload();

  // Save the authenticated browser state for reuse across all spec files
  await page.context().storageState({ path: AUTH_FILE });
});
