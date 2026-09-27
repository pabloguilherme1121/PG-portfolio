export type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string | null;
  addEventListener?: (type: "change", listener: () => void) => void;
  removeEventListener?: (type: "change", listener: () => void) => void;
};

export type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformationLike;
  mozConnection?: NetworkInformationLike;
  webkitConnection?: NetworkInformationLike;
};

export function getNavigatorConnection(navigatorLike?: Navigator | null): NetworkInformationLike | undefined {
  if (!navigatorLike) return undefined;
  const extended = navigatorLike as NavigatorWithConnection;
  return extended.connection ?? extended.mozConnection ?? extended.webkitConnection;
}

export function shouldAvoidSpeculativePreload(connection?: NetworkInformationLike | null) {
  if (!connection) return false;
  if (connection.saveData) return true;
  return connection.effectiveType === "slow-2g" || connection.effectiveType === "2g";
}
