"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import type { Category } from "@/types";

interface CategoriesTableActionsProps {
  category: Category;
}

export function CategoriesTableActions({ category }: CategoriesTableActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${category.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Error al eliminar. Puede que tenga productos asociados.");
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/categorias/${category.id}/editar`}>
          <Pencil className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
