import { defineConfig, devices } from '@playwright/test';

/**
 * DBA Online Apps — Playwright E2E Configuration
 *
 * Targets the .online project (designedbyanthony.online) and its supporting
 * micro-frontends.  Each app runs locally on its own port as defined in the
 * individual package.json dev scripts.
 *
 * App ports (local dev):
 *   Store / .online    → 3207
 *   Lighthouse Scanner → 3201
 *   Lead Form Builder  → 3203
 *   API (Elysia Worker)→ 8787
 */

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3207',
    trace: 'on-first-retry',
  },

  projects: [
    // Auth setup — runs once before all tests that need an authenticated session
    {
      name: 'setup',
      testMatch: /global\.setup\.ts/,
    },

    // Chromium — authenticated routes use the stored Clerk session
    {
      name: 'chromium-auth',
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
      testMatch: /.*\.(spec|test)\.ts/,
    },

    // Chromium — unauthenticated (for free-user redirect checks)
    {
      name: 'chromium-anon',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /auth-access\.spec\.ts/,
    },
  ],
});
