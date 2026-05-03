import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Web Vitals Checker - DBA',
  description: 'Test how fast your website loads - the same way Google grades it.',
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
