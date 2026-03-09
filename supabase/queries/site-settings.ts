import type { SiteSettings } from "@/types";

export async function getSiteSettings(
  supabase: Awaited<ReturnType<typeof import("../server").createClient>>
): Promise<SiteSettings | null> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .limit(1)
    .single();

  if (error || !data) return null;
  return data as SiteSettings;
}
