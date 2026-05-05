/**
 * DBA API Client — Hono RPC wrapper
 *
 * Usage in Next.js apps (this repo) or Designed_By_Anthony_V2:
 *
 *   import { createApiClient } from '@dba/api/client';          // or copy the hc call
 *   const client = createApiClient(process.env.NEXT_PUBLIC_API_URL);
 *   const res = await client.health.$get();
 *
 * Local dev:   http://localhost:8787
 * Production:  https://api.designedbyanthony.online
 */

import { hc } from 'hono/client';
import type { AppType } from './index';

export type { AppType };

/**
 * Create a fully type-safe Hono RPC client bound to the given base URL.
 * The returned client mirrors every route defined in packages/api/src/index.ts.
 *
 * @param baseUrl - The API base URL. **Required in production** — defaults to
 *   `http://localhost:8787` for local development only. In Next.js apps pass
 *   `process.env.NEXT_PUBLIC_API_URL!`.
 * @param defaultHeaders - Optional headers applied to every request (e.g. auth tokens).
 */
export function createApiClient(
  baseUrl: string = 'http://localhost:8787',
  defaultHeaders?: Record<string, string>,
) {
  return hc<AppType>(baseUrl, { headers: defaultHeaders });
}

// ── Legacy fetch wrapper ──────────────────────────────────────────────────────
// Kept for backward compatibility with existing lib/api.ts files in each app.
// New code should use createApiClient() above.

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  baseUrl: string,
  path: string,
  options?: RequestInit & { token?: string; testSecret?: string },
): Promise<T> {
  const { token, testSecret, ...fetchOptions } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (testSecret) headers['X-Test-Secret'] = testSecret;

  const response = await fetch(`${baseUrl}${path}`, { ...fetchOptions, headers });

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}
