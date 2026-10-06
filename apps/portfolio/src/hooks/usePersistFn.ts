import { useRef } from "react";

type AnyFunction = (this: unknown, ...args: never[]) => unknown;

/** Keeps a stable function identity while always calling the latest implementation. */
export function usePersistFn<T extends AnyFunction>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args: Parameters<T>) {
      return fnRef.current.apply(this, args);
    } as T;
  }
  return persistFn.current;
}
