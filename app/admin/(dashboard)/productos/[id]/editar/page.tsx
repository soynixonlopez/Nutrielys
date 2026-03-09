import { notFound } from "next/navigation";
import { createClient } from "@/supabase/server";
import { getCategories } from "@/supabase/queries/categories";
import { ProductForm } from "@/features/admin/product-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const [product, categories] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    getCategories(supabase),
  ]);

  if (product.error || !product.data) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Editar producto</h1>
      <p className="mt-1 text-sage-600">{product.data.name}</p>
      <ProductForm categories={categories} product={product.data} />
    </div>
  );
}
