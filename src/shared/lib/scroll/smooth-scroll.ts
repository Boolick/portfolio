/**
 * ============================================================================
 * SPRING-DAMPER SMOOTH SCROLL ENGINE (PURE TYPESCRIPT)
 * Architecture: Physics-based, 60/120fps rAF loop, Zero-React-State overhead
 * Synchronized with: ThemeWheelEngine spring parameters (1980s hardware feel)
 * ============================================================================
 */

function triggerHapticFeedback(): void {
  try {
    if (typeof window !== "undefined") {
      const tg = (
        window as unknown as {
          Telegram?: {
            WebApp?: {
              HapticFeedback?: { selectionChanged?: () => void };
            };
          };
        }
      ).Telegram?.WebApp;
      if (tg?.HapticFeedback) {
        tg.HapticFeedback.selectionChanged?.();
      } else if (typeof navigator !== "undefined" && typeof navigator.vibrate === "function") {
        navigator.vibrate(6);
      }
    }
  } catch {}
}

export interface SmoothScrollOptions {
  tension?: number;
  damping?: number;
  additionalOffset?: number;
  updateHash?: boolean;
  onSettled?: () => void;
}

let activeRafId: number | null = null;
let cleanupInterruptionListeners: (() => void) | null = null;

export function stopSmoothScroll(): void {
  if (activeRafId !== null) {
    if (typeof cancelAnimationFrame !== "undefined") {
      cancelAnimationFrame(activeRafId);
    }
    activeRafId = null;
  }
  if (cleanupInterruptionListeners) {
    cleanupInterruptionListeners();
    cleanupInterruptionListeners = null;
  }
}

/**
 * Returns dynamic, subpixel-accurate header height (56px desktop, ~96px mobile)
 */
export function getHeaderOffset(): number {
  if (typeof document === "undefined") return 56;
  const header =
    document.querySelector<HTMLElement>("header.sticky") ||
    document.querySelector<HTMLElement>("header");
  if (!header) return 56;
  const rect = header.getBoundingClientRect();
  return Math.round(rect.height);
}

/**
 * Calculates exact scroll position so section top matches header bottom border
 */
export function getTargetScrollY(
  target: string | HTMLElement,
  additionalOffset = 0
): number {
  if (typeof window === "undefined" || typeof document === "undefined") return 0;

  let el: HTMLElement | null = null;
  if (typeof target === "string") {
    const cleanId = target.replace(/^[/#]+/, "");
    el = document.getElementById(cleanId);
  } else {
    el = target;
  }

  if (!el) return window.scrollY;

  const rect = el.getBoundingClientRect();
  const headerOffset = getHeaderOffset();
  const totalOffset = headerOffset + additionalOffset;
  const targetY = Math.round(rect.top + window.scrollY - totalOffset);

  // Clamp to maximum scrollable range
  const maxScroll = Math.max(
    0,
    document.documentElement.scrollHeight - window.innerHeight
  );
  return Math.max(0, Math.min(targetY, maxScroll));
}

/**
 * Smoothly scrolls to target using critically damped spring-damper physics
 * Matches the exact physical parameters of the theme knurled thumbwheel.
 */
export function smoothScrollTo(
  target: string | HTMLElement | number,
  options: SmoothScrollOptions = {}
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  // Stop any currently running scroll animation
  stopSmoothScroll();

  const startY = window.scrollY;
  let targetY = 0;

  if (typeof target === "number") {
    targetY = target;
  } else {
    targetY = getTargetScrollY(target, options.additionalOffset ?? 0);
  }

  // If already at target, return immediately
  if (Math.abs(targetY - startY) < 1) {
    if (typeof target === "string" && options.updateHash !== false) {
      const cleanId = target.replace(/^[/#]+/, "");
      if (cleanId) {
        window.history.replaceState(null, "", `#${cleanId}`);
      }
    }
    return Promise.resolve();
  }

  triggerHapticFeedback();

  return new Promise<void>((resolve) => {
    const tension = options.tension ?? 140; // Identical to ThemeWheelEngine
    const damping = options.damping ?? 19;  // Identical to ThemeWheelEngine
    const distance = targetY - startY;

    let p = 0; // Normalized progress [0.0 .. 1.0]
    let velocity = 0;
    let lastTime = performance.now();

    const onUserInterrupt = () => {
      stopSmoothScroll();
      resolve();
    };

    // User interaction immediately yields control back to native scroll
    window.addEventListener("wheel", onUserInterrupt, { passive: true, once: true });
    window.addEventListener("touchstart", onUserInterrupt, { passive: true, once: true });
    window.addEventListener("keydown", onUserInterrupt, { passive: true, once: true });

    cleanupInterruptionListeners = () => {
      window.removeEventListener("wheel", onUserInterrupt);
      window.removeEventListener("touchstart", onUserInterrupt);
      window.removeEventListener("keydown", onUserInterrupt);
    };

    const loop = (now: number) => {
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      // Clamp dt to 24ms max to handle frame drops gracefully
      const dt = Math.min(Math.max(rawDt, 0.001), 0.024);

      // Spring-mass-damper physics towards target progress 1.0
      const displacement = p - 1.0;
      const springForce = -tension * displacement;
      const dampingForce = -damping * velocity;
      const acceleration = springForce + dampingForce;

      velocity += acceleration * dt;
      p += velocity * dt;

      // Check settlement threshold
      if (Math.abs(p - 1.0) < 0.003 && Math.abs(velocity) < 0.03) {
        window.scrollTo(0, targetY);
        stopSmoothScroll();

        if (typeof target === "string" && options.updateHash !== false) {
          const cleanId = target.replace(/^[/#]+/, "");
          if (cleanId) {
            window.history.replaceState(null, "", `#${cleanId}`);
          }
        }

        if (options.onSettled) options.onSettled();
        resolve();
        return;
      }

      const currentY = Math.round(startY + distance * p);
      window.scrollTo(0, currentY);

      activeRafId = requestAnimationFrame(loop);
    };

    activeRafId = requestAnimationFrame(loop);
  });
}
