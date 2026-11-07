# Bored Billionaires

Demo philanthropy app: browse impact projects, make a demo pledge, share an impact card. No database and no payments. Every pledge is a demo pledge.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## Project layout

| Path | Purpose |
| --- | --- |
| `data/catalog.json` | Source of truth for projects, fixed price points, open-amount rules and exact outcomes |
| `lib/catalog.ts` | Typed catalog access: `listProjects()`, `getProject(id)` |
| `lib/locale.ts` | `Locale` type (`"en" \| "es"`), `parseLocale`, cookie name. Safe for client and server |
| `lib/i18n.ts` | Server-only `getLocale()` / `getDictionary()` |
| `lib/dictionaries/{en,es}.ts` | Shared UI strings. `es` is typed as `typeof en`, so missing keys fail the build |
| `lib/format.ts` | `formatUSD`, `formatDate` (locale aware) |
| `components/` | Shared UI (header, language toggle, project card) |

## Catalog shape

```ts
{
  id: string;                       // stable slug, used in URLs
  name: { en: string; es: string };
  category: string;                 // ocean | water | food | energy | education | climate
  location: string;
  summary: { en: string; es: string };
  pricePoints: { amountUSD: number; outcome: { en: string; es: string } }[];
  openAmount: null | { minUSD: number; outcome: { en: string; es: string } };
}
```

A project with `openAmount: null` accepts its fixed price points only. A project with `openAmount` also accepts any custom amount of at least `minUSD`, and that amount gets the `openAmount.outcome`.

## Language conventions

- The locale comes from the `lang` cookie (`en` or `es`). If it's missing, the browser's `Accept-Language` is used, and the default is English.
- Server components call `getDictionary()` from `lib/i18n.ts` and pass the `locale` and strings down to client components. Don't pass functions to client components.
- Catalog content is localized inline as `{ en, es }`. Read it with `project.name[locale]`.
- Feature-specific strings may live next to the feature as an `{ en, es }` object typed the same way.
- The header `LanguageToggle` sets the cookie and calls `router.refresh()`.

## Brand

Navy `#0B2239`, teal `#0E9594`, gold `#c9a24b`, cream `#F7F5F0`. These are Tailwind theme colors (`bg-navy`, `text-teal`, `border-gold`, `bg-cream`). Use `font-serif` for headings.
