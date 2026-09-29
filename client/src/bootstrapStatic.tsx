import { createRoot } from "react-dom/client";
import App from "./App";
import { registerPortfolioPwa } from "./pwa";

createRoot(document.getElementById("root")!).render(<App />);
registerPortfolioPwa();
