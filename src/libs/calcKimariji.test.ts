import { describe, expect, test } from "bun:test";
import { type KimarijiMap, calcKimariji, sortedKimariji } from "./calcKimariji";

describe("calcKimariji", () => {
  test("case 1", () => {
    const stamps = [
      "a",
      "app",
      "apparel",
      "appeal",
      "appear",
      "appearance",
      "apple",
      "apply",
    ];
    const altNames = {};
    const expected: KimarijiMap = new Map([
      ["a", new Set(["a"])],
      ["app", new Set(["ap", "pp"])],
      ["apparel", new Set(["pa", "ar", "re", "el"])],
      ["appeal", new Set(["pe", "ea", "al"])],
      ["appear", new Set(["ear"])],
      ["appearance", new Set(["ra", "an", "nc", "ce"])],
      ["apple", new Set(["pl", "le"])],
      ["apply", new Set(["ly"])],
    ]);
    const result = calcKimariji(stamps, altNames);
    return expect(sortedKimariji(result)).toEqual(sortedKimariji(expected));
  });

  test("case 2: Upper case (should be case insensitive)", () => {
    const stamps = [
      "A",
      "App",
      "aPparel",
      "appeal",
      "Appear",
      "appEaraNce",
      "aPple",
      "appLy",
    ];
    const altNames = {};
    const expected: KimarijiMap = new Map([
      ["A", new Set(["a"])],
      ["App", new Set(["ap", "pp"])],
      ["aPparel", new Set(["pa", "ar", "re", "el"])],
      ["appeal", new Set(["pe", "ea", "al"])],
      ["Appear", new Set(["ear"])],
      ["appEaraNce", new Set(["ra", "an", "nc", "ce"])],
      ["aPple", new Set(["pl", "le"])],
      ["appLy", new Set(["ly"])],
    ]);
    const result = calcKimariji(stamps, altNames);
    return expect(sortedKimariji(result)).toEqual(sortedKimariji(expected));
  });

  test("case 3: altNames", () => {
    const stamps = [
      "app",
      "apparel",
      "appeal",
      "appear",
      "appearance",
      "apple",
      "apply",
    ];
    const altNames = {
      a: "apply",
      bad_apple: "apple",
    };
    const expected: KimarijiMap = new Map([
      ["app", new Set(["ap", "pp"])],
      ["apparel", new Set(["pa", "ar", "re", "el"])],
      ["appeal", new Set(["pe", "ea", "al"])],
      ["appear", new Set(["ear"])],
      ["appearance", new Set(["ra", "an", "nc", "ce"])],
      ["apple", new Set(["pl", "le", "ba", "ad", "d_", "_a"])],
      ["apply", new Set(["a"])],
    ]);
    const result = calcKimariji(stamps, altNames);
    return expect(sortedKimariji(result)).toEqual(sortedKimariji(expected));
  });
});
