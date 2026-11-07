import type { Locale } from "@/lib/locale";
import type { Pledge } from "@/lib/pledges";
import { DEFAULT_DONOR_NAME } from "@/lib/pledges";
import { formatDate, formatUSD } from "@/lib/format";
import type { PledgeMessages } from "@/components/pledge/messages";

type Props = {
  pledge: Pledge;
  projectName: string;
  locale: Locale;
  m: PledgeMessages;
};

export function ImpactCard({ pledge, projectName, locale, m }: Props) {
  const donor = pledge.donorName === DEFAULT_DONOR_NAME ? m.anonymous : pledge.donorName;
  return (
    <article
      aria-label={m.card.title}
      data-testid="impact-card"
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl bg-navy p-1.5 text-cream shadow-2xl shadow-navy/30"
    >
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-teal/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
      <div className="relative rounded-[1.25rem] border border-gold/60 p-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold font-serif text-sm text-gold">
              BB
            </span>
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-cream/70">{m.card.title}</span>
          </div>
          <span className="rounded-full bg-teal px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider text-white">
            Demo
          </span>
        </header>

        <p
          data-testid="impact-card-demo-label"
          className="mt-5 rounded-lg border border-gold/50 bg-gold/10 px-3 py-2 text-center text-xs font-semibold text-gold-light"
        >
          {m.demoLabel}
        </p>

        <p className="mt-6 text-xs uppercase tracking-[0.2em] text-cream/60">{m.card.pledgedTo}</p>
        <h2 className="mt-1 font-serif text-2xl leading-tight">{projectName}</h2>
        <p className="mt-4 font-serif text-5xl text-gold">{formatUSD(pledge.amountUSD, locale)}</p>

        <div className="mt-6 border-t border-cream/15 pt-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cream/60">{m.card.intendedOutcome}</p>
          <p className="mt-1 text-base leading-snug">{pledge.outcome}</p>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-cream/60">{m.card.date}</dt>
            <dd className="mt-1">{formatDate(pledge.createdAt, locale)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-[0.2em] text-cream/60">{m.card.donor}</dt>
            <dd className="mt-1 break-words">{donor}</dd>
          </div>
        </dl>

        <footer className="mt-6 flex items-end justify-between gap-3 border-t border-cream/15 pt-4">
          <span className="font-serif text-lg tracking-wide text-gold">Bored Billionaires</span>
          <span className="max-w-[10rem] text-right text-[0.6rem] leading-tight text-cream/60">{m.card.notFunding}</span>
        </footer>
      </div>
    </article>
  );
}
