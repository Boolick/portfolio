/**
 * Pure slider index math and scroll-snap position resolvers for EngineeringChronicle.
 * Kept framework-free for deterministic unit testing via Node test runner.
 */

export function clampSlideIndex(index: number, total: number): number {
  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(index)) return 0;
  const maxIndex = Math.floor(total) - 1;
  return Math.max(0, Math.min(maxIndex, Math.round(index)));
}

export function getAdjacentSlideIndex(
  current: number,
  direction: "prev" | "next",
  total: number,
  wrap = false
): number {
  if (!Number.isFinite(total) || total <= 0) return 0;
  const maxIndex = Math.floor(total) - 1;
  const safeCurrent = clampSlideIndex(current, total);

  if (direction === "prev") {
    if (safeCurrent === 0) {
      return wrap ? maxIndex : 0;
    }
    return safeCurrent - 1;
  }

  if (safeCurrent >= maxIndex) {
    return wrap ? 0 : maxIndex;
  }
  return safeCurrent + 1;
}

export function resolveActiveSlideIndex(
  scrollLeft: number,
  slideWidth: number,
  total: number
): number {
  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(slideWidth) || slideWidth <= 0) return 0;
  if (!Number.isFinite(scrollLeft) || scrollLeft <= 0) return 0;

  return clampSlideIndex(scrollLeft / slideWidth, total);
}
