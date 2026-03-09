import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { SettingsForm } from "@/features/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);

  return (
    <div>
      <h1 className="font-serif text-2xl font-medium text-sage-900">Ajustes</h1>
      <p className="mt-1 text-sage-600">
        Configuración general del sitio y WhatsApp.
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
