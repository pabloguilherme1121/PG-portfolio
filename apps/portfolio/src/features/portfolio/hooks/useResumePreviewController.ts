import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type MouseEvent,
  type RefObject,
  type SetStateAction,
} from "react";

type UseResumePreviewControllerOptions = {
  avoidSpeculativePreload: boolean;
  loadPreview: () => Promise<unknown>;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
};

export function useResumePreviewController({
  avoidSpeculativePreload,
  loadPreview,
  menuButtonRef,
  setMenuOpen,
}: UseResumePreviewControllerOptions) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const preload = useCallback(() => {
    if (avoidSpeculativePreload) return;
    void loadPreview();
  }, [avoidSpeculativePreload, loadPreview]);

  const restoreFocus = useCallback(() => {
    window.setTimeout(() => {
      const returnTarget = returnFocusRef.current;
      if (returnTarget?.isConnected && returnTarget.offsetParent !== null) {
        returnTarget.focus();
        return;
      }

      const visibleResumeTrigger = Array.from(
        document.querySelectorAll<HTMLElement>('[data-resume-header="true"]'),
      ).find((element) => element.offsetParent !== null);

      (visibleResumeTrigger ?? menuButtonRef.current)?.focus();
    }, 0);
  }, [menuButtonRef]);

  const close = useCallback(() => {
    setOpen(false);
    setMenuOpen(false);
    restoreFocus();
  }, [restoreFocus, setMenuOpen]);

  const openPreview = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      preload();
      returnFocusRef.current = event.currentTarget;
      setMenuOpen(false);
      setError(false);
      setProgress(8);
      setLoading(true);
      setOpen(true);
    },
    [preload, setMenuOpen],
  );

  const retry = useCallback(() => {
    setError(false);
    setProgress(8);
    setLoading(true);
  }, []);

  const handleLoad = useCallback(() => {
    setProgress(100);
    setLoading(false);
    setError(false);
  }, []);

  const handleError = useCallback(() => {
    setLoading(false);
    setError(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => closeRef.current?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      close();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  useEffect(() => {
    if (!open || !loading) return;

    const progressTimer = window.setInterval(() => {
      setProgress((currentProgress) =>
        Math.min(92, currentProgress + (currentProgress < 55 ? 5 : 2)),
      );
    }, 180);
    const loadingFallbackTimer = window.setTimeout(() => setLoading(false), 4000);

    return () => {
      window.clearInterval(progressTimer);
      window.clearTimeout(loadingFallbackTimer);
    };
  }, [loading, open]);

  return {
    open,
    loading,
    progress,
    error,
    closeRef,
    preload,
    openPreview,
    close,
    retry,
    handleLoad,
    handleError,
  } as const;
}
