import type {
  AuthContext,
  DbCwvMonitor,
  DbLeadForm,
  DbLighthouseJob,
  DbOutreachSequence,
  DbSeoAudit,
  DbServiceMap,
  DbUser,
} from './types';

// ── Auth / Users ─────────────────────────────────────────────────────────────

export async function getUserByApiKey(
  db: D1Database,
  apiKey: string,
): Promise<DbUser | null> {
  const result = await db
    .prepare('SELECT * FROM users WHERE api_key = ? LIMIT 1')
    .bind(apiKey)
    .first<DbUser>();
  return result ?? null;
}

export async function createUser(
  db: D1Database,
  user: Omit<DbUser, 'created_at'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO users (id, email, plan, api_key, stripe_customer_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    )
    .bind(
      user.id,
      user.email,
      user.plan,
      user.api_key,
      user.stripe_customer_id,
      new Date().toISOString(),
    )
    .run();
}

export async function resolveAuth(db: D1Database, request: Request): Promise<AuthContext> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { userId: null, plan: 'free', apiKey: null };
  }
  const apiKey = authHeader.slice(7);
  const user = await getUserByApiKey(db, apiKey);
  if (!user) return { userId: null, plan: 'free', apiKey };
  return { userId: user.id, plan: user.plan, apiKey };
}

// ── Lighthouse Jobs ──────────────────────────────────────────────────────────

export async function createLighthouseJob(
  db: D1Database,
  job: Pick<DbLighthouseJob, 'id' | 'user_id' | 'urls' | 'device' | 'categories'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO lighthouse_jobs (id, user_id, urls, device, categories, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(
      job.id,
      job.user_id,
      job.urls,
      job.device,
      job.categories,
      'pending',
      new Date().toISOString(),
    )
    .run();
}

export async function getLighthouseJob(
  db: D1Database,
  jobId: string,
): Promise<DbLighthouseJob | null> {
  const result = await db
    .prepare('SELECT * FROM lighthouse_jobs WHERE id = ? LIMIT 1')
    .bind(jobId)
    .first<DbLighthouseJob>();
  return result ?? null;
}

export async function updateLighthouseJob(
  db: D1Database,
  jobId: string,
  update: Partial<Pick<DbLighthouseJob, 'status' | 'results' | 'pdf_key' | 'error' | 'completed_at'>>,
): Promise<void> {
  const fields = Object.keys(update) as (keyof typeof update)[];
  const setClauses = fields.map((f) => `${f} = ?`).join(', ');
  const values = fields.map((f) => update[f]);
  await db
    .prepare(`UPDATE lighthouse_jobs SET ${setClauses} WHERE id = ?`)
    .bind(...values, jobId)
    .run();
}

// ── SEO Audits ───────────────────────────────────────────────────────────────

export async function createSeoAudit(
  db: D1Database,
  audit: Pick<DbSeoAudit, 'id' | 'user_id' | 'business_name' | 'location'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO seo_audits (id, user_id, business_name, location, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(audit.id, audit.user_id, audit.business_name, audit.location, new Date().toISOString())
    .run();
}

export async function saveSeoAuditResults(
  db: D1Database,
  auditId: string,
  results: unknown,
): Promise<void> {
  await db
    .prepare('UPDATE seo_audits SET results = ? WHERE id = ?')
    .bind(JSON.stringify(results), auditId)
    .run();
}

// ── Lead Forms ───────────────────────────────────────────────────────────────

export async function createLeadForm(
  db: D1Database,
  form: Pick<DbLeadForm, 'id' | 'user_id' | 'name' | 'fields'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO lead_forms (id, user_id, name, fields, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(form.id, form.user_id, form.name, form.fields, new Date().toISOString())
    .run();
}

export async function getLeadFormsByUser(db: D1Database, userId: string): Promise<DbLeadForm[]> {
  const result = await db
    .prepare('SELECT * FROM lead_forms WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all<DbLeadForm>();
  return result.results;
}

export async function getLeadForm(db: D1Database, formId: string): Promise<DbLeadForm | null> {
  const result = await db
    .prepare('SELECT * FROM lead_forms WHERE id = ? LIMIT 1')
    .bind(formId)
    .first<DbLeadForm>();
  return result ?? null;
}

export async function saveFormSubmission(
  db: D1Database,
  submission: { id: string; form_id: string; data: string; ip: string | null },
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO form_submissions (id, form_id, data, ip, submitted_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(
      submission.id,
      submission.form_id,
      submission.data,
      submission.ip,
      new Date().toISOString(),
    )
    .run();
}

export async function getFormSubmissions(db: D1Database, formId: string) {
  const result = await db
    .prepare('SELECT * FROM form_submissions WHERE form_id = ? ORDER BY submitted_at DESC')
    .bind(formId)
    .all();
  return result.results;
}

// ── Service Maps ─────────────────────────────────────────────────────────────

export async function createServiceMap(
  db: D1Database,
  map: Pick<DbServiceMap, 'id' | 'user_id' | 'business_name' | 'areas'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO service_maps (id, user_id, business_name, areas, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .bind(map.id, map.user_id, map.business_name, map.areas, new Date().toISOString())
    .run();
}

export async function getServiceMap(db: D1Database, mapId: string): Promise<DbServiceMap | null> {
  const result = await db
    .prepare('SELECT * FROM service_maps WHERE id = ? LIMIT 1')
    .bind(mapId)
    .first<DbServiceMap>();
  return result ?? null;
}

export async function setServiceMapEmbedKey(
  db: D1Database,
  mapId: string,
  embedKey: string,
): Promise<void> {
  await db
    .prepare('UPDATE service_maps SET embed_key = ? WHERE id = ?')
    .bind(embedKey, mapId)
    .run();
}

// ── Outreach Sequences ───────────────────────────────────────────────────────

export async function createOutreachSequence(
  db: D1Database,
  seq: Pick<DbOutreachSequence, 'id' | 'user_id' | 'name' | 'steps'>,
): Promise<void> {
  await db
    .prepare(
      'INSERT INTO outreach_sequences (id, user_id, name, steps, prospects, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    )
    .bind(seq.id, seq.user_id, seq.name, seq.steps, '[]', 'draft', new Date().toISOString())
    .run();
}

export async function getOutreachSequence(
  db: D1Database,
  id: string,
): Promise<DbOutreachSequence | null> {
  const result = await db
    .prepare('SELECT * FROM outreach_sequences WHERE id = ? LIMIT 1')
    .bind(id)
    .first<DbOutreachSequence>();
  return result ?? null;
}

export async function updateSequenceProspects(
  db: D1Database,
  id: string,
  prospects: unknown,
): Promise<void> {
  await db
    .prepare('UPDATE outreach_sequences SET prospects = ? WHERE id = ?')
    .bind(JSON.stringify(prospects), id)
    .run();
}

export async function updateSequenceStatus(
  db: D1Database,
  id: string,
  status: DbOutreachSequence['status'],
): Promise<void> {
  await db.prepare('UPDATE outreach_sequences SET status = ? WHERE id = ?').bind(status, id).run();
}

// ── CWV Monitors ─────────────────────────────────────────────────────────────

export async function createCwvMonitor(
  db: D1Database,
  monitor: Pick<DbCwvMonitor, 'id' | 'user_id' | 'url'>,
): Promise<void> {
  await db
    .prepare('INSERT INTO cwv_monitors (id, user_id, url, snapshots, created_at) VALUES (?, ?, ?, ?, ?)')
    .bind(monitor.id, monitor.user_id, monitor.url, '[]', new Date().toISOString())
    .run();
}

export async function getCwvMonitor(
  db: D1Database,
  id: string,
): Promise<DbCwvMonitor | null> {
  const result = await db
    .prepare('SELECT * FROM cwv_monitors WHERE id = ? LIMIT 1')
    .bind(id)
    .first<DbCwvMonitor>();
  return result ?? null;
}

export async function appendCwvSnapshot(
  db: D1Database,
  monitorId: string,
  snapshot: unknown,
): Promise<void> {
  const monitor = await getCwvMonitor(db, monitorId);
  if (!monitor) return;
  const snapshots = JSON.parse(monitor.snapshots) as unknown[];
  snapshots.unshift(snapshot);
  // Keep last 52 snapshots (~1 year of weekly data)
  const trimmed = snapshots.slice(0, 52);
  await db
    .prepare('UPDATE cwv_monitors SET snapshots = ? WHERE id = ?')
    .bind(JSON.stringify(trimmed), monitorId)
    .run();
}
