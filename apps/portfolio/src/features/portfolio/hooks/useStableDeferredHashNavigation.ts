import { useEffect } from "react";

/** Only deferred destinations need to be re-aligned after lazy content mounts. */
const deferredDestinationIds = new Set([
  "sobre",
  "perfil-profissional",
  "curriculo-web",
  "trilha",
  "qualidade",
  "servicos",
  "processo",
  "contato",
  "contato-briefing",
]);

/**
 * Native anchor scrolling can precede React lazy sections loading above the
 * destination. Re-align on DOM/height changes, but give control to the visitor
 * immediately if they initiate a new scroll or keyboard/touch interaction.
 */
export function useStableDeferredHashNavigation() {
  useEffect(() => {
    let releaseNavigation: (() => void) | undefined;

    const navigateToCurrentHash = () => {
      releaseNavigation?.();
      releaseNavigation = undefined;
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return;
      }
      if (!deferredDestinationIds.has(id)) return;

      let stopped = false;
      let frame: number | null = null;
      const root = document.getElementById("conteudo-principal") ?? document.body;

      const alignToDestination = () => {
        frame = null;
        if (stopped || window.location.hash !== `#${encodeURIComponent(id)}`) return;
        const destination = document.getElementById(id);
        // Do not align to temporary placeholders whose height will change.
        if (!destination || destination.closest('[aria-busy="true"]')) return;
        const rect = destination.getBoundingClientRect();
        if (!rect.height || !Number.isFinite(rect.top)) return;
        const headerOffset = 96;
        if (rect.top >= headerOffset - 24 && rect.top <= headerOffset + 40) return;
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - headerOffset), behavior: "instant" });
      };
      const schedule = () => {
        if (stopped || frame !== null) return;
        frame = window.requestAnimationFrame(alignToDestination);
      };

      const mutationObserver = new MutationObserver(schedule);
      mutationObserver.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["aria-busy"] });
      const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
      resizeObserver?.observe(document.body);

      let timer: number;
      const stop = () => {
        if (stopped) return;
        stopped = true;
        if (frame !== null) window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        mutationObserver.disconnect();
        resizeObserver?.disconnect();
        window.removeEventListener("wheel", stop);
        window.removeEventListener("touchstart", stop);
        window.removeEventListener("keydown", stop);
        if (releaseNavigation === stop) releaseNavigation = undefined;
      };
      // The visitor's next intentional input always wins over automatic scroll.
      window.addEventListener("wheel", stop, { passive: true });
      window.addEventListener("touchstart", stop, { passive: true });
      window.addEventListener("keydown", stop);
      timer = window.setTimeout(stop, 8000);
      releaseNavigation = stop;
      schedule();
    };

    window.addEventListener("hashchange", navigateToCurrentHash);
    // A deep link can arrive before the deferred sections are in the DOM.
    navigateToCurrentHash();

    return () => {
      window.removeEventListener("hashchange", navigateToCurrentHash);
      releaseNavigation?.();
    };
  }, []);
}
