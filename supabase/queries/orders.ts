import type { Order } from "@/types";

export async function getOrders(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>
): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as Order[];
}
