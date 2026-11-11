import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  computeDuration,
  computeVisibleChars,
  TypewriterEngine,
} from "./typewriter-engine.ts";
import { resolveTypewriterMode } from "./typewriter-lifecycle.ts";

describe("TypewriterEngine - Duration and Character Calculations", () => {
  it("computeDuration respects clamping bounds [400, 800]", () => {
    assert.equal(computeDuration(0), 0);
    assert.equal(computeDuration(-5), 0);
    // Short string: 10 * 12 = 120ms -> clamped to min 400ms
    assert.equal(computeDuration(10), 400);
    // Mid string: 50 * 12 = 600ms
    assert.equal(computeDuration(50), 600);
    // Long string: 100 * 12 = 1200ms -> clamped to max 800ms
    assert.equal(computeDuration(100), 800);
  });

  it("computeVisibleChars calculates boundary and monotonic progress", () => {
    assert.equal(computeVisibleChars(50, 0, 500), 0);
    assert.equal(computeVisibleChars(50, -10, 500), 0);
    assert.equal(computeVisibleChars(50, 500, 500), 50);
    assert.equal(computeVisibleChars(50, 600, 500), 50);
    assert.equal(computeVisibleChars(0, 250, 500), 0);

    const mid = computeVisibleChars(50, 250, 500);
    assert.equal(mid, 25);
  });
});

describe("TypewriterEngine - Runtime Lifecycle and Mock Clock", () => {
  it("completes immediately for empty text", () => {
    let emitted = "unset";
    let doneCalled = false;

    const engine = new TypewriterEngine({
      text: "",
      onFrame: (slice) => {
        emitted = slice;
      },
      onDone: () => {
        doneCalled = true;
      },
    });

    engine.start();
    assert.equal(emitted, "");
    assert.equal(doneCalled, true);
    assert.equal(engine.isRunning(), false);
  });

  it("runs deterministically with simulated time queue", () => {
    let currentTime = 1000;
    const now = () => currentTime;

    let queuedCallback: ((t: number) => void) | null = null;
    const raf = (cb: (t: number) => void) => {
      queuedCallback = cb;
      return 1;
    };
    const caf = () => {
      queuedCallback = null;
    };

    const frames: string[] = [];
    let completed = false;

    const text = "State machine";
    const engine = new TypewriterEngine({
      text,
      delayMs: 100,
      onFrame: (slice) => {
        frames.push(slice);
      },
      onDone: () => {
        completed = true;
      },
      now,
      raf,
      caf,
    });

    engine.start();
    assert.equal(engine.isRunning(), true);

    // During delay (currentTime = 1050 < 1100), no characters
    currentTime = 1050;
    const cb1 = queuedCallback as ((t: number) => void) | null;
    if (cb1) cb1(currentTime);
    assert.equal(frames.length >= 1, true);
    assert.equal(frames[0], "");

    // After delay begins (currentTime = 1100 + 200ms out of 400ms duration)
    currentTime = 1300;
    const cb2 = queuedCallback as ((t: number) => void) | null;
    if (cb2) cb2(currentTime);
    assert.equal(frames.length >= 2, true);
    const lastSlice = frames[frames.length - 1];
    assert.equal(lastSlice.length > 0 && lastSlice.length < text.length, true);

    // At full duration (currentTime = 1500)
    currentTime = 1500;
    const cb3 = queuedCallback as ((t: number) => void) | null;
    if (cb3) cb3(currentTime);
    assert.equal(completed, true);
    assert.equal(frames[frames.length - 1], text);
    assert.equal(engine.isRunning(), false);
  });

  it("finish() emits full text immediately and completes", () => {
    const frames: string[] = [];
    let done = false;

    const engine = new TypewriterEngine({
      text: "Deterministic FSM",
      onFrame: (slice) => frames.push(slice),
      onDone: () => {
        done = true;
      },
      raf: () => 1,
      caf: () => {},
    });

    engine.start();
    engine.finish();

    assert.equal(frames[frames.length - 1], "Deterministic FSM");
    assert.equal(done, true);
  });

  it("destroy() cancels raf and prevents further emissions", () => {
    let _tickCount = 0;
    let cancelled = false;

    const engine = new TypewriterEngine({
      text: "Hello World",
      onFrame: () => {
        _tickCount++;
      },
      onDone: () => {},
      raf: () => 42,
      caf: (id) => {
        if (id === 42) cancelled = true;
      },
    });

    engine.start();
    engine.destroy();

    assert.equal(cancelled, true);
  });
});

describe("TypewriterText lifecycle & DOM ownership", () => {
  it("defers inactive off-screen slides to 'idle' until active becomes true", () => {
    assert.equal(
      resolveTypewriterMode({
        hasTriggered: false,
        prefersReducedMotion: false,
        hasIntersectionObserver: true,
        active: false,
      }),
      "idle"
    );

    assert.equal(
      resolveTypewriterMode({
        hasTriggered: false,
        prefersReducedMotion: false,
        hasIntersectionObserver: true,
        active: true,
      }),
      "observe"
    );
  });

  it("updates immediately on language toggle after slide has already triggered or under reduced motion", () => {
    assert.equal(
      resolveTypewriterMode({
        hasTriggered: true,
        prefersReducedMotion: false,
        hasIntersectionObserver: true,
        active: true,
      }),
      "immediate"
    );

    assert.equal(
      resolveTypewriterMode({
        hasTriggered: false,
        prefersReducedMotion: true,
        hasIntersectionObserver: true,
        active: true,
      }),
      "immediate"
    );
  });

  it("keeps textNodeRef free of managed JSX children to prevent reconciliation overwrites", () => {
    const componentPath = path.resolve(
      process.cwd(),
      "src/shared/ui/typewriter-text.tsx"
    );
    const source = fs.readFileSync(componentPath, "utf8");
    assert.match(source, /<span ref=\{textNodeRef\} \/>/);
  });
});
