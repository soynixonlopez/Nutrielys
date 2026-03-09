import { ProductForm } from "@/features/admin/product-form";
import { createClient } from "@/supabase/server";
import { getCategories } from "@/supabase/queries/categories";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const supabase = await createClient();
  const categories = await getCategories(supabase);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Nuevo producto</h1>
      <p className="mt-1 text-sage-600">Completa los datos del producto.</p>
      <ProductForm categories={categories} />
    </div>
  );
}
