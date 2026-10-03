import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { observeNearViewport } from "./useNearViewport";

type Callback = IntersectionObserverCallback;

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];

  readonly callback: Callback;
  readonly options?: IntersectionObserverInit;
  readonly observed = new Set<Element>();
  disconnect = vi.fn(() => {
    this.observed.clear();
  });
  observe = vi.fn((target: Element) => {
    this.observed.add(target);
  });
  unobserve = vi.fn((target: Element) => {
    this.observed.delete(target);
  });
  takeRecords = vi.fn(() => [] as IntersectionObserverEntry[]);
  root = null;
  rootMargin = "0px";
  thresholds = [0];

  constructor(callback: Callback, options?: IntersectionObserverInit) {
    this.callback = callback;
    this.options = options;
    FakeIntersectionObserver.instances.push(this);
  }

  emit(target: Element, isIntersecting = true) {
    this.callback(
      [
        {
          target,
          isIntersecting,
          intersectionRatio: isIntersecting ? 1 : 0,
        } as IntersectionObserverEntry,
      ],
      this as unknown as IntersectionObserver,
    );
  }
}

describe("observeNearViewport", () => {
  const originalIntersectionObserver = globalThis.IntersectionObserver;

  beforeEach(() => {
    FakeIntersectionObserver.instances = [];
    globalThis.IntersectionObserver = FakeIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver;
    vi.restoreAllMocks();
  });

  it("compartilha um IntersectionObserver entre alvos com o mesmo rootMargin", () => {
    const first = {} as Element;
    const second = {} as Element;

    const stopFirst = observeNearViewport(first, vi.fn(), "320px");
    const stopSecond = observeNearViewport(second, vi.fn(), "320px");

    expect(FakeIntersectionObserver.instances).toHaveLength(1);
    expect(FakeIntersectionObserver.instances[0]?.observe).toHaveBeenCalledTimes(2);

    stopFirst();
    stopSecond();
  });

  it("mantém pools separados quando rootMargin muda", () => {
    const stopFirst = observeNearViewport({} as Element, vi.fn(), "120px");
    const stopSecond = observeNearViewport({} as Element, vi.fn(), "720px");

    expect(FakeIntersectionObserver.instances).toHaveLength(2);

    stopFirst();
    stopSecond();
  });

  it("notifica apenas o alvo que entrou na viewport e o remove do observer", () => {
    const first = {} as Element;
    const second = {} as Element;
    const onFirst = vi.fn();
    const onSecond = vi.fn();

    const stopFirst = observeNearViewport(first, onFirst, "320px");
    const stopSecond = observeNearViewport(second, onSecond, "320px");
    const observer = FakeIntersectionObserver.instances[0]!;

    observer.emit(first);

    expect(onFirst).toHaveBeenCalledTimes(1);
    expect(onSecond).not.toHaveBeenCalled();
    expect(observer.unobserve).toHaveBeenCalledWith(first);

    stopFirst();
    stopSecond();
  });

  it("desconecta o observer compartilhado quando o último alvo é removido", () => {
    const stopFirst = observeNearViewport({} as Element, vi.fn(), "320px");
    const stopSecond = observeNearViewport({} as Element, vi.fn(), "320px");
    const observer = FakeIntersectionObserver.instances[0]!;

    stopFirst();
    expect(observer.disconnect).not.toHaveBeenCalled();

    stopSecond();
    expect(observer.disconnect).toHaveBeenCalledTimes(1);
  });
});
