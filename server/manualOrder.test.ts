import { describe, expect, it } from "vitest";
import { dropProjectInOrder, moveProjectInOrder, normalizeManualOrder } from "../client/src/lib/manualOrder";

describe("manual project order", () => {
  it("normalizes persisted IDs and appends new valid projects", () => {
    expect(normalizeManualOrder(["b", "missing", "b"], ["a", "b", "c"])).toEqual(["b", "a", "c"]);
  });

  it("moves a project one position with keyboard controls", () => {
    expect(moveProjectInOrder(["a", "b", "c"], "b", -1)).toEqual(["b", "a", "c"]);
    expect(moveProjectInOrder(["a", "b", "c"], "b", 1)).toEqual(["a", "c", "b"]);
    expect(moveProjectInOrder(["a", "b", "c"], "a", -1)).toEqual(["a", "b", "c"]);
  });

  it("moves a dragged project before the drop target", () => {
    expect(dropProjectInOrder(["a", "b", "c", "d"], "d", "b")).toEqual(["a", "d", "b", "c"]);
    expect(dropProjectInOrder(["a", "b", "c", "d"], "a", "c")).toEqual(["b", "a", "c", "d"]);
  });
});
