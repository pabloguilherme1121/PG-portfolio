import { z } from "zod";

export const quoteRequestInputSchema = z.object({
  name: z.string().trim().min(2).max(160),
  email: z.string().trim().email().max(320),
  service: z.string().trim().min(2).max(160),
  projectType: z.string().trim().min(2).max(160),
  location: z.string().trim().min(2).max(255),
  eventDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  delivery: z.string().trim().max(160).optional(),
  budget: z.string().trim().max(120).optional(),
  briefing: z.string().trim().min(12).max(5000),
  website: z.string().trim().max(200).optional(),
});

export type QuoteRequestInput = z.infer<typeof quoteRequestInputSchema>;
