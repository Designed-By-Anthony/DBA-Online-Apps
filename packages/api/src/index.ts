import { Elysia } from 'elysia';
import {
  appendCwvSnapshot,
  createCwvMonitor,
  createLeadForm,
  createLighthouseJob,
  createOutreachSequence,
  createSeoAudit,
  createServiceMap,
  getCwvMonitor,
  getFormSubmissions,
  getLeadForm,
  getLeadFormsByUser,
  getLighthouseJob,
  getOutreachSequence,
  getServiceMap,
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
import type { Env } from './types';

// ── CORS ──────────────────────────────────────────────────────────────────────

function buildResolveOrigin(allowedOrigins: string) {
  const origins = allowedOrigins.split(',').map((s) => s.trim());
  return (origin: string | null): string => {
    if (!origin) return origins[0] ?? '*';
    return origins.includes(origin) ? origin : (origins[0] ?? '*');
  };
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

// ── App factory ───────────────────────────────────────────────────────────────
// A new Elysia instance is created per-request so each request receives its own
// bound `db`, `storage`, and `cache` references injected from the Workers runtime.

function buildApp(env: Env) {
  const resolveOrigin = buildResolveOrigin(env.ALLOWED_ORIGINS);
  const apiBase =
    env.ENVIRONMENT === 'production'
      ? 'https://api.designedbyanthony.online'
      : 'http://localhost:8787';

  return (
    new Elysia({ aot: false })
      .decorate('db', env.DB)
      .decorate('storage', env.STORAGE)
      .decorate('cache', env.CACHE)

      // ── Global CORS ────────────────────────────────────────────
      .onBeforeHandle(({ set, request }) => {
        const origin = request.headers.get('origin');
        set.headers['Access-Control-Allow-Origin'] = resolveOrigin(origin);
        set.headers.Vary = 'Origin';
        set.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        set.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
        set.headers['Access-Control-Allow-Credentials'] = 'true';
        set.headers['Access-Control-Max-Age'] = '86400';
      })
      .options('/*', ({ request }) => {
        const origin = request.headers.get('origin');
        return new Response(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': resolveOrigin(origin),
            Vary: 'Origin',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400',
          },
        });
      })

      // ── Root / Health ──────────────────────────────────────────
      .get('/', () => ({
        message: 'DBA Online Apps API',
        version: '1.0.0',
        environment: env.ENVIRONMENT,
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
      }))
      .get('/health', ({ db }) =>
        db
          .prepare("SELECT 'ok' AS status")
          .first()
          .then((row) => ({
            status: (row as { status: string } | null)?.status ?? 'ok',
            timestamp: new Date().toISOString(),
            uptime: performance.now(),
          })),
      )

      // ── Auth Verify (token → plan) ──────────────────────────────
      .get('/auth/verify', async ({ db, request }) => {
        const auth = await resolveAuth(db, request, env);
        return { plan: auth.plan, userId: auth.userId };
      })

      // ── R2 File Serving ────────────────────────────────────────
      .get('/files/:key', async ({ storage, params: { key } }) => {
        const obj = await getObject(storage, decodeURIComponent(key));
        if (!obj) return new Response('Not found', { status: 404 });
        return new Response(obj.body, {
          headers: {
            'Content-Type': obj.httpMetadata?.contentType ?? 'application/octet-stream',
            'Cache-Control': obj.httpMetadata?.cacheControl ?? 'public, max-age=86400',
          },
        });
      })

      // ─────────────────────────────────────────────────────────
      // 1. LIGHTHOUSE BATCH SCANNER
      // ─────────────────────────────────────────────────────────
      .group('/lighthouse', (app) =>
        app
          .post('/audit', async ({ db, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const {
              urls,
              device = 'desktop',
              categories = ['performance', 'accessibility', 'best-practices', 'seo'],
            } = body as { urls: string[]; device?: string; categories?: string[] };

            const jobId = crypto.randomUUID();
            await createLighthouseJob(db, {
              id: jobId,
              user_id: auth.userId as string,
              urls: JSON.stringify(urls),
              device,
              categories: JSON.stringify(categories),
            });

            return {
              jobId,
              status: 'pending',
              device,
              categories,
              totalUrls: urls.length,
              estimatedTime: urls.length * 30,
            };
          })
          .get('/audit/:jobId', async ({ db, params: { jobId } }) => {
            const job = await getLighthouseJob(db, jobId);
            if (!job) return new Response('Not found', { status: 404 });
            return {
              jobId: job.id,
              status: job.status,
              progress: job.status === 'completed' ? 100 : 0,
              results: job.results ? JSON.parse(job.results) : [],
              pdfUrl: job.pdf_key ? publicUrl(job.pdf_key, apiBase) : null,
              completedAt: job.completed_at,
            };
          })
          .post('/audit/:jobId/complete', async ({ db, params: { jobId }, body }) => {
            const { results, pdfKey } = body as { results: unknown; pdfKey?: string };
            await updateLighthouseJob(db, jobId, {
              status: 'completed',
              results: JSON.stringify(results),
              pdf_key: pdfKey ?? null,
              completed_at: new Date().toISOString(),
            });
            return { ok: true };
          }),
      )

      // ─────────────────────────────────────────────────────────
      // 2. LOCAL SEO AUDIT KIT
      // ─────────────────────────────────────────────────────────
      .group('/seo-audit', (app) =>
        app
          .post('/run', async ({ db, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const { businessName, location, results } = body as {
              businessName: string;
              location: string;
              results: unknown;
            };
            const auditId = crypto.randomUUID();
            await createSeoAudit(db, {
              id: auditId,
              user_id: auth.userId as string,
              business_name: businessName,
              location,
            });
            await saveSeoAuditResults(db, auditId, results);
            return { auditId, saved: true };
          })
          .post('/gmb', async ({ body }) => {
            const { businessName, location } = body as { businessName: string; location: string };
            return {
              auditId: crypto.randomUUID(),
              businessName,
              location,
              gmbFound: false,
              profileCompleteness: 0,
              score: 0,
            };
          })
          .post('/citations', async ({ body }) => {
            const { businessName, phone, address } = body as {
              businessName: string;
              phone: string;
              address: string;
            };
            return {
              auditId: crypto.randomUUID(),
              businessName,
              phone,
              address,
              citationsFound: 0,
              consistencyScore: 0,
              sources: [],
            };
          })
          .post('/schema', async ({ body }) => {
            const { url } = body as { url: string };
            return {
              url,
              validations: [{ type: 'LocalBusiness', valid: false, errors: ['Not implemented'] }],
            };
          }),
      )

      // ─────────────────────────────────────────────────────────
      // 3. LEAD FORM BUILDER
      // ─────────────────────────────────────────────────────────
      .group('/forms', (app) =>
        app
          .get('/', async ({ db, request }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const forms = await getLeadFormsByUser(db, auth.userId!);
            return { forms, total: forms.length };
          })
          .post('/', async ({ db, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const { name, fields } = body as { name: string; fields: unknown[] };
            const formId = crypto.randomUUID();
            await createLeadForm(db, {
              id: formId,
              user_id: auth.userId as string,
              name,
              fields: JSON.stringify(fields),
            });
            return { id: formId, name, fields, createdAt: new Date().toISOString() };
          })
          .get('/:formId', async ({ db, params: { formId } }) => {
            const form = await getLeadForm(db, formId);
            if (!form) return new Response('Not found', { status: 404 });
            return {
              id: form.id,
              name: form.name,
              fields: JSON.parse(form.fields),
              submissions: 0,
            };
          })
          .post('/:formId/submit', async ({ db, params: { formId }, request, body }) => {
            const form = await getLeadForm(db, formId);
            if (!form) return new Response('Not found', { status: 404 });
            const submissionId = crypto.randomUUID();
            await saveFormSubmission(db, {
              id: submissionId,
              form_id: formId,
              data: JSON.stringify(body),
              ip: request.headers.get('cf-connecting-ip'),
            });
            return { submissionId, formId, submittedAt: new Date().toISOString() };
          })
          .get('/:formId/submissions', async ({ db, params: { formId } }) => {
            const submissions = await getFormSubmissions(db, formId);
            return { formId, submissions, total: submissions.length };
          }),
      )

      // ─────────────────────────────────────────────────────────
      // 4. SERVICE AREA MAP GENERATOR
      // ─────────────────────────────────────────────────────────
      .group('/maps', (app) =>
        app
          .post('/', async ({ db, storage, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const { businessName, areas } = body as {
              businessName: string;
              areas: Array<{ city: string; radiusMiles: number }>;
            };
            const mapId = crypto.randomUUID();
            await createServiceMap(db, {
              id: mapId,
              user_id: auth.userId as string,
              business_name: businessName,
              areas: JSON.stringify(areas),
            });
            const embedHtml = buildEmbedHtml(mapId, businessName, areas);
            const key = await uploadEmbed(storage, mapId, embedHtml);
            await setServiceMapEmbedKey(db, mapId, key);
            return {
              mapId,
              businessName,
              areas,
              embedUrl: publicUrl(key, apiBase),
              createdAt: new Date().toISOString(),
            };
          })
          .get('/:mapId', async ({ db, params: { mapId } }) => {
            const map = await getServiceMap(db, mapId);
            if (!map) return new Response('Not found', { status: 404 });
            return {
              id: map.id,
              businessName: map.business_name,
              areas: JSON.parse(map.areas),
              embedUrl: map.embed_key ? publicUrl(map.embed_key, apiBase) : null,
            };
          })
          .get('/:mapId/embed', async ({ storage, params: { mapId } }) => {
            const obj = await getObject(storage, `embeds/${mapId}/embed.html`);
            if (!obj) return new Response('<h1>Map not found</h1>', { status: 404 });
            return new Response(obj.body, {
              headers: { 'Content-Type': 'text/html; charset=utf-8' },
            });
          }),
      )

      // ─────────────────────────────────────────────────────────
      // 5. COLD OUTREACH SEQUENCER
      // ─────────────────────────────────────────────────────────
      .group('/outreach', (app) =>
        app
          .post('/sequences', async ({ db, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const { name, steps } = body as { name: string; steps: unknown[] };
            const id = crypto.randomUUID();
            await createOutreachSequence(db, {
              id,
              user_id: auth.userId as string,
              name,
              steps: JSON.stringify(steps),
            });
            return { id, name, steps, status: 'draft', createdAt: new Date().toISOString() };
          })
          .get('/sequences/:id', async ({ db, params: { id } }) => {
            const seq = await getOutreachSequence(db, id);
            if (!seq) return new Response('Not found', { status: 404 });
            return {
              id: seq.id,
              name: seq.name,
              steps: JSON.parse(seq.steps),
              prospects: JSON.parse(seq.prospects),
              status: seq.status,
            };
          })
          .post('/sequences/:id/prospects', async ({ db, params: { id }, body }) => {
            const { prospects } = body as { prospects: unknown[] };
            await updateSequenceProspects(db, id, prospects);
            return { sequenceId: id, added: prospects.length };
          })
          .post('/sequences/:id/activate', async ({ db, params: { id } }) => {
            await updateSequenceStatus(db, id, 'active');
            return { id, status: 'active', activatedAt: new Date().toISOString() };
          }),
      )

      // ─────────────────────────────────────────────────────────
      // 6. CORE WEB VITALS MONITOR
      // ─────────────────────────────────────────────────────────
      .group('/cwv', (app) =>
        app
          .post('/monitors', async ({ db, request, body }) => {
            const auth = await resolveAuth(db, request, env);
            const gate = requirePaidPlan(auth);
            if (gate) return gate;
            const { url } = body as { url: string };
            const id = crypto.randomUUID();
            await createCwvMonitor(db, { id, user_id: auth.userId as string, url });
            return { id, url, createdAt: new Date().toISOString() };
          })
          .get('/monitors/:id/snapshots', async ({ db, params: { id } }) => {
            const monitor = await getCwvMonitor(db, id);
            if (!monitor) return new Response('Not found', { status: 404 });
            return { monitorId: id, url: monitor.url, snapshots: JSON.parse(monitor.snapshots) };
          })
          .post('/monitors/:id/snapshot', async ({ db, params: { id }, body }) => {
            const snapshot = {
              ...(body as object),
              id: crypto.randomUUID(),
              collectedAt: new Date().toISOString(),
            };
            await appendCwvSnapshot(db, id, snapshot);
            return { monitorId: id, snapshot };
          }),
      )
  );
}

// ── CF Workers entry point ────────────────────────────────────────────────────

export default {
  fetch(req: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
    return buildApp(env).handle(req) as Promise<Response>;
  },

  async queue(_batch: MessageBatch<unknown>, _env: Env, _ctx: ExecutionContext): Promise<void> {
    return;
  },
};
