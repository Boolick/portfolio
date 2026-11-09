export const ALLOWED_CASE_SLUGS = [
  "dkmline",
  "dexsa",
  "tower-empire",
  "portfolio",
] as const;

export type CaseSlug = (typeof ALLOWED_CASE_SLUGS)[number];

export const ALLOWED_SECTION_IDS = [
  "profile",
  "stack",
  "projects",
  "approach",
  "experience",
  "education",
  "contact",
] as const;

export type SectionId = (typeof ALLOWED_SECTION_IDS)[number];

export type ParsedStartParam =
  | { type: "case"; slug: CaseSlug }
  | { type: "section"; sectionId: SectionId }
  | { type: "none" };

const START_PARAM_REGEX = /^[A-Za-z0-9_-]{1,64}$/;

/**
 * Parses and strictly validates a Telegram start_param (deep-link) string.
 * Enforces regex constraints and strict allowlists to prevent injection or invalid navigation.
 */
export function parseStartParam(raw: string | null | undefined): ParsedStartParam {
  if (!raw || typeof raw !== "string") {
    return { type: "none" };
  }

  const trimmed = raw.trim();
  if (!START_PARAM_REGEX.test(trimmed)) {
    return { type: "none" };
  }

  const normalized = trimmed.toLowerCase();

  if (normalized.startsWith("case_")) {
    const rawSlug = normalized.slice(5);
    // Allow both kebab-case and snake_case in input
    const slug = rawSlug.replace(/_/g, "-");
    if ((ALLOWED_CASE_SLUGS as readonly string[]).includes(slug)) {
      return { type: "case", slug: slug as CaseSlug };
    }
    return { type: "none" };
  }

  if (normalized.startsWith("section_")) {
    const sectionId = normalized.slice(8);
    if ((ALLOWED_SECTION_IDS as readonly string[]).includes(sectionId)) {
      return { type: "section", sectionId: sectionId as SectionId };
    }
    return { type: "none" };
  }

  return { type: "none" };
}
