"use client";

import Link from "next/link";
import { Instagram, MapPin, MessageCircle, Clock3, Leaf } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const quickLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
  { href: "/carrito", label: "Carrito" },
];

const legalContent = {
  privacy: {
    title: "Política de privacidad",
    description:
      "En Nutrielys protegemos tus datos y los usamos solo para atender pedidos, contacto y mejora del servicio.",
    body: [
      "Recopilamos información básica como nombre, teléfono y dirección solo cuando es necesaria para gestionar tus pedidos o responder consultas.",
      "No vendemos ni compartimos tus datos con terceros para fines comerciales ajenos a Nutrielys.",
      "Puedes solicitar la actualización o eliminación de tu información escribiéndonos por nuestros canales de contacto.",
    ],
  },
  legal: {
    title: "Aviso legal",
    description:
      "El uso de este sitio implica la aceptación de condiciones básicas de navegación y compra.",
    body: [
      "La información de productos, precios y disponibilidad puede cambiar sin previo aviso.",
      "Las imágenes son de referencia y buscamos mantener la mayor fidelidad posible en cada publicación.",
      "Para pedidos y entregas aplican condiciones específicas coordinadas por WhatsApp con el equipo de Nutrielys.",
    ],
  },
};

function LegalModal({
  trigger,
  title,
  description,
  body,
}: {
  trigger: string;
  title: string;
  description: string;
  body: string[];
}) {
  return (
    <Dialog>
      <DialogTrigger className="text-sage-700 transition-colors hover:text-sage-900">{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-sage-200 bg-cream-50 sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-sage-900">{title}</DialogTitle>
          <DialogDescription className="text-sage-700">{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 text-sm leading-relaxed text-sage-800">
          {body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sage-200/60 bg-gradient-to-b from-cream-100/90 via-white to-sage-50/60">
      <div className="mx-auto max-w-6xl px-3 py-12 sm:px-4 md:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-serif text-xl font-medium text-sage-800">
              <Leaf className="h-5 w-5 text-sage-600" />
              Nutrielys
            </Link>
            <p className="text-sm text-sage-700/90">
              Snacks naturales de frutas y vegetales deshidratados, elaborados en Panamá con enfoque de calidad y
              bienestar.
            </p>
            <Link
              href="/productos"
              className="inline-flex items-center rounded-full bg-sage-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sage-800"
            >
              Explorar catálogo
            </Link>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-sage-800">Navegación</h3>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-sage-700/90 transition-colors hover:text-sage-900">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-sage-800">Contacto</h3>
            <ul className="mt-4 space-y-3 text-sm text-sage-700/90">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-sage-600" />
                Panamá
              </li>
              <li className="flex items-start gap-2">
                <MessageCircle className="mt-0.5 h-4 w-4 text-sage-600" />
                Pedidos por WhatsApp
              </li>
              <li className="flex items-start gap-2">
                <Clock3 className="mt-0.5 h-4 w-4 text-sage-600" />
                Lunes a sábado, 8:00 am - 6:00 pm
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-sage-800">Comunidad</h3>
            <p className="mt-4 text-sm text-sage-700/90">
              Síguenos para recetas, lanzamientos y promociones saludables.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram Nutrielys"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-300 bg-white text-sage-700 transition-colors hover:bg-sage-100"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/50760000000"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp Nutrielys"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sage-300 bg-white text-sage-700 transition-colors hover:bg-sage-100"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-sage-200/70 pt-6 text-sm text-sage-700/90 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nutrielys. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <LegalModal
              trigger="Política de privacidad"
              title={legalContent.privacy.title}
              description={legalContent.privacy.description}
              body={legalContent.privacy.body}
            />
            <LegalModal
              trigger="Aviso legal"
              title={legalContent.legal.title}
              description={legalContent.legal.description}
              body={legalContent.legal.body}
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
