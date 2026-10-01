import { describe, expect, it } from "vitest";
import {
  DEFAULT_EXPORT_FIELDS,
  parseExportPreferences,
  parseExportSelection,
  parseFavoriteIds,
  parseSessionFilters,
} from "./favoritesManagementState";

describe("favoritesManagementState", () => {
  it("normaliza filtros persistidos inválidos para valores suportados", () => {
    expect(parseSessionFilters(JSON.stringify({
      query: 42,
      tagFilter: null,
      editFilter: "quebrado",
      dateFilter: "365",
      customStartDate: 12,
      customEndDate: "2026-09-30",
    }))).toEqual({
      query: "",
      tagFilter: "all",
      editFilter: "all",
      dateFilter: "all",
      customStartDate: "",
      customEndDate: "2026-09-30",
    });
  });

  it("descarta campos de exportação desconhecidos sem perder preferências válidas", () => {
    expect(parseExportPreferences(
      JSON.stringify({ fields: ["name", "__proto__", "tags"], thumbnails: true }),
      JSON.stringify({ format: "zip", estimate: 1234 }),
    )).toEqual({
      fields: ["name", "tags"],
      thumbnails: true,
      format: "zip",
      estimate: 1234,
    });

    expect(parseExportPreferences(
      JSON.stringify({ fields: ["campo-inexistente"] }),
      JSON.stringify({ format: "exe", estimate: -20 }),
    )).toEqual({
      fields: DEFAULT_EXPORT_FIELDS,
      thumbnails: false,
      format: "csv",
      estimate: 0,
    });
  });

  it("mantém seleção vazia intencional e remove ids inválidos ou duplicados", () => {
    expect(parseExportSelection("[]")).toEqual([]);
    expect(parseExportSelection(JSON.stringify(["a", 1, "a", "b", null]))).toEqual(["a", "b"]);
    expect(parseFavoriteIds(JSON.stringify(["x", "x", false, "y"]))).toEqual(["x", "y"]);
  });

  it("retorna defaults quando o JSON persistido está corrompido", () => {
    expect(parseSessionFilters("{")).toEqual({
      query: "",
      tagFilter: "all",
      editFilter: "all",
      dateFilter: "all",
      customStartDate: "",
      customEndDate: "",
    });
    expect(parseExportPreferences("{", "{")).toEqual({
      fields: DEFAULT_EXPORT_FIELDS,
      thumbnails: false,
      format: "csv",
      estimate: 0,
    });
  });
});
