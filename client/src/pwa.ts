export function registerPortfolioPwa() {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator)) return;

  const register = () => {
    const baseUrl = import.meta.env.BASE_URL;
    void navigator.serviceWorker
      .register(`${baseUrl}sw.js`, { scope: baseUrl })
      .catch((error) => {
        console.warn("[PWA] Service worker registration failed", error);
      });
  };

  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}
