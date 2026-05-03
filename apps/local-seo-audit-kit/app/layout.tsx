import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';

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
      <body>
        <ClerkClientProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
