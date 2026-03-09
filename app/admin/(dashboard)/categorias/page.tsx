import Link from "next/link";
import { createClient } from "@/supabase/server";
import { getCategories } from "@/supabase/queries/categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { CategoriesTableActions } from "@/features/admin/categories-table-actions";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const categories = await getCategories(supabase);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-2xl font-medium text-sage-900">Categorías</h1>
        <Button asChild>
          <Link href="/admin/categorias/nueva">
            <Plus className="h-4 w-4" />
            Nueva categoría
          </Link>
        </Button>
      </div>
      {categories.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <p className="text-sage-600">Aún no hay categorías.</p>
            <Button asChild className="mt-4">
              <Link href="/admin/categorias/nueva">Crear primera categoría</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-sage-200/60 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sage-200/60 bg-sage-50/50">
              <tr>
                <th className="p-4 font-medium text-sage-800">Nombre</th>
                <th className="p-4 font-medium text-sage-800">Slug</th>
                <th className="p-4 font-medium text-sage-800 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-sage-100">
                  <td className="p-4 font-medium text-sage-900">{c.name}</td>
                  <td className="p-4 text-sage-600">{c.slug}</td>
                  <td className="p-4 text-right">
                    <CategoriesTableActions category={c} />
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
