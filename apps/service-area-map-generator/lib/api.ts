/**
 * Service Area Map Generator — API client
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

export interface ServiceArea {
  city: string;
  radiusMiles: number;
}

export interface CreateMapPayload {
  businessName: string;
  areas: ServiceArea[];
}

export interface CreateMapResponse {
  mapId: string;
  businessName: string;
  areas: ServiceArea[];
  /** URL to the R2-hosted embed HTML */
  embedUrl: string;
  createdAt: string;
}

/**
 * Save a service area map to D1 and generate an embed snippet in R2.
 * Returns an `embedUrl` you can drop into an iframe.
 */
export async function createMap(
  payload: CreateMapPayload,
  token?: string,
): Promise<CreateMapResponse> {
  return apiFetch<CreateMapResponse>('/maps', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

export async function getMap(mapId: string): Promise<CreateMapResponse> {
  return apiFetch<CreateMapResponse>(`/maps/${mapId}`);
}
