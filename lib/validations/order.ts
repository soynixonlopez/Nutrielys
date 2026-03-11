import { z } from "zod";

const orderItemSchema = z.object({
  product_id: z
    .union([z.string().uuid(), z.literal("")])
    .optional()
    .transform((v) => (v === "" || v === undefined ? null : v)),
  product_name_snapshot: z.string().min(1, "Nombre del producto requerido").max(500),
  price_snapshot: z.coerce.number().min(0, "Precio debe ser ≥ 0"),
  quantity: z.coerce.number().int().min(1, "Cantidad debe ser ≥ 1"),
});

export const createOrderSchema = z.object({
  customer_name: z.string().min(1, "Nombre requerido").max(200).transform((s) => s.trim()),
  customer_phone: z.string().min(1, "Teléfono requerido").max(50).transform((s) => s.trim()),
  customer_notes: z.string().max(1000).optional().transform((s) => (s?.trim() || undefined)),
  items: z.array(orderItemSchema).min(1, "Debe incluir al menos un ítem"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
