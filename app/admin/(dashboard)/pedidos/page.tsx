import { createClient } from "@/supabase/server";
import { getOrders } from "@/supabase/queries/orders";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { OrderStatusSelect } from "@/features/admin/order-status-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface AdminOrdersPageProps {
  searchParams: Promise<{
    q?: string;
    status?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams;
  const supabase = await createClient();
  const orders = await getOrders(supabase, {
    q: params.q,
    status: params.status,
    from: params.from,
    to: params.to,
  });

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Pedidos</h1>
      <p className="mt-1 text-sage-600">
        Pedidos recibidos (generados vía WhatsApp / carrito).
      </p>
      <form className="mt-4 grid gap-3 rounded-xl border border-sage-200/70 bg-white p-4 md:grid-cols-5">
        <Input
          name="q"
          defaultValue={params.q ?? ""}
          className="md:col-span-2"
          placeholder="Buscar por nombre, email o telefono"
        />
        <select
          name="status"
          defaultValue={params.status ?? "all"}
          className="h-10 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>
        <Input name="from" type="date" defaultValue={params.from ?? ""} />
        <Input name="to" type="date" defaultValue={params.to ?? ""} />
        <div className="md:col-span-5 flex gap-2">
          <Button type="submit" size="sm">Filtrar</Button>
          <Button type="button" size="sm" variant="outline" asChild>
            <a href="/admin/pedidos">Limpiar</a>
          </Button>
        </div>
      </form>
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
                    <p className="font-medium text-sage-900">
                      {order.customer_name} {order.customer_last_name ?? ""}
                    </p>
                    {order.customer_email && (
                      <p className="text-sm text-sage-600">{order.customer_email}</p>
                    )}
                    <p className="text-sm text-sage-600">{order.customer_phone}</p>
                    <p className="mt-1 text-sm text-sage-500">
                      {new Date(order.created_at).toLocaleString("es-PA", {
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
                <div className="mt-2 text-sm text-sage-600">
                  <p>
                    Entrega: {order.is_pickup ? "Retiro en punto" : "Domicilio"}
                    {order.pickup_point ? ` - ${order.pickup_point}` : ""}
                  </p>
                  {!order.is_pickup && (
                    <>
                      <p>Direccion: {order.customer_address ?? "-"}</p>
                      <p>Provincia: {order.customer_province ?? "-"}</p>
                      <p>Corregimiento: {order.customer_corregimiento ?? "-"}</p>
                      <p>Calle: {order.customer_street ?? "-"}</p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
