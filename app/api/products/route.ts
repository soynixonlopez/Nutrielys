import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import {
  getProducts,
  type ProductsFilters,
  type ProductsSort,
} from "@/supabase/queries/products";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category");
    const sort = (searchParams.get("sort") as ProductsSort) ?? "newest";
    const featured = searchParams.get("featured") === "1";
    const stock = searchParams.get("stock") === "1";

    const supabase = await createClient();
    const filters: ProductsFilters = {
      isActive: true,
      search: q || undefined,
      categoryId: category && category !== "all" ? category : undefined,
      isFeatured: featured ? true : undefined,
    };
    if (stock) {
      // Filtrar por stock > 0: lo hacemos después ya que Supabase no tiene "gt" fácil para "stock"
      const all = await getProducts(supabase, filters, sort);
      const filtered = all.filter((p) => p.stock > 0);
      return NextResponse.json(filtered);
    }
    const products = await getProducts(supabase, filters, sort);
    return NextResponse.json(products);
  } catch (error) {
    console.error("API products error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
