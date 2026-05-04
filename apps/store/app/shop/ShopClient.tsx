'use client';

import { useCallback, useEffect, useState } from 'react';

const PURCHASE_API = 'https://api.designedbyanthony.com';
const SIGN_UP_URL = 'https://designedbyanthony.com/sign-up';

interface Tool {
  slug: string;
  name: string;
  price: string;
  tagline: string;
}

type AuthState = 'checking' | 'authenticated' | 'unauthenticated';

export function ShopClient({ tools }: { tools: Tool[] }) {
  const [auth, setAuth] = useState<AuthState>('checking');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const poll = setInterval(() => {
      const c = (window as unknown as Record<string, unknown>).Clerk as
        | { loaded?: boolean; session?: { getToken?: () => Promise<string | null> } | null }
        | undefined;
      if (c?.loaded) {
        clearInterval(poll);
        clearTimeout(timeout);
        setAuth(c.session?.getToken ? 'authenticated' : 'unauthenticated');
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(poll);
      setAuth((prev) => (prev === 'checking' ? 'unauthenticated' : prev));
    }, 5000);
    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, []);

  const toggle = useCallback((slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(tools.map((t) => t.slug)));
  }, [tools]);

  const handleCheckout = useCallback(async () => {
    if (auth === 'unauthenticated') {
      window.location.href = `${SIGN_UP_URL}?redirect_url=${encodeURIComponent(window.location.href)}`;
      return;
    }
    if (selected.size === 0) return;

    setCheckingOut(true);
    try {
      const c = (window as unknown as Record<string, unknown>).Clerk as
        | { session?: { getToken?: () => Promise<string | null> } }
        | undefined;
      const token = await c?.session?.getToken?.();

      const res = await fetch(`${PURCHASE_API}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ tools: Array.from(selected) }),
      });

      if (res.ok) {
        const data = (await res.json()) as { url?: string };
        if (data.url) {
          window.location.href = data.url;
          return;
        }
      }

      // Fallback: redirect to .com /tools with selected tools in query
      const params = new URLSearchParams();
      selected.forEach((slug) => params.append('tool', slug));
      window.location.href = `https://designedbyanthony.com/tools?${params.toString()}`;
    } catch {
      // Fallback to .com tools page
      window.location.href = 'https://designedbyanthony.com/tools';
    } finally {
      setCheckingOut(false);
    }
  }, [auth, selected]);

  const totalMonthly = tools
    .filter((t) => selected.has(t.slug))
    .reduce((sum, t) => {
      const num = parseInt(t.price.replace(/[^0-9]/g, ''), 10);
      return sum + (isNaN(num) ? 0 : num);
    }, 0);

  return (
    <>
      <header className="topbar">
        <a href="/" className="topbar-link">
          ← Back to tools
        </a>
      </header>

      <section className="hero" style={{ paddingBottom: '48px' }}>
        <p className="hero-eyebrow">Unlock Full Access</p>
        <h1>
          Choose Your Tools.
          <br />
          <em>Pay Only for What You Need.</em>
        </h1>
        <p className="hero-sub">
          Select the tools below, complete checkout, and get instant access. Cancel any time.
        </p>
      </section>

      {auth === 'unauthenticated' ? (
        <div
          style={{
            background: '#0f172a',
            borderBottom: '1px solid #3b82f6',
            padding: '12px 24px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#94a3b8',
          }}
        >
          <a
            href={`${SIGN_UP_URL}?redirect_url=${typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : '/shop'}`}
            style={{ color: '#60a5fa', fontWeight: 600, textDecoration: 'none' }}
          >
            Sign up or sign in
          </a>{' '}
          to save your selections and complete checkout.
        </div>
      ) : null}

      <section className="grid-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <p className="section-label" style={{ margin: 0 }}>
            Select tools
          </p>
          <button
            type="button"
            onClick={selectAll}
            style={{
              background: 'transparent',
              border: '1px solid var(--line)',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
          >
            Select all
          </button>
        </div>

        <div className="tool-grid">
          {tools.map((tool) => {
            const isSelected = selected.has(tool.slug);
            return (
              <button
                key={tool.slug}
                type="button"
                onClick={() => toggle(tool.slug)}
                className="tool-card"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderColor: isSelected ? 'var(--accent)' : undefined,
                  background: isSelected ? 'var(--accent-soft)' : undefined,
                  position: 'relative',
                }}
              >
                {isSelected ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      color: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      fontWeight: 700,
                    }}
                  >
                    ✓
                  </span>
                ) : null}
                <h2 className="card-name">{tool.name}</h2>
                <p className="card-desc">{tool.tagline}</p>
                <div className="card-footer">
                  <span className="card-open">{isSelected ? 'Selected' : 'Select'}</span>
                  <span className="card-badge">{tool.price}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky checkout bar */}
      {selected.size > 0 ? (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--dark)',
            borderTop: '1px solid var(--dark-mid)',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            zIndex: 100,
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '14px' }}>
            {selected.size} tool{selected.size > 1 ? 's' : ''} · ${totalMonthly}/mo
          </span>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={checkingOut}
            className="btn-primary"
            style={{ padding: '10px 28px', border: 'none', cursor: 'pointer' }}
          >
            {checkingOut
              ? 'Redirecting…'
              : auth === 'unauthenticated'
                ? 'Sign Up & Checkout'
                : 'Proceed to Checkout →'}
          </button>
        </div>
      ) : null}
    </>
  );
}
