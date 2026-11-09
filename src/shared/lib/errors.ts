export interface NormalizedError {
  code: string;
  message: string;
  status: number;
}

/**
 * Anti-Corruption Error Shield:
 * Intercepts raw database/Supabase/gRPC errors and maps them to canonical,
 * sanitized error responses without leaking backend schema, table names, or stack traces.
 */
export function mapBackendError(error: unknown, defaultStatus = 500): NormalizedError {
  if (!error) {
    return {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred. Please try again.",
      status: defaultStatus,
    };
  }

  const err = error as { code?: string; message?: string; status?: number };
  const rawMsg = String(err.message || "");
  const rawCode = String(err.code || "");

  // Authentication & Credentials
  if (
    rawMsg.includes("Invalid login credentials") ||
    rawMsg.includes("invalid_grant") ||
    rawMsg.includes("Email not confirmed")
  ) {
    return {
      code: "INVALID_CREDENTIALS",
      message: "Invalid email or password.",
      status: 401,
    };
  }

  // Authorization & Permissions
  if (
    rawMsg.includes("JWT") ||
    rawMsg.includes("jwt") ||
    rawMsg.includes("Unauthorized") ||
    rawMsg.includes("not authenticated") ||
    err.status === 401
  ) {
    return {
      code: "UNAUTHORIZED",
      message: "Your session has expired. Please sign in again.",
      status: 401,
    };
  }

  if (
    rawMsg.includes("Forbidden") ||
    rawMsg.includes("has_role") ||
    rawMsg.includes("permission denied") ||
    err.status === 403
  ) {
    return {
      code: "FORBIDDEN",
      message: "Administrator privileges required.",
      status: 403,
    };
  }

  // Duplicate key / Conflict
  if (rawCode === "23505" || rawMsg.includes("duplicate key")) {
    return {
      code: "CONFLICT",
      message: "An item with this identifier already exists.",
      status: 409,
    };
  }

  // Rate Limiting
  if (err.status === 429 || rawMsg.includes("rate limit")) {
    return {
      code: "RATE_LIMITED",
      message: "Too many requests. Please wait a moment.",
      status: 429,
    };
  }

  // Default internal server error (Sanitized: NO SQL or backend topology leaked!)
  return {
    code: "INTERNAL_ERROR",
    message: "Operation could not be completed. Please try again later.",
    status: err.status || defaultStatus,
  };
}
