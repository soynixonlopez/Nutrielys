import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/supabase/admin";
import { createOrderSchema } from "@/lib/validations/order";
import { sendOrderNotificationEmail } from "@/lib/email";
import { checkRateLimit, isBotHoneypotTriggered, isSuspiciousFormTiming } from "@/lib/security/request-guards";

export const dynamic = "force-dynamic";

/** Crea un pedido (desde carrito al enviar por WhatsApp o desde admin) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const rl = checkRateLimit({
      request,
      key: "api-orders",
      max: 8,
      windowMs: 10 * 60 * 1000,
    });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: `Demasiados intentos. Intenta nuevamente en ${rl.retryAfterSec}s.` },
        { status: 429 }
      );
    }

    if (isBotHoneypotTriggered(body)) {
      return NextResponse.json({ ok: true });
    }
    if (isSuspiciousFormTiming(body)) {
      return NextResponse.json({ error: "Formulario invalido. Intenta nuevamente." }, { status: 400 });
    }

    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).find(
        (messages) => Array.isArray(messages) && messages.length > 0
      );
      return NextResponse.json(
        {
          error:
            firstError && Array.isArray(firstError) && firstError[0]
              ? firstError[0]
              : "Datos del pedido invalidos. Revisa los campos e intenta nuevamente.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      customer_name,
      customer_last_name,
      customer_email,
      customer_phone,
      customer_address,
      customer_province,
      customer_corregimiento,
      customer_street,
      is_pickup,
      pickup_point,
      customer_notes,
      items,
    } = parsed.data;
    const total = items.reduce((sum, i) => sum + i.price_snapshot * i.quantity, 0);
    const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);
    const distinctProducts = new Set(items.map((i) => i.product_name_snapshot.toLowerCase())).size;
    const isPanama =
      /panama/i.test(customer_province ?? "") || /panama/i.test(customer_corregimiento ?? "");

    if (isPanama && totalUnits < 6 && distinctProducts < 6) {
      return NextResponse.json(
        { error: "Para ciudad/provincia de Panama el pedido minimo es 6 unidades totales o 6 productos diferentes." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_last_name,
        customer_email,
        customer_phone,
        customer_address: customer_address ?? null,
        customer_province: customer_province ?? null,
        customer_corregimiento: customer_corregimiento ?? null,
        customer_street: customer_street ?? null,
        is_pickup,
        pickup_point: pickup_point ?? null,
        customer_notes: customer_notes ?? null,
        total,
        status: "pending",
      })
      .select("id")
      .single();

    if (orderError) {
      if (orderError.message.toLowerCase().includes("row-level security policy")) {
        return NextResponse.json(
          {
            error:
              "Configuracion de seguridad en Supabase incompleta para pedidos (RLS). Ejecuta el SQL de politicas de insercion.",
          },
          { status: 403 }
        );
      }
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
      if (itemsError.message.toLowerCase().includes("row-level security policy")) {
        return NextResponse.json(
          {
            error:
              "Configuracion de seguridad en Supabase incompleta para items del pedido (RLS). Ejecuta el SQL de politicas de insercion.",
          },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    try {
      await sendOrderNotificationEmail({
        orderId: order.id,
        order: parsed.data,
        total,
      });
    } catch (mailError) {
      console.error("POST /api/orders email", mailError);
    }

    return NextResponse.json({ id: order.id });
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
