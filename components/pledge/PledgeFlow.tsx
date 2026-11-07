"use client";

import Link from "next/link";
import { useState } from "react";
import type { Project } from "@/lib/catalog";
import type { Locale } from "@/lib/locale";
import { formatUSD } from "@/lib/format";
import {
  MAX_DONOR_INTENT_LENGTH,
  MAX_DONOR_NAME_LENGTH,
  parseAmountInput,
  resolveOutcome,
  savePledge,
  type Pledge,
  type PledgeErrorCode,
} from "@/lib/pledges";
import { ImpactCard } from "@/components/impact-card/ImpactCard";
import { ShareButtons } from "@/components/impact-card/ShareButtons";
import { getPledgeMessages, type PledgeMessages } from "./messages";

type Step = "select" | "confirm" | "done";
type ErrorKey = keyof PledgeMessages["errors"];
type Choice = { kind: "fixed"; amountUSD: number } | { kind: "custom" } | null;

const STEPS: Step[] = ["select", "confirm", "done"];

export function PledgeFlow({
  project,
  locale,
  initialIntent,
}: {
  project: Project;
  locale: Locale;
  initialIntent: string;
}) {
  const m = getPledgeMessages(locale);
  const [step, setStep] = useState<Step>("select");
  const [choice, setChoice] = useState<Choice>(null);
  const [customInput, setCustomInput] = useState("");
  const [amountUSD, setAmountUSD] = useState<number | null>(null);
  const [outcome, setOutcome] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donorIntent, setDonorIntent] = useState(initialIntent.slice(0, MAX_DONOR_INTENT_LENGTH));
  const [error, setError] = useState<ErrorKey | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [saved, setSaved] = useState(true);

  const projectName = project.name[locale];

  function onContinue() {
    if (!choice) return setError("required");
    let amount: number | null;
    if (choice.kind === "fixed") {
      amount = choice.amountUSD;
    } else {
      amount = parseAmountInput(customInput);
      if (amount === null) return setError("invalid_amount");
    }
    const resolved = resolveOutcome(project, amount, locale);
    if (!resolved.ok) return setError(resolved.error);
    setAmountUSD(resolved.amountUSD);
    setOutcome(resolved.outcome);
    setError(null);
    setStep("confirm");
  }

  async function onConfirm() {
    if (amountUSD === null || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/pledges", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ projectId: project.id, amountUSD, donorName, donorIntent, locale }),
      });
      const data = (await res.json().catch(() => null)) as { pledge?: Pledge; error?: PledgeErrorCode } | null;
      if (!res.ok || !data?.pledge) {
        setError(data?.error && data.error in m.errors ? data.error : "network");
        return;
      }
      setSaved(savePledge(data.pledge));
      setPledge(data.pledge);
      setStep("done");
    } catch {
      setError("network");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep("select");
    setChoice(null);
    setCustomInput("");
    setAmountUSD(null);
    setPledge(null);
    setError(null);
  }

  const stepIndex = STEPS.indexOf(step);

  return (
    <div className="mx-auto w-full max-w-lg px-4 pb-16 pt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">{m.eyebrow}</p>
      <h1 className="mt-1 font-serif text-3xl leading-tight">{projectName}</h1>
      <p className="mt-1 text-sm text-navy/60">{project.location}</p>

      <ol className="mt-5 flex gap-2" aria-label={m.stepOf(stepIndex + 1, STEPS.length)}>
        {STEPS.map((s, i) => (
          <li key={s} className="flex-1" aria-current={s === step ? "step" : undefined}>
            <span className={`block h-1 rounded-full ${i <= stepIndex ? "bg-teal" : "bg-navy/10"}`} />
            <span className={`mt-1 block text-[0.7rem] font-semibold ${i <= stepIndex ? "text-navy" : "text-navy/40"}`}>
              {m.steps[s]}
            </span>
          </li>
        ))}
      </ol>

      {step === "select" && (
        <section className="mt-6">
          <p className="text-sm text-navy/80">{project.summary[locale]}</p>
          <fieldset className="mt-5">
            <legend className="font-serif text-xl">{m.chooseAmount}</legend>
            <div className="mt-3 grid gap-3">
              {project.pricePoints.map((p) => {
                const selected = choice?.kind === "fixed" && choice.amountUSD === p.amountUSD;
                return (
                  <label
                    key={p.amountUSD}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition ${
                      selected ? "border-teal ring-2 ring-teal/30" : "border-navy/10 hover:border-navy/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="amount"
                      className="mt-1 accent-teal"
                      checked={selected}
                      onChange={() => {
                        setChoice({ kind: "fixed", amountUSD: p.amountUSD });
                        setError(null);
                      }}
                    />
                    <span>
                      <span className="block font-serif text-2xl">{formatUSD(p.amountUSD, locale)}</span>
                      <span className="block text-sm text-navy/70">{p.outcome[locale]}</span>
                    </span>
                  </label>
                );
              })}

              {project.openAmount && (
                <label
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-white p-4 transition ${
                    choice?.kind === "custom" ? "border-teal ring-2 ring-teal/30" : "border-navy/10 hover:border-navy/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="amount"
                    className="mt-1 accent-teal"
                    checked={choice?.kind === "custom"}
                    onChange={() => {
                      setChoice({ kind: "custom" });
                      setError(null);
                    }}
                  />
                  <span className="flex-1">
                    <span className="block font-semibold">{m.customAmount}</span>
                    <span className="block text-xs text-navy/60">
                      {m.customAmountHint(formatUSD(project.openAmount.minUSD, locale))}
                    </span>
                    <span className="mt-2 flex items-center rounded-xl border border-navy/20 bg-cream px-3 focus-within:border-teal">
                      <span className="text-navy/60">$</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        autoComplete="off"
                        aria-label={m.customPlaceholder}
                        placeholder={m.customPlaceholder}
                        value={customInput}
                        onFocus={() => setChoice({ kind: "custom" })}
                        onChange={(e) => {
                          setCustomInput(e.target.value);
                          setChoice({ kind: "custom" });
                          setError(null);
                        }}
                        className="w-full bg-transparent px-2 py-2.5 text-lg outline-none"
                      />
                    </span>
                    <span className="mt-2 block text-sm text-navy/70">
                      {m.outcomeFor}: {project.openAmount.outcome[locale]}
                    </span>
                  </span>
                </label>
              )}
            </div>
          </fieldset>

          {error && <ErrorText>{m.errors[error]}</ErrorText>}

          <button
            type="button"
            onClick={onContinue}
            className="mt-6 w-full rounded-full bg-teal px-6 py-3.5 font-semibold text-white transition hover:bg-teal/90"
          >
            {m.continue}
          </button>
        </section>
      )}

      {step === "confirm" && amountUSD !== null && (
        <section className="mt-6">
          <h2 className="font-serif text-xl">{m.confirmTitle}</h2>
          <dl className="mt-4 divide-y divide-navy/10 rounded-2xl border border-navy/10 bg-white">
            <Row label={m.project} value={projectName} />
            <Row label={m.amount} value={formatUSD(amountUSD, locale)} strong />
            <Row label={m.outcome} value={outcome} />
          </dl>

          <label className="mt-5 block">
            <span className="text-sm font-semibold">{m.donorName}</span>
            <input
              type="text"
              value={donorName}
              maxLength={MAX_DONOR_NAME_LENGTH}
              placeholder={m.anonymous}
              autoComplete="name"
              onChange={(e) => setDonorName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-navy/20 bg-white px-3 py-2.5 outline-none focus:border-teal"
            />
            <span className="mt-1 block text-xs text-navy/60">{m.donorNameHint}</span>
          </label>

          <label className="mt-4 block">
            <span className="text-sm font-semibold">{m.donorIntent}</span>
            <textarea
              value={donorIntent}
              maxLength={MAX_DONOR_INTENT_LENGTH}
              rows={2}
              onChange={(e) => setDonorIntent(e.target.value)}
              className="mt-1 w-full resize-none rounded-xl border border-navy/20 bg-white px-3 py-2.5 outline-none focus:border-teal"
            />
          </label>

          {error && <ErrorText>{m.errors[error]}</ErrorText>}

          <div className="mt-6 grid grid-cols-[auto_1fr] gap-3">
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("select");
              }}
              className="rounded-full border border-navy/20 px-5 py-3.5 font-semibold"
            >
              {m.back}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={submitting}
              className="rounded-full bg-teal px-6 py-3.5 font-semibold text-white transition hover:bg-teal/90 disabled:opacity-60"
            >
              {submitting ? m.confirming : m.confirm}
            </button>
          </div>
        </section>
      )}

      {step === "done" && pledge && (
        <section className="mt-6">
          <ImpactCard pledge={pledge} projectName={projectName} locale={locale} m={m} />
          <ShareButtons
            m={m}
            text={m.share.text({
              amount: formatUSD(pledge.amountUSD, locale),
              project: projectName,
              outcome: pledge.outcome,
              label: m.demoLabel,
            })}
            url={`${window.location.origin}/pledge?projectId=${encodeURIComponent(pledge.projectId)}`}
          />
          <p className="mt-4 text-center text-xs text-navy/60">{saved ? m.savedLocally : m.notSavedLocally}</p>
          <div className="mx-auto mt-4 grid max-w-sm grid-cols-2 gap-3 text-sm">
            <button type="button" onClick={reset} className="rounded-full border border-navy/20 px-4 py-3 font-semibold">
              {m.pledgeAnother}
            </button>
            <Link href="/" className="rounded-full border border-navy/20 px-4 py-3 text-center font-semibold">
              {m.browseProjects}
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 px-4 py-3">
      <dt className="text-sm text-navy/60">{label}</dt>
      <dd className={`text-right ${strong ? "font-serif text-2xl" : "text-sm font-medium"}`}>{value}</dd>
    </div>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}
