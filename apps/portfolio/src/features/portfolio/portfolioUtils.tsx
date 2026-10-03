import type { Repository } from "./portfolioData";

export const descriptionStopWords = new Set([
  "a", "ao", "as", "com", "da", "de", "do", "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para", "por", "que", "uma", "um",
]);

export function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function renderSuggestionMatch(value: string, query: string, isActive: boolean) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return value;

  const characters = Array.from(value);
  const normalizedCharacters = characters.map((character) => normalizeSearchText(character));
  const normalizedValue = normalizedCharacters.join("");
  const matchStart = normalizedValue.indexOf(normalizedQuery);
  if (matchStart < 0) return value;

  let characterStart = 0;
  let characterEnd = characters.length;
  let normalizedOffset = 0;
  for (let index = 0; index < normalizedCharacters.length; index += 1) {
    const nextOffset = normalizedOffset + normalizedCharacters[index].length;
    if (normalizedOffset <= matchStart && matchStart < nextOffset) characterStart = index;
    if (normalizedOffset < matchStart + normalizedQuery.length && matchStart + normalizedQuery.length <= nextOffset) {
      characterEnd = index + 1;
      break;
    }
    normalizedOffset = nextOffset;
  }

  return <>{characters.slice(0, characterStart).join("")}<strong data-suggestion-match="true" className={`font-bold ${isActive ? "text-[#02111f]" : "text-white"}`}>{characters.slice(characterStart, characterEnd).join("")}</strong>{characters.slice(characterEnd).join("")}</>;
}

export function getPortfolioUrlFilter(key: string, allowed: readonly string[], fallback: string) {
  if (typeof window === "undefined") return fallback;
  const value = new URLSearchParams(window.location.search).get(key);
  return value && allowed.includes(value) ? value : fallback;
}

export function getPortfolioUrlSearch() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") ?? "";
}

export function getRepositoryCategories(repository: Repository) {
  const categories = new Set<string>();
  if (repository.description.toLocaleLowerCase("pt-BR").includes("evento") || repository.name.toLocaleLowerCase("pt-BR").includes("eloise")) categories.add("Eventos");
  if (repository.technologies.includes("Drone")) categories.add("Aéreo");
  if (repository.technologies.includes("Interface")) categories.add("Interface");
  if (repository.technologies.includes("Conteúdo")) categories.add("Conteúdo");
  if (repository.technologies.includes("Noturno")) categories.add("Noturno");
  return categories;
}
