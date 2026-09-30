import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

type UseAppearancePanelControllerOptions = {
  fallbackTriggerRef: RefObject<HTMLElement | null>;
};

export function useAppearancePanelController({
  fallbackTriggerRef,
}: UseAppearancePanelControllerOptions) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openPanel = useCallback((trigger?: HTMLElement | null) => {
    returnFocusRef.current = trigger ?? fallbackTriggerRef.current;
    setOpen(true);
  }, [fallbackTriggerRef]);

  const restoreFocus = useCallback(() => {
    window.requestAnimationFrame(() => {
      const preferred = returnFocusRef.current;
      if (preferred?.isConnected && preferred.offsetParent !== null) {
        preferred.focus({ preventScroll: true });
        return;
      }

      fallbackTriggerRef.current?.focus({ preventScroll: true });
    });
  }, [fallbackTriggerRef]);

  const closePanel = useCallback(() => {
    setOpen(false);
    restoreFocus();
  }, [restoreFocus]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closePanel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePanel, open]);

  return {
    open,
    closeRef,
    openPanel,
    closePanel,
  } as const;
}
