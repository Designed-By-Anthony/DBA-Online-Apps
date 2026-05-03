import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Lighthouse Batch Scanner - DBA',
  description: "Grade your website's speed, SEO, and accessibility in seconds.",
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
