/**
 * Local SEO Audit Kit — API client
 * Calls the ElysiaJS Worker at NEXT_PUBLIC_API_URL
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

async function post<T>(path: string, body: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface SaveAuditPayload {
  businessName: string;
  location: string;
  results: unknown;
}

export interface SaveAuditResponse {
  auditId: string;
  saved: boolean;
}

/** Persist a completed SEO audit to D1 (optional, requires auth token) */
export async function saveAudit(
  payload: SaveAuditPayload,
  token?: string,
): Promise<SaveAuditResponse> {
  return post<SaveAuditResponse>('/seo-audit/run', payload, token);
}
