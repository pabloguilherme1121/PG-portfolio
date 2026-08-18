import { useEffect, useRef, useState } from "react";

export function useNearViewport<T extends HTMLElement>(rootMargin = "720px") {
  const targetRef = useRef<T | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;
    if (typeof IntersectionObserver === "undefined") {
      setIsNearViewport(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setIsNearViewport(true);
      observer.disconnect();
    }, { rootMargin, threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [targetRef, isNearViewport] as const;
}
