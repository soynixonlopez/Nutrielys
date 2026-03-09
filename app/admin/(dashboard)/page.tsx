import Link from "next/link";
import { Package, FolderTree, ShoppingCart, AlertCircle } from "lucide-react";
import { createClient } from "@/supabase/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

async function getDashboardStats(supabase: Awaited<ReturnType<typeof import("@/supabase/server").createClient>>) {
  const [productsRes, categoriesRes, ordersRes, outOfStockRes] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id").eq("is_active", true).lte("stock", 0),
  ]);

  const [products, categories, orders, outOfStock] = await Promise.all([
    supabase.from("products").select("id, is_active, stock").then((r) => r.data ?? []),
    supabase.from("categories").select("id").then((r) => r.data ?? []),
    supabase.from("orders").select("id").then((r) => r.data ?? []),
    Promise.resolve(outOfStockRes.data ?? []),
  ]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.is_active).length;
  const noStock = products.filter((p) => p.is_active && p.stock <= 0).length;

  return {
    totalProducts,
    activeProducts,
    totalCategories: categories.length,
    totalOrders: orders.length,
    productsOutOfStock: noStock,
  };
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getDashboardStats(supabase);

  const cards = [
    {
      title: "Productos",
      value: stats.totalProducts,
      sub: `${stats.activeProducts} activos`,
      icon: Package,
      href: "/admin/productos",
    },
    {
      title: "Categorías",
      value: stats.totalCategories,
      sub: "",
      icon: FolderTree,
      href: "/admin/categorias",
    },
    {
      title: "Pedidos",
      value: stats.totalOrders,
      sub: "recibidos",
      icon: ShoppingCart,
      href: "/admin/pedidos",
    },
    {
      title: "Sin stock",
      value: stats.productsOutOfStock,
      sub: "productos activos",
      icon: AlertCircle,
      href: "/admin/productos?stock=0",
      variant: stats.productsOutOfStock > 0 ? "warning" : "default",
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Dashboard</h1>
      <p className="mt-1 text-sage-600">
        Resumen de tu tienda.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-sage-600">{card.title}</span>
                <card.icon className="h-5 w-5 text-sage-500" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-sage-900">{card.value}</p>
                {card.sub && (
                  <p className="text-xs text-sage-500">{card.sub}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
