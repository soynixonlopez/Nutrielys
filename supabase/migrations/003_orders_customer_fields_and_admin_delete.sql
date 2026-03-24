-- Agrega campos de cliente para checkout y permisos de borrado para admin.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS customer_last_name TEXT,
  ADD COLUMN IF NOT EXISTS customer_email TEXT,
  ADD COLUMN IF NOT EXISTS customer_address TEXT,
  ADD COLUMN IF NOT EXISTS customer_province TEXT,
  ADD COLUMN IF NOT EXISTS customer_corregimiento TEXT,
  ADD COLUMN IF NOT EXISTS customer_street TEXT,
  ADD COLUMN IF NOT EXISTS is_pickup BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pickup_point TEXT;

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);

DROP POLICY IF EXISTS "Orders deletable by admin" ON public.orders;
CREATE POLICY "Orders deletable by admin" ON public.orders FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
