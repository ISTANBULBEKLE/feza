import type { Metadata } from "next";
import "./globals.scss";
import styles from "./layout.module.scss";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

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
      <body>
        <div className={styles.shell}>
          <Header />
          <div className={styles.content}>{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}
