import { describe, expect, it } from "vitest";
import {
  getProjectNavigationModel,
  orderRepositoriesForNavigation,
} from "@/features/portfolio/utils/projectNavigation";

const repositories = [
  { id: "A", name: "Alpha" },
  { id: "B", name: "Beta" },
  { id: "C", name: "Gamma" },
];

describe("projectNavigation", () => {
  it("aplica a ordem manual e mantém itens não listados no final", () => {
    expect(orderRepositoriesForNavigation(repositories, ["C", "A"]).map((item) => item.id)).toEqual(["C", "A", "B"]);
  });

  it("deriva índice, anterior e próximo sem depender de filtros antigos", () => {
    const model = getProjectNavigationModel(repositories, ["C", "A"], "A");
    expect(model.projectIndex).toBe(1);
    expect(model.previousProject?.id).toBe("C");
    expect(model.nextProject?.id).toBe("B");
    expect(model.projectCount).toBe(3);
  });

  it("retorna navegação neutra quando não há projeto selecionado", () => {
    expect(getProjectNavigationModel(repositories, [], null)).toMatchObject({
      projectIndex: -1,
      previousProject: null,
      nextProject: null,
      projectCount: 3,
    });
  });
});
