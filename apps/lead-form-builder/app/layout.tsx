import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Form Builder",
  description:
    "Drag-and-drop smart forms with reCAPTCHA, Zapier hooks, and CRM-ready JSON output.",
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
