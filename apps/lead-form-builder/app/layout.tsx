import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';
import { Navbar } from '@dba/ui/Navbar';

export const metadata: Metadata = {
  title: 'Free Contact Form Builder — Get More Leads from Your Website',
  description:
    'Build a simple contact form in minutes and paste it on your site. Get new leads straight to your inbox. No coding needed.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [{ url: '/apple-touch-icon.png', sizes: '512x512', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkClientProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          domain={process.env.NEXT_PUBLIC_CLERK_DOMAIN}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
        >
          <Navbar />
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
