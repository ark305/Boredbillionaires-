import { catalog } from "@/lib/catalog";
import { getLocale } from "@/lib/i18n";
import { parseLocale } from "@/lib/locale";
import { validatePledge, type Pledge, type PledgeErrorCode } from "@/lib/pledges";

const ERROR_STATUS: Record<PledgeErrorCode | "invalid_json", number> = {
  invalid_json: 400,
  project_not_found: 404,
  invalid_amount: 422,
  amount_not_offered: 422,
  below_minimum: 422,
  above_maximum: 422,
  invalid_donor_name: 422,
  invalid_donor_intent: 422,
};

function error(code: PledgeErrorCode | "invalid_json") {
  return Response.json({ error: code, demo: true }, { status: ERROR_STATUS[code] });
}

// Demo only: validates against data/catalog.json and echoes the pledge back. Nothing is stored or charged.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return error("invalid_json");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return error("invalid_json");
  const input = body as Record<string, unknown>;

  const locale = parseLocale(input.locale) ?? (await getLocale());
  const result = validatePledge(catalog, {
    projectId: input.projectId,
    amountUSD: input.amountUSD,
    donorName: input.donorName,
    donorIntent: input.donorIntent,
    locale,
  });
  if (!result.ok) return error(result.error);

  const { projectId, amountUSD, outcome, donorName, donorIntent } = result.pledge;
  const pledge: Pledge = {
    id: crypto.randomUUID(),
    projectId,
    amountUSD,
    outcome,
    donorName,
    donorIntent,
    createdAt: new Date().toISOString(),
    demo: true,
  };
  return Response.json({ pledge }, { status: 201 });
}
