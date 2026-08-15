import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { createQuoteRequest } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { notifyOwner } from "./_core/notification";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

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
});

export type AppRouter = typeof appRouter;
