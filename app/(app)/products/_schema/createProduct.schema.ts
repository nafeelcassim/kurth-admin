import { z } from "zod";

const productLanguageSchema = z.enum(["en", "fr", "de"]);

export const createProductSchema = z.object({
  slug: z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be less than 100 characters")
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase, contain only letters, numbers, and hyphens, and cannot start or end with a hyphen"
  ),
  isActive: z.boolean().optional(),
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
