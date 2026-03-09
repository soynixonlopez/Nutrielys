import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  slug: z.string().min(2, "Slug requerido").regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Precio debe ser ≥ 0"),
  compare_price: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0, "Stock debe ser ≥ 0"),
  category_id: z.string().uuid().optional().nullable(),
  image_url: z.string().url().optional().nullable().or(z.literal("")),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  benefits: z.array(z.string()).optional().default([]),
  ingredients: z.array(z.string()).optional().default([]),
});

export type ProductFormData = z.infer<typeof productSchema>;
