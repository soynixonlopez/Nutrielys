"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Header() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sage-200/60 bg-cream-50/95 shadow-sm shadow-sage-200/30 backdrop-blur supports-[backdrop-filter]:bg-cream-50/85">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-3 sm:px-4 md:h-20">
        <Link
          href="/"
          className="inline-flex items-center rounded-md transition-opacity duration-200 hover:opacity-90"
          aria-label="Nutrielys - Ir al inicio"
        >
          <Image
            src="/logo/nutrielyslogo.png"
            alt="Nutrielys"
            width={152}
            height={148}
            priority
            quality={100}
            unoptimized
            className="h-12 w-auto md:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-sage-600",
                pathname === link.href ? "text-sage-700" : "text-sage-800/80"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden rounded-full px-4 md:inline-flex">
            <Link href="/productos">Ver productos</Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="relative h-11 w-11 md:h-12 md:w-12">
            <Link href="/carrito" aria-label="Ver carrito">
              <ShoppingBag className="h-6 w-6 md:h-7 md:w-7" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sage-600 text-xs font-medium text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir menú"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-sage-200/60 bg-cream-50 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2" aria-label="Menú móvil">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium",
                  pathname === link.href ? "bg-sage-100 text-sage-800" : "text-sage-800 hover:bg-sage-100/80"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/carrito"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-sage-800 hover:bg-sage-100/80"
            >
              <ShoppingBag className="h-4 w-4" />
              Carrito {totalItems > 0 && `(${totalItems})`}
            </Link>
            <Button asChild size="sm" className="mt-2">
              <Link href="/productos" onClick={() => setMobileOpen(false)}>
                Ver productos
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
