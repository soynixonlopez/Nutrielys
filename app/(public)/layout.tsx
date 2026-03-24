import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CartProvider } from "@/hooks/use-cart";
import { createPublicSupabaseClient } from "@/supabase/public";
import { getSiteSettings } from "@/supabase/queries/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let whatsappNumber = "50760000000";
  try {
    const supabase = createPublicSupabaseClient();
    const settings = await getSiteSettings(supabase);
    whatsappNumber = settings?.whatsapp_number ?? whatsappNumber;
  } catch (err) {
    console.error("Layout: error cargando settings (red/timeout):", err);
  }

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp whatsappNumber={whatsappNumber} />
      </div>
    </CartProvider>
  );
}
