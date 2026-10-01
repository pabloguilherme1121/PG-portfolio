import { useEffect, useState } from "react";
import {
  getNavigatorConnection,
  shouldAvoidSpeculativePreload,
} from "@/features/portfolio/utils/networkHints";
export function usePortfolioNetworkPreference() {
  const [avoidSpeculativePreload, setAvoidSpeculativePreload] = useState(() =>
    typeof navigator === "undefined"
      ? false
      : shouldAvoidSpeculativePreload(getNavigatorConnection(navigator))
  );
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const connection = getNavigatorConnection(navigator);
    if (!connection?.addEventListener || !connection.removeEventListener)
      return;
    const syncNetworkPreference = () =>
      setAvoidSpeculativePreload(shouldAvoidSpeculativePreload(connection));
    connection.addEventListener("change", syncNetworkPreference);
    return () =>
      connection.removeEventListener?.("change", syncNetworkPreference);
  }, []);

  return avoidSpeculativePreload;
}
