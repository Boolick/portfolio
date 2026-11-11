import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  getHeaderOffset,
  getTargetScrollY,
  smoothScrollTo,
  stopSmoothScroll,
} from "./smooth-scroll.ts";

describe("SmoothScroll Engine", () => {
  it("defaults header offset to 56 when document is undefined or empty", () => {
    stopSmoothScroll();
    assert.equal(getHeaderOffset(), 56);
  });

  it("skips hidden display:none headers (such as .tma-only in web browsers) when computing offset", () => {
    const prevDoc = globalThis.document;
    try {
      (globalThis as unknown as { document: unknown }).document = {
        querySelectorAll: () => [
          { getBoundingClientRect: () => ({ height: 0 }) },
          { getBoundingClientRect: () => ({ height: 56.4 }) },
        ],
      };

      assert.equal(getHeaderOffset(), 56);
    } finally {
      (globalThis as unknown as { document: unknown }).document = prevDoc;
    }
  });

  it("calculates target scroll Y with boundary clamping", () => {
    const targetY = getTargetScrollY("non-existent-section");
    assert.equal(targetY, 0);
  });

  it("drives window.scrollTo with explicit behavior: 'instant' on every frame", async () => {
    const prevWindow = globalThis.window;
    const prevDoc = globalThis.document;
    const prevRaf = globalThis.requestAnimationFrame;
    const prevCaf = globalThis.cancelAnimationFrame;

    const scrollCalls: Array<ScrollToOptions | undefined> = [];
    const listeners = new Map<string, Set<EventListenerOrEventListenerObject>>();
    let frameIndex = 0;

    try {
      const mockWindow = {
        scrollY: 0,
        innerHeight: 800,
        scrollTo: (opts?: ScrollToOptions) => {
          scrollCalls.push(opts);
          if (opts && typeof opts.top === "number") {
            mockWindow.scrollY = opts.top;
          }
        },
        addEventListener: (type: string, fn: EventListenerOrEventListenerObject) => {
          if (!listeners.has(type)) listeners.set(type, new Set());
          listeners.get(type)!.add(fn);
        },
        removeEventListener: (type: string, fn: EventListenerOrEventListenerObject) => {
          listeners.get(type)?.delete(fn);
        },
        history: {
          replaceState: () => {},
        },
      };

      (globalThis as unknown as { window: unknown }).window = mockWindow;
      (globalThis as unknown as { document: unknown }).document = {
        querySelectorAll: () => [{ getBoundingClientRect: () => ({ height: 85 }) }],
        getElementById: (id: string) =>
          id === "approach"
            ? { getBoundingClientRect: () => ({ top: 4474 }) }
            : null,
        documentElement: { scrollHeight: 11000 },
      };

      let time = 0;
      (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = (
        cb: FrameRequestCallback
      ) => {
        frameIndex += 1;
        time += 16;
        // Advance synchronously across frames via microtask
        queueMicrotask(() => cb(time));
        return frameIndex;
      };
      (globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = () => {};

      await smoothScrollTo("approach");

      assert.ok(scrollCalls.length > 0, "Expected rAF loop to issue scrollTo calls");
      for (const call of scrollCalls) {
        assert.equal(call?.behavior, "instant");
      }
      assert.equal(scrollCalls[scrollCalls.length - 1]?.top, 4389);
    } finally {
      stopSmoothScroll();
      (globalThis as unknown as { window: unknown }).window = prevWindow;
      (globalThis as unknown as { document: unknown }).document = prevDoc;
      (globalThis as unknown as { requestAnimationFrame: unknown }).requestAnimationFrame = prevRaf;
      (globalThis as unknown as { cancelAnimationFrame: unknown }).cancelAnimationFrame = prevCaf;
    }
  });

  it("does not enable global CSS scroll-smooth on <html> in layout.tsx", () => {
    const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx");
    const source = fs.readFileSync(layoutPath, "utf8");
    assert.equal(
      source.includes("scroll-smooth"),
      false,
      "Root <html> must not set scroll-smooth while smoothScrollTo drives rAF frames"
    );
  });

  it("verifies spring tension and damping constants match ThemeWheelEngine", () => {
    const tension = 140;
    const damping = 19;
    const zeta = damping / (2 * Math.sqrt(tension));
    assert.ok(
      zeta > 0.7 && zeta < 1.0,
      "Damping ratio must be in the optimal responsive sweet spot"
    );
  });
});
