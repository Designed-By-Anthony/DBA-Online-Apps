import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';

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
      <body>
        <ClerkClientProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
