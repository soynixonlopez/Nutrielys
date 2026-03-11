import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { createOrderSchema } from "@/lib/validations/order";

export const dynamic = "force-dynamic";

/** Crea un pedido (desde carrito al enviar por WhatsApp o desde admin) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { customer_name, customer_phone, customer_notes, items } = parsed.data;
    const total = items.reduce((sum, i) => sum + i.price_snapshot * i.quantity, 0);

    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_phone,
        customer_notes: customer_notes ?? null,
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
