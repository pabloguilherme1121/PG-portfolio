import { describe, expect, it } from "vitest";
import {
  buildFavoriteExportRows,
  csvEscape,
  estimateFavoriteExport,
  filterFavoriteEntries,
  getAvailableFavoriteTags,
  moveFavoriteId,
  type FavoriteEntry,
} from "./favoritesManagementUtils";

const entries: FavoriteEntry[] = [
  {
    id: "alpha",
    position: 0,
    name: "Projeto Alpha",
    description: "Captação aérea",
    tags: ["Aéreo", "Evento"],
    cover: "/alpha.jpg",
    isEdited: true,
    updatedAt: new Date("2026-09-20T12:00:00Z"),
  },
  {
    id: "beta",
    position: 1,
    name: "Projeto Beta",
    description: "Interface web",
    tags: ["Interface"],
    isEdited: false,
    updatedAt: null,
  },
];

const baseFilters = {
  query: "",
  tagFilter: "all",
  editFilter: "all" as const,
  dateFilter: "all" as const,
  customStartDate: "",
  customEndDate: "",
};

describe("favorites management utilities", () => {
  it("filters by query, tag and edit status without mutating entries", () => {
    const byQuery = filterFavoriteEntries(entries, { ...baseFilters, query: "aérea" });
    const byTag = filterFavoriteEntries(entries, { ...baseFilters, tagFilter: "Interface" });
    const edited = filterFavoriteEntries(entries, { ...baseFilters, editFilter: "edited" });

    expect(byQuery.map((entry) => entry.id)).toEqual(["alpha"]);
    expect(byTag.map((entry) => entry.id)).toEqual(["beta"]);
    expect(edited.map((entry) => entry.id)).toEqual(["alpha"]);
    expect(entries.map((entry) => entry.id)).toEqual(["alpha", "beta"]);
  });

  it("applies relative and custom date windows only to edited timestamps", () => {
    const now = new Date("2026-09-25T12:00:00Z").getTime();
    const recent = filterFavoriteEntries(
      entries,
      { ...baseFilters, dateFilter: "7" },
      now,
    );
    const custom = filterFavoriteEntries(
      entries,
      {
        ...baseFilters,
        dateFilter: "custom",
        customStartDate: "2026-09-21",
        customEndDate: "2026-09-30",
      },
      now,
    );

    expect(recent.map((entry) => entry.id)).toEqual(["alpha"]);
    expect(custom).toEqual([]);
  });

  it("moves a favorite before the target and leaves invalid moves untouched", () => {
    expect(moveFavoriteId(["a", "b", "c"], "c", "a")).toEqual(["c", "a", "b"]);
    const original = ["a", "b", "c"];
    expect(moveFavoriteId(original, "missing", "b")).toBe(original);
  });

  it("returns sorted unique tags", () => {
    expect(getAvailableFavoriteTags(entries)).toEqual(["Aéreo", "Evento", "Interface"]);
  });

  it("estimates export data once instead of double-counting the JSON payload", () => {
    const fields = ["id", "name"] as const;
    const rows = buildFavoriteExportRows(entries, [...fields]);
    const expectedDataBytes = new Blob([JSON.stringify(rows)]).size;
    const estimate = estimateFavoriteExport(entries, [...fields], false);

    expect(estimate.data).toBe(expectedDataBytes);
    expect(estimate.total).toBe(expectedDataBytes + Math.round(expectedDataBytes * 0.08));
  });

  it("escapes quotes for CSV values", () => {
    expect(csvEscape('Projeto "Alpha"')).toBe('"Projeto ""Alpha"""');
  });
});
