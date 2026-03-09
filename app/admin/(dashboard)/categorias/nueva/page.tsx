import { CategoryForm } from "@/features/admin/category-form";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Nueva categoría</h1>
      <p className="mt-1 text-sage-600">Completa los datos de la categoría.</p>
      <CategoryForm />
    </div>
  );
}
