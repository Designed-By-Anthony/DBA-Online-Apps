'use client';

import { useAuth, useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.designedbyanthony.online';
const COM_DOMAIN = 'https://designedbyanthony.com';

type Purchase = {
  id: string;
  product_slug: string;
  tier: string;
  status: string;
  created_at: number | string;
};

type MeResponse = {
  ok: boolean;
  user: { id: string; email?: string; plan: string; created_at?: string | number };
  purchases: Purchase[];
};

type ActivityItem = {
  tool: string;
  icon: string;
  label: string;
  date: string;
  url: string;
};

const PRODUCT_META: Record<string, { name: string; icon: string; url: string }> = {
  'construction-calculator': {
    name: 'Construction Calculator',
    icon: '\u{1F3D7}\uFE0F',
    url: 'https://calculator.designedbyanthony.online',
  },
  'lead-form-builder': {
    name: 'Contact Form Builder',
    icon: '\u{1F4CB}',
    url: 'https://lead-form.designedbyanthony.online',
  },
  'site-speed-monitor': {
    name: 'Website Speed Test',
    icon: '\u26A1',
    url: 'https://web-vitals.designedbyanthony.online',
  },
  'seo-audit': {
    name: 'Local SEO Checker',
    icon: '\u{1F50D}',
    url: 'https://seo-audit.designedbyanthony.online',
  },
  'cold-outreach': {
    name: 'Follow-Up Email Writer',
    icon: '\u2709\uFE0F',
    url: 'https://outreach.designedbyanthony.online',
  },
  'service-area-map': {
    name: 'Service Area Map',
    icon: '\u{1F4CD}',
    url: 'https://service-area.designedbyanthony.online',
  },
  'lighthouse-scanner': {
    name: 'Website Speed Grader',
    icon: '\u{1F680}',
    url: 'https://lighthouse.designedbyanthony.online',
  },
};

export function DashboardClient() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [data, setData] = useState<MeResponse | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn === false) {
      setLoading(false);
      return;
    }
    if (isSignedIn === undefined) return; // still loading

    let cancelled = false;
    async function load() {
      try {
        const token = await getToken();
        if (!token || cancelled) return;
        const headers = { Authorization: `Bearer ${token}` };

        const [meRes, ...toolRes] = await Promise.all([
          fetch(`${API_BASE}/me`, { headers }),
          fetch(`${API_BASE}/lighthouse/jobs`, { headers }).catch(() => null),
          fetch(`${API_BASE}/seo-audit/audits`, { headers }).catch(() => null),
          fetch(`${API_BASE}/forms`, { headers }).catch(() => null),
          fetch(`${API_BASE}/maps`, { headers }).catch(() => null),
          fetch(`${API_BASE}/outreach/sequences`, { headers }).catch(() => null),
          fetch(`${API_BASE}/cwv/monitors`, { headers }).catch(() => null),
        ]);

        if (meRes.ok && !cancelled) {
          setData((await meRes.json()) as MeResponse);
        }

        const items: ActivityItem[] = [];
        const [lhRes, seoRes, formsRes, mapsRes, outreachRes, cwvRes] = toolRes;

        if (lhRes?.ok) {
          const d = (await lhRes.json()) as { jobs: { id: string; created_at: string }[] };
          for (const j of d.jobs ?? []) {
            items.push({
              tool: 'lighthouse',
              icon: '\u{1F680}',
              label: `Lighthouse scan`,
              date: j.created_at,
              url: 'https://lighthouse.designedbyanthony.online',
            });
          }
        }
        if (seoRes?.ok) {
          const d = (await seoRes.json()) as {
            audits: { id: string; businessName: string; createdAt: string }[];
          };
          for (const a of d.audits ?? []) {
            items.push({
              tool: 'seo-audit',
              icon: '\u{1F50D}',
              label: `SEO audit: ${a.businessName}`,
              date: a.createdAt,
              url: 'https://seo-audit.designedbyanthony.online',
            });
          }
        }
        if (formsRes?.ok) {
          const d = (await formsRes.json()) as {
            forms: { id: string; name: string; created_at: string }[];
          };
          for (const f of d.forms ?? []) {
            items.push({
              tool: 'lead-form',
              icon: '\u{1F4CB}',
              label: `Form: ${f.name}`,
              date: f.created_at,
              url: 'https://lead-form.designedbyanthony.online',
            });
          }
        }
        if (mapsRes?.ok) {
          const d = (await mapsRes.json()) as {
            maps: { id: string; businessName: string; createdAt: string }[];
          };
          for (const m of d.maps ?? []) {
            items.push({
              tool: 'service-map',
              icon: '\u{1F4CD}',
              label: `Map: ${m.businessName}`,
              date: m.createdAt,
              url: 'https://service-area.designedbyanthony.online',
            });
          }
        }
        if (outreachRes?.ok) {
          const d = (await outreachRes.json()) as {
            sequences: { id: string; name: string; createdAt: string }[];
          };
          for (const s of d.sequences ?? []) {
            items.push({
              tool: 'outreach',
              icon: '\u2709\uFE0F',
              label: `Sequence: ${s.name}`,
              date: s.createdAt,
              url: 'https://outreach.designedbyanthony.online',
            });
          }
        }
        if (cwvRes?.ok) {
          const d = (await cwvRes.json()) as {
            monitors: { id: string; url: string; createdAt: string }[];
          };
          for (const m of d.monitors ?? []) {
            items.push({
              tool: 'cwv',
              icon: '\u26A1',
              label: `Monitor: ${m.url}`,
              date: m.createdAt,
              url: 'https://web-vitals.designedbyanthony.online',
            });
          }
        }

        items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!cancelled) setActivity(items.slice(0, 20));
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [getToken, isSignedIn]);

  if (isSignedIn === false) {
    return (
      <main
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              color: '#1a2a40',
            }}
          >
            Sign in to access your dashboard
          </h1>
          <p style={{ color: '#5d6e80', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Create an account or sign in to view your tools and purchases.
          </p>
          <a
            href={`${COM_DOMAIN}/sign-in`}
            style={{
              display: 'inline-block',
              padding: '0.6rem 1.5rem',
              background: '#5b7c99',
              color: '#fff',
              borderRadius: '9999px',
              fontWeight: 600,
              fontSize: '0.9rem',
              textDecoration: 'none',
            }}
          >
            Sign in &rarr;
          </a>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '80vh', background: '#f8f9fa' }}>
      <div style={{ maxWidth: '56rem', margin: '0 auto', padding: '3rem 1rem' }}>
        <header style={{ marginBottom: '2.5rem' }}>
          <p
            style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#5b7c99',
              marginBottom: '0.5rem',
            }}
          >
            Account
          </p>
          <h1
            style={{
              fontSize: '1.75rem',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#1a2a40',
            }}
          >
            Your Dashboard
          </h1>
          {user ? (
            <p style={{ marginTop: '0.35rem', fontSize: '0.85rem', color: '#5d6e80' }}>
              {user.primaryEmailAddress?.emailAddress}
            </p>
          ) : null}
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem 0' }}>
            <p style={{ fontSize: '0.85rem', color: '#5d6e80' }}>Loading your tools...</p>
          </div>
        ) : (
          <>
            {/* Purchased tools */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#1a2a40',
                  marginBottom: '1rem',
                }}
              >
                Your Tools
              </h2>
              {data?.purchases && data.purchases.filter((p) => p.status === 'active').length > 0 ? (
                <div
                  style={{
                    display: 'grid',
                    gap: '1rem',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(16rem, 1fr))',
                  }}
                >
                  {data.purchases
                    .filter((p) => p.status === 'active')
                    .map((p) => {
                      const meta = PRODUCT_META[p.product_slug];
                      return (
                        <a
                          key={p.id}
                          href={meta?.url ?? '#'}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '1.25rem',
                            background: '#fff',
                            border: '1px solid rgba(26,42,64,0.1)',
                            borderRadius: '0.75rem',
                            textDecoration: 'none',
                            color: 'inherit',
                            transition: 'box-shadow 0.2s',
                          }}
                        >
                          <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
                            {meta?.icon ?? '\u{1F4E6}'}
                          </span>
                          <div>
                            <p style={{ fontWeight: 600, color: '#1a2a40' }}>
                              {meta?.name ?? p.product_slug}
                            </p>
                            <p
                              style={{
                                fontSize: '0.75rem',
                                color: '#5d6e80',
                                textTransform: 'capitalize',
                              }}
                            >
                              {p.tier} plan
                            </p>
                          </div>
                        </a>
                      );
                    })}
                </div>
              ) : (
                <div
                  style={{
                    padding: '2rem',
                    background: '#fff',
                    border: '1px dashed rgba(26,42,64,0.15)',
                    borderRadius: '0.75rem',
                    textAlign: 'center',
                  }}
                >
                  <p style={{ fontSize: '0.85rem', color: '#5d6e80', marginBottom: '0.75rem' }}>
                    You don&apos;t have any tools yet.
                  </p>
                  <a
                    href={`${COM_DOMAIN}/tools`}
                    style={{
                      display: 'inline-block',
                      padding: '0.5rem 1.25rem',
                      background: '#5b7c99',
                      color: '#fff',
                      borderRadius: '9999px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      textDecoration: 'none',
                    }}
                  >
                    Browse tools &rarr;
                  </a>
                </div>
              )}
            </section>

            {/* Recent Activity */}
            {activity.length > 0 && (
              <section style={{ marginBottom: '2.5rem' }}>
                <h2
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    color: '#1a2a40',
                    marginBottom: '1rem',
                  }}
                >
                  Recent Activity
                </h2>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid rgba(26,42,64,0.1)',
                    borderRadius: '0.75rem',
                    overflow: 'hidden',
                  }}
                >
                  {activity.map((item, i) => (
                    <a
                      key={`${item.tool}-${item.date}-${i}`}
                      href={item.url}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.85rem 1.25rem',
                        borderBottom:
                          i < activity.length - 1 ? '1px solid rgba(26,42,64,0.06)' : 'none',
                        textDecoration: 'none',
                        color: 'inherit',
                        transition: 'background 0.15s',
                      }}
                    >
                      <span style={{ fontSize: '1.15rem' }} aria-hidden="true">
                        {item.icon}
                      </span>
                      <span
                        style={{
                          flex: 1,
                          fontSize: '0.85rem',
                          fontWeight: 500,
                          color: '#1a2a40',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.label}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: '#5d6e80', whiteSpace: 'nowrap' }}>
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Account info */}
            <section style={{ marginBottom: '2.5rem' }}>
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#1a2a40',
                  marginBottom: '1rem',
                }}
              >
                Account
              </h2>
              <div
                style={{
                  padding: '1.25rem',
                  background: '#fff',
                  border: '1px solid rgba(26,42,64,0.1)',
                  borderRadius: '0.75rem',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gap: '0.75rem',
                    gridTemplateColumns: '1fr 1fr',
                    fontSize: '0.85rem',
                  }}
                >
                  <div>
                    <p style={{ color: '#5d6e80' }}>Plan</p>
                    <p style={{ fontWeight: 500, color: '#1a2a40', textTransform: 'capitalize' }}>
                      {data?.user?.plan ?? 'free'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#5d6e80' }}>Member since</p>
                    <p style={{ fontWeight: 500, color: '#1a2a40' }}>
                      {data?.user?.created_at
                        ? new Date(
                            typeof data.user.created_at === 'number'
                              ? data.user.created_at * 1000
                              : data.user.created_at,
                          ).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        : '\u2014'}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Quick links */}
            <section>
              <h2
                style={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: '#1a2a40',
                  marginBottom: '1rem',
                }}
              >
                Quick Links
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <a
                  href={`${COM_DOMAIN}/tools`}
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: '#fff',
                    border: '1px solid rgba(26,42,64,0.15)',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#1a2a40',
                    textDecoration: 'none',
                  }}
                >
                  Add more tools
                </a>
                <a
                  href="/"
                  style={{
                    padding: '0.5rem 1.25rem',
                    background: '#fff',
                    border: '1px solid rgba(26,42,64,0.15)',
                    borderRadius: '9999px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    color: '#1a2a40',
                    textDecoration: 'none',
                  }}
                >
                  Back to free tools
                </a>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
