import { z } from "zod";

export const siteSettingsSchema = z.object({
  business_name: z.string().min(1, "Nombre del negocio requerido"),
  whatsapp_number: z.string().min(8, "Número de WhatsApp requerido"),
  hero_title: z.string().optional().nullable(),
  hero_subtitle: z.string().optional().nullable(),
  hero_image: z.string().url().optional().nullable().or(z.literal("")),
});

export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;
