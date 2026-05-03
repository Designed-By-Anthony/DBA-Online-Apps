import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';

export const metadata: Metadata = {
  title: 'Free Website Speed Grader — Check Your Site in Seconds',
  description:
    'Scan up to five pages at once and get a plain-English report on speed, SEO, and accessibility. Free — no sign-up needed.',
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
