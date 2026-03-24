import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Nombre muy corto").max(120, "Nombre demasiado largo"),
  email: z.string().trim().email("Email no valido").max(160, "Email demasiado largo"),
  message: z.string().trim().min(10, "Mensaje muy corto").max(4000, "Mensaje demasiado largo"),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email("Email no valido").max(160, "Email demasiado largo"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
