"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Package, FolderTree, ShoppingCart, Settings, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings },
];

interface AdminNavProps {
  userEmail: string;
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="flex items-center gap-2">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-sage-100 text-sage-900"
              : "text-sage-700 hover:bg-sage-100/80 hover:text-sage-900"
          )}
        >
          <link.icon className="h-4 w-4" />
          <span className="hidden sm:inline">{link.label}</span>
        </Link>
      ))}
      <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-sage-700">
        <LogOut className="h-4 w-4 sm:mr-1" />
        <span className="hidden sm:inline">Salir</span>
      </Button>
    </nav>
  );
}
