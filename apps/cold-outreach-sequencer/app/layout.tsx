import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Cold Outreach Sequencer - DBA',
  description: 'Write personalized follow-up emails for every prospect without a CRM.',
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
