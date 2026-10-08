export type Lang = "en" | "ru";

export function pickLocale<T extends object>(
  row: T,
  field: string,
  lang: Lang
): string {
  const r = row as Record<string, unknown>;
  const key = `${field}_${lang}`;
  const fallback = `${field}_en`;
  return ((r[key] as string) || (r[fallback] as string) || "") as string;
}

export function pickLocaleArr<T extends object>(
  row: T,
  field: string,
  lang: Lang
): string[] {
  const r = row as Record<string, unknown>;
  const key = `${field}_${lang}`;
  const fallback = `${field}_en`;
  return ((r[key] as string[]) || (r[fallback] as string[]) || []) as string[];
}
