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

const PRODUCT_META: Record<string, { name: string; icon: string; path: string }> = {
  sitescan: {
    name: 'SiteScan — Website Health Reports',
    icon: '\u{1F50D}',
    path: '/tools/lighthouse-scanner',
  },
  reviewpilot: {
    name: 'ReviewPilot — AI Review Response',
    icon: '\u2B50',
    path: '/tools/seo-audit',
  },
  clienthub: {
    name: 'ClientHub — Client Portal',
    icon: '\u{1F465}',
    path: '/tools/lead-form-builder',
  },
  localrank: {
    name: 'LocalRank — Local SEO Dashboard',
    icon: '\u{1F4CD}',
    path: '/tools/site-speed-monitor',
  },
  testiflow: {
    name: 'TestiFlow — Testimonial Collector',
    icon: '\u{1F4AC}',
    path: '/tools/cold-outreach',
  },
  contentmill: {
    name: 'ContentMill — AI Social Content',
    icon: '\u270F\uFE0F',
    path: '/tools/service-area-map',
  },
};

export function DashboardClient() {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  const [data, setData] = useState<MeResponse | null>(null);
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
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const json = (await res.json()) as MeResponse;
        if (!cancelled) setData(json);
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
                          href={meta?.path ?? '#'}
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
