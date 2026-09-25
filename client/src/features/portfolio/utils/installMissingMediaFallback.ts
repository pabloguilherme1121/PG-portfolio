/** Show an honest placeholder when a referenced portfolio image cannot load. */
export function installMissingMediaFallback(base: string): () => void {
  const fallback = `${base}media-unavailable.svg`;
  const onError = (event: Event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || image.dataset.mediaFallback === "true") return;
    if (!image.currentSrc.includes("/manus-storage/") && !image.src.includes("/manus-storage/")) return;
    image.dataset.mediaFallback = "true";
    image.parentElement?.querySelectorAll(":scope > source").forEach((source) => {
      source.removeAttribute("srcset");
    });
    image.removeAttribute("srcset");
    image.alt = "Imagem em preparação";
    image.src = fallback;
  };
  document.addEventListener("error", onError, true);
  return () => document.removeEventListener("error", onError, true);
}
