/**
 * CSRF Protection Utility
 *
 * Verifies that incoming mutating HTTP requests have an Origin header
 * matching the Host header of the application.
 *
 * Route Handlers in Next.js do not have automatic origin verification
 * (unlike Server Actions), making this check mandatory for BFF endpoints
 * handling sensitive mutations like login, logout, etc.
 */

export function verifyCsrfOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  const host =
    req.headers.get("x-forwarded-host")?.split(",")[0].trim() ||
    req.headers.get("host");

  if (!origin || !host) {
    return false;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}
