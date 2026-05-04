import type { Metadata } from 'next';
import { DashboardShell } from './DashboardShell';

export const metadata: Metadata = {
  title: 'Dashboard — Your Tools',
  description: 'Access your purchased tools, view your plan, and add more.',
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardShell />;
}
