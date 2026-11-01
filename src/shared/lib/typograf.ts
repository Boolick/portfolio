/**
 * Typographic utility for binding prepositions, conjunctions, units, and em-dashes
 * with non-breaking spaces (\u00A0) to eliminate dangling orphans in Russian and English copy.
 */

const SHORT_WORDS_RE =
  /(^|[\s\u00A0(«"“])(в|во|и|а|но|да|с|со|к|ко|о|об|у|на|по|из|за|от|до|не|ни|под|над|при|про|без|для|или|как|a|an|the|in|on|at|to|of|by|or|as|for|and|via)[ \t]+/gi;

const NUMBER_UNIT_RE =
  /(\d+)[ \t]+(лет|года|год|систем\S*|проект\S*|мс|ms|s|%)/gi;

const EM_DASH_RE = /[ \t]+—/g;
const POD_KLYUCH_RE = /под[ \t]+ключ/gi;

export function typograf(text: string): string {
  if (!text || typeof text !== "string") return text;

  // Protect URLs and email addresses from space-replacement mutations
  if (text.startsWith("http://") || text.startsWith("https://") || text.startsWith("mailto:")) {
    return text;
  }

  return text
    .replace(SHORT_WORDS_RE, (_m, p1, p2) => `${p1}${p2}\u00A0`)
    .replace(SHORT_WORDS_RE, (_m, p1, p2) => `${p1}${p2}\u00A0`) // second pass for consecutive prepositions e.g. "и в "
    .replace(NUMBER_UNIT_RE, "$1\u00A0$2")
    .replace(POD_KLYUCH_RE, (m) => m.replace(/[ \t]+/, "\u00A0"))
    .replace(EM_DASH_RE, "\u00A0—");
}

/**
 * Standard Russian cardinal pluralization.
 * @param count numeric count
 * @param forms tuple of [singular (1), few (2..4), many (0, 5..20)]
 * @example pluralizeRu(3, ["система", "системы", "систем"]) => "3 системы"
 */
export function pluralizeRu(
  count: number,
  forms: [string, string, string]
): string {
  const abs = Math.abs(count);
  const mod10 = abs % 10;
  const mod100 = abs % 100;

  let form: string;
  if (mod100 >= 11 && mod100 <= 19) {
    form = forms[2];
  } else if (mod10 === 1) {
    form = forms[0];
  } else if (mod10 >= 2 && mod10 <= 4) {
    form = forms[1];
  } else {
    form = forms[2];
  }

  return `${count}\u00A0${form}`;
}
