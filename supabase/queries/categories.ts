import type { Category } from "@/types";

export async function getCategories(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Category[];
}
