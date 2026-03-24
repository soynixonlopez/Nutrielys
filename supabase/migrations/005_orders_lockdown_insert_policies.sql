-- Endurece seguridad: deshabilita INSERT publico en orders/order_items.
-- La insercion de pedidos debe ocurrir solo desde backend seguro (service_role).

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Orders insertable by public" ON public.orders;
DROP POLICY IF EXISTS "Orders insertable by service" ON public.orders;
DROP POLICY IF EXISTS "Orders insertable by service_role" ON public.orders;
CREATE POLICY "Orders insertable by service_role"
ON public.orders
FOR INSERT
TO service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "Order items insertable by public" ON public.order_items;
DROP POLICY IF EXISTS "Order items insertable by service" ON public.order_items;
DROP POLICY IF EXISTS "Order items insertable by service_role" ON public.order_items;
CREATE POLICY "Order items insertable by service_role"
ON public.order_items
FOR INSERT
TO service_role
WITH CHECK (true);
