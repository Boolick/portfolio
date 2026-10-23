import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ThemeWheelEngine } from "./wheel-engine.ts";

describe("ThemeWheelEngine - Transfer Curve", () => {
  const engine = new ThemeWheelEngine();

  it("calculates correct boundary values", () => {
    assert.equal(engine.transferCurve(0.0), 0);
    assert.equal(engine.transferCurve(1.0), 100);
    assert.equal(engine.transferCurve(0.4), 20);
    assert.equal(engine.transferCurve(0.6), 80);
    assert.equal(engine.transferCurve(0.5), 50);
  });

  it("clamps out-of-bounds positions safely", () => {
    assert.equal(engine.transferCurve(-0.5), 0);
    assert.equal(engine.transferCurve(1.5), 100);
  });

  it("is strictly monotonic non-decreasing across full range", () => {
    let last = -1;
    for (let i = 0; i <= 100; i++) {
      const x = i / 100;
      const val = engine.transferCurve(x);
      assert.ok(val >= last, `transferCurve(${x}) = ${val} is less than ${last}`);
      last = val;
    }
  });

  it("produces smooth S-curve through transition band", () => {
    const val45 = engine.transferCurve(0.45);
    const val50 = engine.transferCurve(0.50);
    const val55 = engine.transferCurve(0.55);

    // 0.45 should be between 20 and 50
    assert.ok(val45 > 20 && val45 < 50);
    // 0.50 is exact midpoint 50
    assert.equal(val50, 50);
    // 0.55 should be between 50 and 80
    assert.ok(val55 > 50 && val55 < 80);
  });
});

describe("ThemeWheelEngine - Hysteresis & Schmitt Trigger logic", () => {
  it("respects 42% / 58% hysteresis threshold", () => {
    const modeChanges: string[] = [];

    const engine = new ThemeWheelEngine({
      onModeChange: (m) => {
        modeChanges.push(m);
      },
    });

    // Start at light (0.0)
    assert.equal(engine.getMode(), "light");

    // Move to 0.40 -> still light
    engine.applyToDOM(0.40, false);
    assert.equal(engine.getMode(), "light");

    // Move to 0.50 (in the deadzone) -> still light! No flickering!
    engine.applyToDOM(0.50, false);
    assert.equal(engine.getMode(), "light");

    // Move to 0.57 -> still light
    engine.applyToDOM(0.57, false);
    assert.equal(engine.getMode(), "light");

    // Cross 0.58 threshold -> flips to dark!
    engine.applyToDOM(0.59, false);
    assert.equal(engine.getMode(), "dark");
    assert.deepEqual(modeChanges, ["dark"]);

    // Move back to 0.50 -> still dark! Hysteresis holds!
    engine.applyToDOM(0.50, false);
    assert.equal(engine.getMode(), "dark");

    // Move to 0.43 -> still dark
    engine.applyToDOM(0.43, false);
    assert.equal(engine.getMode(), "dark");

    // Cross 0.42 threshold down -> flips to light!
    engine.applyToDOM(0.41, false);
    assert.equal(engine.getMode(), "light");
    assert.deepEqual(modeChanges, ["dark", "light"]);
  });
});

describe("ThemeWheelEngine - Quantizer & Step Navigation", () => {
  it("counts detent ticks correctly across travel", () => {
    let tickCount = 0;
    const directions: number[] = [];

    const engine = new ThemeWheelEngine({
      detentSteps: 20,
      onTick: (dir) => {
        tickCount++;
        directions.push(dir);
      },
    });

    // Move from 0 to 1 in steps
    for (let i = 1; i <= 20; i++) {
      engine.applyToDOM(i / 20, false);
    }

    assert.equal(tickCount, 20);
    assert.ok(directions.every((d): boolean => d === 1));

    // Move backwards from 1 to 0
    tickCount = 0;
    directions.length = 0;
    for (let i = 19; i >= 0; i--) {
      engine.applyToDOM(i / 20, false);
    }

    assert.equal(tickCount, 20);
    assert.ok(directions.every((d): boolean => d === -1));
  });

  it("handles keyboard step increments", () => {
    const engine = new ThemeWheelEngine();
    assert.equal(engine.getPosition(), 0);

    engine.step(0.1);
    assert.equal(engine.getPosition(), 0.1);

    engine.step(0.5);
    assert.equal(engine.getPosition(), 0.6);
    engine.dispose();
  });

  it("animates smoothly across multiple frames on single click without teleporting", async () => {
    const positions: number[] = [];
    let settledMode: string | null = null;

    const engine = new ThemeWheelEngine({
      onPositionChange: (pos) => {
        positions.push(pos);
      },
      onSettled: (mode) => {
        settledMode = mode;
      },
    });

    // Simulate single click (pointerdown + pointerup at same X)
    engine.onPointerDown(100);
    engine.onPointerUp();

    // Wait for spring simulation to settle
    await new Promise((resolve) => setTimeout(resolve, 650));

    // Must have generated multiple intermediate frames (not a 1-step jump!)
    assert.ok(positions.length >= 8, `Expected >= 8 smooth frames, got ${positions.length}`);
    assert.equal(engine.getPosition(), 1);
    assert.equal(settledMode, "dark");
    engine.dispose();
  });
});
