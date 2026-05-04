'use client';

import dynamic from 'next/dynamic';

const AuthNav = dynamic(() => import('@dba/ui/AuthNav').then((m) => ({ default: m.AuthNav })), {
  ssr: false,
});

export function AuthNavClient() {
  return <AuthNav />;
}
