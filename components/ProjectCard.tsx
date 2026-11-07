import Link from "next/link";
import type { Project } from "@/lib/catalog";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/locale";
import { formatUSD } from "@/lib/format";

export function ProjectCard({ project, locale, t }: { project: Project; locale: Locale; t: Dictionary }) {
  const minFixed = Math.min(...project.pricePoints.map((p) => p.amountUSD));
  const from = project.openAmount ? Math.min(project.openAmount.minUSD, minFixed) : minFixed;
  return (
    <article className="flex flex-col rounded-2xl border border-navy/10 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
        <span className="text-teal">{t.categories[project.category] ?? project.category}</span>
        {project.openAmount && <span className="text-gold">{t.home.openAmount}</span>}
      </div>
      <h3 className="mt-2 font-serif text-xl">{project.name[locale]}</h3>
      <p className="mt-1 text-xs text-navy/60">{project.location}</p>
      <p className="mt-3 flex-1 text-sm text-navy/80">{project.summary[locale]}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm text-navy/70">
          {t.home.from} <strong className="text-navy">{formatUSD(from, locale)}</strong>
        </span>
        <Link
          href={`/pledge?projectId=${encodeURIComponent(project.id)}`}
          className="rounded-full bg-teal px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal/90"
        >
          {t.home.pledge}
        </Link>
      </div>
    </article>
  );
}
