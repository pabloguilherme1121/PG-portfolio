import * as React from "react";
import { subscribeToMediaQuery } from "@/lib/mediaQuery";

const MOBILE_BREAKPOINT = 768;
const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MOBILE_QUERY).matches : false,
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const sync = () => setIsMobile(mediaQuery.matches);
    const unsubscribe = subscribeToMediaQuery(mediaQuery, sync);
    sync();
    return unsubscribe;
  }, []);

  return isMobile;
}
