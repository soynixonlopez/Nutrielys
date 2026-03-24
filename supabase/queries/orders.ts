import type { Order } from "@/types";

interface GetOrdersFilters {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
}

export async function getOrders(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>,
  filters?: GetOrdersFilters
): Promise<Order[]> {
  let query = supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  const q = filters?.q?.trim();
  if (q) {
    query = query.or(
      `customer_name.ilike.%${q}%,customer_last_name.ilike.%${q}%,customer_email.ilike.%${q}%,customer_phone.ilike.%${q}%`
    );
  }

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }

  if (filters?.from) {
    query = query.gte("created_at", `${filters.from}T00:00:00.000Z`);
  }

  if (filters?.to) {
    query = query.lte("created_at", `${filters.to}T23:59:59.999Z`);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data ?? []) as Order[];
}
