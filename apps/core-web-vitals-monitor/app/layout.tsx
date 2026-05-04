import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';
import { Navbar } from '@dba/ui/Navbar';

export const metadata: Metadata = {
  title: 'Free Website Speed Test — See How Google Scores Your Site',
  description:
    'Test how fast your website loads on a phone. See the same speed score Google uses to rank you. Takes 30 seconds.',
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
