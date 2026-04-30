import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cold Outreach Sequencer",
  description:
    "Personalized email sequences for web design agencies targeting local service businesses.",
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
