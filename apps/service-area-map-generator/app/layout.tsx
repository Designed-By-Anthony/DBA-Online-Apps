import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Service Area Map Generator - DBA',
  description: 'Show customers and Google exactly where you work.',
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
