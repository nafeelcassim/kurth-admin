import { z } from "zod";

const shapeLanguageSchema = z.enum(["en", "fr", "de"]);

export const updateShapeSchema = z.object({
  isActive: z.boolean().optional(),
  priceMultiplier: z.number().nonnegative("Must be positive or zero").min(0).max(10).optional(),
  translations: z
    .array(
      z.object({
        id: z.string().min(1),
        language: shapeLanguageSchema,
        name: z.string().optional(),
      })
    )
    .optional(),
});

export type UpdateShapeFormValues = z.infer<typeof updateShapeSchema>;
