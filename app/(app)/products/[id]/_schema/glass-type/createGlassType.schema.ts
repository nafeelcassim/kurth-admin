import { z } from "zod";

export const createGlassTypeSchema = z.object({
  enName: z.string().min(1, "Required").max(100),
  frName: z.string().min(1, "Required").max(100),
  deName: z.string().min(1, "Required").max(100),
  imageUrl: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export type CreateGlassTypeFormValues = z.infer<typeof createGlassTypeSchema>;
