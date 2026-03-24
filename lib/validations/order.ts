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
  customer_last_name: z.string().min(1, "Apellido requerido").max(200).transform((s) => s.trim()),
  customer_email: z.string().email("Email no válido").max(160).transform((s) => s.trim().toLowerCase()),
  customer_phone: z.string().min(1, "Teléfono requerido").max(50).transform((s) => s.trim()),
  customer_address: z.string().max(500).optional().transform((s) => (s?.trim() || undefined)),
  customer_province: z.string().max(120).optional().transform((s) => (s?.trim() || undefined)),
  customer_corregimiento: z.string().max(120).optional().transform((s) => (s?.trim() || undefined)),
  customer_street: z.string().max(250).optional().transform((s) => (s?.trim() || undefined)),
  is_pickup: z.coerce.boolean().optional().default(false),
  pickup_point: z.string().max(250).optional().transform((s) => (s?.trim() || undefined)),
  customer_notes: z.string().max(1000).optional().transform((s) => (s?.trim() || undefined)),
  items: z.array(orderItemSchema).min(1, "Debe incluir al menos un ítem"),
}).superRefine((data, ctx) => {
  if (data.is_pickup) {
    if (!data.pickup_point) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["pickup_point"],
        message: "Debes indicar el punto de retiro.",
      });
    }
    return;
  }

  if (!data.customer_address || !data.customer_province || !data.customer_corregimiento || !data.customer_street) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["customer_address"],
      message: "Para entrega, completa direccion, provincia, corregimiento y calle.",
    });
  }
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
