'use client';

import { useEffect, useState } from 'react';

export type AuthState = 'checking' | 'paid' | 'free';

const AUTH_API =
  process.env.NEXT_PUBLIC_AUTH_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'https://api.designedbyanthony.com';

type ClerkWindow = {
  loaded?: boolean;
  session?: { getToken?: () => Promise<string | null> } | null;
};

export function useAuthState(): AuthState {
  const [auth, setAuth] = useState<AuthState>('checking');

  useEffect(() => {
    const poll = setInterval(() => {
      const c = (window as unknown as Record<string, unknown>).Clerk as ClerkWindow | undefined;
      if (c?.loaded) {
        clearInterval(poll);
        clearTimeout(timeout);
        if (!c.session?.getToken) {
          setAuth('free');
          return;
        }
        c.session
          .getToken()
          .then((token) => {
            if (!token) {
              setAuth('free');
              return;
            }
            return fetch(`${AUTH_API}/auth/verify`, {
              headers: { Authorization: `Bearer ${token}` },
            })
              .then((r) => (r.ok ? r.json() : Promise.reject(new Error('auth-failed'))))
              .then((data: { plan?: string }) => {
                setAuth(data.plan && data.plan !== 'free' ? 'paid' : 'free');
              });
          })
          .catch(() => setAuth('free'));
      }
    }, 100);
    const timeout = setTimeout(() => {
      clearInterval(poll);
      setAuth((prev) => (prev === 'checking' ? 'free' : prev));
    }, 5000);
    return () => {
      clearInterval(poll);
      clearTimeout(timeout);
    };
  }, []);

  return auth;
}
