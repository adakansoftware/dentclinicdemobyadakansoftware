import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  title: "Diş Kliniği",
  description: "Profesyonel diş kliniği hizmetleri",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
