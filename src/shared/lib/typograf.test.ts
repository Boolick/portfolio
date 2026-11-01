import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { typograf, pluralizeRu } from "./typograf.ts";

describe("typograf", () => {
  it("binds short Russian prepositions with non-breaking spaces", () => {
    const input = "Проектирование и разработка веб-систем под ключ.";
    const expected = "Проектирование и\u00A0разработка веб-систем под\u00A0ключ.";
    assert.equal(typograf(input), expected);
  });

  it("handles consecutive prepositions in two passes", () => {
    const input = "Системы и в продакшне";
    const expected = "Системы и\u00A0в\u00A0продакшне";
    assert.equal(typograf(input), expected);
  });

  it("binds English short words", () => {
    const input = "Design and delivery of web systems in production";
    const expected = "Design and\u00A0delivery of\u00A0web systems in\u00A0production";
    assert.equal(typograf(input), expected);
  });

  it("binds numbers and Russian units", () => {
    const input = "Опыт 11 лет и 3 системы";
    const expected = "Опыт 11\u00A0лет и\u00A03\u00A0системы";
    assert.equal(typograf(input), expected);
  });

  it("binds em-dashes", () => {
    const input = "Платформы — надежно";
    const expected = "Платформы\u00A0— надежно";
    assert.equal(typograf(input), expected);
  });

  it("preserves URLs and mailto links without modification", () => {
    assert.equal(typograf("https://example.com/a/b"), "https://example.com/a/b");
    assert.equal(typograf("mailto:user@test.com"), "mailto:user@test.com");
  });
});

describe("pluralizeRu", () => {
  const forms: [string, string, string] = ["система", "системы", "систем"];

  it("correctly pluralizes cardinal numbers", () => {
    assert.equal(pluralizeRu(1, forms), "1\u00A0система");
    assert.equal(pluralizeRu(2, forms), "2\u00A0системы");
    assert.equal(pluralizeRu(3, forms), "3\u00A0системы");
    assert.equal(pluralizeRu(4, forms), "4\u00A0системы");
    assert.equal(pluralizeRu(5, forms), "5\u00A0систем");
    assert.equal(pluralizeRu(11, forms), "11\u00A0систем");
    assert.equal(pluralizeRu(12, forms), "12\u00A0систем");
    assert.equal(pluralizeRu(21, forms), "21\u00A0система");
    assert.equal(pluralizeRu(22, forms), "22\u00A0системы");
    assert.equal(pluralizeRu(25, forms), "25\u00A0систем");
    assert.equal(pluralizeRu(0, forms), "0\u00A0систем");
  });
});
