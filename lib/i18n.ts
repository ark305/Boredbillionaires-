import "server-only";
import { cookies, headers } from "next/headers";
import { en } from "./dictionaries/en";
import { es } from "./dictionaries/es";
import { DEFAULT_LOCALE, LOCALE_COOKIE, parseLocale, type Locale } from "./locale";

export type { Locale } from "./locale";
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, es };

// Locale: the visitor's explicit choice (cookie) first, then the browser language.
export async function getLocale(): Promise<Locale> {
  const chosen = parseLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  if (chosen) return chosen;
  const accept = (await headers()).get("accept-language") ?? "";
  if (/^es/i.test(accept)) return "es";
  if (/^en/i.test(accept)) return "en";
  return DEFAULT_LOCALE;
}

export async function getDictionary() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
