import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Local SEO Checker — Can Customers Find You on Google?',
  description:
    'Run a quick audit to see how your business shows up in local search. Get a simple list of what to fix. Free for small businesses.',
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
