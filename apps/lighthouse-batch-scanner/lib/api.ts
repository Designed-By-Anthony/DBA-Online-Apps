/**
 * Decoupled API Client
 *
 * All 6 apps communicate with the ElysiaJS backend via HTTP.
 * No direct coupling - frontend is pure static, backend is API-only.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`;
  console.log(`[API] ${options?.method || 'GET'} ${url}`);

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`[API] Failed to connect to ${url}`);
    console.error(`[API] Make sure wrangler dev is running on port 8787`);
    throw error;
  }
}

// ============================================================
// 1. LIGHTHOUSE BATCH SCANNER API
// ============================================================

export interface AuditRequest {
  urls: string[];
  device?: 'desktop' | 'mobile';
  categories?: string[];
}

export interface AuditResponse {
  jobId: string;
  status: 'pending' | 'in-progress' | 'completed';
  totalUrls: number;
  estimatedTime: number;
}

export function startAudit(data: AuditRequest): Promise<AuditResponse> {
  return fetchApi('/lighthouse/audit', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getAuditStatus(jobId: string): Promise<AuditResponse> {
  return fetchApi(`/lighthouse/audit/${jobId}`);
}

export function getAuditPdf(jobId: string): Promise<{ pdfUrl: string }> {
  return fetchApi(`/lighthouse/audit/${jobId}/pdf`);
}

// ============================================================
// 2. LOCAL SEO AUDIT KIT API
// ============================================================

export interface GMBAuditRequest {
  businessName: string;
  location: string;
}

export interface CitationAuditRequest {
  businessName: string;
  phone: string;
  address: string;
}

export function auditGMB(data: GMBAuditRequest) {
  return fetchApi('/seo-audit/gmb', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function auditCitations(data: CitationAuditRequest) {
  return fetchApi('/seo-audit/citations', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function validateSchema(url: string) {
  return fetchApi('/seo-audit/schema', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

// ============================================================
// 3. LEAD FORM BUILDER API
// ============================================================

export function listForms() {
  return fetchApi('/forms');
}

export function createForm(data: unknown) {
  return fetchApi('/forms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getForm(formId: string) {
  return fetchApi(`/forms/${formId}`);
}

export function submitForm(formId: string, data: unknown) {
  return fetchApi(`/forms/${formId}/submit`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getFormSubmissions(formId: string) {
  return fetchApi(`/forms/${formId}/submissions`);
}

// ============================================================
// 4. SERVICE AREA MAP GENERATOR API
// ============================================================

export function createMap(data: unknown) {
  return fetchApi('/maps', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMap(mapId: string) {
  return fetchApi(`/maps/${mapId}`);
}

// ============================================================
// 5. COLD OUTREACH SEQUENCER API
// ============================================================

export function listSequences() {
  return fetchApi('/outreach/sequences');
}

export function createSequence(data: unknown) {
  return fetchApi('/outreach/sequences', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getSequence(id: string) {
  return fetchApi(`/outreach/sequences/${id}`);
}

export function importProspects(id: string, prospects: unknown[]) {
  return fetchApi(`/outreach/sequences/${id}/prospects`, {
    method: 'POST',
    body: JSON.stringify({ prospects }),
  });
}

export function activateSequence(id: string) {
  return fetchApi(`/outreach/sequences/${id}/activate`, {
    method: 'POST',
  });
}

// ============================================================
// 6. CORE WEB VITALS MONITOR API
// ============================================================

export function takeSnapshot(url: string) {
  return fetchApi('/cwv/snapshot', {
    method: 'POST',
    body: JSON.stringify({ url }),
  });
}

export function listMonitors() {
  return fetchApi('/cwv/monitors');
}

export function createMonitor(data: unknown) {
  return fetchApi('/cwv/monitors', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function getMonitorSnapshots(id: string) {
  return fetchApi(`/cwv/monitors/${id}/snapshots`);
}

export function getMonitorAlerts(id: string) {
  return fetchApi(`/cwv/monitors/${id}/alerts`);
}

export function checkMonitor(id: string) {
  return fetchApi(`/cwv/monitors/${id}/check`, {
    method: 'POST',
  });
}

// ============================================================
// HEALTH CHECK
// ============================================================

export function getHealth() {
  return fetchApi('/health');
}

export function getApiInfo() {
  return fetchApi('/');
}
