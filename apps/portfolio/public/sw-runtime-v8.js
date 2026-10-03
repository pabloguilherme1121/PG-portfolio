// Compatibility alias for clients that still have the v8 bundle loaded.
// It now points to the v10 retirement worker so old installed shells stop controlling navigation.
importScripts("./sw.js?alias=v10");
