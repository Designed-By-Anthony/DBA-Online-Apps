import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Contact Form Builder — Get More Leads from Your Website',
  description:
    'Build a simple contact form in minutes and paste it on your site. Get new leads straight to your inbox. No coding needed.',
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
