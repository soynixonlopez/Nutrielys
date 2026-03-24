"use client";

import { useCallback, useEffect, useState } from "react";
import { ProductCard } from "./product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category, Product } from "@/types";
import type { ProductsSort } from "@/supabase/queries/products";

interface ProductsCatalogProps {
  categories: Category[];
  /** Productos cargados desde el servidor (creados en el panel). Se muestran al inicio. */
  initialProducts?: Product[];
}

export function ProductsCatalog({ categories, initialProducts = [] }: ProductsCatalogProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [sort, setSort] = useState<ProductsSort>("newest");
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (categoryId && categoryId !== "all") params.set("category", categoryId);
    params.set("sort", sort);
    if (onlyFeatured) params.set("featured", "1");
    if (onlyInStock) params.set("stock", "1");
    const res = await fetch(`/api/products?${params.toString()}`);
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [search, categoryId, sort, onlyFeatured, onlyInStock]);

  useEffect(() => {
    const isDefault = !search.trim() && (!categoryId || categoryId === "all") && !onlyFeatured && !onlyInStock && sort === "newest";
    if (isDefault) {
      setProducts(initialProducts);
      return;
    }
    fetchProducts();
  }, [search, categoryId, sort, onlyFeatured, onlyInStock, initialProducts, fetchProducts]);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex flex-col gap-4 rounded-xl border border-sage-200/60 bg-cream-50/50 p-4 md:flex-row md:flex-wrap md:items-center">
        <div className="flex-1 min-w-[200px]">
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white"
          />
        </div>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as ProductsSort)}>
          <SelectTrigger className="w-full md:w-[180px] bg-white">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Más recientes</SelectItem>
            <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
            <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
            <SelectItem value="featured">Destacados primero</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={onlyFeatured ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyFeatured((o) => !o)}
          >
            Destacados
          </Button>
          <Button
            variant={onlyInStock ? "default" : "outline"}
            size="sm"
            onClick={() => setOnlyInStock((o) => !o)}
          >
            En stock
          </Button>
        </div>
      </div>

      {/* Listado */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-sage-200/60 bg-white overflow-hidden">
              <div className="aspect-square animate-pulse bg-sage-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-sage-100" />
                <div className="h-4 w-1/2 animate-pulse rounded bg-sage-100" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl border border-sage-200/60 bg-cream-50/50 py-16 text-center">
          <p className="text-sage-700">No hay productos que coincidan con los filtros.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setCategoryId("all"); setOnlyFeatured(false); setOnlyInStock(false); fetchProducts(); }}>
            Limpiar filtros
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
