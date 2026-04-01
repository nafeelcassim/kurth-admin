import { z } from "zod";

const productLanguageSchema = z.enum(["en", "fr", "de"]);

export const createProductSchema = z.object({
  slug: z.string().min(1, "Slug is required"),
  isActive: z.boolean().optional(),
  priceMultiplier: z.number().positive().optional(),
  translations: z
    .array(
      z.object({
        language: productLanguageSchema,
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
      })
    )
    .min(1, "At least one translation is required"),
});

export type CreateProductFormValues = z.infer<typeof createProductSchema>;
