import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Local SEO Audit - DBA',
  description: 'See how your business looks online and what to fix for local search.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
