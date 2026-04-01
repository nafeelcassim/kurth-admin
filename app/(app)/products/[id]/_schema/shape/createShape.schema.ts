import { z } from "zod";

export const createShapeSchema = z.object({
  enName: z.string().min(1, "Required").max(100),
  frName: z.string().min(1, "Required").max(100),
  deName: z.string().min(1, "Required").max(100),
  priceMultiplier: z.number().nonnegative("Must be positive or zero").min(0).max(10),
});

export type CreateShapeFormValues = z.infer<typeof createShapeSchema>;
