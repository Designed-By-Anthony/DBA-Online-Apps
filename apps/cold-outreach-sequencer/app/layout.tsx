import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Follow-Up Email Writer — Send Sequences That Get Replies',
  description:
    'Paste your prospect list and get a ready-to-send email sequence in seconds. No CRM needed. Free to try.',
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
