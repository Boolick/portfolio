import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseStartParam,
  ALLOWED_CASE_SLUGS,
  ALLOWED_SECTION_IDS,
} from "./start-param.ts";

describe("parseStartParam", () => {
  it("contains 4 allowed case studies", () => {
    assert.equal(ALLOWED_CASE_SLUGS.length, 4);
  });

  it("parses valid case study slugs including uppercase and snake_case variants", () => {
    assert.deepEqual(parseStartParam("case_dkmline"), {
      type: "case",
      slug: "dkmline",
    });
    assert.deepEqual(parseStartParam("CASE_DKMLINE"), {
      type: "case",
      slug: "dkmline",
    });
    assert.deepEqual(parseStartParam("case_dexsa"), {
      type: "case",
      slug: "dexsa",
    });
    assert.deepEqual(parseStartParam("case_tower-empire"), {
      type: "case",
      slug: "tower-empire",
    });
    assert.deepEqual(parseStartParam("case_tower_empire"), {
      type: "case",
      slug: "tower-empire",
    });
    assert.deepEqual(parseStartParam("case_portfolio"), {
      type: "case",
      slug: "portfolio",
    });
  });

  it("parses all 7 allowed section identifiers", () => {
    for (const section of ALLOWED_SECTION_IDS) {
      assert.deepEqual(parseStartParam(`section_${section}`), {
        type: "section",
        sectionId: section,
      });
      assert.deepEqual(parseStartParam(`SECTION_${section.toUpperCase()}`), {
        type: "section",
        sectionId: section,
      });
    }
  });

  it("returns none for unknown or unallowlisted slugs", () => {
    assert.deepEqual(parseStartParam("case_admin"), { type: "none" });
    assert.deepEqual(parseStartParam("case_unknown"), { type: "none" });
    assert.deepEqual(parseStartParam("section_settings"), { type: "none" });
    assert.deepEqual(parseStartParam("random_text"), { type: "none" });
  });

  it("returns none for malicious, injected, or malformed strings", () => {
    assert.deepEqual(parseStartParam("case_dexsa/../admin"), { type: "none" });
    assert.deepEqual(parseStartParam("case_dexsa?x=1"), { type: "none" });
    assert.deepEqual(parseStartParam("case_dexsa#hash"), { type: "none" });
    assert.deepEqual(parseStartParam("<script>alert(1)</script>"), { type: "none" });
    assert.deepEqual(parseStartParam("case_dexsa with spaces"), { type: "none" });
    assert.deepEqual(parseStartParam("case_кейс_кириллица"), { type: "none" });
    assert.deepEqual(parseStartParam("a".repeat(65)), { type: "none" });
  });

  it("returns none for empty, null, or undefined inputs", () => {
    assert.deepEqual(parseStartParam(""), { type: "none" });
    assert.deepEqual(parseStartParam("   "), { type: "none" });
    assert.deepEqual(parseStartParam(null), { type: "none" });
    assert.deepEqual(parseStartParam(undefined), { type: "none" });
  });
});
