import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resolveActiveSectionId } from "./active-section-engine.ts";

describe("resolveActiveSectionId", () => {
  it("tracks huge mobile sections (3187px, 4541px, 2882px) accurately without getting stuck", () => {
    const params = {
      viewportHeight: 800,
      docHeight: 11500,
      headerHeight: 84,
      scrollY: 0,
    };

    // Inside #projects (3187px tall)
    assert.equal(
      resolveActiveSectionId(
        [
          { id: "projects", top: -600 },
          { id: "approach", top: 2587 },
          { id: "experience", top: 7128 },
          { id: "contact", top: 10010 },
        ],
        { ...params, scrollY: 1100 }
      ),
      "projects"
    );

    // Scrolled into #approach (4541px tall)
    assert.equal(
      resolveActiveSectionId(
        [
          { id: "projects", top: -3100 },
          { id: "approach", top: 90 },
          { id: "experience", top: 4631 },
          { id: "contact", top: 7513 },
        ],
        { ...params, scrollY: 3600 }
      ),
      "approach"
    );

    // Deep inside #approach
    assert.equal(
      resolveActiveSectionId(
        [
          { id: "projects", top: -5500 },
          { id: "approach", top: -2310 },
          { id: "experience", top: 2231 },
          { id: "contact", top: 5113 },
        ],
        { ...params, scrollY: 6000 }
      ),
      "approach"
    );

    // Scrolled into #experience (2882px tall)
    assert.equal(
      resolveActiveSectionId(
        [
          { id: "projects", top: -7900 },
          { id: "approach", top: -4710 },
          { id: "experience", top: -170 },
          { id: "contact", top: 2712 },
        ],
        { ...params, scrollY: 8400 }
      ),
      "experience"
    );
  });

  it("activates final section (#contact) when reaching bottom of document even if short", () => {
    const result = resolveActiveSectionId(
      [
        { id: "projects", top: -10200 },
        { id: "approach", top: -7000 },
        { id: "experience", top: -2460 },
        { id: "contact", top: 420 },
      ],
      {
        viewportHeight: 800,
        docHeight: 11500,
        headerHeight: 84,
        scrollY: 10685, // 10685 + 800 = 11485 >= 11500 - 24
      }
    );
    assert.equal(result, "contact");
  });

  it("defaults to first section above the fold and returns empty string when empty", () => {
    assert.equal(
      resolveActiveSectionId([], {
        viewportHeight: 800,
        docHeight: 4000,
        headerHeight: 56,
        scrollY: 0,
      }),
      ""
    );

    assert.equal(
      resolveActiveSectionId(
        [
          { id: "projects", top: 520 },
          { id: "approach", top: 3700 },
        ],
        {
          viewportHeight: 800,
          docHeight: 4000,
          headerHeight: 56,
          scrollY: 0,
        }
      ),
      "projects"
    );
  });
});
