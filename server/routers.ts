import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { blockAvailabilityDate, createQuoteRequest, listBlockedDates, unblockAvailabilityDate } from "./db";
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
});

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
    create: publicProcedure.input(quoteRequestInputSchema).mutation(async ({ input }) => {
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
