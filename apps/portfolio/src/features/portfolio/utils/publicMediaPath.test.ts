import { describe, expect, it } from "vitest";
import { publicMediaPath } from "./publicMediaPath";

describe("publicMediaPath", () => {
  it("resolves URLs and responsive srcsets below GitHub Pages", () => {
    expect(publicMediaPath("/manus-storage/hero.jpg", "/PG-portfolio/")).toBe("/PG-portfolio/manus-storage/hero.jpg");
    expect(publicMediaPath("/manus-storage/a.avif 480w, /manus-storage/b.avif 960w", "/PG-portfolio/"))
      .toBe("/PG-portfolio/manus-storage/a.avif 480w, /PG-portfolio/manus-storage/b.avif 960w");
  });
});
