import "./index.css";
import { handOffPrebootRecovery } from "./legacyRuntimeMigration";
import { installPortfolioPromptCapture } from "./pwaInstallPromptBridge";
import {
  installVitePreloadRecovery,
  preparePortfolioRuntime,
} from "./runtimeRecovery";

async function bootstrap() {
  installVitePreloadRecovery(import.meta.env.BASE_URL);
  installPortfolioPromptCapture();

  if (import.meta.env.PROD || import.meta.env.VITE_STATIC_DEPLOY === "true") {
    const reloadingAfterMigration = await preparePortfolioRuntime(
      import.meta.env.BASE_URL
    );
    if (reloadingAfterMigration) return;
  }

  handOffPrebootRecovery();

  await import("@portfolio/bootstrap");
}

void bootstrap();
