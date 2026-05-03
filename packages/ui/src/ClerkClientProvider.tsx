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
  domain = 'designedbyanthony.online',
  signInUrl = 'https://designedbyanthony.com/sign-in',
  signUpUrl = 'https://designedbyanthony.com/sign-up',
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
