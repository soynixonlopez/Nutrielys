import type { SupabaseClient } from "@supabase/supabase-js";
import type { SiteSettings } from "@/types";

export async function getSiteSettings(
  supabase: Pick<SupabaseClient, "from">
): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as SiteSettings;
}
