"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [formStartedAt] = useState<number>(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const website = String(formData.get("website") ?? "");

    setIsSubmitting(true);
    setFeedback(null);
    setFeedbackType(null);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website, form_started_at: formStartedAt }),
      });

      if (!response.ok) {
        throw new Error("No se pudo suscribir");
      }

      form.reset();
      setFeedback("Suscripcion realizada. Gracias por unirte.");
      setFeedbackType("success");
    } catch {
      setFeedback("No pudimos procesar tu suscripcion ahora. Intenta nuevamente.");
      setFeedbackType("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-white/25 bg-white/10 p-4 md:p-5">
      <Input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Ingresa tu correo"
        className="mt-2 h-11 border-white/30 bg-white/95 text-sage-900 placeholder:text-sage-500"
      />
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-3 h-11 w-full bg-white px-6 text-sage-900 hover:bg-sage-100"
      >
        {isSubmitting ? "Enviando..." : "Suscribirme"}
      </Button>
      {feedback ? (
        <p className={`mt-3 text-xs ${feedbackType === "success" ? "text-emerald-200" : "text-rose-200"}`}>{feedback}</p>
      ) : null}
    </form>
  );
}
