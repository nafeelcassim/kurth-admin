import { z } from "zod";

export const updateThicknessSchema = z.object({
  value: z.number().min(0, "Must be 0 or greater").max(21, "Must be 21 or less"),
  isActive: z.boolean().optional(),
});

export type UpdateThicknessFormValues = z.infer<typeof updateThicknessSchema>;
