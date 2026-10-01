import path from "node:path";
import { defineConfig } from "drizzle-kit";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required to run drizzle commands");
}

export default defineConfig({
  schema: path.join(import.meta.dirname, "apps/api/drizzle/schema.ts"),
  out: path.join(import.meta.dirname, "apps/api/drizzle"),
  dialect: "mysql",
  dbCredentials: {
    url: connectionString,
  },
});
