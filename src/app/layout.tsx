import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cdesign — design.md generator",
  description:
    "Paste a website URL and generate a human-readable design.md spec describing its design system.",
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
