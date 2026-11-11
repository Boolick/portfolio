export const NAV_SCROLL_THRESHOLD = 60;
export const NAV_COLLAPSE_DELTA_DOWN = 8;
export const NAV_EXPAND_DELTA_UP = -14;

export interface NavVisibilityState {
  isScrolled: boolean;
  isCollapsed: boolean;
  isManualOpen: boolean;
}

/** Effective open state of the collapsible navigation bar. */
export function isNavOpen(state: Pick<NavVisibilityState, "isCollapsed" | "isManualOpen">): boolean {
  return !state.isCollapsed || state.isManualOpen;
}

/** Computes next visibility state after a scroll tick. */
export function reduceScrollNavState(
  prev: NavVisibilityState,
  scrollY: number,
  delta: number
): NavVisibilityState {
  if (scrollY <= NAV_SCROLL_THRESHOLD) {
    return {
      isScrolled: false,
      isCollapsed: false,
      isManualOpen: false,
    };
  }

  if (delta > NAV_COLLAPSE_DELTA_DOWN && !prev.isCollapsed) {
    return {
      isScrolled: true,
      isCollapsed: true,
      isManualOpen: false,
    };
  }

  if (delta < NAV_EXPAND_DELTA_UP && prev.isCollapsed) {
    return {
      isScrolled: true,
      isCollapsed: false,
      isManualOpen: prev.isManualOpen,
    };
  }

  return prev.isScrolled ? prev : { ...prev, isScrolled: true };
}

/** Closes the nav bar when scrolled (works for both manually and auto-expanded states). */
export function reduceCloseNavState(scrollY: number): NavVisibilityState {
  if (scrollY > NAV_SCROLL_THRESHOLD) {
    return {
      isScrolled: true,
      isCollapsed: true,
      isManualOpen: false,
    };
  }

  return {
    isScrolled: false,
    isCollapsed: false,
    isManualOpen: false,
  };
}
