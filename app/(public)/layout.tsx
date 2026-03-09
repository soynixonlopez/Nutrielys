import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CartProvider } from "@/hooks/use-cart";
import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const settings = await getSiteSettings(supabase);
  const whatsappNumber = settings?.whatsapp_number ?? "50760000000";

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
