import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export const dynamic = "force-dynamic";

/** Crea un pedido (desde carrito al enviar por WhatsApp o desde admin) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, customer_notes, items } = body as {
      customer_name: string;
      customer_phone: string;
      customer_notes?: string;
      items: Array<{ product_id?: string; product_name_snapshot: string; price_snapshot: number; quantity: number }>;
    };

    if (!customer_name?.trim() || !customer_phone?.trim() || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan nombre, teléfono o ítems" },
        { status: 400 }
      );
    }

    const total = items.reduce((sum, i) => sum + i.price_snapshot * i.quantity, 0);

    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_notes: customer_notes?.trim() || null,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id ?? null,
      product_name_snapshot: item.product_name_snapshot,
      price_snapshot: item.price_snapshot,
      quantity: item.quantity,
      subtotal: item.price_snapshot * item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    return NextResponse.json({ id: order.id });
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
