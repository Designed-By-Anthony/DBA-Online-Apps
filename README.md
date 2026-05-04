# DBA-Online-Apps

Monorepo for Cloudflare Workers-backed web apps and API.

## What’s included

- `apps/*` — six Next.js frontend apps built for Cloudflare Pages and Workers.
- `packages/api` — backend ElysiaJS API deployed as a Cloudflare Worker.
- `packages/ui`, `packages/types`, shared config packages.

## Worker-first commands

```bash
bun install
bun run dev
bun run build
bun run deploy
```

## Deployment

- `bun run pages:build` — build all apps for Cloudflare Pages.
- `bun run pages:deploy` — deploy all frontend apps.
- `bun run deploy:api` — deploy backend API worker.
- `bun run deploy` — build frontends and deploy both apps + API.

## Automated Testing

**Automated Testing:** Full E2E coverage via Playwright, including authenticated state persistence and cross-origin API validation.

The test suite covers:

- **`tests/leads.spec.ts`** — Lead Form Builder lifecycle: custom field serialisation into JSON, CORS header validation on `POST /forms`, and embed-code preview updates.
- **`tests/audit.spec.ts`** — Lighthouse Batch Scanner: "Analyzing" state, non-blocking UI during background scans, score-badge rendering, and D1 schema validation on `POST /lighthouse/audit`.
- **`tests/auth-access.spec.ts`** — Auth & access control: Founder God Mode bypass (ADMIN_CLERK_ID gets unrestricted API access), free-user paywall enforcement, and CORS header presence on every protected endpoint.

```bash
# Run all E2E tests (apps must be running locally)
bun run test:e2e

# Open the interactive Playwright UI
bun run test:e2e:ui

# View the last HTML report
bun run test:e2e:report
```

Set `CLERK_TEST_USER_TOKEN` in your environment to enable authenticated test runs.
