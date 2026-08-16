export const favoriteImageStorageKey = "pablo-portfolio-favorite-images";

export function normalizeFavoriteImageIds(storedIds: unknown, validImageIds: string[]) {
  const validImageIdSet = new Set(validImageIds);
  if (!Array.isArray(storedIds)) return [];

  return storedIds.filter(
    (id, index, ids): id is string => typeof id === "string" && validImageIdSet.has(id) && ids.indexOf(id) === index,
  );
}

export function toggleFavoriteImageId(currentIds: string[], imageId: string) {
  return currentIds.includes(imageId)
    ? currentIds.filter((id) => id !== imageId)
    : [...currentIds, imageId];
}
