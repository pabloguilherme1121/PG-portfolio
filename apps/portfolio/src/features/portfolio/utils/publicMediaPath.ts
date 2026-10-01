/** Resolve the original media inventory under the active Vite base path. */
export function publicMediaPath(value: string, base = import.meta.env.BASE_URL): string {
  return value.replaceAll("/manus-storage/", `${base}manus-storage/`);
}
