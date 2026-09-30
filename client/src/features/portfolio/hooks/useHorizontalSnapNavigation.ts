import { useCallback, useEffect, useRef, useState } from "react";
import { subscribeToMediaQuery } from "@/lib/mediaQuery";

type HorizontalSnapNavigationOptions = {
  itemSelector: string;
  itemCount: number;
  mediaQuery?: string;
};

export function useHorizontalSnapNavigation({
  itemSelector,
  itemCount,
  mediaQuery = "(max-width: 639px)",
}: HorizontalSnapNavigationOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const syncActiveIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container || itemCount <= 0) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    if (!items.length) return;

    const viewportCenter = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    items.forEach((item, index) => {
      const itemCenter = item.offsetLeft + item.offsetWidth / 2;
      const distance = Math.abs(itemCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex((current) => (current === closestIndex ? current : closestIndex));
  }, [itemCount, itemSelector]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const viewport = window.matchMedia(mediaQuery);
    let frameId: number | null = null;

    const scheduleSync = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        if (!viewport.matches) {
          setActiveIndex(0);
          return;
        }
        syncActiveIndex();
      });
    };

    scheduleSync();
    container.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync);
    const unsubscribeViewport = subscribeToMediaQuery(viewport, scheduleSync);

    return () => {
      container.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
      unsubscribeViewport();
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, [mediaQuery, syncActiveIndex]);

  const scrollToIndex = useCallback((requestedIndex: number) => {
    const container = containerRef.current;
    if (!container || itemCount <= 0) return;

    const items = Array.from(container.querySelectorAll<HTMLElement>(itemSelector));
    const index = Math.min(Math.max(requestedIndex, 0), Math.max(items.length - 1, 0));
    const item = items[index];
    if (!item) return;

    const targetLeft = item.offsetLeft - (container.clientWidth - item.offsetWidth) / 2;
    const maxScrollLeft = Math.max(0, container.scrollWidth - container.clientWidth);
    const left = Math.min(maxScrollLeft, Math.max(0, targetLeft));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    setActiveIndex(index);
    container.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
  }, [itemCount, itemSelector]);

  useEffect(() => {
    if (activeIndex < itemCount) return;
    setActiveIndex(Math.max(0, itemCount - 1));
  }, [activeIndex, itemCount]);

  return {
    activeIndex,
    containerRef,
    scrollToIndex,
  } as const;
}
