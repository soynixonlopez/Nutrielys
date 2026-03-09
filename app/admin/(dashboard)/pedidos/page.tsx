import { createClient } from "@/supabase/server";
import { getOrders } from "@/supabase/queries/orders";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/features/admin/order-status-select";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const orders = await getOrders(supabase);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Pedidos</h1>
      <p className="mt-1 text-sage-600">
        Pedidos recibidos (generados vía WhatsApp / carrito).
      </p>
      {orders.length === 0 ? (
        <Card className="mt-6">
          <CardContent className="py-16 text-center text-sage-600">
            Aún no hay pedidos registrados.
          </CardContent>
        </Card>
      ) : (
        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-sage-900">{order.customer_name}</p>
                    <p className="text-sm text-sage-600">{order.customer_phone}</p>
                    <p className="mt-1 text-sm text-sage-500">
                      {new Date(order.created_at).toLocaleDateString("es-PA", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold text-sage-900">{formatPrice(order.total)}</p>
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </div>
                </div>
                {order.order_items && order.order_items.length > 0 && (
                  <ul className="mt-3 border-t border-sage-100 pt-3 text-sm text-sage-700">
                    {order.order_items.map((item) => (
                      <li key={item.id}>
                        {item.product_name_snapshot} x{item.quantity} — {formatPrice(item.subtotal)}
                      </li>
                    ))}
                  </ul>
                )}
                {order.customer_notes && (
                  <p className="mt-2 text-sm italic text-sage-600">Nota: {order.customer_notes}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
