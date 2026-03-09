import { Suspense } from "react";
import { createClient } from "@/supabase/server";
import { getCategories } from "@/supabase/queries/categories";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { ProductsCatalog } from "@/features/products/products-catalog";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Productos",
  description: "Catálogo de frutas y vegetales deshidratados. Snacks naturales y saludables.",
};

export default async function ProductosPage() {
  const supabase = await createClient();
  const [categories, settings] = await Promise.all([
    getCategories(supabase),
    getSiteSettings(supabase),
  ]);

  const whatsappNumber = settings?.whatsapp_number ?? "50760000000";

  return (
    <div className="mx-auto max-w-6xl px-3 py-8 sm:px-4 md:py-12">
      <div className="mb-10 rounded-2xl border border-sage-200/60 bg-gradient-to-br from-cream-50/80 to-sage-50/30 p-6 md:p-8">
        <h1 className="font-serif text-3xl font-medium text-sage-900 md:text-4xl">
          Nuestros productos
        </h1>
        <p className="mt-2 max-w-2xl text-sage-700/90">
          Frutas y vegetales deshidratados, naturales y deliciosos. Elige tu favorito y pide por WhatsApp.
        </p>
      </div>
      <Suspense fallback={<ProductsCatalogSkeleton />}>
        <ProductsCatalog categories={categories} whatsappNumber={whatsappNumber} />
      </Suspense>
    </div>
  );
}

function ProductsCatalogSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-sage-200/60 bg-white">
          <div className="aspect-square animate-pulse bg-sage-100" />
          <div className="p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-sage-100" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-sage-100" />
          </div>
        </div>
      ))}
    </div>
  );
}
