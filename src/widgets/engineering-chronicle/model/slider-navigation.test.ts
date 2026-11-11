import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CHRONICLE_PANELS } from "./panels.ts";
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

  it("computes adjacent slide indices and supports full 01->06->01 restart cycle", () => {
    assert.equal(getAdjacentSlideIndex(0, "prev", 6, false), 0);
    assert.equal(getAdjacentSlideIndex(5, "next", 6, false), 5);

    // Step forward from 01 through 06
    let idx = 0;
    for (let step = 1; step <= 5; step += 1) {
      idx = getAdjacentSlideIndex(idx, "next", 6, true);
      assert.equal(idx, step);
    }
    // Restart on slide 06 wraps cleanly back to 01
    assert.equal(getAdjacentSlideIndex(idx, "next", 6, true), 0);
    // Wrapping backwards from 01 reaches 06
    assert.equal(getAdjacentSlideIndex(0, "prev", 6, true), 5);
  });

  it("resolves active slide index accurately from scrollLeft across mobile and desktop widths", () => {
    for (const width of [320, 360, 1230]) {
      assert.equal(resolveActiveSlideIndex(0, width, 6), 0);
      assert.equal(resolveActiveSlideIndex(width * 0.49, width, 6), 0);
      assert.equal(resolveActiveSlideIndex(width * 0.51, width, 6), 1);
      assert.equal(resolveActiveSlideIndex(width * 5, width, 6), 5);
      assert.equal(resolveActiveSlideIndex(width * 7, width, 6), 5);
    }
    assert.equal(resolveActiveSlideIndex(360, 0, 6), 0);
  });

  it("keeps all 6 chronicle panels configured with exact dimensions and zero legacy grid delay", () => {
    assert.equal(CHRONICLE_PANELS.length, 6);
    for (const panel of CHRONICLE_PANELS) {
      assert.ok(panel.dimensions.width > 0 && panel.dimensions.height > 0);
      assert.equal(panel.delayMs, 0);
      assert.ok(panel.title.en && panel.title.ru);
      assert.ok(panel.punchline.en && panel.punchline.ru);
      assert.ok(panel.caption.en && panel.caption.ru);
    }
  });

  it("ensures slider track allows both horizontal swipe and vertical page scroll (touch-pan-x touch-pan-y)", () => {
    const chroniclePath = path.resolve(
      process.cwd(),
      "src/widgets/engineering-chronicle/ui/engineering-chronicle.tsx"
    );
    const source = fs.readFileSync(chroniclePath, "utf8");
    assert.match(source, /touch-pan-x\s+touch-pan-y/);
    assert.equal(
      source.includes("scroll-smooth"),
      false,
      "Slider track should not mix CSS scroll-smooth with programmatic ResizeObserver/scrollTo"
    );
  });
});
