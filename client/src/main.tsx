import "./index.css";
import { registerPortfolioPwa } from "./pwa";
import { installPortfolioPromptCapture } from "./pwaInstallPromptBridge";

installPortfolioPromptCapture();
registerPortfolioPwa();

if (import.meta.env.VITE_STATIC_DEPLOY === "true") {
  void import("./bootstrapStatic");
} else {
  void import("./bootstrapServer");
}
