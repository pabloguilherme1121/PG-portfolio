import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import type { Request } from "express";
import { TRPCError } from "@trpc/server";
import { blockAvailabilityDate, createQuoteRequest, deleteFavoriteProjectMetadata, listBlockedDates, listFavoriteProjectMetadata, listFavoriteProjectOrder, replaceFavoriteProjectOrder, unblockAvailabilityDate, upsertFavoriteProjectMetadata } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";

export const quoteRequestInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  service: z.string().trim().min(2).max(160),
  projectType: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(255),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  delivery: z.string().trim().max(160).optional(),
  budget: z.string().trim().max(120).optional(),
  briefing: z.string().trim().min(12).max(5000),
  website: z.string().trim().max(200).optional(),
});

const quoteRateLimitBuckets = new Map<string, { startedAt: number; count: number }>();
const QUOTE_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const QUOTE_RATE_LIMIT_MAX = 5;

export function isQuoteRequestHoneypotFilled(value: string | undefined) {
  return Boolean(value?.trim());
}

export function consumeQuoteRequestRateLimit(identifier: string, now = Date.now()) {
  const current = quoteRateLimitBuckets.get(identifier);
  if (!current || now - current.startedAt >= QUOTE_RATE_LIMIT_WINDOW_MS) {
    quoteRateLimitBuckets.set(identifier, { startedAt: now, count: 1 });
    return true;
  }
  if (current.count >= QUOTE_RATE_LIMIT_MAX) return false;
  current.count += 1;
  return true;
}

function normalizeNetworkAddress(value: string | undefined) {
  return (value || "unknown").trim().replace(/^::ffff:/, "").slice(0, 80);
}

export function isTrustedProxyAddress(address: string | undefined) {
  const normalized = normalizeNetworkAddress(address).toLowerCase();
  if (normalized === "127.0.0.1" || normalized === "::1") return true;
  if (/^10\./.test(normalized) || /^192\.168\./.test(normalized)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(normalized)) return true;
  if (/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(normalized)) return true;
  return normalized.startsWith("fc") || normalized.startsWith("fd") || normalized.startsWith("fe80:");
}

export function getRequestIdentifier(req: Pick<Request, "headers" | "socket">) {
  const peerAddress = normalizeNetworkAddress(req.socket.remoteAddress);
  // O cabeçalho forwarded só é aceito quando a conexão chega de uma faixa local/privada
  // típica de proxy gerenciado. Conexões diretas não podem escolher o próprio identificador.
  if (!isTrustedProxyAddress(peerAddress)) return peerAddress;
  const forwarded = req.headers["x-forwarded-for"];
  const forwardedAddress = Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(",")[0];
  return normalizeNetworkAddress(forwardedAddress || peerAddress);
}

export function isValidDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

const blockedDateKeySchema = z.string().refine(isValidDateKey, "Informe uma data válida");

export const blockedDateInputSchema = z.object({
  dateKey: blockedDateKeySchema,
  note: z.string().trim().max(180).optional(),
});

export type InstagramFeedItem = {
  id: string;
  permalink: string;
  caption?: string;
};

export type InstagramFeedResponse =
  | { status: "available"; items: InstagramFeedItem[]; message?: string }
  | { status: "empty" | "credentials_required" | "error"; items: []; message: string };

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  quoteRequest: router({
    create: publicProcedure.input(quoteRequestInputSchema).mutation(async ({ ctx, input }) => {
      if (isQuoteRequestHoneypotFilled(input.website)) {
        return { success: true, requestId: "filtered", ownerNotified: false } as const;
      }
      if (!consumeQuoteRequestRateLimit(getRequestIdentifier(ctx.req))) {
        throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "Muitos pedidos em sequência. Aguarde alguns minutos e tente novamente." });
      }
      const result = await createQuoteRequest({
        ...input,
        delivery: input.delivery || null,
        budget: input.budget || null,
        eventDate: input.eventDate ? new Date(`${input.eventDate}T12:00:00.000Z`) : null,
      });
      let ownerNotified = false;
      try {
        ownerNotified = await notifyOwner({
          title: "Novo pedido de orçamento",
          content: `${input.name} pediu ${input.service} para ${input.projectType}. Contato: ${input.email}.`,
        });
      } catch (error) {
        console.warn("[QuoteRequest] Pedido salvo, mas a notificação não foi entregue:", error);
      }
      return { success: true, requestId: result.id, ownerNotified };
    }),
  }),
  instagramFeed: router({
    status: publicProcedure.query((): InstagramFeedResponse => ({
      status: "credentials_required",
      items: [],
      message: "A conexão com a API da Meta ainda depende de uma conta profissional e autorização válida.",
    })),
  }),
  favoriteOrder: router({
    list: adminProcedure.query(({ ctx }) => listFavoriteProjectOrder(ctx.user.id)),
    replace: adminProcedure.input(z.object({ projectIds: z.array(z.string().trim().min(1).max(64)).max(100) })).mutation(({ ctx, input }) => replaceFavoriteProjectOrder(ctx.user.id, input.projectIds)),
  }),
  favoriteMetadata: router({
    list: adminProcedure.query(({ ctx }) => listFavoriteProjectMetadata(ctx.user.id)),
    save: adminProcedure.input(z.object({ projectId: z.string().trim().min(1).max(64), displayName: z.string().trim().min(1).max(160), description: z.string().trim().max(2000) })).mutation(({ ctx, input }) => upsertFavoriteProjectMetadata(ctx.user.id, input.projectId, input.displayName, input.description)),
    restore: adminProcedure.input(z.object({ projectId: z.string().trim().min(1).max(64) })).mutation(({ ctx, input }) => deleteFavoriteProjectMetadata(ctx.user.id, input.projectId)),
  }),
  availability: router({
    listBlocked: publicProcedure.query(() => listBlockedDates()),
    block: adminProcedure.input(blockedDateInputSchema).mutation(async ({ input }) => {
      await blockAvailabilityDate(input.dateKey, input.note);
      return { success: true };
    }),
    unblock: adminProcedure.input(z.object({ dateKey: blockedDateKeySchema })).mutation(async ({ input }) => {
      await unblockAvailabilityDate(input.dateKey);
      return { success: true };
    }),
  }),
});

export type AppRouter = typeof appRouter;
