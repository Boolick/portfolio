import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isNavOpen,
  reduceCloseNavState,
  reduceScrollNavState,
} from "./collapsible-nav-state.ts";

describe("collapsible-nav-state", () => {
  it("marks nav as open when auto-expanded on scroll up so toggle renders X icon", () => {
    const scrolledDown = reduceScrollNavState(
      { isScrolled: true, isCollapsed: false, isManualOpen: false },
      1200,
      40
    );
    assert.equal(scrolledDown.isCollapsed, true);
    assert.equal(isNavOpen(scrolledDown), false);

    const scrolledUp = reduceScrollNavState(scrolledDown, 1100, -100);
    assert.equal(scrolledUp.isCollapsed, false);
    assert.equal(scrolledUp.isManualOpen, false);
    assert.equal(isNavOpen(scrolledUp), true);
  });

  it("collapses an auto-expanded nav cleanly when close is triggered while scrolled", () => {
    const closed = reduceCloseNavState(1100);
    assert.equal(closed.isScrolled, true);
    assert.equal(closed.isCollapsed, true);
    assert.equal(closed.isManualOpen, false);
    assert.equal(isNavOpen(closed), false);
  });

  it("keeps nav expanded when at top of page", () => {
    const atTop = reduceCloseNavState(20);
    assert.equal(atTop.isScrolled, false);
    assert.equal(atTop.isCollapsed, false);
    assert.equal(isNavOpen(atTop), true);
  });
});
