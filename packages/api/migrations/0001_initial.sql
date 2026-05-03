-- DBA Online Apps — D1 Database Schema
-- Apply with: bunx wrangler d1 migrations apply dba-db --remote
-- Local dev:  bunx wrangler d1 migrations apply dba-db --local

-- ── Users ────────────────────────────────────────────────────────────────────
-- Managed by designedbyanthony.com (payment site). API trusts the api_key.
CREATE TABLE IF NOT EXISTS users (
  id                 TEXT PRIMARY KEY,
  email              TEXT UNIQUE NOT NULL,
  plan               TEXT NOT NULL DEFAULT 'free',  -- free | pro | agency
  api_key            TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT,
  created_at         TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_api_key ON users (api_key);
CREATE INDEX IF NOT EXISTS idx_users_email   ON users (email);

-- ── Lighthouse Batch Audit Jobs ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lighthouse_jobs (
  id           TEXT PRIMARY KEY,
  user_id      TEXT REFERENCES users (id),
  urls         TEXT NOT NULL,                       -- JSON array of strings
  device       TEXT NOT NULL DEFAULT 'desktop',
  categories   TEXT NOT NULL DEFAULT '[]',          -- JSON array
  status       TEXT NOT NULL DEFAULT 'pending',     -- pending|running|completed|failed
  results      TEXT,                                -- JSON results blob
  pdf_key      TEXT,                                -- R2 object key
  error        TEXT,
  created_at   TEXT NOT NULL,
  completed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_lh_jobs_user   ON lighthouse_jobs (user_id);
CREATE INDEX IF NOT EXISTS idx_lh_jobs_status ON lighthouse_jobs (status);

-- ── Local SEO Audits ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS seo_audits (
  id            TEXT PRIMARY KEY,
  user_id       TEXT REFERENCES users (id),
  business_name TEXT NOT NULL,
  location      TEXT NOT NULL DEFAULT '',
  results       TEXT,                               -- JSON results blob
  created_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_seo_audits_user ON seo_audits (user_id);

-- ── Lead Forms ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_forms (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id),
  name       TEXT NOT NULL,
  fields     TEXT NOT NULL DEFAULT '[]',            -- JSON array of field schemas
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_lead_forms_user ON lead_forms (user_id);

-- ── Form Submissions ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS form_submissions (
  id           TEXT PRIMARY KEY,
  form_id      TEXT NOT NULL REFERENCES lead_forms (id),
  data         TEXT NOT NULL DEFAULT '{}',          -- JSON map of field->value
  ip           TEXT,
  submitted_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_form ON form_submissions (form_id);

-- ── Service Area Maps ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS service_maps (
  id            TEXT PRIMARY KEY,
  user_id       TEXT REFERENCES users (id),
  business_name TEXT NOT NULL,
  areas         TEXT NOT NULL DEFAULT '[]',         -- JSON array of {city, radiusMiles}
  embed_key     TEXT,                               -- R2 key for the embed HTML snippet
  created_at    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_service_maps_user ON service_maps (user_id);

-- ── Cold Outreach Sequences ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS outreach_sequences (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL REFERENCES users (id),
  name       TEXT NOT NULL,
  steps      TEXT NOT NULL DEFAULT '[]',            -- JSON array of {subject, body, delayDays}
  prospects  TEXT NOT NULL DEFAULT '[]',            -- JSON array of {name, email, company, city}
  status     TEXT NOT NULL DEFAULT 'draft',         -- draft|active|paused|completed
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outreach_user   ON outreach_sequences (user_id);
CREATE INDEX IF NOT EXISTS idx_outreach_status ON outreach_sequences (status);

-- ── Core Web Vitals Monitors ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cwv_monitors (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users (id),
  url        TEXT NOT NULL,
  snapshots  TEXT NOT NULL DEFAULT '[]',            -- JSON array of snapshot objects
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cwv_user ON cwv_monitors (user_id);
CREATE INDEX IF NOT EXISTS idx_cwv_url  ON cwv_monitors (url);
