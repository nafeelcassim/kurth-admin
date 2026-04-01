import { z } from "zod";

const productLanguageSchema = z.enum(["en", "fr", "de"]);

export const updateProductSchema = z.object({
  slug: z.string().min(1, "Slug is required").optional(),
  isActive: z.boolean().optional(),
  translations: z
    .array(
      z.object({
        id: z.string().min(1),
        language: productLanguageSchema,
        name: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .optional(),
});

export type UpdateProductFormValues = z.infer<typeof updateProductSchema>;
