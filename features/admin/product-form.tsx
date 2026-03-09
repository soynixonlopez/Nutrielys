"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Category } from "@/types";
import type { Product } from "@/types";
import { slugify } from "@/lib/utils";
import { Upload, Loader2 } from "lucide-react";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = !!product;

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          slug: product.slug,
          short_description: product.short_description ?? "",
          description: product.description ?? "",
          price: product.price,
          compare_price: product.compare_price ?? undefined,
          stock: product.stock,
          category_id: product.category_id ?? undefined,
          image_url: product.image_url ?? "",
          is_featured: product.is_featured,
          is_active: product.is_active,
          benefits: product.benefits ?? [],
          ingredients: product.ingredients ?? [],
        }
      : {
          is_featured: false,
          is_active: true,
          benefits: [],
          ingredients: [],
        },
  });

  const name = watch("name");
  const imageUrl = watch("image_url");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const syncSlug = () => {
    if (!isEdit && name) setValue("slug", slugify(name));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al subir");
      setValue("image_url", data.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const payload = {
      ...data,
      compare_price: data.compare_price || null,
      category_id: data.category_id || null,
      image_url: data.image_url || null,
      benefits: data.benefits ?? [],
      ingredients: data.ingredients ?? [],
    };
    const url = isEdit ? `/api/admin/products/${product.id}` : "/api/admin/products";
    const method = isEdit ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err.error ?? "Error al guardar");
      return;
    }
    router.push("/admin/productos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
      <Card>
        <CardHeader>
          <h2 className="font-semibold text-sage-900">Datos del producto</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                className="mt-1"
                {...register("name")}
                onBlur={syncSlug}
              />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="slug">Slug (URL)</Label>
              <Input id="slug" className="mt-1" {...register("slug")} />
              {errors.slug && <p className="mt-1 text-xs text-destructive">{errors.slug.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="short_description">Descripción corta</Label>
            <Input id="short_description" className="mt-1" {...register("short_description")} />
          </div>
          <div>
            <Label htmlFor="description">Descripción</Label>
            <textarea
              id="description"
              rows={4}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register("description")}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="price">Precio (USD)</Label>
              <Input id="price" type="number" step="0.01" className="mt-1" {...register("price")} />
              {errors.price && <p className="mt-1 text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div>
              <Label htmlFor="compare_price">Precio comparación (opcional)</Label>
              <Input id="compare_price" type="number" step="0.01" className="mt-1" {...register("compare_price")} />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" className="mt-1" {...register("stock")} />
              {errors.stock && <p className="mt-1 text-xs text-destructive">{errors.stock.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              value={watch("category_id") ?? "none"}
              onValueChange={(v) => setValue("category_id", v === "none" ? undefined : v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Sin categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Imagen principal</Label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              {(imageUrl || uploading) && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-sage-200 bg-sage-50">
                  {uploading ? (
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-sage-500" />
                    </div>
                  ) : imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt="Vista previa"
                      fill
                      className="object-cover"
                      sizes="96px"
                      unoptimized
                    />
                  ) : null}
                </div>
              )}
              <div className="flex flex-col gap-2 min-w-0">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4" />
                  {uploading ? "Subiendo…" : "Subir imagen"}
                </Button>
                <p className="text-xs text-sage-500">O pega una URL abajo (máx. 5 MB: JPEG, PNG, WebP, GIF)</p>
                {uploadError && <p className="text-xs text-destructive">{uploadError}</p>}
              </div>
            </div>
            <Input id="image_url" type="url" className="mt-1" placeholder="https://..." {...register("image_url")} />
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_featured")} className="rounded border-sage-300" />
              <span className="text-sm">Destacado</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("is_active")} className="rounded border-sage-300" />
              <span className="text-sm">Activo</span>
            </label>
          </div>
          <div>
            <Label htmlFor="benefits">Beneficios (uno por línea)</Label>
            <textarea
              id="benefits"
              rows={3}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Rica en vitamina C&#10;Fibra natural&#10;Sin azúcar añadida"
              value={(watch("benefits") ?? []).join("\n")}
              onChange={(e) =>
                setValue(
                  "benefits",
                  e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">Cada línea será un ítem de la lista de beneficios.</p>
          </div>
          <div>
            <Label htmlFor="ingredients">Ingredientes (uno por línea)</Label>
            <textarea
              id="ingredients"
              rows={2}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Piña 100%&#10;Sin conservantes"
              value={(watch("ingredients") ?? []).join("\n")}
              onChange={(e) =>
                setValue(
                  "ingredients",
                  e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
            <p className="mt-1 text-xs text-muted-foreground">Cada línea será un ítem de la lista de ingredientes.</p>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando…" : isEdit ? "Guardar cambios" : "Crear producto"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
