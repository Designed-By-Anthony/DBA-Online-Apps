import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';

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
      <body>
        <ClerkClientProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
