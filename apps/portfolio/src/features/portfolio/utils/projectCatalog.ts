import type { Repository } from "../portfolioData";

export type SearchSuggestion = {
  value: string;
  source: "projeto" | "tecnologia" | "descrição";
};

export type ProjectSortMode = "manual" | "relevance" | "added";

const descriptionStopWords = new Set([
  "a", "ao", "as", "com", "da", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "uma", "um",
]);

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function getRepositoryCategories(repository: Repository) {
  const categories = new Set<string>(["Produto digital"]);
  if (repository.technologies.includes("Interface")) categories.add("Interface");
  return categories;
}

function matchesProjectFilters(
  repository: Repository,
  {
    activeTechnology,
    activeCategory,
    activeTag,
  }: {
    activeTechnology: string;
    activeCategory: string;
    activeTag: string;
  },
) {
  const categories = getRepositoryCategories(repository);
  const matchesTechnology = activeTechnology === "Todos" || repository.technologies.includes(activeTechnology);
  const matchesCategory = activeCategory === "Todos" || categories.has(activeCategory);
  const matchesTag =
    activeTag === "Todos" ||
    repository.technologies.includes(activeTag) ||
    categories.has(activeTag);

  return matchesTechnology && matchesCategory && matchesTag;
}

export function buildProjectSearchSuggestions(
  projects: readonly Repository[],
  filters: {
    activeTechnology: string;
    activeCategory: string;
    activeTag: string;
  },
): SearchSuggestion[] {
  const candidates = new Map<string, SearchSuggestion>();

  const addCandidate = (value: string, source: SearchSuggestion["source"]) => {
    const normalizedValue = normalizeSearchText(value);
    if (!normalizedValue || candidates.has(normalizedValue)) return;
    candidates.set(normalizedValue, { value, source });
  };

  projects
    .filter((repository) => matchesProjectFilters(repository, filters))
    .forEach((repository) => {
      addCandidate(repository.name, "projeto");
      repository.technologies.forEach((technology) => addCandidate(technology, "tecnologia"));
      repository.description
        .split(/[^A-Za-zÀ-ÿ0-9]+/)
        .filter((word) => word.length >= 4 && !descriptionStopWords.has(normalizeSearchText(word)))
        .forEach((word) => addCandidate(word, "descrição"));
    });

  return Array.from(candidates.values());
}

export function selectVisibleRepositories(
  projects: readonly Repository[],
  {
    activeTechnology,
    activeCategory,
    activeTag,
    search,
    sortMode,
    favoritesOnly,
    favoriteProjectIds,
    sharedProjectIds,
    manualProjectOrder,
  }: {
    activeTechnology: string;
    activeCategory: string;
    activeTag: string;
    search: string;
    sortMode: ProjectSortMode;
    favoritesOnly: boolean;
    favoriteProjectIds: readonly string[];
    sharedProjectIds: readonly string[] | null;
    manualProjectOrder: readonly string[];
  },
) {
  const orderIndex = new Map(manualProjectOrder.map((id, index) => [id, index]));
  const normalizedSearch = normalizeSearchText(search);
  const favoriteProjectIdSet = new Set(favoriteProjectIds);
  const sharedProjectIdSet = new Set(sharedProjectIds ?? []);

  return [...projects]
    .sort(
      (first, second) =>
        (orderIndex.get(first.id) ?? Number.MAX_SAFE_INTEGER) -
        (orderIndex.get(second.id) ?? Number.MAX_SAFE_INTEGER),
    )
    .filter((repository) => {
      if (!matchesProjectFilters(repository, { activeTechnology, activeCategory, activeTag })) return false;

      const categories = getRepositoryCategories(repository);
      const searchableProjectText = normalizeSearchText(
        [
          repository.name,
          repository.description,
          ...repository.technologies,
          ...Array.from(categories),
        ].join(" "),
      );
      const matchesSearch = !normalizedSearch || searchableProjectText.includes(normalizedSearch);
      const matchesFavorites =
        !favoritesOnly ||
        (sharedProjectIds
          ? sharedProjectIdSet.has(repository.id)
          : favoriteProjectIdSet.has(repository.id));

      return matchesSearch && matchesFavorites;
    })
    .sort((first, second) =>
      sortMode === "manual"
        ? 0
        : sortMode === "added"
          ? second.addedOrder - first.addedOrder
          : second.relevance - first.relevance,
    );
}
