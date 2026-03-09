"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2 } from "lucide-react";
import type { Product } from "@/types";

interface ProductsTableActionsProps {
  product: Product;
}

export function ProductsTableActions({ product }: ProductsTableActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar "${product.name}"?`)) return;
    const res = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" });
    if (res.ok) router.refresh();
    else alert("Error al eliminar");
  };

  const handleToggleActive = async (active: string) => {
    const isActive = active === "true";
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: isActive }),
    });
    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="ghost" size="icon" asChild>
        <Link href={`/admin/productos/${product.id}/editar`}>
          <Pencil className="h-4 w-4" />
          <span className="sr-only">Editar</span>
        </Link>
      </Button>
      <Select value={product.is_active ? "true" : "false"} onValueChange={handleToggleActive}>
        <SelectTrigger className="w-[100px] h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="true">Activo</SelectItem>
          <SelectItem value="false">Inactivo</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={handleDelete}>
        <span className="sr-only">Eliminar</span>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
