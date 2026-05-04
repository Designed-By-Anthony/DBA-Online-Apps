import type { Metadata } from 'next';
import './globals.css';
import { ClerkClientProvider } from '@dba/ui/ClerkClientProvider';
import { Navbar } from '@dba/ui/Navbar';

export const metadata: Metadata = {
  title: 'Free Service Area Map — Show Customers Where You Work',
  description:
    'Enter the towns you serve and get an embeddable map for your website. Helps Google understand your service area.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <ClerkClientProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          {children}
        </ClerkClientProvider>
      </body>
    </html>
  );
}
