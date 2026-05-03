import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Construction Calculators",
  description:
    "Professional construction calculators for contractors and builders",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
