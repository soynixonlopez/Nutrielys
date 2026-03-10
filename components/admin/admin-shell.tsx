"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/client";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/ajustes", label: "Ajustes", icon: Settings },
];

interface AdminShellProps {
  userEmail: string;
  children: React.ReactNode;
}

export function AdminShell({ userEmail, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("admin-sidebar-collapsed");
    setCollapsed(saved === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem("admin-sidebar-collapsed", next ? "1" : "0");
      return next;
    });
  };

  const activeLabel = useMemo(() => {
    const found = navLinks.find((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));
    return found?.label ?? "Panel";
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const SidebarContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-sage-200/60 px-4">
        <Link href="/admin" className="inline-flex items-center gap-2 text-sage-900">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sage-700 text-sm font-semibold text-white">
            N
          </span>
          {(!collapsed || isMobile) && <span className="font-semibold">Nutrielys Admin</span>}
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)} aria-label="Cerrar menú">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navLinks.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-sage-100 text-sage-900" : "text-sage-700 hover:bg-sage-100/80 hover:text-sage-900",
                collapsed && !isMobile && "justify-center px-2"
              )}
            >
              <link.icon className="h-4 w-4 shrink-0" />
              {(!collapsed || isMobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sage-200/60 p-3">
        {(!collapsed || isMobile) && <p className="mb-2 truncate text-xs text-sage-500">{userEmail}</p>}
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={cn("w-full justify-start text-sage-700", collapsed && !isMobile && "justify-center px-2")}
        >
          <LogOut className="h-4 w-4" />
          {(!collapsed || isMobile) && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sage-50/30 md:grid md:grid-cols-[auto_1fr]">
      <aside
        className={cn(
          "hidden border-r border-sage-200/60 bg-white transition-all duration-300 md:block",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 border-b border-sage-200/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Abrir menú admin"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-sage-500">Panel</p>
                <p className="font-semibold text-sage-900">{activeLabel}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="hidden md:inline-flex"
              onClick={toggleCollapsed}
              aria-label="Colapsar sidebar"
            >
              {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-72 max-w-[85vw] border-r border-sage-200/60 bg-white shadow-xl">
            <SidebarContent isMobile />
          </aside>
        </div>
      )}
    </div>
  );
}
