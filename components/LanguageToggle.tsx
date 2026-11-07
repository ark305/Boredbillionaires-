"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { LOCALES, LOCALE_COOKIE, type Locale } from "@/lib/locale";

function saveLocale(next: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
}

export function LanguageToggle({ locale, label }: { locale: Locale; label: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    saveLocale(next);
    startTransition(() => router.refresh());
  }

  return (
    <div role="group" aria-label={label} className="flex rounded-full border border-gold/50 p-0.5 text-xs font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => choose(l)}
          disabled={pending}
          aria-pressed={l === locale}
          className={`rounded-full px-2.5 py-1 uppercase transition ${
            l === locale ? "bg-gold text-navy" : "text-cream/80 hover:text-cream"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
