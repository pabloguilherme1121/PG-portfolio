import { readStorage, writeStorage } from "@/lib/safeStorage";

export const DEFAULT_SIDEBAR_WIDTH = 280;
export const MIN_SIDEBAR_WIDTH = 200;
export const MAX_SIDEBAR_WIDTH = 480;

export function parseStoredSidebarWidth(value: string | null): number {
  if (value === null) return DEFAULT_SIDEBAR_WIDTH;
  const normalized = value.trim();
  if (!normalized) return DEFAULT_SIDEBAR_WIDTH;
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return DEFAULT_SIDEBAR_WIDTH;
  return Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, parsed));
}

export function readStoredSidebarWidth(storage: Storage | null | undefined): number {
  return parseStoredSidebarWidth(readStorage(storage, "sidebar-width"));
}

export function persistSidebarWidth(
  storage: Storage | null | undefined,
  width: number,
): boolean {
  return writeStorage(storage, "sidebar-width", String(width));
}
