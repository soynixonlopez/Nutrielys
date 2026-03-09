import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  slug: z.string().min(2, "Slug requerido").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
