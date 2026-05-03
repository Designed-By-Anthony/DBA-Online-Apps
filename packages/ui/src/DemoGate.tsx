'use client';

import { type ReactNode, useCallback, useEffect, useState } from 'react';

const PURCHASE_URL = 'https://designedbyanthony.com/tools';

export interface DemoGateProps {
  appName: string;
  tagline: string;
  demoContent: ReactNode;
}

type Phase = 'intro' | 'playing' | 'cta';

export function DemoGate({ appName, tagline, demoContent }: DemoGateProps) {
  const [phase, setPhase] = useState<Phase>('intro');

  const handlePlay = useCallback(() => {
    setPhase('playing');
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;
    const timer = window.setTimeout(() => setPhase('cta'), 4500);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      {/* Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.45rem 1.25rem',
          background: '#0f172a',
          borderBottom: '1px solid #3b82f6',
          fontSize: '0.8rem',
          zIndex: 200,
          position: 'sticky',
          top: 0,
        }}
      >
        <span
          style={{
            display: 'inline-block',
            padding: '2px 10px',
            background: '#3b82f6',
            color: '#fff',
            borderRadius: '999px',
            fontWeight: 700,
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Preview
        </span>
        <span style={{ color: '#94a3b8' }}>
          Demo mode &mdash;{' '}
          <a
            href={PURCHASE_URL}
            style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}
          >
            Get full access &rarr;
          </a>
        </span>
      </div>

      {phase === 'intro' ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '4rem 1.5rem',
            minHeight: 'calc(100vh - 40px)',
            gap: '1.25rem',
            background: 'var(--background, #f4f5f6)',
          }}
        >
          <div
            aria-hidden="true"
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'var(--accent-soft, #e0f2fe)',
              border: '1px solid var(--accent, #5b7c99)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent, #5b7c99)',
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              role="img"
              aria-label="Play demo"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--foreground, #1a2a40)',
            }}
          >
            {appName}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '1.1rem',
              color: 'var(--muted, #5d6e80)',
              maxWidth: 480,
            }}
          >
            {tagline}
          </p>
          <button
            type="button"
            onClick={handlePlay}
            style={{
              marginTop: '1rem',
              padding: '0.85rem 2.5rem',
              fontSize: '1rem',
              fontWeight: 600,
              border: 'none',
              borderRadius: 10,
              background: 'var(--accent, #0369a1)',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            See How It Works
          </button>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--muted, #5d6e80)' }}>
            No sign-up required &middot; 30-second preview
          </p>
        </div>
      ) : null}

      {phase === 'playing' ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div
            style={{
              height: 3,
              background: 'var(--line, #d5dde7)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                background: 'var(--accent, #0369a1)',
                animation: 'demoProgress 4.5s ease-in-out forwards',
              }}
            />
          </div>
          <div
            style={{
              padding: '1.5rem',
              maxWidth: 1200,
              margin: '0 auto',
              width: '100%',
              animation: 'demoFadeIn 0.6s ease-out',
            }}
          >
            {demoContent}
          </div>
        </div>
      ) : null}

      {phase === 'cta' ? (
        <div style={{ position: 'relative', flex: 1, minHeight: '60vh' }}>
          <div
            style={{
              padding: '1.5rem',
              maxWidth: 1200,
              margin: '0 auto',
              width: '100%',
              filter: 'blur(3px)',
              opacity: 0.35,
              pointerEvents: 'none',
            }}
          >
            {demoContent}
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(244, 245, 246, 0.75)',
              backdropFilter: 'blur(10px)',
              zIndex: 50,
            }}
          >
            <div
              style={{
                background: '#fff',
                border: '1px solid var(--line, #d5dde7)',
                borderRadius: 16,
                padding: '2.5rem',
                textAlign: 'center',
                maxWidth: 420,
                width: '90%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: 'var(--foreground, #1a2a40)',
                }}
              >
                Ready for the real thing?
              </h2>
              <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--muted, #5d6e80)' }}>
                Unlock {appName} with live data, exports, and integrations.
              </p>
              <a
                href={PURCHASE_URL}
                style={{
                  display: 'inline-block',
                  marginTop: '0.5rem',
                  padding: '0.85rem 2.5rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: 10,
                  background: 'var(--accent, #0369a1)',
                  color: '#fff',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                View Plans &amp; Pricing
              </a>
              <button
                type="button"
                onClick={() => setPhase('intro')}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted, #5d6e80)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  padding: '0.5rem',
                }}
              >
                Replay Demo
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Keyframe injection */}
      <style>{`
        @keyframes demoProgress {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes demoFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
