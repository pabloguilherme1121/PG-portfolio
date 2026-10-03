import { lazy } from "react";
import { Route } from "wouter";
import PortfolioApp from "@/App";

const AvailabilityManager = lazy(() => import("./pages/AvailabilityManager"));
const FavoritesManagement = lazy(() => import("./pages/FavoritesManagement"));

export default function ServerApp() {
  return (
    <PortfolioApp
      administrativeRoutes={[
        <Route key="agenda" path="/agenda" component={AvailabilityManager} />,
        <Route
          key="favorites"
          path="/favoritos"
          component={FavoritesManagement}
        />,
        <Route
          key="curation"
          path="/curadoria"
          component={FavoritesManagement}
        />,
      ]}
    />
  );
}
