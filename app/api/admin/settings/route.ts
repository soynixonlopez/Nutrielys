import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { ensureAdmin } from "@/lib/auth";
import { siteSettingsSchema } from "@/lib/validations/settings";

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const admin = await ensureAdmin(supabase);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { data: existing } = await supabase.from("site_settings").select("id").limit(1).single();
  const payload = {
    business_name: parsed.data.business_name,
    whatsapp_number: parsed.data.whatsapp_number,
    hero_title: parsed.data.hero_title ?? null,
    hero_subtitle: parsed.data.hero_subtitle ?? null,
    hero_image: parsed.data.hero_image ?? null,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { error } = await supabase.from("site_settings").update(payload).eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
