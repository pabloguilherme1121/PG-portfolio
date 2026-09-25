export type FavoriteEntry = {
  id: string;
  position: number;
  name: string;
  description: string;
  tags?: string[];
  cover?: string;
  isEdited: boolean;
  updatedAt: Date | null;
};

export type FavoriteDateFilter = "all" | "7" | "30" | "custom";
export type FavoriteEditFilter = "all" | "edited" | "original";
export type ExportField = "position" | "id" | "name" | "description" | "tags" | "updatedAt";

export type FavoriteFilterState = {
  query: string;
  tagFilter: string;
  editFilter: FavoriteEditFilter;
  dateFilter: FavoriteDateFilter;
  customStartDate: string;
  customEndDate: string;
};

export const EXPORT_FIELDS: { value: ExportField; label: string }[] = [
  { value: "position", label: "posição" },
  { value: "id", label: "identificador" },
  { value: "name", label: "nome" },
  { value: "description", label: "descrição" },
  { value: "tags", label: "tags" },
  { value: "updatedAt", label: "alteração" },
];

export function filterFavoriteEntries<T extends FavoriteEntry>(
  entries: T[],
  filters: FavoriteFilterState,
  now = Date.now(),
): T[] {
  const normalized = filters.query.trim().toLocaleLowerCase();
  const cutoff =
    filters.dateFilter === "all"
      ? null
      : filters.dateFilter === "custom"
        ? filters.customStartDate
          ? new Date(`${filters.customStartDate}T00:00:00`).getTime()
          : null
        : now - Number(filters.dateFilter) * 24 * 60 * 60 * 1000;
  const end =
    filters.dateFilter === "custom" && filters.customEndDate
      ? new Date(`${filters.customEndDate}T23:59:59`).getTime()
      : null;

  return entries.filter((entry) => {
    const matchesQuery =
      !normalized ||
      `${entry.name} ${entry.description} ${entry.id}`
        .toLocaleLowerCase()
        .includes(normalized);
    const matchesTag =
      filters.tagFilter === "all" || entry.tags?.includes(filters.tagFilter);
    const matchesEdit =
      filters.editFilter === "all" ||
      (filters.editFilter === "edited" ? entry.isEdited : !entry.isEdited);
    const matchesStart =
      !cutoff || Boolean(entry.updatedAt && entry.updatedAt.getTime() >= cutoff);
    const matchesEnd =
      !end || Boolean(entry.updatedAt && entry.updatedAt.getTime() <= end);

    return matchesQuery && matchesTag && matchesEdit && matchesStart && matchesEnd;
  });
}

export function getAvailableFavoriteTags(entries: FavoriteEntry[]): string[] {
  return Array.from(new Set(entries.flatMap((entry) => entry.tags ?? []))).sort();
}

export function moveFavoriteId(ids: string[], sourceId: string, targetId: string): string[] {
  if (sourceId === targetId) return ids;
  const sourceIndex = ids.indexOf(sourceId);
  const targetIndex = ids.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0) return ids;

  const next = [...ids];
  next.splice(sourceIndex, 1);
  next.splice(next.indexOf(targetId), 0, sourceId);
  return next;
}

export function favoriteExportValue(entry: FavoriteEntry, field: ExportField): string {
  const value =
    field === "position"
      ? entry.position + 1
      : field === "tags"
        ? (entry.tags ?? []).join("|")
        : field === "updatedAt"
          ? (entry.updatedAt?.toISOString() ?? "original")
          : entry[field];

  return String(value ?? "");
}

export function buildFavoriteExportRows(
  entries: FavoriteEntry[],
  fields: ExportField[],
): Record<string, string>[] {
  return entries.map((entry) =>
    Object.fromEntries(fields.map((field) => [field, favoriteExportValue(entry, field)])),
  );
}

export function estimateFavoriteExport(
  entries: FavoriteEntry[],
  fields: ExportField[],
  withThumbnails: boolean,
): { data: number; thumbnails: number; overhead: number; total: number } {
  if (!entries.length || !fields.length) {
    return { data: 0, thumbnails: 0, overhead: 0, total: 0 };
  }

  const rows = buildFavoriteExportRows(entries, fields);
  const data = new Blob([JSON.stringify(rows)]).size;
  const thumbnails = withThumbnails
    ? entries.filter((entry) => entry.cover).length * 180 * 1024
    : 0;
  const overhead = Math.round((data + thumbnails) * 0.08);

  return { data, thumbnails, overhead, total: data + thumbnails + overhead };
}

export function csvEscape(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}
