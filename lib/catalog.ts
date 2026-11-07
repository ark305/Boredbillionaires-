import catalogData from "@/data/catalog.json";
import type { Locale } from "./locale";

export type LocalizedText = Record<Locale, string>;

export type PricePoint = {
  amountUSD: number;
  outcome: LocalizedText;
};

export type OpenAmount = {
  minUSD: number;
  outcome: LocalizedText;
};

export type Project = {
  id: string;
  name: LocalizedText;
  category: string;
  location: string;
  summary: LocalizedText;
  pricePoints: PricePoint[];
  openAmount: OpenAmount | null;
};

export type Catalog = {
  version: number;
  currency: "USD";
  projects: Project[];
};

export const catalog = catalogData as Catalog;

export function listProjects(): Project[] {
  return catalog.projects;
}

export function getProject(id: string | null | undefined): Project | undefined {
  if (!id) return undefined;
  return catalog.projects.find((p) => p.id === id);
}
