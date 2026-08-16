import { describe, expect, it } from "vitest";
import { normalizeFavoriteImageIds, toggleFavoriteImageId } from "../client/src/lib/imageFavorites";

describe("favorite image collection", () => {
  it("keeps only unique IDs that still reference gallery images", () => {
    expect(normalizeFavoriteImageIds(["AUD.01", "missing", "AUD.01", 42], ["AUD.01", "CNT.02"])).toEqual(["AUD.01"]);
    expect(normalizeFavoriteImageIds("invalid", ["AUD.01"])).toEqual([]);
  });

  it("adds and removes an image without touching the project favorites collection", () => {
    expect(toggleFavoriteImageId(["AUD.01"], "CNT.02")).toEqual(["AUD.01", "CNT.02"]);
    expect(toggleFavoriteImageId(["AUD.01", "CNT.02"], "AUD.01")).toEqual(["CNT.02"]);
  });
});
