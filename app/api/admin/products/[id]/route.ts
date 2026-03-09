import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { productSchema } from "@/lib/validations/product";

export const dynamic = "force-dynamic";

async function ensureAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  // Full form update (edit product)
  if (body.name !== undefined) {
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    const data = parsed.data;
    const { error } = await supabase
      .from("products")
      .update({
        name: data.name,
        slug: data.slug,
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
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Partial update (e.g. toggle is_active from table)
  const updates: Record<string, unknown> = {};
  if (typeof body.is_active === "boolean") updates.is_active = body.is_active;
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: "No updates" }, { status: 400 });

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
