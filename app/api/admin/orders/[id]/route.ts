import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import type { OrderStatus } from "@/types";

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "delivered", "cancelled"];

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
  const status = body?.status as string | undefined;

  if (!status || !VALID_STATUSES.includes(status as OrderStatus)) {
    return NextResponse.json(
      { error: "status debe ser: pending, confirmed, delivered o cancelled" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("orders")
    .update({ status: status as OrderStatus })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
