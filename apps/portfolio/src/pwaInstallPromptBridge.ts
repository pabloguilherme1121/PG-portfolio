export type PortfolioInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __portfolioPendingInstallPrompt?: PortfolioInstallPromptEvent | null;
    __portfolioPromptCaptureInstalled?: boolean;
  }
}

export function installPortfolioPromptCapture() {
  if (typeof window === "undefined" || window.__portfolioPromptCaptureInstalled) return;

  window.__portfolioPromptCaptureInstalled = true;
  window.addEventListener("beforeinstallprompt", (event) => {
    const promptEvent = event as PortfolioInstallPromptEvent;
    if (typeof promptEvent.prompt !== "function") return;
    event.preventDefault();
    window.__portfolioPendingInstallPrompt = promptEvent;
  });
  window.addEventListener("appinstalled", () => {
    window.__portfolioPendingInstallPrompt = null;
  });
}

export function getPendingPortfolioInstallPrompt() {
  return typeof window === "undefined" ? null : window.__portfolioPendingInstallPrompt ?? null;
}

export function clearPendingPortfolioInstallPrompt() {
  if (typeof window !== "undefined") window.__portfolioPendingInstallPrompt = null;
}
