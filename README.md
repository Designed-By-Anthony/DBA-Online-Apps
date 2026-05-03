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
