import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  clampSlideIndex,
  getAdjacentSlideIndex,
  resolveActiveSlideIndex,
} from "./slider-navigation.ts";

describe("slider-navigation", () => {
  it("clamps slide indices within bounds and handles invalid values safely", () => {
    assert.equal(clampSlideIndex(-3, 6), 0);
    assert.equal(clampSlideIndex(0, 6), 0);
    assert.equal(clampSlideIndex(5, 6), 5);
    assert.equal(clampSlideIndex(12, 6), 5);
    assert.equal(clampSlideIndex(Number.NaN, 6), 0);
    assert.equal(clampSlideIndex(2, 0), 0);
  });

  it("computes adjacent slide indices with optional wrap-around", () => {
    // Non-wrapping boundaries
    assert.equal(getAdjacentSlideIndex(0, "prev", 6, false), 0);
    assert.equal(getAdjacentSlideIndex(5, "next", 6, false), 5);
    assert.equal(getAdjacentSlideIndex(2, "next", 6, false), 3);
    assert.equal(getAdjacentSlideIndex(2, "prev", 6, false), 1);

    // Wrapping boundaries (used for Restart on final panel)
    assert.equal(getAdjacentSlideIndex(0, "prev", 6, true), 5);
    assert.equal(getAdjacentSlideIndex(5, "next", 6, true), 0);
  });

  it("resolves active slide index accurately from scrollLeft and container width", () => {
    const width = 360;
    const total = 6;

    assert.equal(resolveActiveSlideIndex(0, width, total), 0);
    // Less than 50% swiped remains on current slide
    assert.equal(resolveActiveSlideIndex(179, width, total), 0);
    // Past 50% threshold snaps to next slide
    assert.equal(resolveActiveSlideIndex(181, width, total), 1);
    assert.equal(resolveActiveSlideIndex(1080, width, total), 3);
    // Overscroll past final panel clamps cleanly
    assert.equal(resolveActiveSlideIndex(2500, width, total), 5);
    // Guard against zero-width / SSR / unmounted container
    assert.equal(resolveActiveSlideIndex(360, 0, total), 0);
  });
});
