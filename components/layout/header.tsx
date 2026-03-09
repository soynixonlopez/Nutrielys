"use client";

import Link from "next/link";
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
    <header className="sticky top-0 z-50 w-full border-b border-sage-200/60 bg-cream-50/98 shadow-sm shadow-sage-200/30 backdrop-blur supports-[backdrop-filter]:bg-cream-50/90">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-4 md:h-16">
        <Link
          href="/"
          className="font-serif text-xl font-medium text-sage-800 transition-all duration-200 hover:text-sage-600 md:text-2xl"
        >
          Nutrielys
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
          <Button variant="ghost" size="icon" asChild className="relative">
            <Link href="/carrito" aria-label="Ver carrito">
              <ShoppingBag className="h-5 w-5" />
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
          </nav>
        </div>
      )}
    </header>
  );
}
