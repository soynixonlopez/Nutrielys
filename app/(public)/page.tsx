import Link from "next/link";
import { ArrowRight, Leaf, Shield, Heart, Truck, Sparkles, Apple, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/supabase/server";
import { getSiteSettings } from "@/supabase/queries/site-settings";
import { getFeaturedProducts } from "@/supabase/queries/products";
import { formatPrice } from "@/lib/utils";
import { SafeImage } from "@/components/ui/safe-image";

export const dynamic = "force-dynamic";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1619566636858-adf3ef50300b?q=80&w=1920&auto=format&fit=crop";
const CTA_BG_IMAGE =
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1920&auto=format&fit=crop";

export default async function HomePage() {
  const supabase = await createClient();
  const [settings, featured] = await Promise.all([
    getSiteSettings(supabase),
    getFeaturedProducts(supabase, 8),
  ]);

  const heroTitle = settings?.hero_title ?? "Snacks naturales que nutren";
  const heroSubtitle =
    settings?.hero_subtitle ?? "Frutas y vegetales deshidratados con el sabor de Panamá";

  return (
    <div className="overflow-x-hidden">
      {/* Hero con imagen de frutas */}
      <section className="relative min-h-[85vh] overflow-hidden md:min-h-[90vh]">
        <div className="absolute inset-0">
          <SafeImage
            src={HERO_IMAGE}
            alt="Frutas frescas y naturales"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </div>
        <div className="relative mx-auto flex min-h-[85vh] max-w-6xl flex-col items-center justify-center px-3 text-center text-white sm:px-4 md:min-h-[90vh]">
          <h1 className="max-w-4xl font-serif text-4xl font-medium tracking-tight opacity-0 animate-slide-up drop-shadow-lg md:text-5xl lg:text-6xl xl:text-7xl">
            {heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-lg opacity-0 animate-slide-up-delay-1 text-white/95 drop-shadow md:text-xl">
            {heroSubtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 opacity-0 animate-slide-up-delay-2 sm:gap-4">
            <Button
              size="lg"
              asChild
              className="bg-[#25D366] font-semibold hover:bg-[#20bd5a]"
            >
              <Link href="/productos">Ver productos</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-2 border-white/80 bg-white/10 text-white backdrop-blur hover:bg-white/20 hover:text-white"
            >
              <Link href="/contacto">Contactar</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="border-t border-sage-200/60 bg-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <h2 className="text-center font-serif text-2xl font-medium text-sage-900 opacity-0 animate-slide-up md:text-3xl">
            Por qué elegirnos
          </h2>
          <div className="mx-auto mt-8 grid max-w-4xl gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Leaf, title: "100% natural", text: "Sin conservantes artificiales.", delay: "animate-slide-up-delay-1" },
              { icon: Shield, title: "Calidad premium", text: "Proceso artesanal y cuidado.", delay: "animate-slide-up-delay-2" },
              { icon: Heart, title: "Saludable", text: "Nutritivo y delicioso.", delay: "animate-slide-up-delay-3" },
              { icon: Truck, title: "Entrega", text: "Pedidos por WhatsApp en Panamá.", delay: "animate-slide-up-delay-4" },
            ].map((item) => (
              <div
                key={item.title}
                className={`rounded-xl border border-sage-200/60 bg-gradient-to-br from-cream-50/80 to-sage-50/50 p-5 text-center opacity-0 ${item.delay} transition-all duration-300 hover:shadow-lg hover:shadow-sage-200/40 hover:-translate-y-0.5`}
              >
                <item.icon className="mx-auto h-10 w-10 text-sage-600" />
                <h3 className="mt-2 font-semibold text-sage-800">{item.title}</h3>
                <p className="mt-1 text-sm text-sage-700/90">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Beneficios de nuestros productos */}
      <section className="border-t border-sage-200/60 bg-gradient-to-b from-cream-50/50 to-white py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <h2 className="text-center font-serif text-2xl font-medium text-sage-900 md:text-3xl">
            Beneficios de nuestros productos
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sage-700">
            Frutas y vegetales deshidratados que conservan sabor y nutrientes. Ideales para tu día a día.
          </p>
          <div className="mx-auto mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Apple, title: "Nutrición concentrada", text: "Vitaminas y fibra en cada porción. Snack que alimenta." },
              { icon: Zap, title: "Energía natural", text: "Sin azúcares añadidos. El dulzor de la fruta tal cual." },
              { icon: Leaf, title: "Sin aditivos", text: "Solo fruta o vegetal. Ingredientes que reconoces." },
              { icon: Sparkles, title: "Práctico y duradero", text: "Llévalo a cualquier parte. Conserva bien y rinde." },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-sage-200/60 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100 text-sage-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-sage-900">{item.title}</h3>
                <p className="mt-2 text-sm text-sage-700/90">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center">
            <Button variant="outline" asChild>
              <Link href="/nosotros">Conoce más sobre Nutrielys</Link>
            </Button>
          </p>
        </div>
      </section>

      {/* Productos destacados */}
      <section className="border-t border-sage-200/60 bg-gradient-to-b from-cream-50/50 to-sage-50/30 py-14 md:py-16">
        <div className="mx-auto max-w-6xl px-3 sm:px-4">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <h2 className="font-serif text-2xl font-medium text-sage-900 md:text-3xl">
              Productos destacados
            </h2>
            <Button variant="outline" asChild className="transition-transform hover:scale-105">
              <Link href="/productos">Ver todos</Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <p className="mt-10 text-center text-sage-600">
              Pronto tendremos productos destacados. Revisa el catálogo.
            </p>
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/productos/${product.slug}`}
                  className="group overflow-hidden rounded-2xl border border-sage-200/60 bg-white shadow-sm opacity-0 animate-slide-up transition-all duration-300 hover:shadow-xl hover:shadow-sage-300/30 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="aspect-square relative overflow-hidden bg-sage-100/50">
                    {product.image_url ? (
                      <SafeImage
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-warm-papaya/20 to-warm-mango/20">
                        <span className="text-sm font-medium text-sage-600">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sage-900 transition-colors group-hover:text-sage-700">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-sage-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="relative overflow-hidden border-t border-sage-200/60 bg-gradient-to-br from-sage-700 to-sage-800 py-14 text-white md:py-16">
        <div className="absolute inset-0 opacity-10">
          <SafeImage
            src={CTA_BG_IMAGE}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative mx-auto max-w-6xl px-3 text-center sm:px-4">
          <h2 className="font-serif text-2xl font-medium md:text-3xl">
            ¿Listo para pedir?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sage-100">
            Revisa nuestro catálogo y envíanos tu pedido por WhatsApp. Te respondemos rápido.
          </p>
          <Button
            size="lg"
            variant="whatsapp"
            className="mt-6 transition-transform hover:scale-105"
            asChild
          >
            <Link href="/productos">Ver productos y pedir</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
