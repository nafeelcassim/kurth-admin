import { z } from "zod";

export const createEdgeFinishingSchema = z.object({
  enName: z.string().min(1, "Required").max(100),
  frName: z.string().min(1, "Required").max(100),
  deName: z.string().min(1, "Required").max(100),
  imageUrl: z.string().max(500).optional(),
  pricePerLfm: z.number().min(0, "Must be 0 or greater"),
  minLengthLfm: z.number().min(0, "Must be 0 or greater"),
  isActive: z.boolean().optional(),
});

export type CreateEdgeFinishingFormValues = z.infer<typeof createEdgeFinishingSchema>;
