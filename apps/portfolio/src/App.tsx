/** Design: Arquivo Profundo — a aplicação inicia no modo escuro para preservar o contraste do portfólio. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense, useEffect, type ReactNode } from "react";
import Home from "./pages/Home";
import { installMissingMediaFallback } from "@/features/portfolio/utils/installMissingMediaFallback";
const Privacy = lazy(() => import("./pages/Privacy"));

function AppRoutes({
  administrativeRoutes,
}: {
  administrativeRoutes?: ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div
          role="status"
          aria-live="polite"
          className="grid min-h-screen place-items-center bg-[#030b1e] px-6 font-mono text-xs uppercase tracking-[0.14em] text-[#a5f3fc]"
        >
          carregando conteúdo…
        </div>
      }
    >
      <Switch>
        <Route path="/" component={Home} />
        {administrativeRoutes}
        <Route path="/privacidade" component={Privacy} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App({ administrativeRoutes }: { administrativeRoutes?: ReactNode }) {
  useEffect(() => installMissingMediaFallback(import.meta.env.BASE_URL), []);
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes administrativeRoutes={administrativeRoutes} />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
