import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tools — Designed by Anthony',
  description:
    'Seven tools for contractors and local service businesses. Job estimates, lead forms, SEO audits, site speed monitoring, and more.',
  alternates: {
    canonical: 'https://designedbyanthony.online',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
