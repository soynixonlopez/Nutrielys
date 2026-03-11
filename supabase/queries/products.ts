import type { Product, ProductWithImages } from "@/types";

export interface ProductsFilters {
  categoryId?: string | null;
  search?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductsSort = "price_asc" | "price_desc" | "newest" | "featured";

export async function getProducts(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>,
  filters: ProductsFilters = {},
  sort: ProductsSort = "newest"
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, category:categories(id, name, slug, description)");

  if (filters.isActive !== undefined) {
    query = query.eq("is_active", filters.isActive);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }
  if (filters.search?.trim()) {
    const searchTerm = filters.search.trim().slice(0, 200);
    query = query.or(
      `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }
  if (filters.isFeatured !== undefined) {
    query = query.eq("is_featured", filters.isFeatured);
  }
  if (filters.minPrice != null) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters.maxPrice != null) {
    query = query.lte("price", filters.maxPrice);
  }

  switch (sort) {
    case "price_asc":
      query = query.order("price", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "featured":
      query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>,
  slug: string
): Promise<ProductWithImages | null> {
  const { data: product, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug, description)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !product) return null;

  const { data: images } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort_order", { ascending: true });

  return {
    ...product,
    product_images: images ?? [],
  } as ProductWithImages;
}

/** Productos destacados: primero featured, luego el resto activos (para home). */
export async function getFeaturedProducts(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>,
  limit = 8
): Promise<Product[]> {
  const { data: featuredData, error } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const featured = (featuredData ?? []) as Product[];
  if (featured.length >= limit) return featured;

  const excludedIds = featured.map((p) => p.id);
  let fallbackQuery = supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(limit - featured.length);

  if (excludedIds.length > 0) {
    const quotedIds = excludedIds.map((id) => `"${id}"`).join(",");
    fallbackQuery = fallbackQuery.not("id", "in", `(${quotedIds})`);
  }

  const { data: fallbackData, error: fallbackError } = await fallbackQuery;
  if (fallbackError) throw fallbackError;

  return [...featured, ...((fallbackData ?? []) as Product[])];
}


export async function getRelatedProducts(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>,
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .eq("is_active", true)
    .neq("id", productId)
    .limit(limit);

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}
