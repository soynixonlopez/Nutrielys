import Link from "next/link";
import { MessageCircle, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { ContactForm } from "@/features/contact/contact-form";
import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contacto",
  description: "Contáctanos por WhatsApp o escríbenos. Nutrielys - Snacks naturales.",
};

function normalizeWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

const CONTACT_IMAGE = "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=1200&auto=format&fit=crop";

export default async function ContactoPage() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);
  const whatsapp = settings?.whatsapp_number ?? "50760000000";
  const waUrl = `https://wa.me/${normalizeWhatsApp(whatsapp)}`;

  return (
    <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 md:py-16">
      {/* Encabezado con imagen */}
      <div className="relative mb-12 h-52 overflow-hidden rounded-2xl md:h-64">
        <SafeImage
          src={CONTACT_IMAGE}
          alt="Contacto"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1152px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-sage-900/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <h1 className="font-serif text-3xl font-medium text-white drop-shadow md:text-4xl">
            Contacto
          </h1>
          <p className="mt-2 max-w-xl text-white/95 drop-shadow">
            ¿Dudas o quieres hacer un pedido? Escríbenos por WhatsApp o envíanos un mensaje.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-sage-200/60 bg-gradient-to-br from-cream-50/80 to-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#25D366]">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-semibold text-sage-900">WhatsApp</h2>
              <p className="mt-2 text-sm text-sage-700">
                Respuesta rápida. Ideal para pedidos y consultas.
              </p>
              <Button variant="whatsapp" className="mt-4 w-full sm:w-auto" asChild>
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  Abrir WhatsApp
                </a>
              </Button>
            </div>
            <div className="rounded-2xl border border-sage-200/60 bg-white p-6 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                <MapPin className="h-6 w-6" />
              </div>
              <h2 className="mt-4 font-semibold text-sage-900">Ubicación</h2>
              <p className="mt-2 text-sm text-sage-700">
                Panamá. Envíos según disponibilidad. Te confirmamos por WhatsApp.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-sage-200/60 bg-white p-6 shadow-sm lg:col-span-3">
            <h2 className="flex items-center gap-2 font-semibold text-sage-900">
              <Send className="h-5 w-5 text-sage-600" />
              Envíanos un mensaje
            </h2>
            <p className="mt-2 text-sm text-sage-700">
              Completa el formulario y te responderemos a la brevedad.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
