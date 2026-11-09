/**
 * Escapes characters for Telegram parse_mode: "HTML" messages:
 * &, <, >, " are replaced with their respective HTML entities.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
