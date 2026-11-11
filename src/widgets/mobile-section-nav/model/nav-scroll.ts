/**
 * Computes the horizontal scrollLeft offset needed to center an active tab
 * inside a horizontally scrollable nav container without touching window scrollY.
 * Returns null when all items already fit inside containerWidth.
 */
export function computeNavCenterScrollLeft(
  itemOffsetLeft: number,
  itemWidth: number,
  containerWidth: number,
  scrollWidth: number
): number | null {
  if (
    !Number.isFinite(containerWidth) ||
    !Number.isFinite(scrollWidth) ||
    containerWidth <= 0 ||
    scrollWidth <= containerWidth
  ) {
    return null;
  }

  const maxScrollLeft = scrollWidth - containerWidth;
  const centered = itemOffsetLeft - (containerWidth - itemWidth) / 2;
  return Math.max(0, Math.min(maxScrollLeft, Math.round(centered)));
}
