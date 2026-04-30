import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Core Web Vitals Monitor",
  description:
    "Weekly Core Web Vitals snapshots with regression alerts sent straight to your inbox.",
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
