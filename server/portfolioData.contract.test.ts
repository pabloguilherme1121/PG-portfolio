import { describe, expect, it } from "vitest";
import { repositories } from "../client/src/features/portfolio/portfolioData";

describe("portfolio data canonical contract", () => {
  it("keeps public repository identifiers unique", () => {
    const ids = repositories.map((repository) => repository.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every published project ready for the professional detail view", () => {
    expect(repositories.length).toBeGreaterThanOrEqual(3);
    for (const repository of repositories) {
      expect(repository.name.trim().length).toBeGreaterThan(0);
      expect(repository.description.trim().length).toBeGreaterThan(0);
      expect(repository.role.trim().length).toBeGreaterThan(0);
      expect(repository.process.trim().length).toBeGreaterThan(0);
      expect(repository.result.trim().length).toBeGreaterThan(0);
      expect(repository.caseStudy).toBeDefined();
      expect(repository.relevance).toBeGreaterThanOrEqual(0);
      expect(repository.relevance).toBeLessThanOrEqual(100);
    }
  });

  it("keeps at least one featured web or digital project in the public selection", () => {
    expect(repositories.some((repository) => repository.featured && repository.technologies.some((technology) => ["Web", "Interface"].includes(technology)))).toBe(true);
  });
});
