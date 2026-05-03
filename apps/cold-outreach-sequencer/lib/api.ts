/**
 * Cold Outreach Sequencer — API client
 * Calls the ElysiaJS Worker at NEXT_PUBLIC_API_URL
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8787';

async function apiFetch<T>(path: string, options?: RequestInit & { token?: string }): Promise<T> {
  const { token, ...rest } = options ?? {};
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(rest.headers as Record<string, string> | undefined),
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...rest, headers });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export interface SequenceStep {
  subject: string;
  body: string;
  delayDays: number;
}

export interface Prospect {
  name: string;
  email: string;
  company: string;
  city: string;
}

export interface CreateSequencePayload {
  name: string;
  steps: SequenceStep[];
}

export interface SequenceResponse {
  id: string;
  name: string;
  steps: SequenceStep[];
  prospects: Prospect[];
  status: 'draft' | 'active' | 'paused' | 'completed';
  createdAt?: string;
}

/** Create a new sequence (requires auth) */
export async function createSequence(
  payload: CreateSequencePayload,
  token: string,
): Promise<SequenceResponse> {
  return apiFetch<SequenceResponse>('/outreach/sequences', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

/** Add prospects to an existing sequence */
export async function addProspects(
  sequenceId: string,
  prospects: Prospect[],
  token: string,
): Promise<{ sequenceId: string; added: number }> {
  return apiFetch(`/outreach/sequences/${sequenceId}/prospects`, {
    method: 'POST',
    body: JSON.stringify({ prospects }),
    token,
  });
}

/** Activate a sequence */
export async function activateSequence(
  sequenceId: string,
  token: string,
): Promise<{ id: string; status: string; activatedAt: string }> {
  return apiFetch(`/outreach/sequences/${sequenceId}/activate`, {
    method: 'POST',
    token,
  });
}
