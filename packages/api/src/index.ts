import { withSentry } from '@sentry/cloudflare';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { TOOL_CATALOG } from './catalog';
import {
  appendCwvSnapshot,
  createCwvMonitor,
  createLeadForm,
  createLighthouseJob,
  createOutreachSequence,
  createSeoAudit,
  createServiceMap,
  getCwvMonitor,
  getCwvMonitorsByUser,
  getFormSubmissions,
  getLeadForm,
  getLeadFormsByUser,
  getLighthouseJob,
  getLighthouseJobsByUser,
  getOutreachSequence,
  getOutreachSequencesByUser,
  getSeoAuditsByUser,
  getServiceMap,
  getServiceMapsByUser,
  getVerifiedUserId,
  requirePaidPlan,
  resolveAuth,
  saveFormSubmission,
  saveSeoAuditResults,
  setServiceMapEmbedKey,
  updateLighthouseJob,
  updateSequenceProspects,
  updateSequenceStatus,
} from './db';
import { getObject, publicUrl, uploadEmbed } from './storage';
import type { AuthContext, Env } from './types';

// ── Context types ─────────────────────────────────────────────────────────────

type AppVariables = {
  auth: AuthContext;
  isTest: boolean;
};

type AppEnv = { Bindings: Env; Variables: AppVariables };

// ── Timing-safe string comparison ────────────────────────────────────────────
// Prevents timing attacks when comparing secret values.

function timingSafeStringEqual(a: string, b: string): boolean {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  const len = Math.max(aBytes.length, bBytes.length);
  // XOR length difference into accumulator so length mismatch always returns false
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] ?? 0) ^ (bBytes[i] ?? 0);
  }
  return diff === 0;
}

// ── Embed HTML builder ────────────────────────────────────────────────────────

function buildEmbedHtml(
  _mapId: string,
  businessName: string,
  areas: Array<{ city: string; radiusMiles: number }>,
): string {
  const areaList = areas
    .map((a) => `<li>${a.city} (${a.radiusMiles} mi radius)</li>`)
    .join('\n      ');
  const query = encodeURIComponent(`${businessName} service area`);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${businessName} – Service Area Map</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #f9fafb; }
    .wrapper { max-width: 800px; margin: 0 auto; padding: 1.5rem; }
    h2 { font-size: 1.25rem; margin-bottom: 1rem; color: #111; }
    ul { list-style: disc; padding-left: 1.25rem; color: #374151; line-height: 1.8; }
    iframe { width: 100%; height: 400px; border: 0; border-radius: 8px; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="wrapper">
    <h2>${businessName} – Service Areas</h2>
    <ul>
      ${areaList}
    </ul>
    <iframe
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
      src="https://www.google.com/maps?q=${query}&output=embed"
      allowfullscreen
    ></iframe>
  </div>
</body>
</html>`;
}

// ── CORS middleware ───────────────────────────────────────────────────────────
// Allows any *.designedbyanthony.com / *.designedbyanthony.online origin, plus
// localhost for local development. Reflects the origin so credentials work.

const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) return 'https://designedbyanthony.com';
    if (
      origin === 'https://designedbyanthony.com' ||
      origin === 'https://designedbyanthony.online' ||
      origin.endsWith('.designedbyanthony.com') ||
      origin.endsWith('.designedbyanthony.online') ||
      /^http:\/\/localhost(:\d+)?$/.test(origin)
    ) {
      return origin;
    }
    return 'https://designedbyanthony.com';
  },
  allowHeaders: ['Content-Type', 'Authorization', 'X-Source-Origin', 'X-Test-Secret'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
});

// ── Sub-routers ───────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// 1. LIGHTHOUSE BATCH SCANNER
// ─────────────────────────────────────────────────────────
const lighthouse = new Hono<AppEnv>()
  .get('/jobs', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const jobs = await getLighthouseJobsByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({ jobs, total: jobs.length });
  })
  .post('/audit', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const {
      urls,
      device = 'desktop',
      categories = ['performance', 'accessibility', 'best-practices', 'seo'],
    } = await c.req.json<{ urls: string[]; device?: string; categories?: string[] }>();

    const jobId = crypto.randomUUID();
    await createLighthouseJob(c.env.DB, {
      id: jobId,
      user_id: auth.userId as string,
      urls: JSON.stringify(urls),
      device,
      categories: JSON.stringify(categories),
    });

    return c.json({
      jobId,
      status: 'pending',
      device,
      categories,
      totalUrls: urls.length,
      estimatedTime: urls.length * 30,
    });
  })
  .get('/audit/:jobId', async (c) => {
    const apiBase =
      {
        production: 'https://api.designedbyanthony.online',
        preview: 'https://preview.api.designedbyanthony.online',
      }[c.env.ENVIRONMENT] ?? 'http://localhost:8787';
    const job = await getLighthouseJob(c.env.DB, c.req.param('jobId'));
    if (!job) return c.notFound();
    return c.json({
      jobId: job.id,
      status: job.status,
      progress: job.status === 'completed' ? 100 : 0,
      results: job.results ? JSON.parse(job.results) : [],
      pdfUrl: job.pdf_key ? publicUrl(job.pdf_key, apiBase) : null,
      completedAt: job.completed_at,
    });
  })
  .post('/audit/:jobId/complete', async (c) => {
    const { results, pdfKey } = await c.req.json<{ results: unknown; pdfKey?: string }>();
    await updateLighthouseJob(c.env.DB, c.req.param('jobId'), {
      status: 'completed',
      results: JSON.stringify(results),
      pdf_key: pdfKey ?? null,
      completed_at: new Date().toISOString(),
    });
    return c.json({ ok: true });
  });

// ─────────────────────────────────────────────────────────
// 2. LOCAL SEO AUDIT KIT
// ─────────────────────────────────────────────────────────
const seoAudit = new Hono<AppEnv>()
  .get('/audits', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const audits = await getSeoAuditsByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({ audits, total: audits.length });
  })
  .post('/run', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const { businessName, location, results } = await c.req.json<{
      businessName: string;
      location: string;
      results: unknown;
    }>();
    const auditId = crypto.randomUUID();
    await createSeoAudit(c.env.DB, {
      id: auditId,
      user_id: auth.userId as string,
      business_name: businessName,
      location,
    });
    await saveSeoAuditResults(c.env.DB, auditId, results);
    return c.json({ auditId, saved: true });
  })
  .post('/gmb', async (c) => {
    const { businessName, location } = await c.req.json<{
      businessName: string;
      location: string;
    }>();
    return c.json({
      auditId: crypto.randomUUID(),
      businessName,
      location,
      gmbFound: false,
      profileCompleteness: 0,
      score: 0,
    });
  })
  .post('/citations', async (c) => {
    const { businessName, phone, address } = await c.req.json<{
      businessName: string;
      phone: string;
      address: string;
    }>();
    return c.json({
      auditId: crypto.randomUUID(),
      businessName,
      phone,
      address,
      citationsFound: 0,
      consistencyScore: 0,
      sources: [],
    });
  })
  .post('/schema', async (c) => {
    const { url } = await c.req.json<{ url: string }>();
    return c.json({
      url,
      validations: [{ type: 'LocalBusiness', valid: false, errors: ['Not implemented'] }],
    });
  });

// ─────────────────────────────────────────────────────────
// 3. LEAD FORM BUILDER
// ─────────────────────────────────────────────────────────
const forms = new Hono<AppEnv>()
  .get('/', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const formList = await getLeadFormsByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({ forms: formList, total: formList.length });
  })
  .post('/', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const { name, fields } = await c.req.json<{ name: string; fields: unknown[] }>();
    const formId = crypto.randomUUID();
    await createLeadForm(c.env.DB, {
      id: formId,
      user_id: auth.userId as string,
      name,
      fields: JSON.stringify(fields),
    });
    return c.json({ id: formId, name, fields, createdAt: new Date().toISOString() });
  })
  .get('/:formId', async (c) => {
    const form = await getLeadForm(c.env.DB, c.req.param('formId'));
    if (!form) return c.notFound();
    return c.json({
      id: form.id,
      name: form.name,
      fields: JSON.parse(form.fields),
      submissions: 0,
    });
  })
  .post('/:formId/submit', async (c) => {
    const formId = c.req.param('formId');
    const form = await getLeadForm(c.env.DB, formId);
    if (!form) return c.notFound();
    const body = await c.req.json();
    const submissionId = crypto.randomUUID();
    await saveFormSubmission(c.env.DB, {
      id: submissionId,
      form_id: formId,
      data: JSON.stringify(body),
      ip: c.req.raw.headers.get('cf-connecting-ip'),
    });
    return c.json({ submissionId, formId, submittedAt: new Date().toISOString() });
  })
  .get('/:formId/submissions', async (c) => {
    const submissions = await getFormSubmissions(c.env.DB, c.req.param('formId'));
    return c.json({ formId: c.req.param('formId'), submissions, total: submissions.length });
  });

// ─────────────────────────────────────────────────────────
// 4. SERVICE AREA MAP GENERATOR
// ─────────────────────────────────────────────────────────
const maps = new Hono<AppEnv>()
  .get('/', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const apiBase =
      {
        production: 'https://api.designedbyanthony.online',
        preview: 'https://preview.api.designedbyanthony.online',
      }[c.env.ENVIRONMENT] ?? 'http://localhost:8787';
    const mapList = await getServiceMapsByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({
      maps: mapList.map((m) => ({
        id: m.id,
        businessName: m.business_name,
        areas: JSON.parse(m.areas),
        embedUrl: m.embed_key ? publicUrl(m.embed_key, apiBase) : null,
        createdAt: m.created_at,
      })),
      total: mapList.length,
    });
  })
  .post('/', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const apiBase =
      {
        production: 'https://api.designedbyanthony.online',
        preview: 'https://preview.api.designedbyanthony.online',
      }[c.env.ENVIRONMENT] ?? 'http://localhost:8787';
    const { businessName, areas } = await c.req.json<{
      businessName: string;
      areas: Array<{ city: string; radiusMiles: number }>;
    }>();
    const mapId = crypto.randomUUID();
    await createServiceMap(c.env.DB, {
      id: mapId,
      user_id: auth.userId as string,
      business_name: businessName,
      areas: JSON.stringify(areas),
    });
    const embedHtml = buildEmbedHtml(mapId, businessName, areas);
    const key = await uploadEmbed(c.env.STORAGE, mapId, embedHtml);
    await setServiceMapEmbedKey(c.env.DB, mapId, key);
    return c.json({
      mapId,
      businessName,
      areas,
      embedUrl: publicUrl(key, apiBase),
      createdAt: new Date().toISOString(),
    });
  })
  .get('/:mapId', async (c) => {
    const apiBase =
      {
        production: 'https://api.designedbyanthony.online',
        preview: 'https://preview.api.designedbyanthony.online',
      }[c.env.ENVIRONMENT] ?? 'http://localhost:8787';
    const map = await getServiceMap(c.env.DB, c.req.param('mapId'));
    if (!map) return c.notFound();
    return c.json({
      id: map.id,
      businessName: map.business_name,
      areas: JSON.parse(map.areas),
      embedUrl: map.embed_key ? publicUrl(map.embed_key, apiBase) : null,
    });
  })
  .get('/:mapId/embed', async (c) => {
    const obj = await getObject(c.env.STORAGE, `embeds/${c.req.param('mapId')}/embed.html`);
    if (!obj) return new Response('<h1>Map not found</h1>', { status: 404 });
    return new Response(obj.body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  });

// ─────────────────────────────────────────────────────────
// 5. COLD OUTREACH SEQUENCER
// ─────────────────────────────────────────────────────────
const outreach = new Hono<AppEnv>()
  .get('/sequences', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const sequences = await getOutreachSequencesByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({
      sequences: sequences.map((s) => ({
        id: s.id,
        name: s.name,
        status: s.status,
        createdAt: s.created_at,
      })),
      total: sequences.length,
    });
  })
  .post('/sequences', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const { name, steps } = await c.req.json<{ name: string; steps: unknown[] }>();
    const id = crypto.randomUUID();
    await createOutreachSequence(c.env.DB, {
      id,
      user_id: auth.userId as string,
      name,
      steps: JSON.stringify(steps),
    });
    return c.json({ id, name, steps, status: 'draft', createdAt: new Date().toISOString() });
  })
  .get('/sequences/:id', async (c) => {
    const seq = await getOutreachSequence(c.env.DB, c.req.param('id'));
    if (!seq) return c.notFound();
    return c.json({
      id: seq.id,
      name: seq.name,
      steps: JSON.parse(seq.steps),
      prospects: JSON.parse(seq.prospects),
      status: seq.status,
    });
  })
  .post('/sequences/:id/prospects', async (c) => {
    const { prospects } = await c.req.json<{ prospects: unknown[] }>();
    await updateSequenceProspects(c.env.DB, c.req.param('id'), prospects);
    return c.json({ sequenceId: c.req.param('id'), added: prospects.length });
  })
  .post('/sequences/:id/activate', async (c) => {
    await updateSequenceStatus(c.env.DB, c.req.param('id'), 'active');
    return c.json({
      id: c.req.param('id'),
      status: 'active',
      activatedAt: new Date().toISOString(),
    });
  });

// ─────────────────────────────────────────────────────────
// 6. CORE WEB VITALS MONITOR
// ─────────────────────────────────────────────────────────
const cwv = new Hono<AppEnv>()
  .get('/monitors', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const monitors = await getCwvMonitorsByUser(c.env.DB, getVerifiedUserId(auth));
    return c.json({
      monitors: monitors.map((m) => ({
        id: m.id,
        url: m.url,
        createdAt: m.created_at,
      })),
      total: monitors.length,
    });
  })
  .post('/monitors', async (c) => {
    const auth = c.get('auth');
    const gate = requirePaidPlan(auth);
    if (gate) return gate;
    const { url } = await c.req.json<{ url: string }>();
    const id = crypto.randomUUID();
    await createCwvMonitor(c.env.DB, { id, user_id: auth.userId as string, url });
    return c.json({ id, url, createdAt: new Date().toISOString() });
  })
  .get('/monitors/:id/snapshots', async (c) => {
    const monitor = await getCwvMonitor(c.env.DB, c.req.param('id'));
    if (!monitor) return c.notFound();
    return c.json({
      monitorId: c.req.param('id'),
      url: monitor.url,
      snapshots: JSON.parse(monitor.snapshots),
    });
  })
  .post('/monitors/:id/snapshot', async (c) => {
    const body = await c.req.json<object>();
    const snapshot = {
      ...body,
      id: crypto.randomUUID(),
      collectedAt: new Date().toISOString(),
    };
    await appendCwvSnapshot(c.env.DB, c.req.param('id'), snapshot);
    return c.json({ monitorId: c.req.param('id'), snapshot });
  });

// ── Main app ──────────────────────────────────────────────────────────────────

const app = new Hono<AppEnv>()

  // ── Global CORS ────────────────────────────────────────────
  .use('*', corsMiddleware)

  // ── Test-runner bouncer ────────────────────────────────────
  // Requests carrying X-Test-Secret matching env.TEST_SECRET are marked as
  // test requests and bypass rate-limiting / analytics checks.
  .use('*', async (c, next) => {
    const testSecret = c.req.header('x-test-secret');
    c.set(
      'isTest',
      Boolean(
        c.env.TEST_SECRET &&
          testSecret !== undefined &&
          timingSafeStringEqual(testSecret, c.env.TEST_SECRET),
      ),
    );
    await next();
  })

  // ── Auth middleware ────────────────────────────────────────
  // Resolves Clerk JWT or legacy API-key auth for every request.
  // Individual routes call requirePaidPlan(auth) where needed.
  .use('*', async (c, next) => {
    const auth = await resolveAuth(c.env.DB, c.req.raw, c.env);
    c.set('auth', auth);
    await next();
  })

  // ── Root / Health ──────────────────────────────────────────
  .get('/', (c) =>
    c.json({
      message: 'DBA Online Apps API',
      version: '1.0.0',
      environment: c.env.ENVIRONMENT,
      endpoints: [
        '/health',
        '/lighthouse/*',
        '/seo-audit/*',
        '/forms/*',
        '/maps/*',
        '/outreach/*',
        '/cwv/*',
        '/files/*',
      ],
    }),
  )
  .get('/health', async (c) => {
    const row = await c.env.DB.prepare("SELECT 'ok' AS status").first<{ status: string }>();
    return c.json({
      status: row?.status ?? 'ok',
      timestamp: new Date().toISOString(),
      uptime: performance.now(),
    });
  })

  // ── Tool catalog (public, cacheable) ──────────────────────
  .get('/tools/catalog', (c) => c.json({ tools: TOOL_CATALOG }))

  // ── Auth Verify (token → plan) ─────────────────────────────
  .get('/auth/verify', (c) => {
    const auth = c.get('auth');
    return c.json({ plan: auth.plan, userId: auth.userId });
  })

  // ── /me — user profile + purchases from .com API ───────────
  .get('/me', async (c) => {
    const auth = c.get('auth');
    if (!auth.userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // PAYMENT_DOMAIN is the website (designedbyanthony.com); the API lives at api.designedbyanthony.com
    const paymentApiDomain = c.env.PAYMENT_DOMAIN
      ? c.env.PAYMENT_DOMAIN.replace('://', '://api.')
      : 'https://api.designedbyanthony.com';
    const bearer = c.req.header('Authorization') ?? '';

    let purchases: unknown[] = [];
    let remotePlan: string | null = null;
    try {
      const meRes = await fetch(`${paymentApiDomain}/me`, {
        headers: { Authorization: bearer },
      });
      if (meRes.ok) {
        const meData = (await meRes.json()) as {
          ok?: boolean;
          user?: { plan?: string };
          purchases?: unknown[];
        };
        purchases = meData.purchases ?? [];
        remotePlan = meData.user?.plan ?? null;
      }
    } catch {
      // .com API unreachable — return local data only
    }

    // Sync plan from .com if it's higher than local.
    // founder is a local-only plan — never allow the .com API to downgrade it.
    const planRank: Record<string, number> = { free: 0, pro: 1, agency: 2, founder: 3 };
    const plan =
      auth.plan !== 'founder' &&
      (planRank[remotePlan ?? ''] ?? 0) > (planRank[auth.plan] ?? 0) &&
      remotePlan
        ? remotePlan
        : auth.plan;

    // Persist upgraded plan so resolveAuth / requirePaidPlan see it on future requests
    if (plan !== auth.plan) {
      try {
        await c.env.DB.prepare('UPDATE users SET plan = ? WHERE id = ?')
          .bind(plan, auth.userId)
          .run();
      } catch {
        // best-effort — display still shows correct plan
      }
    }

    const user = await c.env.DB.prepare(
      'SELECT id, email, plan, created_at FROM users WHERE id = ? LIMIT 1',
    )
      .bind(auth.userId)
      .first<{ id: string; email: string; plan: string; created_at: string }>();

    return c.json({
      ok: true,
      user: user
        ? { id: user.id, email: user.email, plan, created_at: user.created_at }
        : { id: auth.userId, plan },
      purchases,
    });
  })

  // ── R2 File Serving ────────────────────────────────────────
  .get('/files/:key', async (c) => {
    const obj = await getObject(c.env.STORAGE, decodeURIComponent(c.req.param('key')));
    if (!obj) return new Response('Not found', { status: 404 });
    return new Response(obj.body, {
      headers: {
        'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
        'Cache-Control': obj.httpMetadata?.cacheControl ?? 'public, max-age=86400',
      },
    });
  })

  // ── PageSpeed Proxy (authenticated — .online tools) ────────
  .post('/external/pagespeed', async (c) => {
    const auth = c.get('auth');
    if (!auth.userId) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    const body = await c.req.json<{
      url?: string;
      strategy?: string;
      categories?: string[];
    } | null>();
    const targetUrl = body?.url?.trim();
    if (!targetUrl) {
      return c.json({ error: 'Missing required field: url' }, 400);
    }

    const strategy = body?.strategy ?? 'mobile';
    const categories = body?.categories ?? [
      'performance',
      'accessibility',
      'best-practices',
      'seo',
    ];
    const categoryParams = categories.map((cat) => `category=${encodeURIComponent(cat)}`).join('&');
    let psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&strategy=${encodeURIComponent(strategy)}&${categoryParams}`;

    if (c.env.GOOGLE_PAGESPEED_API_KEY) {
      psiUrl += `&key=${encodeURIComponent(c.env.GOOGLE_PAGESPEED_API_KEY)}`;
    }

    const psiRes = await fetch(psiUrl, { headers: { Accept: 'application/json' } });
    return new Response(psiRes.body, {
      status: psiRes.status,
      headers: { 'Content-Type': 'application/json' },
    });
  })

  // ── Feature sub-routers ────────────────────────────────────
  .route('/lighthouse', lighthouse)
  .route('/seo-audit', seoAudit)
  .route('/forms', forms)
  .route('/maps', maps)
  .route('/outreach', outreach)
  .route('/cwv', cwv);

// ── AppType export (for Hono RPC client in the .com repo) ────────────────────
// Usage (Designed_By_Anthony_V2):
//   import { hc } from 'hono/client';
//   import type { AppType } from '@dba/api';           // copy/publish this type
//   const client = hc<AppType>(process.env.NEXT_PUBLIC_API_URL!);
//   const jobs = await client.lighthouse.jobs.$get({ headers: { Authorization: `Bearer ${token}` } });
export type AppType = typeof app;

// ── CF Workers entry point ────────────────────────────────────────────────────

export default withSentry(
  (env: Env) => ({
    dsn: env.SENTRY_DSN,
    tracesSampleRate: 0.2,
  }),
  {
    fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
      return Promise.resolve(app.fetch(req, env, ctx));
    },

    async queue(_batch: MessageBatch<unknown>, _env: Env, _ctx: ExecutionContext): Promise<void> {
      return;
    },
  } satisfies ExportedHandler<Env>,
);
