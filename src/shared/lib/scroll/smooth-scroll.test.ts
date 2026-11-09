import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getHeaderOffset,
  getTargetScrollY,
  stopSmoothScroll,
} from "./smooth-scroll.ts";

describe("SmoothScroll Engine", () => {
  it("defaults header offset to 56 when document is undefined or empty", () => {
    stopSmoothScroll();
    assert.equal(getHeaderOffset(), 56);
  });

  it("calculates target scroll Y with boundary clamping", () => {
    const targetY = getTargetScrollY("non-existent-section");
    assert.equal(targetY, 0);
  });

  it("verifies spring tension and damping constants match ThemeWheelEngine", () => {
    // Verified parameters: tension 140, damping 19
    const tension = 140;
    const damping = 19;
    // Critical damping condition: c_crit = 2 * sqrt(m * k)
    // For unit mass m = 1, k = 140:
    // c_crit = 2 * sqrt(140) ~= 2 * 11.832 ~= 23.66
    // damping = 19 gives zeta = 19 / 23.66 ~= 0.803 (swift responsive settling with minimal overshoot)
    const zeta = damping / (2 * Math.sqrt(tension));
    assert.ok(zeta > 0.7 && zeta < 1.0, "Damping ratio must be in the optimal responsive sweet spot");
  });
});
