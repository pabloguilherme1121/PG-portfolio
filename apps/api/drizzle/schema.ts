import { int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 160 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  service: varchar("service", { length: 160 }).notNull(),
  projectType: varchar("project_type", { length: 160 }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  eventDate: timestamp("event_date"),
  delivery: varchar("delivery", { length: 160 }),
  budget: varchar("budget", { length: 120 }),
  briefing: text("briefing").notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "closed"]).default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

export const blockedDates = mysqlTable("availability_blocked_dates", {
  id: int("id").autoincrement().primaryKey(),
  dateKey: varchar("date_key", { length: 10 }).notNull().unique(),
  note: varchar("note", { length: 180 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BlockedDate = typeof blockedDates.$inferSelect;
export type InsertBlockedDate = typeof blockedDates.$inferInsert;

export const favoriteProjectOrders = mysqlTable("favorite_project_orders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  projectId: varchar("project_id", { length: 64 }).notNull(),
  position: int("position").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userProjectUnique: uniqueIndex("favorite_project_orders_user_project_idx").on(table.userId, table.projectId),
  userPositionUnique: uniqueIndex("favorite_project_orders_user_position_idx").on(table.userId, table.position),
}));

export type FavoriteProjectOrder = typeof favoriteProjectOrders.$inferSelect;
export type InsertFavoriteProjectOrder = typeof favoriteProjectOrders.$inferInsert;

export const favoriteProjectMetadata = mysqlTable("favorite_project_metadata", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  projectId: varchar("project_id", { length: 64 }).notNull(),
  displayName: varchar("display_name", { length: 160 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  userProjectUnique: uniqueIndex("favorite_project_metadata_user_project_idx").on(table.userId, table.projectId),
}));

export type FavoriteProjectMetadata = typeof favoriteProjectMetadata.$inferSelect;
export type InsertFavoriteProjectMetadata = typeof favoriteProjectMetadata.$inferInsert;
