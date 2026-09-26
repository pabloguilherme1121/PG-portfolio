import { Suspense, useEffect, lazy } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { installMissingMediaFallback } from "@/features/portfolio/utils/installMissingMediaFallback";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";

const Privacy = lazy(() => import("@/pages/Privacy"));

function AppRoutes() {
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#030b1e] px-6 font-mono text-xs uppercase tracking-[0.14em] text-[#a5f3fc]">carregando…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/privacidade" component={Privacy} />
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
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRoutes />
          </WouterRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
