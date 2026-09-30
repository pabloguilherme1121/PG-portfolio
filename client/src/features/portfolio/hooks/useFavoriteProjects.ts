import { useCallback, useEffect, useMemo, useState } from "react";
import { getSafeStorage, readStorage, writeStorage } from "@/lib/safeStorage";
import { parseFavoriteIds } from "@/lib/favoritesManagementState";

const FAVORITES_KEY = "pablo-portfolio-favorites";

function readFavoriteProjectIds(): string[] {
  if (typeof window === "undefined") return [];
  return parseFavoriteIds(readStorage(getSafeStorage("local"), FAVORITES_KEY));
}

export function useFavoriteProjects() {
  const [favoriteProjectIds, setFavoriteProjectIds] = useState<string[]>(readFavoriteProjectIds);
  const favoriteProjectIdSet = useMemo(() => new Set(favoriteProjectIds), [favoriteProjectIds]);

  useEffect(() => {
    writeStorage(
      getSafeStorage("local"),
      FAVORITES_KEY,
      JSON.stringify(favoriteProjectIds),
    );
  }, [favoriteProjectIds]);

  const toggleFavoriteProject = useCallback((projectId: string) => {
    const wasSaved = favoriteProjectIdSet.has(projectId);
    setFavoriteProjectIds((current) =>
      current.includes(projectId)
        ? current.filter((id) => id !== projectId)
        : [...current, projectId],
    );
    return wasSaved;
  }, [favoriteProjectIdSet]);

  return {
    favoriteProjectIds,
    favoriteProjectIdSet,
    toggleFavoriteProject,
  } as const;
}
