import { describe, expect, test } from "bun:test";
import { calcKimariji, type Kimariji } from "./calcKimariji";

const sortKimariji = (kimarijis: Kimariji[]) =>
  kimarijis
    .map((kimariji) => ({
      name: kimariji.name,
      kimariji: kimariji.kimariji.sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

describe("calcKimariji", () => {
  test("case 1", () => {
    const stamps = [
      "app",
      "apparel",
      "appeal",
      "appear",
      "appearance",
      "apple",
      "apply",
    ];
    const altNames = {};
    const expected: Kimariji[] = [
      { name: "app", kimariji: ["ap", "pp"] },
      { name: "apparel", kimariji: ["pa", "ar", "re", "el"] },
      { name: "appeal", kimariji: ["pe", "ea", "al"] },
      { name: "appear", kimariji: ["ear"] },
      { name: "appearance", kimariji: ["ra", "an", "nc", "ce"] },
      { name: "apple", kimariji: ["pl", "le"] },
      { name: "apply", kimariji: ["ly"] },
    ];
    const result = calcKimariji(stamps, altNames);
    return expect(sortKimariji(result)).toEqual(sortKimariji(expected));
  });

  test("case 2: Upper case (should be case insensitive)", () => {
    const stamps = [
      "App",
      "aPparel",
      "appeal",
      "Appear",
      "appEaraNce",
      "aPple",
      "appLy",
    ];
    const altNames = {};
    const expected: Kimariji[] = [
      { name: "App", kimariji: ["ap", "pp"] },
      { name: "aPparel", kimariji: ["pa", "ar", "re", "el"] },
      { name: "appeal", kimariji: ["pe", "ea", "al"] },
      { name: "Appear", kimariji: ["ear"] },
      { name: "appEaraNce", kimariji: ["ra", "an", "nc", "ce"] },
      { name: "aPple", kimariji: ["pl", "le"] },
      { name: "appLy", kimariji: ["ly"] },
    ];
    const result = calcKimariji(stamps, altNames);
    return expect(sortKimariji(result)).toEqual(sortKimariji(expected));
  });
});
