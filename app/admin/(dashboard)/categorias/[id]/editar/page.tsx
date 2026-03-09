import { notFound } from "next/navigation";
import { createClient } from "@/supabase/server";
import { CategoryForm } from "@/features/admin/category-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: category, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !category) notFound();

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Editar categoría</h1>
      <p className="mt-1 text-sage-600">{category.name}</p>
      <CategoryForm category={category} />
    </div>
  );
}
