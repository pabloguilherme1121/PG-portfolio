/** Design: Arquivo Profundo — a aplicação inicia no modo escuro para preservar o contraste do portfólio. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Router as WouterRouter, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense, useEffect } from "react";
import Home from "./pages/Home";
import { installMissingMediaFallback } from "@/features/portfolio/utils/installMissingMediaFallback";
import { getPublicRoutePolicy } from "./appRoutePolicy";
const isStaticDeploy = import.meta.env.VITE_STATIC_DEPLOY === "true";
const AvailabilityManager = isStaticDeploy ? null : lazy(() => import("./pages/AvailabilityManager"));
const FavoritesManagement = isStaticDeploy ? null : lazy(() => import("./pages/FavoritesManagement"));
const Privacy = lazy(() => import("./pages/Privacy"));

const routePolicy = getPublicRoutePolicy(isStaticDeploy);

function AppRoutes() {
  return (
    <Suspense fallback={<div role="status" aria-live="polite" className="grid min-h-screen place-items-center bg-[#030b1e] px-6 font-mono text-xs uppercase tracking-[0.14em] text-[#a5f3fc]">carregando conteúdo…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        {routePolicy.agenda && AvailabilityManager && <Route path="/agenda" component={AvailabilityManager} />}
        {routePolicy.favorites && FavoritesManagement && <Route path="/favoritos" component={FavoritesManagement} />}
        {routePolicy.curation && FavoritesManagement && <Route path="/curadoria" component={FavoritesManagement} />}
        {routePolicy.privacy && <Route path="/privacidade" component={Privacy} />}
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => installMissingMediaFallback(import.meta.env.BASE_URL), []);
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><AppRoutes /></WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
