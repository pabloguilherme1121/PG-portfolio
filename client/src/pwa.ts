const PWA_RUNTIME_VERSION = "v8";
const PWA_RUNTIME_SCRIPT = "sw-runtime-v8.js";

export function registerPortfolioPwa() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const register = () => {
    const baseUrl = import.meta.env.BASE_URL;
    void navigator.serviceWorker
      .register(`${baseUrl}${PWA_RUNTIME_SCRIPT}?runtime=${PWA_RUNTIME_VERSION}`, {
        scope: baseUrl,
        updateViaCache: "none",
      })
      .then((registration) => registration.update())
      .catch((error) => {
        console.warn("[PWA] Service worker registration failed", error);
      });
  };

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
