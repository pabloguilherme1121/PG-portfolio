import { useEffect, useRef, useState } from "react";

type NearViewportCallback = () => void;

type ObserverPool = {
  observer: IntersectionObserver;
  callbacksByTarget: Map<Element, Set<NearViewportCallback>>;
};

const observerPools = new Map<string, ObserverPool>();

function releasePoolIfEmpty(rootMargin: string, pool: ObserverPool) {
  if (pool.callbacksByTarget.size > 0) return;
  pool.observer.disconnect();
  observerPools.delete(rootMargin);
}

function getObserverPool(rootMargin: string) {
  const existing = observerPools.get(rootMargin);
  if (existing) return existing;

  let pool!: ObserverPool;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const callbacks = pool.callbacksByTarget.get(entry.target);
        if (!callbacks) return;

        pool.callbacksByTarget.delete(entry.target);
        pool.observer.unobserve(entry.target);
        callbacks.forEach((callback) => callback());
      });

      releasePoolIfEmpty(rootMargin, pool);
    },
    { rootMargin, threshold: 0 },
  );

  pool = {
    observer,
    callbacksByTarget: new Map(),
  };
  observerPools.set(rootMargin, pool);
  return pool;
}

export function observeNearViewport(
  target: Element,
  onNearViewport: NearViewportCallback,
  rootMargin = "720px",
) {
  if (typeof IntersectionObserver === "undefined") {
    onNearViewport();
    return () => {};
  }

  const pool = getObserverPool(rootMargin);
  const existingCallbacks = pool.callbacksByTarget.get(target);
  if (existingCallbacks) {
    existingCallbacks.add(onNearViewport);
  } else {
    pool.callbacksByTarget.set(target, new Set([onNearViewport]));
    pool.observer.observe(target);
  }

  return () => {
    const callbacks = pool.callbacksByTarget.get(target);
    if (!callbacks) return;

    callbacks.delete(onNearViewport);
    if (callbacks.size > 0) return;

    pool.callbacksByTarget.delete(target);
    pool.observer.unobserve(target);
    releasePoolIfEmpty(rootMargin, pool);
  };
}

export function useNearViewport<T extends HTMLElement>(rootMargin = "720px") {
  const targetRef = useRef<T | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    return observeNearViewport(target, () => setIsNearViewport(true), rootMargin);
  }, [rootMargin]);

  return [targetRef, isNearViewport] as const;
}
