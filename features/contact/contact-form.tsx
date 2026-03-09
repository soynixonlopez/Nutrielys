"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email no válido"),
  message: z.string().min(10, "Escribe al menos un mensaje breve"),
});

type FormData = z.infer<typeof schema>;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    // En un proyecto real aquí iría un API route que envía email o guarda en DB
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
  };

  if (sent) {
    return (
      <p className="mt-4 text-sm text-sage-700">
        Gracias por tu mensaje. Te responderemos pronto. Para pedidos te recomendamos usar WhatsApp.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" className="mt-1" {...register("name")} />
        {errors.name && (
          <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" className="mt-1" {...register("email")} />
        {errors.email && (
          <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="message">Mensaje</Label>
        <textarea
          id="message"
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          {...register("message")}
        />
        {errors.message && (
          <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Enviando…" : "Enviar mensaje"}
      </Button>
    </form>
  );
}
