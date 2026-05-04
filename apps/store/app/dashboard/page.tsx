import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('./DashboardClient').then((m) => m.DashboardClient), {
  ssr: false,
  loading: () => (
    <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '0.85rem', color: '#5d6e80' }}>Loading dashboard...</p>
    </main>
  ),
});

export const metadata: Metadata = {
  title: 'Dashboard — Your Tools',
  description: 'Access your purchased tools, view your plan, and add more.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
