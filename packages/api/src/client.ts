/**
 * DBA API Client — shared fetch wrapper
 * Used by all apps. API base URL is set via NEXT_PUBLIC_API_URL env var.
 *
 * Local dev:   http://localhost:8787
 * Production:  https://api.designedbyanthony.online
 */

// In a Workers context, this value is passed via the Env binding.
// In Next.js apps, use NEXT_PUBLIC_API_URL env var instead.
export const API_BASE = 'http://localhost:8787';

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
  path: string,
  options?: RequestInit & { token?: string },
): Promise<T> {
  const { token, ...fetchOptions } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });

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
