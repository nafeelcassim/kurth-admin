import { z } from "zod";

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  isActive: z.boolean().optional(),
});

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
