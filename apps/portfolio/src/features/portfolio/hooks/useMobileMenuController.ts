import { useCallback, useEffect, useRef, useState } from "react";

type UseMobileMenuControllerOptions = {
  isDesktopViewport: boolean;
};

export function useMobileMenuController({
  isDesktopViewport,
}: UseMobileMenuControllerOptions) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((current) => !current);
  }, []);

  useEffect(() => {
    if (isDesktopViewport) close();
  }, [close, isDesktopViewport]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
      window.requestAnimationFrame(() => {
        buttonRef.current?.focus({ preventScroll: true });
      });
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [close, open]);

  return {
    open,
    setOpen,
    buttonRef,
    close,
    toggle,
  } as const;
}
