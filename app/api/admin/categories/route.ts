import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { categorySchema } from "@/lib/validations/category";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function ensureAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return profile?.role === "admin" ? user : null;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const slug = parsed.data.slug || slugify(parsed.data.name);
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: parsed.data.name,
      slug,
      description: parsed.data.description || null,
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
