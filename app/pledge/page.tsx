import type { Metadata } from "next";
import Link from "next/link";
import { DemoBanner } from "@/components/pledge/DemoBanner";
import { PledgeFlow } from "@/components/pledge/PledgeFlow";
import { getPledgeMessages } from "@/components/pledge/messages";
import { getProject, listProjects } from "@/lib/catalog";
import { getLocale } from "@/lib/i18n";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const locale = await getLocale();
  const project = getProject(first((await searchParams).projectId));
  const m = getPledgeMessages(locale);
  return {
    title: project ? `${project.name[locale]} · Bored Billionaires` : "Bored Billionaires",
    description: m.demoLabel,
  };
}

export default async function PledgePage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const locale = await getLocale();
  const m = getPledgeMessages(locale);
  const project = getProject(first(params.projectId));

  return (
    <>
      <DemoBanner label={m.demoLabel} />
      {project ? (
        <PledgeFlow key={`${project.id}-${locale}`} project={project} locale={locale} initialIntent={first(params.intent) ?? ""} />
      ) : (
        <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-8">
          <h1 className="font-serif text-3xl">{m.notFoundTitle}</h1>
          <p className="mt-2 text-sm text-navy/70">{m.notFoundBody}</p>
          <ul className="mt-6 grid gap-3">
            {listProjects().map((p) => (
              <li key={p.id}>
                <Link
                  href={`/pledge?projectId=${encodeURIComponent(p.id)}`}
                  className="block rounded-2xl border border-navy/10 bg-white p-4 transition hover:border-teal"
                >
                  <span className="block font-serif text-lg">{p.name[locale]}</span>
                  <span className="block text-xs text-navy/60">{p.location}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
