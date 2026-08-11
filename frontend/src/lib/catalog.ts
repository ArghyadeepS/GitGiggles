import { generateRoast, type RoastData, type RoastMode } from "@/lib/roast";

export interface CatalogEntry {
  username: string;
  data: RoastData;
  /** Accent color for this entry's cards. */
  color: string;
}

/**
 * The Roast Vault — a curated set of profiles with evidence already filed.
 * Deterministic per username, so the catalog is stable between visits.
 */
const PROFILES: { username: string; mode: RoastMode }[] = [
  { username: "octocat", mode: "brutal" },
  { username: "alexdev", mode: "brutal" },
  { username: "mira_codes", mode: "friendly" },
  { username: "syntaxsam", mode: "brutal" },
  { username: "nullpointer", mode: "hacker" },
  { username: "devina", mode: "friendly" },
  { username: "koba", mode: "brutal" },
  { username: "heisenbug", mode: "hacker" },
  { username: "asyncannie", mode: "recruiter" },
  { username: "commitless", mode: "brutal" },
  { username: "pixelpete", mode: "friendly" },
  { username: "legacy_larry", mode: "recruiter" },
  { username: "yolo_main", mode: "hacker" },
  { username: "gitguilty", mode: "brutal" },
];

const COLORS = [
  "var(--neo)",
  "var(--neo-yellow)",
  "var(--neo-purple)",
  "var(--neo-fire)",
  "#ff7a00",
];

export function getCatalog(): CatalogEntry[] {
  return PROFILES.map((profile, index) => ({
    username: profile.username,
    data: generateRoast(profile.username, profile.mode),
    color: COLORS[index % COLORS.length],
  }));
}

export function scoreColor(score: number): string {
  if (score >= 90) return "var(--neo-fire)";
  if (score >= 80) return "var(--neo)";
  if (score >= 65) return "var(--neo-yellow)";
  return "var(--neo-purple)";
}
