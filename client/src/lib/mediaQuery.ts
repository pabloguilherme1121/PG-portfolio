type MediaQueryChangeListener = (event: MediaQueryListEvent) => void;

export function subscribeToMediaQuery(
  mediaQuery: MediaQueryList,
  listener: MediaQueryChangeListener,
): () => void {
  if (typeof mediaQuery.addEventListener === "function") {
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }

  const legacyMediaQuery = mediaQuery as MediaQueryList & {
    addListener?: (listener: MediaQueryChangeListener) => void;
    removeListener?: (listener: MediaQueryChangeListener) => void;
  };

  if (typeof legacyMediaQuery.addListener === "function") {
    legacyMediaQuery.addListener(listener);
    return () => legacyMediaQuery.removeListener?.(listener);
  }

  return () => undefined;
}
