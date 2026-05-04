import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';
import { Navbar } from '@dba/ui/Navbar';
import { AuthNavClient } from './AuthNavClient';

export const metadata: Metadata = {
  title: 'Business Tools — Calculators, SEO Audits, Lead Forms & More',
  description:
    'Seven tools for small businesses. Estimate costs, check your SEO, build contact forms, test your website speed, and more.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '512x512', type: 'image/png' }],
  },
  alternates: {
    canonical: 'https://designedbyanthony.online',
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ClerkClientProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        >
          <Navbar>
            <AuthNavClient />
          </Navbar>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
