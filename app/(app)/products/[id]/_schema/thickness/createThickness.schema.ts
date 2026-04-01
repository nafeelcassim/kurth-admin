import { z } from "zod";

export const createThicknessSchema = z.object({
  value: z.number().min(0, "Must be 0 or greater").max(21, "Must be 21 or less"),
  isActive: z.boolean().optional(),
});

export type CreateThicknessFormValues = z.infer<typeof createThicknessSchema>;
