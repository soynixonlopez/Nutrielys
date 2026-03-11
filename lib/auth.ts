import type { User } from "@supabase/supabase-js";
import type { createClient } from "@/supabase/server";

export type SupabaseServer = Awaited<ReturnType<typeof createClient>>;

/**
 * Verifica que el usuario actual sea admin (sesión + role en profiles).
 * Usado en todas las rutas API de admin.
 */
export async function ensureAdmin(supabase: SupabaseServer): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin" ? user : null;
}
