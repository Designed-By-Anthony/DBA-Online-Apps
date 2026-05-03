import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Website Speed Test — See How Google Scores Your Site',
  description:
    'Test how fast your website loads on a phone. See the same speed score Google uses to rank you. Takes 30 seconds.',
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
