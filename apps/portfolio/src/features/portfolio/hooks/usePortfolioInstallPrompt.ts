import { useCallback, useEffect, useState } from "react";
import {
  clearPendingPortfolioInstallPrompt,
  getPendingPortfolioInstallPrompt,
  type PortfolioInstallPromptEvent,
} from "@/pwaInstallPromptBridge";

export function usePortfolioInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<PortfolioInstallPromptEvent | null>(null);

  useEffect(() => {
    const pendingPrompt = getPendingPortfolioInstallPrompt();
    if (pendingPrompt) setPromptEvent(pendingPrompt);

    const handleBeforeInstallPrompt = (event: Event) => {
      const nextPromptEvent = event as PortfolioInstallPromptEvent;
      if (typeof nextPromptEvent.prompt !== "function") return;
      event.preventDefault();
      setPromptEvent(nextPromptEvent);
    };

    const handleAppInstalled = () => {
      clearPendingPortfolioInstallPrompt();
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installPortfolio = useCallback(async () => {
    const currentPromptEvent = promptEvent;
    if (!currentPromptEvent) return false;

    try {
      await currentPromptEvent.prompt();
      await currentPromptEvent.userChoice;
      return true;
    } finally {
      clearPendingPortfolioInstallPrompt();
      setPromptEvent(null);
    }
  }, [promptEvent]);

  return {
    canInstallPortfolio: Boolean(promptEvent),
    installPortfolio,
  } as const;
}
