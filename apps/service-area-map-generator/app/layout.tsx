import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Service Area Map Generator",
  description:
    "Generate embeddable service-area maps optimized for local SEO signals.",
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
