import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { computeNavCenterScrollLeft } from "./nav-scroll.ts";

describe("MobileSectionNav horizontal centering", () => {
  it("returns null when all nav items fit without horizontal overflow", () => {
    assert.equal(computeNavCenterScrollLeft(120, 72, 360, 340), null);
    assert.equal(computeNavCenterScrollLeft(0, 72, 360, 360), null);
    assert.equal(computeNavCenterScrollLeft(0, 72, 0, 400), null);
  });

  it("centers active tab strictly within horizontal bounds", () => {
    // First tab near left edge clamps to 0
    assert.equal(computeNavCenterScrollLeft(10, 80, 300, 460), 0);

    // Middle tab ("Approach") centers inside 300px viewport
    // center target = 150 - (300 - 90) / 2 = 150 - 105 = 45
    assert.equal(computeNavCenterScrollLeft(150, 90, 300, 460), 45);

    // Final tab clamps to maxScrollLeft (460 - 300 = 160)
    assert.equal(computeNavCenterScrollLeft(380, 80, 300, 460), 160);
  });

  it("never calls window-hijacking scrollIntoView and permits pan-y vertical touch scroll", () => {
    const navPath = path.resolve(
      process.cwd(),
      "src/widgets/mobile-section-nav/ui/mobile-section-nav.tsx"
    );
    const source = fs.readFileSync(navPath, "utf8");

    assert.doesNotMatch(
      source,
      /\.scrollIntoView\s*\(/,
      "MobileSectionNav must use container.scrollTo instead of Element.scrollIntoView"
    );
    assert.match(source, /touch-pan-x\s+touch-pan-y/);
    assert.match(source, /const effectiveCollapsed\s*=\s*isTma\s*\?\s*false\s*:\s*isCollapsed/);
  });
});
