/**
 * Core Web Vitals Monitor — API client
 * Calls the ElysiaJS Worker at NEXT_PUBLIC_API_URL
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

async function apiFetch<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
  const { token, ...rest } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface CwvSnapshot {
  id: string;
  date: string;
  url: string;
  lcp: number;
  cls: number;
  inp: number;
  collectedAt?: string;
}

export interface MonitorResponse {
  id: string;
  url: string;
  createdAt: string;
}

export interface SnapshotsResponse {
  monitorId: string;
  url: string;
  snapshots: CwvSnapshot[];
}

/** Create a new monitor for a URL (optional auth — anon monitors are allowed) */
export async function createMonitor(url: string, token?: string): Promise<MonitorResponse> {
  return apiFetch<MonitorResponse>('/cwv/monitors', {
    method: 'POST',
    body: JSON.stringify({ url }),
    token,
  });
}

/** Save a snapshot for an existing monitor */
export async function saveSnapshot(
  monitorId: string,
  snapshot: Omit<CwvSnapshot, 'id' | 'collectedAt'>,
  token?: string,
): Promise<{ monitorId: string; snapshot: CwvSnapshot }> {
  return apiFetch(`/cwv/monitors/${monitorId}/snapshot`, {
    method: 'POST',
    body: JSON.stringify(snapshot),
    token,
  });
}

/** Fetch all snapshots for a monitor */
export async function getSnapshots(monitorId: string): Promise<SnapshotsResponse> {
  return apiFetch<SnapshotsResponse>(`/cwv/monitors/${monitorId}/snapshots`);
}
