import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { ensureAdmin } from "@/lib/auth";
import { productSchema } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.slug || slugify(data.name);

  const { data: product, error } = await supabase
    .from("products")
    .insert({
      name: data.name,
      slug,
      short_description: data.short_description || null,
      description: data.description || null,
      price: data.price,
      compare_price: data.compare_price ?? null,
      stock: data.stock,
      category_id: data.category_id ?? null,
      image_url: data.image_url || null,
      is_featured: data.is_featured ?? false,
      is_active: data.is_active ?? true,
      benefits: data.benefits ?? [],
      ingredients: data.ingredients ?? [],
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(product);
}
