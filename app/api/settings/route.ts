import { NextResponse } from "next/server";
import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const settings = await getSiteSettings(supabase);
    if (!settings) {
      return NextResponse.json({ whatsapp_number: "50760000000", business_name: "Nutrielys" });
    }
    return NextResponse.json({
      whatsapp_number: settings.whatsapp_number,
      business_name: settings.business_name,
    });
  } catch (error) {
    console.error("API settings error:", error);
    return NextResponse.json(
      { whatsapp_number: "50760000000", business_name: "Nutrielys" },
      { status: 200 }
    );
  }
}
