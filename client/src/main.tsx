import "./index.css";
import { registerPortfolioPwa } from "./pwa";
import { installPortfolioPromptCapture } from "./pwaInstallPromptBridge";
import { installVitePreloadRecovery, preparePortfolioRuntime } from "./runtimeRecovery";

async function bootstrap() {
  installVitePreloadRecovery(import.meta.env.BASE_URL);
  installPortfolioPromptCapture();

  if (import.meta.env.VITE_STATIC_DEPLOY === "true") {
    const reloadingAfterMigration = await preparePortfolioRuntime(import.meta.env.BASE_URL);
    if (reloadingAfterMigration) return;
  }

  registerPortfolioPwa();

  if (import.meta.env.VITE_STATIC_DEPLOY === "true") {
    await import("./bootstrapStatic");
  } else {
    await import("./bootstrapServer");
  }
}

void bootstrap();
