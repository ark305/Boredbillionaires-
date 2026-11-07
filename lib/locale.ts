export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "lang";

export function parseLocale(value: unknown): Locale | null {
  return value === "en" || value === "es" ? value : null;
}
