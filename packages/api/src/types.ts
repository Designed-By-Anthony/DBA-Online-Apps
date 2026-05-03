// ── Cloudflare Worker Bindings ──────────────────────────────────────────────
// These are injected by the Workers runtime from wrangler.jsonc declarations.

export interface Env {
  // D1 — SQLite-compatible relational database
  DB: D1Database;
  // R2 — Object storage (PDFs, exports, uploads)
  STORAGE: R2Bucket;
  // KV — Fast key-value cache (job status, rate limits, sessions)
  CACHE: KVNamespace;
  // Env vars
  ALLOWED_ORIGINS: string;
  PAYMENT_DOMAIN: string;
  ENVIRONMENT: string;
  // Secrets (set via `wrangler secret put`)
  STRIPE_WEBHOOK_SECRET?: string;
  JWT_SECRET?: string;
}

// ── Shared Domain Types ─────────────────────────────────────────────────────

export type Plan = 'free' | 'pro' | 'agency';

export interface DbUser {
  id: string;
  email: string;
  plan: Plan;
  api_key: string;
  created_at: string;
  stripe_customer_id: string | null;
}

export interface DbLighthouseJob {
  id: string;
  user_id: string | null;
  urls: string; // JSON string
  device: string;
  categories: string; // JSON string
  status: 'pending' | 'running' | 'completed' | 'failed';
  results: string | null; // JSON string
  pdf_key: string | null; // R2 object key
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface DbSeoAudit {
  id: string;
  user_id: string | null;
  business_name: string;
  location: string;
  results: string | null; // JSON string
  created_at: string;
}

export interface DbLeadForm {
  id: string;
  user_id: string;
  name: string;
  fields: string; // JSON string
  created_at: string;
}

export interface DbFormSubmission {
  id: string;
  form_id: string;
  data: string; // JSON string
  ip: string | null;
  submitted_at: string;
}

export interface DbServiceMap {
  id: string;
  user_id: string | null;
  business_name: string;
  areas: string; // JSON string
  embed_key: string | null; // R2 key for embed script
  created_at: string;
}

export interface DbOutreachSequence {
  id: string;
  user_id: string;
  name: string;
  steps: string; // JSON string
  prospects: string; // JSON string
  status: 'draft' | 'active' | 'paused' | 'completed';
  created_at: string;
}

export interface DbCwvMonitor {
  id: string;
  user_id: string | null;
  url: string;
  snapshots: string; // JSON string
  created_at: string;
}

// ── Auth ────────────────────────────────────────────────────────────────────

export interface AuthContext {
  userId: string | null;
  plan: Plan;
  apiKey: string | null;
}
