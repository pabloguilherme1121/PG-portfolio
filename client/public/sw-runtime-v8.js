// Compatibility alias for clients that still have the v8 bundle loaded.
// Keeping this URL alive prevents old mobile tabs/PWA shells from re-installing a stale worker.
importScripts("./sw.js?alias=v9");
