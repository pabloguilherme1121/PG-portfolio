/** Design: Arquivo Profundo — a aplicação inicia no modo escuro para preservar o contraste do portfólio. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const AvailabilityManager = lazy(() => import("./pages/AvailabilityManager"));
const FavoritesManagement = lazy(() => import("./pages/FavoritesManagement"));
const Privacy = lazy(() => import("./pages/Privacy"));

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Suspense fallback={<div className="grid min-h-screen place-items-center bg-[#030b1e] px-6 font-mono text-xs uppercase tracking-[0.14em] text-[#a5f3fc]">carregando agenda…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/agenda" component={AvailabilityManager} />
        <Route path="/favoritos" component={FavoritesManagement} />
        <Route path="/curadoria" component={FavoritesManagement} />
        <Route path="/privacidade" component={Privacy} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
