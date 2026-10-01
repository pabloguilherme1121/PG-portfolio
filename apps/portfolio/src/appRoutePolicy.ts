export type PublicRoutePolicy = {
  agenda: boolean;
  favorites: boolean;
  curation: boolean;
  privacy: boolean;
};

export function getPublicRoutePolicy(isStaticDeploy: boolean): PublicRoutePolicy {
  return {
    agenda: !isStaticDeploy,
    favorites: !isStaticDeploy,
    curation: !isStaticDeploy,
    privacy: true,
  };
}
