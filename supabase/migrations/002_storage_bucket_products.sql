-- Bucket 'products' para imágenes de productos (admin sube, público lee)
-- Ejecuta este archivo en Supabase → SQL Editor si obtienes "bucket not found" al subir imágenes.

-- Crear el bucket público
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Política: todo el mundo puede ver (leer) las imágenes
DROP POLICY IF EXISTS "Public read products" ON storage.objects;
CREATE POLICY "Public read products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

-- Política: solo admins pueden subir imágenes
DROP POLICY IF EXISTS "Admin upload products" ON storage.objects;
CREATE POLICY "Admin upload products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Política: solo admins pueden actualizar/eliminar (opcional, para editar o borrar imágenes)
DROP POLICY IF EXISTS "Admin update products" ON storage.objects;
CREATE POLICY "Admin update products"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'products'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

DROP POLICY IF EXISTS "Admin delete products" ON storage.objects;
CREATE POLICY "Admin delete products"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'products'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
