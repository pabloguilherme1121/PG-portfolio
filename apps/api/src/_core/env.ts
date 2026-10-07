export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || process.env.BUILT_IN_FORGE_API_URL || "",
  notificationServiceApiKey: process.env.NOTIFICATION_SERVICE_API_KEY || process.env.BUILT_IN_FORGE_API_KEY || "",
};
