import { describe, expect, it } from "vitest";
import type { Repository } from "../portfolioData";
import {
  buildProjectSearchSuggestions,
  selectVisibleRepositories,
} from "./projectCatalog";

function repository(overrides: Partial<Repository> & Pick<Repository, "id" | "name">): Repository {
  return {
    id: overrides.id,
    name: overrides.name,
    description: overrides.description ?? "Descrição do projeto",
    role: overrides.role ?? "Produto e desenvolvimento",
    process: overrides.process ?? "Processo",
    result: overrides.result ?? "Resultado",
    technologies: overrides.technologies ?? [],
    url: overrides.url ?? "https://example.com",
    kind: "repository",
    status: overrides.status ?? "Publicado",
    evidence: overrides.evidence ?? {
      label: "código",
      href: "https://github.com/example/project",
      type: "code",
    },
    cover: overrides.cover,
    featured: overrides.featured,
    addedOrder: overrides.addedOrder ?? 1,
    relevance: overrides.relevance ?? 50,
    catalog: overrides.catalog ?? {
      description: "Catálogo",
      tags: [],
    },
    caseStudy: overrides.caseStudy,
  };
}

describe("projectCatalog", () => {
  const projects = [
    repository({
      id: "react",
      name: "Painel React",
      description: "Dashboard para mobilidade urbana",
      technologies: ["React", "Interface"],
      relevance: 90,
      addedOrder: 1,
    }),
    repository({
      id: "python",
      name: "Automação Python",
      description: "Robôs para processamento de documentos",
      technologies: ["Python"],
      relevance: 80,
      addedOrder: 2,
    }),
  ];

  it("gera sugestões somente a partir de projetos compatíveis com tecnologia, categoria e tag ativas", () => {
    const suggestions = buildProjectSearchSuggestions(projects, {
      activeTechnology: "Todos",
      activeCategory: "Todos",
      activeTag: "React",
    });

    expect(suggestions.map((item) => item.value)).toContain("Painel React");
    expect(suggestions.map((item) => item.value)).toContain("React");
    expect(suggestions.map((item) => item.value)).not.toContain("Automação Python");
    expect(suggestions.map((item) => item.value)).not.toContain("Python");
  });

  it("filtra busca sem acentos e mantém ordenação por relevância", () => {
    const visible = selectVisibleRepositories(projects, {
      activeTechnology: "Todos",
      activeCategory: "Todos",
      activeTag: "Todos",
      search: "mobilidade",
      sortMode: "relevance",
      favoritesOnly: false,
      favoriteProjectIds: [],
      sharedProjectIds: null,
      manualProjectOrder: [],
    });

    expect(visible.map((item) => item.id)).toEqual(["react"]);
  });

  it("respeita ordem manual quando o modo manual está ativo", () => {
    const visible = selectVisibleRepositories(projects, {
      activeTechnology: "Todos",
      activeCategory: "Todos",
      activeTag: "Todos",
      search: "",
      sortMode: "manual",
      favoritesOnly: false,
      favoriteProjectIds: [],
      sharedProjectIds: null,
      manualProjectOrder: ["python", "react"],
    });

    expect(visible.map((item) => item.id)).toEqual(["python", "react"]);
  });
});
