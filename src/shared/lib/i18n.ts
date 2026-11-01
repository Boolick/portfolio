import { typograf } from "./typograf";

export type Lang = "en" | "ru";

export function pickLocale<T extends object>(
  row: T,
  field: string,
  lang: Lang
): string {
  const r = row as Record<string, unknown>;
  const key = `${field}_${lang}`;
  const fallback = `${field}_en`;
  const val = ((r[key] as string) || (r[fallback] as string) || "") as string;
  return typograf(val);
}

export function pickLocaleArr<T extends object>(
  row: T,
  field: string,
  lang: Lang
): string[] {
  const r = row as Record<string, unknown>;
  const key = `${field}_${lang}`;
  const fallback = `${field}_en`;
  const arr = ((r[key] as string[]) || (r[fallback] as string[]) || []) as string[];
  return arr.map((item) => typograf(item));
}
