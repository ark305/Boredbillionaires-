import { ProjectCard } from "@/components/ProjectCard";
import { listProjects } from "@/lib/catalog";
import { getDictionary } from "@/lib/i18n";

export default async function Home() {
  const { locale, t } = await getDictionary();
  const projects = listProjects();
  return (
    <>
      <section className="bg-navy px-4 pb-14 pt-10 text-cream">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">{t.home.eyebrow}</p>
          <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight sm:text-5xl">{t.home.title}</h1>
          <p className="mt-4 max-w-xl text-cream/80">{t.home.subtitle}</p>
        </div>
      </section>
      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="font-serif text-2xl">{t.home.projectsTitle}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} locale={locale} t={t} />
          ))}
        </div>
      </section>
    </>
  );
}
