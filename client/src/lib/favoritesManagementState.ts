export type EditFilter = "all" | "edited" | "original";
export type DateFilter = "all" | "7" | "30" | "custom";
export type ExportField = "position" | "id" | "name" | "description" | "tags" | "updatedAt";
export type ExportFormat = "csv" | "json" | "zip";

export type SessionFilters = {
  query: string;
  tagFilter: string;
  editFilter: EditFilter;
  dateFilter: DateFilter;
  customStartDate: string;
  customEndDate: string;
};

export type ExportPreferences = {
  fields: ExportField[];
  thumbnails: boolean;
  format: ExportFormat;
  estimate: number;
};

export const DEFAULT_EXPORT_FIELDS: ExportField[] = ["position", "id", "name", "description"];

const EDIT_FILTERS = new Set<EditFilter>(["all", "edited", "original"]);
const DATE_FILTERS = new Set<DateFilter>(["all", "7", "30", "custom"]);
const EXPORT_FIELDS = new Set<ExportField>(["position", "id", "name", "description", "tags", "updatedAt"]);
const EXPORT_FORMATS = new Set<ExportFormat>(["csv", "json", "zip"]);

const DEFAULT_FILTERS: SessionFilters = {
  query: "",
  tagFilter: "all",
  editFilter: "all",
  dateFilter: "all",
  customStartDate: "",
  customEndDate: "",
};

function parseJsonRecord(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function parseJsonArray(raw: string | null): unknown[] {
  if (!raw) return [];
  try {
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function stringOr(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

export function parseFavoriteIds(raw: string | null): string[] {
  return Array.from(new Set(parseJsonArray(raw).filter((value): value is string => typeof value === "string")));
}

export function parseExportSelection(raw: string | null): string[] {
  return parseFavoriteIds(raw);
}

export function parseSessionFilters(raw: string | null): SessionFilters {
  const value = parseJsonRecord(raw);
  const editFilter = typeof value.editFilter === "string" && EDIT_FILTERS.has(value.editFilter as EditFilter)
    ? value.editFilter as EditFilter
    : DEFAULT_FILTERS.editFilter;
  const dateFilter = typeof value.dateFilter === "string" && DATE_FILTERS.has(value.dateFilter as DateFilter)
    ? value.dateFilter as DateFilter
    : DEFAULT_FILTERS.dateFilter;

  return {
    query: stringOr(value.query, DEFAULT_FILTERS.query),
    tagFilter: stringOr(value.tagFilter, DEFAULT_FILTERS.tagFilter),
    editFilter,
    dateFilter,
    customStartDate: stringOr(value.customStartDate, DEFAULT_FILTERS.customStartDate),
    customEndDate: stringOr(value.customEndDate, DEFAULT_FILTERS.customEndDate),
  };
}

export function parseExportPreferences(rawPreferences: string | null, rawLast: string | null): ExportPreferences {
  const preferences = parseJsonRecord(rawPreferences);
  const last = parseJsonRecord(rawLast);

  let fields = DEFAULT_EXPORT_FIELDS;
  if (Array.isArray(preferences.fields)) {
    const valid = Array.from(new Set(preferences.fields.filter((field): field is ExportField =>
      typeof field === "string" && EXPORT_FIELDS.has(field as ExportField)
    )));
    if (preferences.fields.length === 0) fields = [];
    else if (valid.length > 0) fields = valid;
  }

  const format = typeof last.format === "string" && EXPORT_FORMATS.has(last.format as ExportFormat)
    ? last.format as ExportFormat
    : "csv";
  const estimate = typeof last.estimate === "number" && Number.isFinite(last.estimate) && last.estimate >= 0
    ? last.estimate
    : 0;

  return {
    fields,
    thumbnails: preferences.thumbnails === true,
    format,
    estimate,
  };
}
