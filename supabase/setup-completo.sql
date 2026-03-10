-- =============================================================================
-- NUTRIELYS - SETUP COMPLETO (una sola ejecución)
-- Pega todo este archivo en Supabase → SQL Editor → New query → Run
-- =============================================================================

-- Extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (extiende auth.users para admin/roles)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10, 2) CHECK (compare_price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  benefits TEXT[],
  ingredients TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);

-- ============================================
-- PRODUCT_IMAGES (galería adicional)
-- ============================================
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON public.product_images(product_id);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_notes TEXT,
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- ============================================
-- ORDER_ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name_snapshot TEXT NOT NULL,
  price_snapshot DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);

-- ============================================
-- SITE_SETTINGS (singleton para configuración)
-- ============================================
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Nutrielys',
  whatsapp_number TEXT NOT NULL,
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Configuración inicial del sitio (una sola fila)
INSERT INTO public.site_settings (business_name, whatsapp_number, hero_title, hero_subtitle)
SELECT 'Nutrielys', '50760000000', 'Snacks naturales que nutren', 'Frutas y vegetales deshidratados con el sabor de Panamá'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings LIMIT 1);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Product images are viewable by everyone" ON public.product_images;
CREATE POLICY "Product images are viewable by everyone" ON public.product_images FOR SELECT USING (true);

DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON public.site_settings;
CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Orders viewable by admin" ON public.orders;
CREATE POLICY "Orders viewable by admin" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Orders updatable by admin" ON public.orders;
CREATE POLICY "Orders updatable by admin" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Orders insertable by service" ON public.orders;
CREATE POLICY "Orders insertable by service" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Order items viewable by admin" ON public.order_items;
CREATE POLICY "Order items viewable by admin" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Order items insertable by service" ON public.order_items;
CREATE POLICY "Order items insertable by service" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin full access categories" ON public.categories;
CREATE POLICY "Admin full access categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin full access products" ON public.products;
CREATE POLICY "Admin full access products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin full access product_images" ON public.product_images;
CREATE POLICY "Admin full access product_images" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
DROP POLICY IF EXISTS "Admin full access site_settings" ON public.site_settings;
CREATE POLICY "Admin full access site_settings" ON public.site_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- TRIGGERS
-- ============================================

-- Crear profile al registrarse un usuario
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS site_settings_updated_at ON public.site_settings;
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================
-- DATOS INICIALES (categorías y productos de ejemplo)
-- ============================================

INSERT INTO public.categories (name, slug, description) VALUES
  ('Frutas deshidratadas', 'frutas-deshidratadas', 'Frutas naturales deshidratadas sin azúcar añadida'),
  ('Vegetales deshidratados', 'vegetales-deshidratados', 'Vegetales deshidratados para snacks y cocina'),
  ('Snacks saludables', 'snacks-saludables', 'Mezclas y snacks listos para consumir')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Piña deshidratada', 'pina-deshidratada', 'Rodajas de piña natural deshidratada.', 'Piña tropical deshidratada, dulce y con el sabor de Panamá. Sin conservantes. Ideal como snack o en recetas.', 4.99, 5.99, 50, c.id, NULL, true, true, ARRAY['Rica en vitamina C', 'Fibra natural', 'Sin azúcar añadida'], ARRAY['Piña 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Mango deshidratado', 'mango-deshidratado', 'Tiras de mango natural deshidratado.', 'Mango deshidratado con su dulzor natural. Perfecto para lunch o postre saludable.', 5.49, 6.49, 45, c.id, NULL, true, true, ARRAY['Vitamina A y C', 'Antioxidantes'], ARRAY['Mango 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Papaya deshidratada', 'papaya-deshidratada', 'Cubos de papaya deshidratada.', 'Papaya tropical deshidratada, suave y nutritiva.', 4.49, NULL, 40, c.id, NULL, true, true, ARRAY['Enzimas digestivas', 'Vitamina C'], ARRAY['Papaya 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Guineo deshidratado', 'guineo-deshidratado', 'Rodajas de guineo (banano) deshidratado.', 'Guineo deshidratado, energético y delicioso. Snack ideal para el día.', 3.99, 4.49, 60, c.id, NULL, false, true, ARRAY['Potasio', 'Energía natural'], ARRAY['Guineo 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Tomate deshidratado', 'tomate-deshidratado', 'Tomate deshidratado en trozos.', 'Tomate deshidratado intenso, perfecto para ensaladas y cocina.', 5.99, NULL, 30, c.id, NULL, true, true, ARRAY['Licopeno', 'Sabor concentrado'], ARRAY['Tomate 100%'] FROM public.categories c WHERE c.slug = 'vegetales-deshidratados' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Zanahoria deshidratada', 'zanahoria-deshidratada', 'Zanahoria en tiras deshidratada.', 'Zanahoria crujiente y dulce, ideal para snack o guarnición.', 3.49, NULL, 55, c.id, NULL, false, true, ARRAY['Betacaroteno', 'Vitamina A'], ARRAY['Zanahoria 100%'] FROM public.categories c WHERE c.slug = 'vegetales-deshidratados' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Manzana deshidratada', 'manzana-deshidratada', 'Rodajas de manzana deshidratada.', 'Manzana deshidratada crujiente, sin azúcar añadida.', 4.29, NULL, 35, c.id, NULL, false, true, ARRAY['Fibra', 'Vitamina C'], ARRAY['Manzana 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Mix tropical', 'mix-tropical', 'Mezcla de piña, mango y papaya deshidratados.', 'Combo de frutas tropicales deshidratadas. Sabor y variedad en un solo paquete.', 6.99, 7.99, 25, c.id, NULL, true, true, ARRAY['Variedad de sabores', 'Snack completo'], ARRAY['Piña', 'Mango', 'Papaya'] FROM public.categories c WHERE c.slug = 'snacks-saludables' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Coco deshidratado', 'coco-deshidratado', 'Tiras de coco deshidratado.', 'Coco natural deshidratado, crujiente y con sabor tropical.', 5.99, NULL, 20, c.id, NULL, false, true, ARRAY['Grasas saludables', 'Energía'], ARRAY['Coco 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Pimiento deshidratado', 'pimiento-deshidratado', 'Tiras de pimiento rojo deshidratado.', 'Pimiento deshidratado para dar sabor y color a tus platos.', 4.99, NULL, 28, c.id, NULL, false, true, ARRAY['Vitamina C', 'Color natural'], ARRAY['Pimiento 100%'] FROM public.categories c WHERE c.slug = 'vegetales-deshidratados' LIMIT 1
ON CONFLICT (slug) DO NOTHING;
INSERT INTO public.products (name, slug, short_description, description, price, compare_price, stock, category_id, image_url, is_featured, is_active, benefits, ingredients)
SELECT 'Sandía deshidratada', 'sandia-deshidratada', 'Gomitas de sandía deshidratada.', 'Sandía deshidratada en formato gomita, dulce y refrescante.', 4.79, NULL, 22, c.id, NULL, false, true, ARRAY['Hidratación', 'Licopeno'], ARRAY['Sandía 100%'] FROM public.categories c WHERE c.slug = 'frutas-deshidratadas' LIMIT 1
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- STORAGE: bucket para imágenes de productos (admin sube, público lee)
-- =============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public read products" ON storage.objects;
CREATE POLICY "Public read products"
ON storage.objects FOR SELECT
USING (bucket_id = 'products');

DROP POLICY IF EXISTS "Admin upload products" ON storage.objects;
CREATE POLICY "Admin upload products"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'products'
  AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

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

-- =============================================================================
-- Admin: asignar rol admin al usuario (info@nutrielys.com)
-- Ejecutar después de crear el usuario en Authentication → Users
-- =============================================================================
UPDATE public.profiles
SET role = 'admin'
WHERE id = '82a3284b-68cb-4f34-a3ab-1a0f5acc5369';
