import type { Catalog, Project } from "./catalog";
import type { Locale } from "./locale";

export const PLEDGES_STORAGE_KEY = "bored-billionaires:pledges:v1";
export const PLEDGES_UPDATED_EVENT = "bored-billionaires:pledges-updated";
export const DEFAULT_DONOR_NAME = "Anonymous";
export const MAX_PLEDGE_USD = 1_000_000_000;
export const MAX_DONOR_NAME_LENGTH = 60;
export const MAX_DONOR_INTENT_LENGTH = 280;

/** Shared contract for every pledge stored under `PLEDGES_STORAGE_KEY` (a JSON array). */
export type Pledge = {
  id: string;
  projectId: string;
  amountUSD: number;
  /** Exact catalog outcome, in the donor's language at pledge time. */
  outcome: string;
  /** Defaults to "Anonymous". */
  donorName: string;
  /** Optional free text: why the donor chose this project (or the chat match intent). */
  donorIntent: string | null;
  /** ISO 8601 timestamp, e.g. "2026-11-07T18:30:00.000Z". */
  createdAt: string;
  demo: true;
};

export type PledgeInput = {
  projectId: unknown;
  amountUSD: unknown;
  donorName?: unknown;
  donorIntent?: unknown;
  locale?: Locale;
};

export type PledgeErrorCode =
  | "project_not_found"
  | "invalid_amount"
  | "amount_not_offered"
  | "below_minimum"
  | "above_maximum"
  | "invalid_donor_name"
  | "invalid_donor_intent";

export type ValidatedPledge = Omit<Pledge, "id" | "createdAt">;

export type ValidationResult =
  | { ok: true; pledge: ValidatedPledge; project: Project }
  | { ok: false; error: PledgeErrorCode };

function hasAtMostTwoDecimals(n: number): boolean {
  return Math.abs(n * 100 - Math.round(n * 100)) < 1e-6;
}

/** Strict parser for what a donor types: digits with optional cents, `$` and `,` allowed. */
export function parseAmountInput(raw: string): number | null {
  const cleaned = raw.trim().replace(/^\$/, "").replace(/,/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) && n > 0 ? n : null;
}

/** Resolves the exact catalog outcome for an amount, or why the amount is not allowed. */
export function resolveOutcome(
  project: Project,
  amountUSD: unknown,
  locale: Locale,
): { ok: true; amountUSD: number; outcome: string } | { ok: false; error: PledgeErrorCode } {
  if (typeof amountUSD !== "number" || !Number.isFinite(amountUSD) || amountUSD <= 0 || !hasAtMostTwoDecimals(amountUSD)) {
    return { ok: false, error: "invalid_amount" };
  }
  const amount = Math.round(amountUSD * 100) / 100;
  if (amount > MAX_PLEDGE_USD) return { ok: false, error: "above_maximum" };

  const point = project.pricePoints.find((p) => p.amountUSD === amount);
  if (point) return { ok: true, amountUSD: amount, outcome: point.outcome[locale] };

  if (!project.openAmount) return { ok: false, error: "amount_not_offered" };
  if (amount < project.openAmount.minUSD) return { ok: false, error: "below_minimum" };
  return { ok: true, amountUSD: amount, outcome: project.openAmount.outcome[locale] };
}

function optionalText(value: unknown, max: number): { ok: true; value: string | null } | { ok: false } {
  if (value === undefined || value === null) return { ok: true, value: null };
  if (typeof value !== "string") return { ok: false };
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length > max) return { ok: false };
  return { ok: true, value: trimmed || null };
}

export function validatePledge(catalog: Catalog, input: PledgeInput): ValidationResult {
  const locale = input.locale ?? "en";
  const project =
    typeof input.projectId === "string" ? catalog.projects.find((p) => p.id === input.projectId) : undefined;
  if (!project) return { ok: false, error: "project_not_found" };

  const resolved = resolveOutcome(project, input.amountUSD, locale);
  if (!resolved.ok) return resolved;

  const name = optionalText(input.donorName, MAX_DONOR_NAME_LENGTH);
  if (!name.ok) return { ok: false, error: "invalid_donor_name" };
  const intent = optionalText(input.donorIntent, MAX_DONOR_INTENT_LENGTH);
  if (!intent.ok) return { ok: false, error: "invalid_donor_intent" };

  return {
    ok: true,
    project,
    pledge: {
      projectId: project.id,
      amountUSD: resolved.amountUSD,
      outcome: resolved.outcome,
      donorName: name.value ?? DEFAULT_DONOR_NAME,
      donorIntent: intent.value,
      demo: true,
    },
  };
}

export function isPledge(value: unknown): value is Pledge {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.projectId === "string" &&
    typeof p.amountUSD === "number" &&
    typeof p.outcome === "string" &&
    typeof p.donorName === "string" &&
    (p.donorIntent === null || typeof p.donorIntent === "string") &&
    typeof p.createdAt === "string" &&
    p.demo === true
  );
}

/** Browser only. Returns stored pledges, oldest first; ignores malformed entries. */
export function readPledges(): Pledge[] {
  try {
    const raw = window.localStorage.getItem(PLEDGES_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter(isPledge) : [];
  } catch {
    return [];
  }
}

/** Browser only. Appends a pledge (deduped by id) and notifies same-tab listeners. */
export function savePledge(pledge: Pledge): boolean {
  try {
    const pledges = readPledges().filter((p) => p.id !== pledge.id);
    pledges.push(pledge);
    window.localStorage.setItem(PLEDGES_STORAGE_KEY, JSON.stringify(pledges));
    window.dispatchEvent(new CustomEvent(PLEDGES_UPDATED_EVENT, { detail: pledge }));
    return true;
  } catch {
    return false;
  }
}
