/**
 * Lead Form Builder — API client
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

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select';
  required: boolean;
}

export interface SaveFormPayload {
  name: string;
  fields: FormField[];
}

export interface SaveFormResponse {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

export interface FormListResponse {
  forms: SaveFormResponse[];
  total: number;
}

/** Save a form schema to D1 (requires auth token) */
export async function saveForm(
  payload: SaveFormPayload,
  token: string,
): Promise<SaveFormResponse> {
  return apiFetch<SaveFormResponse>('/forms', {
    method: 'POST',
    body: JSON.stringify(payload),
    token,
  });
}

/** List all forms for the authenticated user */
export async function listForms(token: string): Promise<FormListResponse> {
  return apiFetch<FormListResponse>('/forms', { token });
}

/** Submit data to a published form (no auth required) */
export async function submitForm(
  formId: string,
  data: Record<string, string>,
): Promise<{ submissionId: string; formId: string; submittedAt: string }> {
  return apiFetch(`/forms/${formId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
