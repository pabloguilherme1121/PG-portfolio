import "./index.css";
import { registerPortfolioPwa } from "./pwa";
import { installPortfolioPromptCapture } from "./pwaInstallPromptBridge";
import { installVitePreloadRecovery } from "./runtimeRecovery";

installVitePreloadRecovery(import.meta.env.BASE_URL);
installPortfolioPromptCapture();
registerPortfolioPwa();

if (import.meta.env.VITE_STATIC_DEPLOY === "true") {
  void import("./bootstrapStatic");
} else {
  void import("./bootstrapServer");
}
