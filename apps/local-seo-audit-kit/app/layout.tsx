import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Local SEO Audit Kit",
  description:
    "Google Business Profile checks, citation consistency reporting, and schema validation in one workflow.",
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
