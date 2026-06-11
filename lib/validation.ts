import { z } from "zod";

export const reminderSchema = z.object({
  userId: z.string().min(1),
  partnerId: z.string().min(1),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  timezone: z.string().min(1).default("Asia/Hong_Kong"),
  message: z.string().trim().min(1).max(200),
  deliveryMethod: z.enum(["Web Push", "Manual message"]).default("Web Push"),
  enabled: z.boolean().default(true),
  repeatType: z.literal("daily").default("daily"),
});

export const reminderPatchSchema = reminderSchema.omit({ userId: true, partnerId: true }).partial();
