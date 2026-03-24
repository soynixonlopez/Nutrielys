import { createClient } from "@/supabase/server";
import { getCategories } from "@/supabase/queries/categories";
import { getProducts } from "@/supabase/queries/products";
import { ProductsCatalog } from "@/features/products/products-catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Productos",
  description: "Catálogo de frutas y vegetales deshidratados. Snacks naturales y saludables.",
};

export default async function ProductosPage() {
  const supabase = await createClient();
  const [categories, initialProducts] = await Promise.all([
    getCategories(supabase),
    getProducts(supabase, { isActive: true }, "newest"),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 md:py-12">
      <div className="mb-10 rounded-2xl border border-sage-200/60 bg-gradient-to-br from-cream-50/80 to-sage-50/30 p-6 md:p-8">
        <h1 className="font-serif text-3xl font-medium text-sage-900 md:text-4xl">
          Nuestros productos
        </h1>
        <p className="mt-2 max-w-2xl text-sage-700/90">
          Frutas y vegetales deshidratados, naturales y deliciosos creados desde nuestro panel. Elige tu favorito y pide por WhatsApp.
        </p>
      </div>
      <ProductsCatalog
        categories={categories}
        initialProducts={initialProducts}
      />
    </div>
  );
}

