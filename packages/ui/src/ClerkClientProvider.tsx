'use client';

import { ClerkProvider } from '@clerk/clerk-react';
import type { ReactNode } from 'react';

export interface ClerkClientProviderProps {
  children: ReactNode;
  publishableKey?: string;
  domain?: string;
  signInUrl?: string;
  signUpUrl?: string;
}

/**
 * Client-side ClerkProvider for static-export satellite apps.
 * If no publishable key is provided, renders children without Clerk auth.
 */
export function ClerkClientProvider({
  children,
  publishableKey,
  domain = process.env.NEXT_PUBLIC_CLERK_DOMAIN ?? 'designedbyanthony.online',
  signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? 'https://designedbyanthony.com/sign-in',
  signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? 'https://designedbyanthony.com/sign-up',
}: ClerkClientProviderProps) {
  if (!publishableKey) return <>{children}</>;

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      isSatellite
      domain={domain}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
    >
      {children}
    </ClerkProvider>
  );
}
