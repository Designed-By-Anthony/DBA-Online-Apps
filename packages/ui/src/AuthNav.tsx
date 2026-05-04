'use client';

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

export function AuthNav() {
  return (
    <div className="dba-auth-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <SignedOut>
        <SignInButton mode="modal">
          <button
            type="button"
            style={{
              background: 'none',
              border: 'none',
              color: '#d1d5db',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              padding: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </button>
        </SignInButton>
        <SignUpButton mode="redirect" forceRedirectUrl="/checkout">
          <button
            type="button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 1rem',
              borderRadius: '0.5rem',
              border: '1px solid #486D8A',
              background: '#486D8A',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 600,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Get Started
          </button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <a
          href="/dashboard"
          style={{
            color: '#d1d5db',
            fontSize: '0.82rem',
            fontWeight: 500,
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          Dashboard
        </a>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
