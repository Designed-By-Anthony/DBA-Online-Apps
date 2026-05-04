'use client';

type ClerkWindow = {
  loaded?: boolean;
  session?: { getToken?: () => Promise<string | null> } | null;
};

/** Grab the current Clerk session JWT, or null when unauthenticated. */
export async function getClerkToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  const c = (window as unknown as Record<string, unknown>).Clerk as ClerkWindow | undefined;
  if (!c?.session?.getToken) return null;
  try {
    return await c.session.getToken();
  } catch {
    return null;
  }
}
