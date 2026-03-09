import Link from "next/link";

const footerLinks = [
  { href: "/productos", label: "Productos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export function Footer() {
  return (
    <footer className="border-t border-sage-200/60 bg-gradient-to-b from-cream-100/80 to-sage-50/50">
      <div className="mx-auto max-w-6xl px-3 py-10 sm:px-4 md:py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="font-serif text-lg font-medium text-sage-800">
              Nutrielys
            </Link>
            <p className="mt-2 text-sm text-sage-700/80">
              Snacks naturales de frutas y vegetales deshidratados. Frescura y sabor de Panamá.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sage-800">Enlaces</h3>
            <ul className="mt-3 space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sage-700/80 transition-colors hover:text-sage-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-sage-800">Contacto</h3>
            <p className="mt-3 text-sm text-sage-700/80">
              Pedidos por WhatsApp. Respuesta rápida.
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-sage-200/60 pt-8 text-center text-sm text-sage-600/80">
          © {new Date().getFullYear()} Nutrielys. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
