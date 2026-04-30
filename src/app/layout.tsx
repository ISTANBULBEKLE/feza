import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "feza · NASA explorer",
  description:
    "feza is a tiny Next.js 16 demo app for showcasing Claude Code, CLAUDE.md, Skills, and MCP in everyday dev work.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
