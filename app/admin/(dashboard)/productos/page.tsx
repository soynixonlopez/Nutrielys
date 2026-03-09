import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { getProducts } from "@/supabase/queries/products";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { ProductsTableActions } from "@/features/admin/products-table-actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const products = await getProducts(supabase, { isActive: undefined }, "newest");

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-medium text-sage-900">Productos</h1>
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>
      {products.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-sage-600">Aún no hay productos.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/productos/nuevo">Crear primer producto</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-sage-200/60 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sage-200/60 bg-sage-50/50">
              <tr>
                <th className="p-4 font-medium text-sage-800">Producto</th>
                <th className="p-4 font-medium text-sage-800">Categoría</th>
                <th className="p-4 font-medium text-sage-800">Precio</th>
                <th className="p-4 font-medium text-sage-800">Stock</th>
                <th className="p-4 font-medium text-sage-800">Estado</th>
                <th className="p-4 font-medium text-sage-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-sage-100">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-sage-100">
                        {p.image_url ? (
                          <Image src={p.image_url} alt="" fill className="object-cover" />
                        ) : (
                          <span className="text-sage-400 text-xs">Sin img</span>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sage-900">{p.name}</p>
                        <p className="text-xs text-sage-500">{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sage-700">{(p as { category?: { name: string } }).category?.name ?? "—"}</td>
                  <td className="p-4 font-medium text-sage-800">{formatPrice(p.price)}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.is_active ? "bg-sage-100 text-sage-700" : "bg-sage-200/60 text-sage-600"}`}>
                      {p.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <ProductsTableActions product={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
