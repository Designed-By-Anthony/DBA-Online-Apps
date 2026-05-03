import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Free Business Tools — Calculators, SEO Audits, Lead Forms & More',
  description:
    'Seven free tools for small businesses. Estimate costs, check your SEO, build contact forms, test your website speed, and more. No sign-up required.',
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
