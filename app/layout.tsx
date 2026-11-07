import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { getDictionary } from "@/lib/i18n";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getDictionary();
  return { title: t.meta.title, description: t.meta.description };
}

export const viewport: Viewport = {
  themeColor: "#0B2239",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getDictionary();
  return (
    <html lang={locale}>
      <body className="flex min-h-dvh flex-col">
        <SiteHeader locale={locale} languageLabel={t.nav.language} />
        <main className="flex-1">{children}</main>
        <footer className="bg-navy px-4 py-6 text-center text-xs text-cream/70">{t.footer.demo}</footer>
      </body>
    </html>
  );
}
