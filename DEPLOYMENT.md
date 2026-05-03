# Deployment Guide

This project is configured for deployment on Cloudflare.

## Architecture

- **Frontend**: Next.js apps deployed to Cloudflare Pages using Cloudflare Workers.
- **Backend**: ElysiaJS API running on Cloudflare Workers.

## Prerequisites

1. Cloudflare account
2. Wrangler CLI installed: `bunx wrangler login`
3. Cloudflare API token with Pages and Workers permissions

## Project Structure

```
packages/api/          # ElysiaJS backend worker
apps/*/                # Next.js frontend apps
  - cold-outreach-sequencer
  - lead-form-builder
  - lighthouse-batch-scanner
  - core-web-vitals-monitor
  - local-seo-audit-kit
  - service-area-map-generator
```

## Local Development

```bash
# Install dependencies
bun install

# Run all apps in dev mode
bun run dev

# Run API worker locally
bun run --cwd packages/api dev
```

## Deployment

### Deploy API Worker

```bash
cd packages/api
bun run deploy
```

The API worker custom domain is declared in [packages/api/wrangler.jsonc](/Users/anthonyjones/Web%20Design/DBA-Online-Apps/packages/api/wrangler.jsonc) and is provisioned by Wrangler during deploy:

```json
"routes": [
  { "pattern": "api.designedbyanthony.online", "custom_domain": true }
]
```

### Deploy Individual Apps

```bash
cd apps/<app-name>
bun run pages:build
bun run pages:deploy
```

### Deploy All Apps

```bash
bun run pages:build
bun run pages:deploy
```

### Deploy Everything

```bash
bun run deploy
```

## Environment Variables

Create a `.env` file in each app directory as needed:

```
# apps/<app-name>/.env
NEXT_PUBLIC_API_URL=https://api.designedbyanthony.online
```

## GitHub Actions

The `.github/workflows/deploy.yml` file contains automated deployment workflows. Set these secrets in your GitHub repository:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID
