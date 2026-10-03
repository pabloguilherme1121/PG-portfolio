import { useEffect, useState } from "react";

export function useMobileKeyboardState() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const update = () => {
      // Pinch zoom and browser toolbars also resize the visual viewport.
      setOpen(window.innerWidth < 768 && viewport.scale === 1 && window.innerHeight - viewport.height > 140);
    };
    update();
    viewport.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      viewport.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return open;
}
