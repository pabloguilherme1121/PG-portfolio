import { asc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { blockedDates, favoriteProjectMetadata, favoriteProjectOrders, InsertQuoteRequest, InsertUser, quoteRequests, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createQuoteRequest(request: InsertQuoteRequest) {
  const db = await getDb();
  if (!db) {
    throw new Error("Banco de dados indisponível para receber o pedido de orçamento");
  }

  try {
    const result = await db.insert(quoteRequests).values(request);
    return { id: Number((result as unknown as { insertId: number }).insertId) };
  } catch (error) {
    console.error("[QuoteRequest] Failed to persist request:", error);
    throw error;
  }
}

export async function listBlockedDates() {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para consultar a agenda");

  return db.select().from(blockedDates).orderBy(asc(blockedDates.dateKey));
}

export async function blockAvailabilityDate(dateKey: string, note?: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar a agenda");

  await db.insert(blockedDates).values({
    dateKey,
    note: note || null,
  }).onDuplicateKeyUpdate({
    set: { note: note || null },
  });
}

export async function unblockAvailabilityDate(dateKey: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para atualizar a agenda");

  await db.delete(blockedDates).where(eq(blockedDates.dateKey, dateKey));
}

export async function listFavoriteProjectOrder(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para consultar a ordem dos favoritos");
  return db.select().from(favoriteProjectOrders).where(eq(favoriteProjectOrders.userId, userId)).orderBy(asc(favoriteProjectOrders.position));
}

export async function listFavoriteProjectMetadata(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para consultar os metadados dos favoritos");
  return db.select().from(favoriteProjectMetadata).where(eq(favoriteProjectMetadata.userId, userId));
}

export async function upsertFavoriteProjectMetadata(userId: number, projectId: string, displayName: string, description: string) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para salvar os metadados dos favoritos");
  await db.insert(favoriteProjectMetadata).values({ userId, projectId, displayName, description }).onDuplicateKeyUpdate({ set: { displayName, description, updatedAt: new Date() } });
  return { success: true };
}

export async function replaceFavoriteProjectOrder(userId: number, projectIds: string[]) {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível para salvar a ordem dos favoritos");
  const uniqueProjectIds = Array.from(new Set(projectIds));
  await db.transaction(async (transaction) => {
    await transaction.delete(favoriteProjectOrders).where(eq(favoriteProjectOrders.userId, userId));
    if (uniqueProjectIds.length === 0) return;
    await transaction.insert(favoriteProjectOrders).values(uniqueProjectIds.map((projectId, position) => ({ userId, projectId, position })));
  });
  return { count: uniqueProjectIds.length };
}
