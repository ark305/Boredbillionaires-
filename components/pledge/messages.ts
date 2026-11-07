import type { Locale } from "@/lib/locale";
import type { PledgeErrorCode } from "@/lib/pledges";

const en = {
  demoLabel: "Demo pledge — no money moves.",
  eyebrow: "Make a demo pledge",
  steps: { select: "Amount", confirm: "Confirm", done: "Impact card" },
  stepOf: (n: number, total: number) => `Step ${n} of ${total}`,
  chooseAmount: "Choose an amount",
  customAmount: "Custom amount",
  customAmountHint: (min: string) => `Any amount from ${min}. Gets the outcome below.`,
  customPlaceholder: "Amount in USD",
  outcomeFor: "Outcome",
  continue: "Continue",
  back: "Back",
  confirmTitle: "Confirm your demo pledge",
  project: "Project",
  amount: "Amount",
  outcome: "Exact outcome",
  donorName: "Your name (optional)",
  donorNameHint: "Shown on your impact card. Leave blank to stay anonymous.",
  donorIntent: "Why this project? (optional)",
  anonymous: "Anonymous",
  confirm: "Confirm demo pledge",
  confirming: "Confirming…",
  savedLocally: "Saved on this device.",
  notSavedLocally: "Couldn't save on this device (storage unavailable).",
  pledgeAnother: "Pledge again",
  browseProjects: "Browse projects",
  notFoundTitle: "Project not found",
  notFoundBody: "Pick one of the projects below to start a demo pledge.",
  errors: {
    required: "Choose an amount or enter a custom one.",
    invalid_amount: "Enter a positive amount in USD, with at most 2 decimals.",
    amount_not_offered: "This project only accepts the listed amounts.",
    below_minimum: "That amount is below this project's minimum.",
    above_maximum: "That amount is above the demo limit.",
    project_not_found: "This project is no longer in the catalog.",
    invalid_donor_name: "Name is too long (60 characters max).",
    invalid_donor_intent: "Reason is too long (280 characters max).",
    network: "Couldn't reach the server. Please try again.",
  } satisfies Record<PledgeErrorCode | "required" | "network", string>,
  card: {
    title: "Impact card",
    pledgedTo: "Demo pledge to",
    intendedOutcome: "Intended outcome",
    date: "Date",
    donor: "Pledged by",
    notFunding: "Not completed funding. Illustrative pledge only.",
  },
  share: {
    copy: "Copy text",
    copied: "Copied!",
    copyFailed: "Copy failed",
    x: "Share on X",
    text: (o: { amount: string; project: string; outcome: string; label: string }) =>
      `I made a ${o.amount} demo pledge to ${o.project} on Bored Billionaires. Intended outcome: ${o.outcome}. ${o.label}`,
  },
};

export type PledgeMessages = typeof en;

const es: PledgeMessages = {
  demoLabel: "Promesa de demostración — no se mueve dinero.",
  eyebrow: "Haz una promesa de demostración",
  steps: { select: "Monto", confirm: "Confirmar", done: "Tarjeta de impacto" },
  stepOf: (n, total) => `Paso ${n} de ${total}`,
  chooseAmount: "Elige un monto",
  customAmount: "Monto personalizado",
  customAmountHint: (min) => `Cualquier monto desde ${min}. Recibe el resultado de abajo.`,
  customPlaceholder: "Monto en USD",
  outcomeFor: "Resultado",
  continue: "Continuar",
  back: "Atrás",
  confirmTitle: "Confirma tu promesa de demostración",
  project: "Proyecto",
  amount: "Monto",
  outcome: "Resultado exacto",
  donorName: "Tu nombre (opcional)",
  donorNameHint: "Aparece en tu tarjeta de impacto. Déjalo vacío para ser anónimo.",
  donorIntent: "¿Por qué este proyecto? (opcional)",
  anonymous: "Anónimo",
  confirm: "Confirmar promesa demo",
  confirming: "Confirmando…",
  savedLocally: "Guardada en este dispositivo.",
  notSavedLocally: "No se pudo guardar en este dispositivo (almacenamiento no disponible).",
  pledgeAnother: "Hacer otra promesa",
  browseProjects: "Ver proyectos",
  notFoundTitle: "Proyecto no encontrado",
  notFoundBody: "Elige uno de estos proyectos para empezar una promesa de demostración.",
  errors: {
    required: "Elige un monto o escribe uno personalizado.",
    invalid_amount: "Escribe un monto positivo en USD, con máximo 2 decimales.",
    amount_not_offered: "Este proyecto solo acepta los montos indicados.",
    below_minimum: "Ese monto está por debajo del mínimo del proyecto.",
    above_maximum: "Ese monto supera el límite de la demo.",
    project_not_found: "Este proyecto ya no está en el catálogo.",
    invalid_donor_name: "El nombre es muy largo (máximo 60 caracteres).",
    invalid_donor_intent: "El motivo es muy largo (máximo 280 caracteres).",
    network: "No se pudo conectar con el servidor. Inténtalo de nuevo.",
  },
  card: {
    title: "Tarjeta de impacto",
    pledgedTo: "Promesa demo para",
    intendedOutcome: "Resultado previsto",
    date: "Fecha",
    donor: "Promesa de",
    notFunding: "No es financiación completada. Promesa ilustrativa.",
  },
  share: {
    copy: "Copiar texto",
    copied: "¡Copiado!",
    copyFailed: "No se pudo copiar",
    x: "Compartir en X",
    text: (o) =>
      `Hice una promesa de demostración de ${o.amount} a ${o.project} en Bored Billionaires. Resultado previsto: ${o.outcome}. ${o.label}`,
  },
};

const messages: Record<Locale, PledgeMessages> = { en, es };

export function getPledgeMessages(locale: Locale): PledgeMessages {
  return messages[locale];
}
