/**
 * Pure mode resolver for TypewriterText lifecycle transitions.
 */
export type TypewriterLifecycleMode = "immediate" | "idle" | "observe";

export interface TypewriterModeInput {
  hasTriggered: boolean;
  prefersReducedMotion: boolean;
  hasIntersectionObserver: boolean;
  active: boolean;
}

export function resolveTypewriterMode(
  input: TypewriterModeInput
): TypewriterLifecycleMode {
  if (
    input.hasTriggered ||
    input.prefersReducedMotion ||
    !input.hasIntersectionObserver
  ) {
    return "immediate";
  }

  return input.active ? "observe" : "idle";
}
