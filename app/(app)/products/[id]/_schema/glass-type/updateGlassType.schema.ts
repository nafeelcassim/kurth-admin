import { z } from "zod";

export const updateGlassTypeSchema = z.object({
  enName: z.string().min(1, "Required").max(100),
  frName: z.string().min(1, "Required").max(100),
  deName: z.string().min(1, "Required").max(100),
  imageUrl: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateGlassTypeFormValues = z.infer<typeof updateGlassTypeSchema>;
