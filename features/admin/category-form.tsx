"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySchema, type CategoryFormData } from "@/lib/validations/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@/types";
import { slugify } from "@/lib/utils";

interface CategoryFormProps {
  category?: Category;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const isEdit = !!category;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category
      ? { name: category.name, slug: category.slug, description: category.description ?? "" }
      : undefined,
  });

  const name = watch("name");
  const syncSlug = () => {
    if (!isEdit && name) setValue("slug", slugify(name));
  };

  const onSubmit = async (data: CategoryFormData) => {
    const url = isEdit ? `/api/admin/categories/${category.id}` : "/api/admin/categories";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Error al guardar");
      return;
    }
    router.push("/admin/categorias");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" className="mt-1" {...register("name")} onBlur={syncSlug} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="slug">Slug (URL)</Label>
            <Input id="slug" className="mt-1" {...register("slug")} />
            {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input id="description" className="mt-1" {...register("description")} />
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear categoría"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
