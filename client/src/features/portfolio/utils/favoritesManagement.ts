export type FavoriteExportField =
  | "position"
  | "id"
  | "name"
  | "description"
  | "tags"
  | "updatedAt";

export type FavoriteExportEntry = {
  id: string;
  position: number;
  name: string;
  description: string;
  tags?: string[] | null;
  updatedAt?: Date | null;
  cover?: string | null;
};

export const FAVORITE_EXPORT_FIELDS: { value: FavoriteExportField; label: string }[] = [
  { value: "position", label: "posição" },
  { value: "id", label: "identificador" },
  { value: "name", label: "nome" },
  { value: "description", label: "descrição" },
  { value: "tags", label: "tags" },
  { value: "updatedAt", label: "alteração" },
];

export function favoriteExportValue(
  entry: FavoriteExportEntry,
  field: FavoriteExportField,
) {
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
  entries: FavoriteExportEntry[],
  fields: FavoriteExportField[],
) {
  return entries.map((entry) =>
    Object.fromEntries(
      fields.map((field) => [field, favoriteExportValue(entry, field)]),
    ),
  );
}

export function estimateFavoriteExportBreakdown(
  rows: Record<string, string>[],
  entries: FavoriteExportEntry[],
  includeThumbnails: boolean,
) {
  if (!rows.length) {
    return { data: 0, thumbnails: 0, overhead: 0, total: 0 };
  }

  const data = new Blob([JSON.stringify(rows)]).size;
  const thumbnails = includeThumbnails
    ? entries.filter((entry) => Boolean(entry.cover)).length * 180 * 1024
    : 0;
  const overhead = Math.round((data + thumbnails) * 0.08);

  return {
    data,
    thumbnails,
    overhead,
    total: data + thumbnails + overhead,
  };
}

export function moveFavoriteId(
  ids: string[],
  sourceId: string,
  targetId: string,
) {
  if (sourceId === targetId) return [...ids];

  const next = [...ids];
  const sourceIndex = next.indexOf(sourceId);
  const targetIndex = next.indexOf(targetId);
  if (sourceIndex < 0 || targetIndex < 0) return next;

  next.splice(sourceIndex, 1);
  next.splice(next.indexOf(targetId), 0, sourceId);
  return next;
}

export function formatFavoriteBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function favoriteCsvEscape(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
