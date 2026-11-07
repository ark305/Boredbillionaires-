import Link from "next/link";
import { LanguageToggle } from "./LanguageToggle";
import type { Locale } from "@/lib/locale";

export function SiteHeader({ locale, languageLabel }: { locale: Locale; languageLabel: string }) {
  return (
    <header className="bg-navy text-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-gold font-serif text-sm text-gold">
            BB
          </span>
          <span className="font-serif text-lg tracking-wide">Bored Billionaires</span>
        </Link>
        <LanguageToggle locale={locale} label={languageLabel} />
      </div>
    </header>
  );
}
