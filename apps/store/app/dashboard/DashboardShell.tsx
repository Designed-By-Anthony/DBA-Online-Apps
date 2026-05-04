'use client';

import { lazy, Suspense, useEffect, useState } from 'react';

const DashboardClient = lazy(() =>
  import('./DashboardClient').then((m) => ({ default: m.DashboardClient })),
);

const Fallback = () => (
  <main
    style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
  >
    <p style={{ fontSize: '0.85rem', color: '#5d6e80' }}>Loading dashboard...</p>
  </main>
);

export function DashboardShell() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <Fallback />;

  return (
    <Suspense fallback={<Fallback />}>
      <DashboardClient />
    </Suspense>
  );
}
