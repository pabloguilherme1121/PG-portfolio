import { describe, expect, it } from "vitest";
import { repositories } from "../client/src/features/portfolio/portfolioData";
import { portfolioCatalog } from "../client/src/lib/portfolioCatalog";

describe("portfolio data canonical contract", () => {
  it("keeps public repository identifiers unique", () => {
    const ids = repositories.map((repository) => repository.id);

    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps case studies aligned with the current public project catalog", () => {
    expect(repositories.filter((repository) => repository.caseStudy).map((repository) => repository.id)).toEqual([
      "TEC.08",
      "AUD.01",
      "CNT.02",
      "CNT.03",
      "AUD.04",
      "AUD.05",
      "CNT.06",
      "AUD.07",
    ]);
  });

  it("derives the favorites catalog exactly from each repository catalog projection", () => {
    expect(portfolioCatalog).toEqual(repositories.map((repository) => ({
      id: repository.id,
      name: repository.name,
      cover: repository.cover ?? "",
      description: repository.catalog.description,
      tags: repository.catalog.tags,
    })));
  });
});
