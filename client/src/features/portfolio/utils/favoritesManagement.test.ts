import { describe, expect, it } from "vitest";
import {
  buildFavoriteExportRows,
  estimateFavoriteExportBreakdown,
  moveFavoriteId,
} from "./favoritesManagement";

describe("favoritesManagement utilities", () => {
  const entries = [
    {
      id: "project-a",
      position: 0,
      name: "Projeto A",
      description: "Descrição A",
      tags: ["Interface", "Conteúdo"],
      updatedAt: null,
      cover: "/cover-a.jpg",
    },
    {
      id: "project-b",
      position: 1,
      name: "Projeto B",
      description: "Descrição B",
      tags: ["Aéreo"],
      updatedAt: new Date("2026-09-20T12:00:00.000Z"),
      cover: null,
    },
  ];

  it("contabiliza os dados exportáveis uma única vez na estimativa", () => {
    const rows = buildFavoriteExportRows(entries, ["position", "id", "name"]);
    const expectedDataBytes = new Blob([JSON.stringify(rows)]).size;

    const result = estimateFavoriteExportBreakdown(rows, entries, false);

    expect(result.data).toBe(expectedDataBytes);
    expect(result.thumbnails).toBe(0);
    expect(result.total).toBe(expectedDataBytes + Math.round(expectedDataBytes * 0.08));
  });

  it("inclui somente miniaturas existentes quando solicitado", () => {
    const rows = buildFavoriteExportRows(entries, ["id"]);

    const result = estimateFavoriteExportBreakdown(rows, entries, true);

    expect(result.thumbnails).toBe(180 * 1024);
  });

  it("move um favorito para a posição do destino sem perder ids", () => {
    expect(moveFavoriteId(["a", "b", "c", "d"], "a", "c")).toEqual(["b", "c", "a", "d"]);
    expect(moveFavoriteId(["a", "b"], "missing", "b")).toEqual(["a", "b"]);
  });
});
